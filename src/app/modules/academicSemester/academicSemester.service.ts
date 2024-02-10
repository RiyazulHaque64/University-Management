import { Types } from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { semesterNameAndCodeMapper } from './academicSemester.constant';
import { TAcademicSemester } from './academicSemester.interface';
import AcademicSemester from './academicSemester.model';

const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
  if (semesterNameAndCodeMapper[payload.name] === payload.code) {
    const result = await AcademicSemester.create(payload);
    return result;
  } else {
    throw new Error('Invalid semester code!');
  }
};

const getAllAcademicSemestersFromDB = async (
  query: Record<string, unknown>,
) => {
  const searchableField = ['name', 'year', 'startMonth', 'endMonth'];
  const academicSemesterQuery = new QueryBuilder(AcademicSemester.find(), query)
    .search(searchableField)
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await academicSemesterQuery.queryModel;
  const meta = await academicSemesterQuery.countTotal();
  return {
    result,
    meta,
  };
};

const getAnAcademicSemesterFromDB = async (id: Types.ObjectId) => {
  const result = await AcademicSemester.isAcademicSemesterExists(id);
  return result;
};

export const academicSemesterServices = {
  createAcademicSemesterIntoDB,
  getAllAcademicSemestersFromDB,
  getAnAcademicSemesterFromDB,
};
