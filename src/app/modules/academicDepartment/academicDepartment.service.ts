import httpStatus from 'http-status';
import { Types } from 'mongoose';
import AppError from '../../error/appError';
import AcademicFaculty from '../academicFaculty/academicFaculty.model';
import { TAcademicDepartment } from './academicDepartment.interface';
import AcademicDepartment from './academicDepartment.model';

const createAcademicDepartmentIntoDB = async (payload: TAcademicDepartment) => {
  const academicFaculty = await AcademicFaculty.findById(
    payload.academicFaculty,
  );
  if (!academicFaculty) {
    throw new AppError(httpStatus.NOT_FOUND, "Academic faculty doesn't exists");
  }
  const result = await AcademicDepartment.create(payload);
  return result;
};

const getAllAcademicDepartmentFromDB = async () => {
  const result = await AcademicDepartment.find().populate('academicFaculty');
  return result;
};

const getAnAcademicDepartmentFromDB = async (id: Types.ObjectId) => {
  const result = await AcademicDepartment.isAcademicDepartmentExists(id);
  return result;
};

const updateAnAcademicDepartmentIntoDB = async (
  id: string,
  payload: TAcademicDepartment,
) => {
  const result = await AcademicDepartment.findOneAndUpdate(
    { _id: id },
    payload,
    { new: true },
  ).populate('academicFaculty');
  return result;
};

export const AcademicDepartmentServices = {
  createAcademicDepartmentIntoDB,
  getAllAcademicDepartmentFromDB,
  getAnAcademicDepartmentFromDB,
  updateAnAcademicDepartmentIntoDB,
};
