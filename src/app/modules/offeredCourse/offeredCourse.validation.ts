import { z } from 'zod';
import { Days } from './offeredCourse.const';

const createOfferedCourseValidationSchema = z.object({
  offeredCourse: z
    .object({
      semesterRegistration: z.string(),
      academicFaculty: z.string(),
      academicDepartment: z.string(),
      course: z.string(),
      faculty: z.string(),
      maxCapacity: z.number(),
      section: z.number(),
      days: z.array(z.enum([...Days] as [string])),
      startTime: z.string().refine(
        (time) => {
          const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
          return regex.test(time);
        },
        { message: 'Invalid time format, expected "HH:MM" in 24 hours format' },
      ),
      endTime: z.string().refine(
        (time) => {
          const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
          return regex.test(time);
        },
        { message: 'Invalid time format, expected "HH:MM" in 24 hours format' },
      ),
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
  faculty: z.string().optional(),
  maxCapacity: z.number().optional(),
  section: z.number().optional(),
  days: z.array(z.enum([...Days] as [string])).optional(),
  startTime: z
    .string()
    .refine(
      (time) => {
        const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
        return regex.test(time);
      },
      { message: 'Invalid time format, expected "HH:MM" in 24 hours format' },
    )
    .optional(),
  endTime: z
    .string()
    .refine(
      (time) => {
        const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
        return regex.test(time);
      },
      { message: 'Invalid time format, expected "HH:MM" in 24 hours format' },
    )
    .optional(),
});

export const OfferedCourseValidations = {
  createOfferedCourseValidationSchema,
  updateOfferedCourseValidationSchema,
};
