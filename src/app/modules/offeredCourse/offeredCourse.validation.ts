import { z } from 'zod';
import { Days } from './offeredCourse.const';

const timeValidationSchema = z.string().refine(
  (time) => {
    const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return regex.test(time);
  },
  { message: 'Invalid time format, expected "HH:MM" in 24 hours format' },
);

const createOfferedCourseValidationSchema = z.object({
  body: z
    .object({
      semesterRegistration: z.string(),
      academicDepartment: z.string(),
      course: z.string(),
      faculty: z.string(),
      maxCapacity: z.number(),
      section: z.number(),
      days: z.array(z.enum([...Days] as [string])),
      startTime: timeValidationSchema,
      endTime: timeValidationSchema,
    })
    .refine(
      (offeredCourse) => {
        const start = new Date(`1970-01-01T${offeredCourse.startTime}:00`);
        const end = new Date(`1970-01-01T${offeredCourse.endTime}:00`);
        return end > start;
      },
      { message: 'Start time should be before end time' },
    ),
});

const updateOfferedCourseValidationSchema = z.object({
  body: z
    .object({
      faculty: z.string(),
      maxCapacity: z.number(),
      days: z.array(z.enum([...Days] as [string])),
      startTime: timeValidationSchema,
      endTime: timeValidationSchema,
    })
    .refine(
      (offeredCourse) => {
        const start = new Date(`1970-01-01T${offeredCourse.startTime}:00`);
        const end = new Date(`1970-01-01T${offeredCourse.endTime}:00`);
        return end > start;
      },
      { message: 'Start time should be before end time' },
    ),
});

export const OfferedCourseValidations = {
  createOfferedCourseValidationSchema,
  updateOfferedCourseValidationSchema,
};
