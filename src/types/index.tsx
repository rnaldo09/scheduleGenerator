export type Day =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type timeRequirementType = {
    semester: string,
    day: Day[],
    classDuration: number,
    breakDuration: number,
    startTime: string,
    endTime: string,
    conditions?: string[]
    maxCoursesPerDay: number
}
export interface Subject {
  id: string;
  subjectCode: string;
  subjectName: string;
  roomType: string;
  tandem: boolean;
}

export interface Lecturer {
  id: string;
  lecturerId: string;
  lecturerName: string;
  subject: string[];
  availability: Day[];
  conditions: string[]; // e.g. "monday|=|morning"
}

export interface Room {
  id: string;
  roomCode: string;
  roomName: string;
  capacity: number;
  roomType: string;
  facility: string[];
}

export interface Batch {
  id: string;
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

export interface ScheduleList {
  id: string;
  semester: string;
  schedule: string;
}