import httpStatus from 'http-status';
import { Schema, Types, model } from 'mongoose';
import AppError from '../../error/appError';
import {
  TAcademicFaculty,
  TAcademicFacultyMethod,
} from './academicFaculty.interface';

const academicFacultySchema = new Schema<
  TAcademicFaculty,
  TAcademicFacultyMethod
>(
  {
    name: {
      type: String,
      required: [true, 'Academic Faculty name is must be required!'],
    },
  },
  {
    timestamps: true,
  },
);

academicFacultySchema.statics.isAcademicFacultyExists = async function (
  id: Types.ObjectId,
) {
  const academicFaculty = await AcademicFaculty.findById(id);
  if (!academicFaculty) {
    throw new AppError(httpStatus.NOT_FOUND, "Academic Faculty doesn't exists");
  }
  return academicFaculty;
};

academicFacultySchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getQuery();
  const isDepartmentExists = await AcademicFaculty.findOne(query);
  if (!isDepartmentExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Academic faculty doesn't exists");
  }
  next();
});

const AcademicFaculty = model<TAcademicFaculty, TAcademicFacultyMethod>(
  'AcademicFaculty',
  academicFacultySchema,
);

export default AcademicFaculty;
