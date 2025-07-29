export type Day =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type timeRequirementType = {
    day: Day[],
    classDuration: number,
    breakDuration: number,
    startTime: string,
    endTime: string,
    conditions?: string[]
    maxCoursesPerDay: number
}
export interface Subject {
  subjectCode: string;
  subjectName: string;
  roomType: string;
  tandem: boolean;
}

export interface Lecturer {
  lecturerId: string;
  lecturerName: string;
  subject: string[];
  availability: Day[];
  conditions: string[]; // e.g. "monday|=|morning"
}

export interface Room {
  roomCode: string;
  roomName: string;
  capacity: number;
  roomType: string;
  facility: string[];
}

export interface Batch {
  batchId: string;
  batchName: string;
  major: string;
  batch: number;
  amount: number;
  subjectEnroll: string[];
}

export interface ScheduleItem {
  day: string;
  startTime: string;
  endTime: string;
  subject: string;
  batch: string;
  room: string;
  lecturer: string;
}