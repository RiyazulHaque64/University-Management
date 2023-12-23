import { z } from 'zod';

const createAcademicDepartmentValidationSchema = z.object({
  body: z.object({
    name: z.string({
      invalid_type_error: 'Department name is must be string!',
      required_error: 'Department name must be required!',
    }),
    academicFaculty: z.string({
      required_error: 'Faculty must be required!',
    }),
  }),
});

const updateAcademicDepartmentValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        invalid_type_error: 'Department name is must be string!',
      })
      .optional(),
    academicFaculty: z.string().optional(),
  }),
});

export const AcademicDepartmentValidations = {
  createAcademicDepartmentValidationSchema,
  updateAcademicDepartmentValidationSchema,
};
