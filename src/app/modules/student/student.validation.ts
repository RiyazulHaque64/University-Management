import { z } from 'zod';

const studentNameValidationSchema = z.object({
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

const updateStudentNameValidationSchema = z.object({
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

const guardianValidationSchema = z.object({
  fatherName: z.string(),
  fatherOccupation: z.string(),
  fatherContactNo: z.string(),
  motherName: z.string(),
  motherOccupation: z.string(),
  motherContactNo: z.string(),
});

const updateGuardianValidationSchema = z.object({
  fatherName: z.string().optional(),
  fatherOccupation: z.string().optional(),
  fatherContactNo: z.string().optional(),
  motherName: z.string().optional(),
  motherOccupation: z.string().optional(),
  motherContactNo: z.string().optional(),
});

const localGuardianValidationSchema = z.object({
  name: z.string(),
  contactNo: z.string(),
  address: z.string(),
  occupation: z.string(),
});

const updateLocalGuardianValidationSchema = z.object({
  name: z.string().optional(),
  contactNo: z.string().optional(),
  address: z.string().optional(),
  occupation: z.string().optional(),
});

const createStudentValidationSchema = z.object({
  body: z.object({
    password: z
      .string({
        invalid_type_error: 'Password must be string!',
      })
      .max(20, { message: "Password can't be more than 20 characters!" })
      .optional(),
    student: z.object({
      name: studentNameValidationSchema,
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
      guardian: guardianValidationSchema,
      localGuardian: localGuardianValidationSchema,
      admissionSemester: z.string(),
      academicDepartment: z.string(),
    }),
  }),
});

const updateStudentValidationSchema = z.object({
  body: z.object({
    student: z.object({
      name: updateStudentNameValidationSchema,
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
      guardian: updateGuardianValidationSchema,
      localGuardian: updateLocalGuardianValidationSchema,
      admissionSemester: z.string().optional(),
      academicDepartment: z.string().optional(),
    }),
  }),
});

export const studentValidations = {
  createStudentValidationSchema,
  updateStudentValidationSchema,
};
