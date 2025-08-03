import { useState } from "react";
import { Batch, Day, Lecturer, Room, Subject, timeRequirementType } from "../types";

export function useStepMasterData() {
  const [currentStep, setCurrentStep] = useState(0);

  const dayOptions: Day[] = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

  const [rooms, setRooms] = useState<Room[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [timeRequirement, setTimeRequirement] = useState<timeRequirementType>({
    semester: '',
    day: [],
    classDuration: 30,
    breakDuration: 5,
    maxCoursesPerDay: 1,
    startTime: '',
    endTime: '',
    conditions: []
  });

  const subjectOptions = subjects.map((subj) => ({
    label: subj.subjectName,
    value: subj.subjectCode,
  }));

  const normalizeDays = (value: string | string[] | undefined): Day[] => {
    if (!value) return [];
    const values = Array.isArray(value)
      ? value
      : value.includes(',')
        ? value.split(',').map((v) => v.trim())
        : [value.trim()];
    return values.filter((v): v is Day => dayOptions.includes(v as Day));
  }

  const normalizeStringArray = (value: string | string[] | undefined): string[] => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    return value.includes(',') ? value.split(',').map((v) => v.trim()) : [value.trim()];
  };

  const next = () => setCurrentStep((c) => Math.min(c + 1, 4));
  const prev = () => setCurrentStep((c) => Math.max(c - 1, 0));
  const goTo = (step: number) => setCurrentStep(step);

  const addTimeRequirement = (timeRequirement: Omit<timeRequirementType, "conditions"> & { conditions: string[] }) => {
    setTimeRequirement({
      ...timeRequirement,
      conditions: normalizeStringArray(timeRequirement.conditions)
    });
  }

  const addRoom = (room: Omit<Room, "facility"> & { facility: string }) => {
    setRooms((prev) => [
      ...prev,
      {
        ...room,
        facility: room.facility ? room.facility.split(",").map((f) => f.trim()) : [],
      },
    ]);
  };

  const addSubject = (subject: Subject) => {
    setSubjects((prev) => [...prev, subject]);
  };

  const addLecturer = (lecturer: Omit<Lecturer, "subject" | "availability" | "conditions"> & {
    subject: string;
    availability: Day[];
    conditions: string;
  }) => {
    setLecturers((prev) => [
      ...prev,
      {
        ...lecturer,
        subject: normalizeStringArray(lecturer.subject),
        availability: normalizeDays(lecturer.availability),
        conditions: normalizeStringArray(lecturer.conditions),
      },
    ]);
  };

  const addBatch = (batch: any) => {
    setBatches(batch)
  };

  return {
    currentStep,
    next,
    prev,
    goTo,
    rooms,
    subjects,
    lecturers,
    batches,
    addTimeRequirement,
    addRoom,
    addSubject,
    addLecturer,
    addBatch,
    subjectOptions,
    timeRequirement,
    setTimeRequirement,
    dayOptions
  };
}
