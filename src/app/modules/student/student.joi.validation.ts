import Joi from 'joi';

const studentNameSchema = Joi.object({
  firstName: Joi.string()
    .required()
    .regex(/^[A-Z][a-z]*$/, 'capitalize')
    .message('First name must be capitalized!'),
  middleName: Joi.string().allow(''),
  lastName: Joi.string().required(),
});

const guardianSchema = Joi.object({
  fatherName: Joi.string().required(),
  fatherOccupation: Joi.string().required(),
  fatherContactNo: Joi.string().required(),
  motherName: Joi.string().required(),
  motherOccupation: Joi.string().allow(''),
  motherContactNo: Joi.string().required(),
});

const localGuardianSchema = Joi.object({
  name: Joi.string().required(),
  contactNo: Joi.string().required(),
  address: Joi.string().required(),
});

// Define the main student schema
const studentValidationSchema = Joi.object({
  id: Joi.string().required(),
  name: studentNameSchema.required(),
  gender: Joi.string().valid('male', 'female', 'other').required(),
  email: Joi.string().email().required(),
  dateOfBirth: Joi.string().allow(''),
  contactNo: Joi.string().required(),
  emergencyContactNo: Joi.string().required(),
  bloodGroup: Joi.string().valid('A+', 'A-', 'B+', 'B-', 'O+', 'O-').allow(''),
  presentAddress: Joi.string().required(),
  permanentAddress: Joi.string().required(),
  guardian: guardianSchema.required(),
  localGuardian: localGuardianSchema.required(),
  profileImg: Joi.string().allow(''),
  isActive: Joi.string().valid('active', 'block').default('active'),
});

export default studentValidationSchema;
