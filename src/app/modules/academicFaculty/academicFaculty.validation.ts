import { z } from 'zod';

const createAcademicFacultyValidationSchema = z.object({
  name: z.string(),
});

export const AcademicFacultyValidations = {
  createAcademicFacultyValidationSchema,
};
