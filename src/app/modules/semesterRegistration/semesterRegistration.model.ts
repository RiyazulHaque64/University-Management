import { Schema, model } from 'mongoose';
import { TSemesterRegistration } from './semesterRegistration.interface';

const semesterRegistrationSchema = new Schema<TSemesterRegistration>({
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

const SemesterRegistrationModel = model<TSemesterRegistration>(
  'SemesterRegistration',
  semesterRegistrationSchema,
);

export default SemesterRegistrationModel;
