import { z } from 'zod';

const preRequisiteCourseValidationSchema = z.object({
  course: z.string(),
  isDeleted: z.boolean().default(false),
});

const updatePreRequisiteCourseValidationSchema = z.object({
  course: z.string().optional(),
  isDeleted: z.boolean().default(false).optional(),
});

const createCourseValidationSchema = z.object({
  body: z.object({
    title: z.string({
      invalid_type_error: 'Course title must be a string!',
      required_error: 'Course title must be required!',
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
    preRequisiteCourses: z.array(preRequisiteCourseValidationSchema).optional(),
    isDeleted: z.boolean().default(false),
  }),
});

const updateCourseValidationSchema = z.object({
  body: z.object({
    title: z
      .string({
        invalid_type_error: 'Course title must be a string!',
        required_error: 'Course title must be required!',
      })
      .optional(),
    prefix: z
      .string({
        invalid_type_error: 'Prefix must be a string!',
        required_error: 'Prefix must be required!',
      })
      .optional(),
    code: z
      .number({
        invalid_type_error: 'Course code must be a number!',
        required_error: 'Course code must be required!',
      })
      .optional(),
    credits: z
      .number({
        invalid_type_error: 'Course credits must be a number!',
        required_error: 'Course credits must be required!',
      })
      .optional(),
    preRequisiteCourses: z
      .array(updatePreRequisiteCourseValidationSchema)
      .optional(),
    isDeleted: z.boolean().default(false).optional(),
  }),
});

const courseFacultiesValidationSchema = z.object({
  body: z.object({
    faculties: z.array(z.string()),
  }),
});

export const courseValidations = {
  createCourseValidationSchema,
  updateCourseValidationSchema,
  courseFacultiesValidationSchema,
};
