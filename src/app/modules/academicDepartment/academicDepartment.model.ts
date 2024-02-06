import httpStatus from 'http-status';
import { Schema, Types, model } from 'mongoose';
import AppError from '../../error/appError';
import {
  TAcademicDepartment,
  TAcademicDepartmentMethod,
} from './academicDepartment.interface';

const academicDepartmentSchema = new Schema<
  TAcademicDepartment,
  TAcademicDepartmentMethod
>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'AcademicFaculty',
    },
  },
  {
    timestamps: true,
  },
);

academicDepartmentSchema.statics.isAcademicDepartmentExists = async function (
  id: Types.ObjectId,
) {
  const academicDepartment =
    await AcademicDepartment.findById(id).populate('academicFaculty');
  if (!academicDepartment) {
    throw new AppError(httpStatus.NOT_FOUND, 'The department does not exists!');
  }
  return academicDepartment;
};

academicDepartmentSchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getQuery();
  const isDepartmentExists = await AcademicDepartment.findOne(query);
  if (!isDepartmentExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'The department does not exists!');
  }
  next();
});

const AcademicDepartment = model<
  TAcademicDepartment,
  TAcademicDepartmentMethod
>('AcademicDepartment', academicDepartmentSchema);

export default AcademicDepartment;
