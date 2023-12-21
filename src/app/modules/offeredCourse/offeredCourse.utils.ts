import { TSchedule } from './offeredCourse.interface';

export const hashTimeConflict = (
  assignedShedules: TSchedule[],
  newSchedule: TSchedule,
) => {
  for (const schedule of assignedShedules) {
    const existingStartTime = new Date(`1970-01-01T${schedule?.startTime}`);
    const existingEndTime = new Date(`1970-01-01T${schedule?.endTime}`);
    const newStartTime = new Date(`1970-01-01T${newSchedule.startTime}`);
    const newEndTime = new Date(`1970-01-01T${newSchedule.endTime}`);

    if (existingEndTime > newStartTime && existingStartTime < newEndTime) {
      return true;
    }
  }
  return false;
};
