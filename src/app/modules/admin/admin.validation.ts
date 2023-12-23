import { z } from 'zod';

const adminNameValidationSchema = z.object({
  firstName: z
    .string()
    .refine(
      (value) => value.charAt(0).toUpperCase() + value.slice(1) === value,
      {
        message: 'First name must be capitalized!',
      },
    ),
  middleName: z.string(),
  lastName: z.string(),
});

const updateAdminNameValidationSchema = z.object({
  firstName: z
    .string()
    .refine(
      (value) => value.charAt(0).toUpperCase() + value.slice(1) === value,
      {
        message: 'First name must be capitalized!',
      },
    )
    .optional(),
  middleName: z.string().optional(),
  lastName: z.string().optional(),
});

const createAdminValidationSchema = z.object({
  body: z.object({
    password: z
      .string({
        invalid_type_error: 'Password must be string!',
      })
      .max(20, { message: "Password can't be more than 20 characters!" })
      .optional(),
    admin: z.object({
      name: adminNameValidationSchema,
      gender: z.enum(['male', 'female', 'other'], {
        required_error: 'Gender must be required!',
      }),
      email: z.string().email({ message: 'Invalid email address!' }),
      dateOfBirth: z.string().optional(),
      contactNo: z.string(),
      emergencyContactNo: z.string(),
      bloodGroup: z
        .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
        .optional(),
      presentAddress: z.string(),
      permanentAddress: z.string(),
      profileImg: z.string(),
    }),
  }),
});

const updateAdminValidationSchema = z.object({
  body: z.object({
    admin: z.object({
      name: updateAdminNameValidationSchema.optional(),
      gender: z.enum(['male', 'female', 'other']).optional(),
      email: z.string().email({ message: 'Invalid email address!' }).optional(),
      dateOfBirth: z.string().optional().optional(),
      contactNo: z.string().optional(),
      emergencyContactNo: z.string().optional(),
      bloodGroup: z
        .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
        .optional()
        .optional(),
      presentAddress: z.string().optional(),
      permanentAddress: z.string().optional(),
      admissionSemester: z.string().optional(),
      profileImg: z.string().optional(),
    }),
  }),
});

export const adminValidations = {
  createAdminValidationSchema,
  updateAdminValidationSchema,
};
