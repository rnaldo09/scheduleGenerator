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
    }
  ) => {
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

    // Slot Tracker
    const tracker = {
      lecturer: new Map<string, Set<string>>(),
      room: new Map<string, Set<string>>(),
      batch: new Map<string, Set<string>>(),
      batchCountPerDay: new Map<string, number>(),
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

    for (const batch of students) {
      for (const code of batch.subjectEnroll) {
        const subject = subjectMap.get(code);
        if (!subject) continue;

        const lecturerCandidates = lecturerMap.get(code) ?? [];
        const roomCandidates = roomMap.get(subject.roomType) ?? [];
        let scheduled = false;

        const allSlots: { day: Day; time: number; timeStr: string }[] = [];
        for (const day of timeReq.day) {
          for (let time = start; time + timeReq.classDuration <= end; time += slotLength) {
            allSlots.push({ day: day as Day, time, timeStr: formatTime(time) });
          }
        }
        allSlots.sort((a, b) => slotLoad[a.day][a.timeStr] - slotLoad[b.day][b.timeStr]);

        for (const slot of allSlots) {
          const { day, time, timeStr } = slot;

          if (!isSlotValid(timeReq.conditions ?? [], day, timeStr)) continue;

          const availableLecturers = lecturerCandidates.filter(
            (d) =>
              d.availability.includes(day) &&
              matchesCondition(d.conditions, day, time) &&
              !isTaken(tracker.lecturer, `${d.lecturerId}|${day}`, timeStr)
          );

          const availableRooms = roomCandidates.filter(
            (r) => !isTaken(tracker.room, `${r.roomCode}|${day}`, timeStr)
          );

          const batchKey = `${batch.batchId}|${day}`;
          const countKey = batchKey;

          const currentCount = tracker.batchCountPerDay.get(countKey) ?? 0;
          
          if (currentCount >= timeReq.maxCoursesPerDay || isTaken(tracker.batch, batchKey, timeStr)) continue;

          if (availableLecturers.length && availableRooms.length) {
            const lec = getRandomItem(availableLecturers);
            const rm = getRandomItem(availableRooms);

            result.push({
              day,
              startTime: timeStr,
              endTime: formatTime(time + timeReq.classDuration),
              subject: subject.subjectName,
              batch: batch.batchName,
              room: rm.roomName,
              lecturer: lec.lecturerName,
            });

            occupy(tracker.lecturer, `${lec.lecturerId}|${day}`, timeStr);
            occupy(tracker.room, `${rm.roomCode}|${day}`, timeStr);
            occupy(tracker.batch, batchKey, timeStr);
            tracker.batchCountPerDay.set(countKey, currentCount + 1);

            slotLoad[day][timeStr] += 1;
            scheduled = true;
            break;
          }
        }

        if (!scheduled) {
          result.push({
            day: "N/A",
            startTime: "N/A",
            endTime: "N/A",
            subject: subject.subjectName,
            batch: batch.batchName,
            room: "No room",
            lecturer: "No lecturer",
          });
        }
      }
    }

    return result;
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
  const colors = ["#ffd6d6", "#d6ffd9", "#d6eaff", "#f9f5d6", "#e7d6ff", "#ffe6d6"];

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

  const batchOptions = Array.from(new Set(schedule.map((s) => s.batch)));
  const lecturerOptions = Array.from(new Set(schedule.map((s) => s.lecturer)));
  const roomOptions = Array.from(new Set(schedule.map((s) => s.room)));

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
