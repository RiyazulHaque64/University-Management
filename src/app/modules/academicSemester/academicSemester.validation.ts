import { z } from 'zod';
import {
  AcademicSemesterCode,
  AcademicSemesterName,
  Months,
} from './academicSemester.constant';

const createAcademicSemesterValidation = z.object({
  name: z.enum([...AcademicSemesterName] as [string]),
  code: z.enum([...AcademicSemesterCode] as [string]),
  year: z.string(),
  startMonth: z.enum([...Months] as [string]),
  endMonth: z.enum([...Months] as [string]),
});

export const academicSemesterValidations = {
  createAcademicSemesterValidation,
};
