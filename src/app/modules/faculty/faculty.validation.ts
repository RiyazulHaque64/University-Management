import { z } from 'zod';

const facultyNameValidationSchema = z.object({
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

const updateFacultyNameValidationSchema = z.object({
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

const createFacultyValidationSchema = z.object({
  body: z.object({
    password: z
      .string({
        invalid_type_error: 'Password must be string!',
      })
      .max(20, { message: "Password can't be more than 20 characters!" })
      .optional(),
    faculty: z.object({
      name: facultyNameValidationSchema,
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
      academicDepartment: z.string(),
      profileImg: z.string(),
    }),
  }),
});

const updateFacultyValidationSchema = z.object({
  body: z.object({
    faculty: z.object({
      name: updateFacultyNameValidationSchema.optional(),
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

export const facultyValidations = {
  createFacultyValidationSchema,
  updateFacultyValidationSchema,
};
