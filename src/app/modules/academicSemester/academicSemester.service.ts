import { Types } from 'mongoose';
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

const getAllAcademicSemestersFromDB = async () => {
  const result = await AcademicSemester.find();
  return result;
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
