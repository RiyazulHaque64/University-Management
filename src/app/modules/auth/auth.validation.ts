import { z } from 'zod';

const loginValidationSchema = z.object({
  body: z.object({
    id: z.string(),
    password: z.string(),
  }),
});

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string(),
  }),
});

const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string({ required_error: 'Old password is required!' }),
    newPassword: z.string(),
  }),
});

const forgetPasswordValidationSchema = z.object({
  body: z.object({
    userId: z.string({ required_error: 'User ID is required!' }),
  }),
});
const resetPasswordValidationSchema = z.object({
  body: z.object({
    userId: z.string({ required_error: 'User ID is required!' }),
    newPassword: z.string({ required_error: 'New password is required!' }),
  }),
});

export const authValidations = {
  loginValidationSchema,
  changePasswordValidationSchema,
  refreshTokenValidationSchema,
  forgetPasswordValidationSchema,
  resetPasswordValidationSchema,
};
