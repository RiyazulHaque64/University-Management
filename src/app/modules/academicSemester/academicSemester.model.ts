import httpStatus from 'http-status';
import { Schema, Types, model } from 'mongoose';
import AppError from '../../error/appError';
import {
  AcademicSemesterCode,
  AcademicSemesterName,
  Months,
} from './academicSemester.constant';
import {
  TAcademicSemester,
  TAcademicSemesterMethod,
} from './academicSemester.interface';

const academicSemesterSchema = new Schema<
  TAcademicSemester,
  TAcademicSemesterMethod
>(
  {
    name: {
      type: String,
      enum: AcademicSemesterName,
      required: [true, 'Academic semester name is must be required!'],
    },
    code: {
      type: String,
      enum: AcademicSemesterCode,
      required: [true, 'Academic semester code is required!'],
    },
    year: {
      type: String,
      required: [true, 'Academic semester year is must be required!'],
    },
    startMonth: {
      type: String,
      enum: Months,
      required: [true, 'Academic semester start month is required!'],
    },
    endMonth: {
      type: String,
      enum: Months,
      required: [true, 'Academic semester end month is required!'],
    },
  },
  { timestamps: true },
);

academicSemesterSchema.pre('save', async function (next) {
  const isSemesterExists = await AcademicSemester.findOne({
    name: this.name,
    year: this.year,
  });
  if (isSemesterExists) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Semester is already exists!');
  } else {
    next();
  }
});

academicSemesterSchema.statics.isAcademicSemesterExists = async function (
  id: Types.ObjectId,
) {
  const academicSemester = await AcademicSemester.findById(id);
  if (!academicSemester) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Academic semester doesn't exists",
    );
  }
  return academicSemester;
};

const AcademicSemester = model<TAcademicSemester, TAcademicSemesterMethod>(
  'AcademicSemester',
  academicSemesterSchema,
);
export default AcademicSemester;
