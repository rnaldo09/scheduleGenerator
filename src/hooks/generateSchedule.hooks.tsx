import React, { useCallback, useMemo, useState } from "react";
import {
  Day,
  Lecturer,
  Room,
  ScheduleItem,
} from "../types/index";
import { Batch, Subject, timeRequirementType } from "../types";
import { useScheduleStore } from "../stores/useScheduleStore";
import { formatTime, parseTime } from "../utils/timeUtils";
import { getRandomItem } from "../utils/randomizer";
import { isSlotValid, matchesCondition } from "../utils/conditionChecking";

export const useOptimizedSchedule = () => {
  const schedule = useScheduleStore((state) => state.schedule);
  const [batchFilter, setBatchFilter] = useState<string | undefined>();
  const [lecturerFilter, setLecturerFilter] = useState<string | undefined>();
  const [roomFilter, setRoomFilter] = useState<string | undefined>();

  const generateSchedule = useCallback((
  {
    timeReq,
    students,
    subjects,
    lecturers,
    rooms,
  }: {
    timeReq: timeRequirementType,
    students: Batch[],
    subjects: Subject[],
    lecturers: Lecturer[],
    rooms: Room[],
  }) => {
    const result: ScheduleItem[] = [];
    const slotLength = timeReq.classDuration + timeReq.breakDuration;
    const start = parseTime(timeReq.startTime);
    const end = parseTime(timeReq.endTime);

    const subjectMap = new Map(subjects.map((s) => [s.subjectCode, s]));
    const lecturerMap = new Map<string, Lecturer[]>();
    for (const l of lecturers) {
      for (const subj of l.subject) {
        if (!lecturerMap.has(subj)) lecturerMap.set(subj, []);
        lecturerMap.get(subj)!.push(l);
      }
    }

    const roomMap = new Map<string, Room[]>();
    for (const r of rooms) {
      if (!roomMap.has(r.roomType)) roomMap.set(r.roomType, []);
      roomMap.get(r.roomType)!.push(r);
    }

    const tracker = {
      lecturer: new Map<string, Set<string>>(),
      room: new Map<string, Set<string>>(),
      batch: new Map<string, Set<string>>(),
    };

    const isTaken = (map: Map<string, Set<string>>, key: string, time: string) =>
      map.get(key)?.has(time) ?? false;

    const occupy = (map: Map<string, Set<string>>, key: string, time: string) => {
      if (!map.has(key)) map.set(key, new Set());
      map.get(key)!.add(time);
    };

    const slotLoad: Record<Day, Record<string, number>> = {} as any;
    timeReq.day.forEach((day) => {
      slotLoad[day as Day] = {};
      for (let time = start; time + timeReq.classDuration <= end; time += slotLength) {
        const timeStr = formatTime(time);
        slotLoad[day as Day][timeStr] = 0;
      }
    });

    const batchDayCount = new Map<string, Record<Day, number>>();
    const unscheduledSubjects: { batchName: string; subjectName: string; reason: string }[] = [];

    for (const batch of students) {
      for (const code of batch.subjectEnroll) {
        const subject = subjectMap.get(code);
        if (!subject) continue;

        const lecturerCandidates = lecturerMap.get(code) ?? [];
        const roomCandidates = roomMap.get(subject.roomType) ?? [];
        const totalStudents = batch.amount;

        const suitableRooms = roomCandidates.filter(room => room.capacity >= totalStudents);
        if (suitableRooms.length === 0) {
          unscheduledSubjects.push({
            batchName: batch.batchName,
            subjectName: subject.subjectName,
            reason: "No suitable room found",
          });
          continue;
        }

        const allSlots: { day: Day; time: number; timeStr: string }[] = [];
        for (const day of timeReq.day) {
          for (let time = start; time + timeReq.classDuration <= end; time += slotLength) {
            const timeStr = formatTime(time);
            allSlots.push({ day, time, timeStr });
          }
        }

        // Prioritaskan hari dengan kelas lebih sedikit untuk batch ini
        allSlots.sort((a, b) => {
          const aCount = batchDayCount.get(batch.batchId)?.[a.day] ?? 0;
          const bCount = batchDayCount.get(batch.batchId)?.[b.day] ?? 0;
          if (aCount !== bCount) return aCount - bCount;
          return slotLoad[a.day][a.timeStr] - slotLoad[b.day][b.timeStr];
        });

        let scheduled = false;
        for (const slot of allSlots) {
          const { day, time, timeStr } = slot;

          const currentDayCount = batchDayCount.get(batch.batchId)?.[day] ?? 0;
          if (currentDayCount >= timeReq.maxCoursesPerDay) continue;
          if (!isSlotValid(timeReq.conditions ?? [], day, timeStr)) continue;

          const availableLecturers = lecturerCandidates.filter(
            (d) =>
              d.availability.includes(day) &&
              matchesCondition(d.conditions, day, time) &&
              !isTaken(tracker.lecturer, `${d.lecturerId}|${day}`, timeStr)
          );

          if (availableLecturers.length < 1) continue;

          // Pilih ruangan secara acak dari yang cocok
          const selectedRoom = getRandomItem(suitableRooms);
          if (isTaken(tracker.room, `${selectedRoom.roomCode}|${day}`, timeStr)) continue;
          if (isTaken(tracker.batch, `${batch.batchId}|${day}`, timeStr)) continue;

          const lec = getRandomItem(availableLecturers);
          occupy(tracker.lecturer, `${lec.lecturerId}|${day}`, timeStr);
          occupy(tracker.room, `${selectedRoom.roomCode}|${day}`, timeStr);
          occupy(tracker.batch, `${batch.batchId}|${day}`, timeStr);

          if (!batchDayCount.has(batch.batchId)) {
            batchDayCount.set(batch.batchId, {} as Record<Day, number>);
          }
          batchDayCount.get(batch.batchId)![day] =
            (batchDayCount.get(batch.batchId)![day] ?? 0) + 1;

          result.push({
            day,
            startTime: timeStr,
            endTime: formatTime(time + timeReq.classDuration),
            subject: subject.subjectName,
            batch: batch.batchName,
            room: selectedRoom.roomName,
            lecturer: lec.lecturerName,
          });

          slotLoad[day][timeStr] += 1;
          scheduled = true;
          break;
        }

        if (!scheduled) {
          unscheduledSubjects.push({
            batchName: batch.batchName,
            subjectName: subject.subjectName,
            reason: "No available slot or lecturer",
          });
        }
      }
    }

    return { scheduledResults: result, unscheduledSubjects };
  }, []);

  // Filter Function
  const filteredSchedule = useMemo(() => {
    return schedule.filter((s) => {
      return (
        (!batchFilter || s.batch === batchFilter) &&
        (!lecturerFilter || s.lecturer === lecturerFilter) &&
        (!roomFilter || s.room === roomFilter)
      );
    });
  }, [schedule, batchFilter, lecturerFilter, roomFilter]);

  const timeSlots = useMemo(() => {
    const uniqueSlots = new Set<string>();
    schedule.forEach(({ startTime, endTime }) => {
      uniqueSlots.add(`${startTime} - ${endTime}`);
    });

    return Array.from(uniqueSlots)
      .sort((a, b) => {
        const [aStart] = a.split(" - ");
        const [bStart] = b.split(" - ");
        return aStart.localeCompare(bStart);
      })
      .map((timeRange) => {
        const [startTime, endTime] = timeRange.split(" - ");
        return {
          time: timeRange,
          startTime,
          endTime,
        };
      });
  }, [schedule]);

  const days: string[] = ["monday", "tuesday", "wednesday", "thursday", "friday"];
  const colors = [
    "#ffd6d6", "#d6ffd9", "#d6eaff", "#f9f5d6", "#e7d6ff", "#ffe6d6", 
    "#ffb3b3", "#b3ffb3", "#b3d9ff", "#fff2b3", "#d9b3ff", "#ffcc99", 
    "#ff6666", "#66ff66", "#66ccff", "#ffff66", "#cc66ff", "#ff9966", 
    "#ff4d4d", "#4dff4d", "#4d94ff", "#ffff4d", "#944dff", "#ff7a7a", 
    "#7aff7a", "#7ab3ff", "#ffb84d", "#b34dff", "#ff6666", "#66ff99", 
    "#66b3ff", "#ffff99", "#b366ff", "#ffcc66", "#ff3366", "#66ffcc", 
    "#6699ff", "#ffff33", "#9966ff", "#ff9933", "#33ff66", "#33b3ff", 
    "#ffff00", "#9900ff", "#ff6600", "#00ff66", "#0066ff", "#ccff00", 
    "#9933ff", "#ff0033", "#33ff33", "#0099ff", "#ff6633", "#ff00cc"
  ];


  const batchColors = useMemo(() => {
    const uniqueBatches = Array.from(new Set(schedule.map((s) => s.batch)));
    const map: Record<string, string> = {};
    uniqueBatches.forEach((batch, index) => {
      map[batch] = colors[index % colors.length];
    });
    return map;
  }, [schedule]);

  const dataSource = useMemo(() => timeSlots.map((slot) => {
    const row: any = { key: slot.time, time: slot.time };
    days.forEach((day) => {
      const items = filteredSchedule.filter(
        (s) =>
          s.day.toLowerCase() === day &&
          s.startTime === slot.startTime &&
          s.endTime === slot.endTime
      );

      row[day] = items.length
        ? items.map((item, idx) => (
            <div
              key={idx}
              style={{
                background: batchColors[item.batch],
                padding: "4px",
                marginBottom: "4px",
                borderRadius: "4px",
              }}
            >
              <strong>{item.subject}</strong>
              <div>{item.batch}</div>
              <div>{item.room}</div>
              <div>{item.lecturer}</div>
            </div>
          ))
        : "-";
    });
    return row;
  }), [filteredSchedule, batchColors, timeSlots]);

  const columns = useMemo(() => [
    {
      title: "Jam",
      dataIndex: "time",
      key: "time",
      width: 100,
      fixed: "left" as const,
    },
    ...days.map((day) => ({
      title: day.charAt(0).toUpperCase() + day.slice(1),
      dataIndex: day,
      key: day,
      width: 200,
      render: (content: React.ReactNode) => (
        <div style={{ display: "flex", flexDirection: "column" }}>{content}</div>
      ),
    })),
  ], []);

  const batchOptions = Array.from(new Set(schedule.map((s) => s.batch))).sort();
  const lecturerOptions = Array.from(new Set(schedule.map((s) => s.lecturer))).sort();
  const roomOptions = Array.from(new Set(schedule.map((s) => s.room))).sort();

  return {
    schedule,
    generateSchedule,
    columns,
    dataSource,
    batchOptions,
    lecturerOptions,
    roomOptions,
    setBatchFilter,
    setLecturerFilter,
    setRoomFilter,
  };
};
