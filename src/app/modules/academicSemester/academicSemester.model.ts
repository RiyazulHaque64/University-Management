import { Schema, model } from 'mongoose';
import { TAcademicSemester } from './academicSemester.interface';
import {
  AcademicSemesterCode,
  AcademicSemesterName,
  Months,
} from './academicSemester.constant';

const academicSemesterSchema = new Schema<TAcademicSemester>(
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
  const isSemesterExists = await AcademicSemesterModel.findOne({
    name: this.name,
    year: this.year,
  });
  if (isSemesterExists) {
    throw new Error('Semester is already exists!');
  } else {
    next();
  }
});

const AcademicSemesterModel = model<TAcademicSemester>(
  'AcademicSemester',
  academicSemesterSchema,
);
export default AcademicSemesterModel;
