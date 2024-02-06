import httpStatus from 'http-status';
import { Schema, Types, model } from 'mongoose';
import AppError from '../../error/appError';
import { TFaculty, TFacultyMethod, TUserName } from './faculty.interface';

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

const facultySchema = new Schema<TFaculty, TFacultyMethod>({
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
  profileImg: {
    type: String,
    default: '',
  },
  academicDepartment: {
    type: Schema.Types.ObjectId,
    ref: 'AcademicDepartment',
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

facultySchema.statics.isFacultyExists = async function (id: Types.ObjectId) {
  const faculty = await Faculty.findOne({ _id: id, isDeleted: false }).populate(
    'academicDepartment',
  );
  if (!faculty) {
    throw new AppError(httpStatus.NOT_FOUND, "The faculty doesn't exists");
  }
  return faculty;
};

facultySchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getQuery();
  const isFacultyExists = await Faculty.findOne(query);
  if (!isFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, "The faculty doesn't exists");
  }
  next();
});

const Faculty = model<TFaculty, TFacultyMethod>('Faculty', facultySchema);

export default Faculty;
