import {
  TAcademicSemesterCode,
  TAcademicSemesterName,
  TMonth,
  TSemesterNameAndCodeMapper,
} from './academicSemester.interface';

export const AcademicSemesterName: TAcademicSemesterName[] = [
  'Autumn',
  'Summer',
  'Fall',
];

export const AcademicSemesterCode: TAcademicSemesterCode[] = ['01', '02', '03'];

export const Months: TMonth[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const semesterNameAndCodeMapper: TSemesterNameAndCodeMapper = {
  Autumn: '01',
  Summar: '02',
  Fall: '03',
};
