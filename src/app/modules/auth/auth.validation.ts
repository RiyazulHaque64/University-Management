import { z } from 'zod';

const loginValidationSchema = z.object({
  id: z.string(),
  password: z.string(),
});

const changePasswordValidationSchema = z.object({
  oldPassword: z.string({ required_error: 'Old password is required!' }),
  newPassword: z.string(),
});

export const authValidations = {
  loginValidationSchema,
  changePasswordValidationSchema,
};
