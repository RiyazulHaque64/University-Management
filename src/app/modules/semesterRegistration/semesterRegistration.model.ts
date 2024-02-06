import httpStatus from 'http-status';
import { Schema, Types, model } from 'mongoose';
import AppError from '../../error/appError';
import {
  TSemesterRegistration,
  TSemesterRegistrationMethod,
} from './semesterRegistration.interface';

const semesterRegistrationSchema = new Schema<
  TSemesterRegistration,
  TSemesterRegistrationMethod
>({
  academicSemester: {
    type: Schema.Types.ObjectId,
    required: [true, 'Academic semester is required!'],
    unique: true,
    ref: 'AcademicSemester',
  },
  status: {
    type: String,
    enum: ['UPCOMING', 'ONGOING', 'ENDED'],
    required: [true, 'Status is required!'],
    default: 'UPCOMING',
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  minCredit: {
    type: Number,
    default: 3,
  },
  maxCredit: {
    type: Number,
    default: 15,
  },
});

semesterRegistrationSchema.statics.isSemesterRegistrationExists =
  async function (id: Types.ObjectId) {
    const semesterRegistration = await SemesterRegistration.findOne({
      _id: id,
    }).populate('academicSemester');
    if (!semesterRegistration) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        'The semester is not registered semester',
      );
    }
    return semesterRegistration;
  };

semesterRegistrationSchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getQuery();
  const isSemesterRegistrationExists =
    await SemesterRegistration.findOne(query);
  if (!isSemesterRegistrationExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'The semester is not registered semester',
    );
  }
  next();
});

const SemesterRegistration = model<
  TSemesterRegistration,
  TSemesterRegistrationMethod
>('SemesterRegistration', semesterRegistrationSchema);

export default SemesterRegistration;
