import { Schema, model } from 'mongoose';
import { TFaculty, TUserName } from './faculty.interface';

const facultyNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    required: [true, 'First name is required!'],
    trim: true,
    maxlength: [20, "Name cann't be more than 20 characters!"],
  },
  middleName: String,
  lastName: {
    type: String,
    required: [true, 'Last name is required!'],
    trim: true,
    maxlength: [20, "Name cann't be more than 20 characters!"],
  },
});

const facultySchema = new Schema<TFaculty>({
  id: {
    type: String,
    required: [true, 'Faculty ID is required!'],
  },
  user: {
    type: Schema.Types.ObjectId,
    required: [true, 'User ID is required!'],
    ref: 'User',
  },
  name: {
    type: facultyNameSchema,
    required: [true, 'Faculty name is required!'],
  },
  gender: {
    type: String,
    enum: {
      values: ['male', 'female', 'other'],
      message: '{VALUE} is not valid!',
    },
    required: true,
  },
  email: {
    type: String,
    required: [true, 'Faculty email must be required!'],
    unique: true,
  },
  dateOfBirth: {
    type: Schema.Types.Mixed,
  },
  contactNo: {
    type: String,
    required: [true, 'Faculty contact number is required!'],
  },
  emergencyContactNo: {
    type: String,
    required: [true, 'An emergency contact number is required!'],
  },
  bloodGroup: {
    type: String,
    enum: {
      values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      message: '{VALUE} is not valid!',
    },
  },
  presentAddress: {
    type: String,
    required: [true, 'Present address is required!'],
  },
  permanentAddress: {
    type: String,
    required: [true, 'Permanent address is required!'],
  },
  profileImg: String,
  academicDepartment: {
    type: Schema.Types.ObjectId,
    ref: 'AcademicDepartment',
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const FacultyModel = model<TFaculty>('Faculty', facultySchema);

export default FacultyModel;
