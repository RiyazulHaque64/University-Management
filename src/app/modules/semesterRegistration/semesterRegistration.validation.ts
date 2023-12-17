import { z } from 'zod';

const createSemesterRegistrationValidationSchema = z.object({
  academicSemester: z.string(),
  status: z.enum(['UPCOMING', 'ONGOING', 'ENDED']).default('UPCOMING'),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  minCredit: z.number().default(3),
  maxCredit: z.number().default(15),
});

export const SemesterRegistrationValidations = {
  createSemesterRegistrationValidationSchema,
};
