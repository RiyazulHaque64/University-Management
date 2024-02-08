import { Model, Types } from 'mongoose';

export type TMonth =
  | 'January'
  | 'February'
  | 'March'
  | 'April'
  | 'May'
  | 'June'
  | 'July'
  | 'August'
  | 'September'
  | 'October'
  | 'November'
  | 'December';

export type TAcademicSemesterName = 'Autumn' | 'Summer' | 'Fall';
export type TAcademicSemesterCode = '01' | '02' | '03';
export type TSemesterNameAndCodeMapper = {
  [key: string]: string;
};

export interface TAcademicSemester {
  name: TAcademicSemesterName;
  code: TAcademicSemesterCode;
  year: string;
  startMonth: TMonth;
  endMonth: TMonth;
}

export interface TAcademicSemesterMethod extends Model<TAcademicSemester> {
  isAcademicSemesterExists(
    // eslint-disable-next-line no-unused-vars
    id: Types.ObjectId,
  ): Promise<TAcademicSemester | null>;
}
