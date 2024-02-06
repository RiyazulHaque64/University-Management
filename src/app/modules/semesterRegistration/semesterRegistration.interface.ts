import { Model, Types } from 'mongoose';

export interface TSemesterRegistration {
  academicSemester: Types.ObjectId;
  status: 'UPCOMING' | 'ONGOING' | 'ENDED';
  startDate: Date;
  endDate: Date;
  minCredit: number;
  maxCredit: number;
}

export interface TSemesterRegistrationMethod
  extends Model<TSemesterRegistration> {
  isSemesterRegistrationExists(
    // eslint-disable-next-line no-unused-vars
    id: Types.ObjectId,
  ): Promise<TSemesterRegistration | null>;
}
