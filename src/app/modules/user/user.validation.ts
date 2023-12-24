import { z } from 'zod';

const userValidationSchema = z.object({
  password: z
    .string({
      invalid_type_error: 'Password must be string!',
    })
    .max(20, { message: "Password can't be more than 20 characters!" })
    .optional(),
});

const changeStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum(['in-progress', 'blocked']),
  }),
});

export const userValidations = {
  userValidationSchema,
  changeStatusValidationSchema,
};
