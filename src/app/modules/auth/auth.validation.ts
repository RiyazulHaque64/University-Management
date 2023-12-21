import { z } from 'zod';

const loginValidationSchema = z.object({
  id: z.string(),
  password: z.string(),
});

export const authValidations = {
  loginValidationSchema,
};
