import { z } from 'zod';

const preRequisiteCourseValidationSchema = z.object({
  course: z.string(),
  isDeleted: z.boolean(),
});

const createCourseValidationSchema = z.object({
  title: z.string({
    invalid_type_error: 'Course name must be a string!',
    required_error: 'Course name must be required!',
  }),
  prefix: z.string({
    invalid_type_error: 'Prefix must be a string!',
    required_error: 'Prefix must be required!',
  }),
  code: z.number({
    invalid_type_error: 'Course code must be a number!',
    required_error: 'Course code must be required!',
  }),
  credits: z.number({
    invalid_type_error: 'Course credits must be a number!',
    required_error: 'Course credits must be required!',
  }),
  preRequisiteCourses: z.array(preRequisiteCourseValidationSchema),
});

export const courseValidations = {
  createCourseValidationSchema,
};
