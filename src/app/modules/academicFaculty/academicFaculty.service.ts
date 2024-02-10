import { Types } from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { TAcademicFaculty } from './academicFaculty.interface';
import AcademicFaculty from './academicFaculty.model';

const createAcademicFacultyIntoDB = async (payload: TAcademicFaculty) => {
  const result = await AcademicFaculty.create(payload);
  return result;
};

const getAllAcademicFacultiesFromDB = async (
  query: Record<string, unknown>,
) => {
  const searchableField = ['name'];
  const academicFacultiesQuery = new QueryBuilder(AcademicFaculty.find(), query)
    .search(searchableField)
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await academicFacultiesQuery.queryModel;
  const meta = await academicFacultiesQuery.countTotal();
  return {
    result,
    meta,
  };
};

const getAnAcademicFacultyFromDB = async (id: Types.ObjectId) => {
  const result = await AcademicFaculty.isAcademicFacultyExists(id);
  return result;
};

const updateAnAcademicFacultyIntoDB = async (
  id: string,
  payload: TAcademicFaculty,
) => {
  const result = await AcademicFaculty.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

export const AcademicFacultyServices = {
  createAcademicFacultyIntoDB,
  getAllAcademicFacultiesFromDB,
  getAnAcademicFacultyFromDB,
  updateAnAcademicFacultyIntoDB,
};
