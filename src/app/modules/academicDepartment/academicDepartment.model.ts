import { Schema, model } from 'mongoose';
import { TAcademicDepartment } from './academicDepartment.interface';
import AcademicFacultyModel from '../academicFaculty/academicFaculty.model';
import AppError from '../../error/appError';
import httpStatus from 'http-status';

const academicDepartmentSchema = new Schema<TAcademicDepartment>(
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

academicDepartmentSchema.pre('save', async function (next) {
  const isDepartmentExists = await AcademicDepartmentModel.findOne({
    name: this.name,
  });
  if (isDepartmentExists) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'This department is already exists!',
    );
  }
  next();
});

academicDepartmentSchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getQuery();
  const isDepartmentExists = await AcademicDepartmentModel.findOne(query);
  if (!isDepartmentExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'The department does not exists!');
  }
  next();
});

academicDepartmentSchema.pre('save', async function (next) {
  const isFacultyExists = await AcademicFacultyModel.findOne({
    _id: this.academicFaculty,
  });
  if (!isFacultyExists) {
    throw new Error('The faculty does not exists!');
  }
  next();
});

const AcademicDepartmentModel = model<TAcademicDepartment>(
  'AcademicDepartment',
  academicDepartmentSchema,
);

export default AcademicDepartmentModel;
