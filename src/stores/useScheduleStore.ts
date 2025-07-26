import { create } from 'zustand';

type ScheduleData = any;

interface ScheduleState {
  schedule: ScheduleData[];
  setSchedule: (data: ScheduleData[]) => void;
}

export const useScheduleStore = create<ScheduleState>((set) => ({
  schedule: [],
  setSchedule: (data) => set({ schedule: data }),
}));
