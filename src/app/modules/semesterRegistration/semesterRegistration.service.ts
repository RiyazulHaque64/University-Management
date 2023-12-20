import httpStatus from 'http-status';
import AppError from '../../error/appError';
import AcademicSemesterModel from '../academicSemester/academicSemester.model';
import { TSemesterRegistration } from './semesterRegistration.interface';
import SemesterRegistrationModel from './semesterRegistration.model';
import QueryBuilder from '../../builder/QueryBuilder';

const semesterRegistrationIntoDB = async (payload: TSemesterRegistration) => {
  const academicSemester = payload?.academicSemester;
  const checkRegistered = await SemesterRegistrationModel.findOne({
    academicSemester,
  });
  if (checkRegistered) {
    throw new AppError(
      httpStatus.CONFLICT,
      'This academic semester is already registered!',
    );
  }
  const isSemesterExists =
    await AcademicSemesterModel.findById(academicSemester);
  if (!isSemesterExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "This academic semester doesn't exists!",
    );
  }
  const result = await SemesterRegistrationModel.create(payload);
  return result;
};

const getAllRegisteredSemesterFromDB = async (
  query: Record<string, unknown>,
) => {
  const semesterRegistrationQuery = new QueryBuilder(
    SemesterRegistrationModel.find(),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await semesterRegistrationQuery.queryModel;
  return result;
};

const getSingleRegisteredSemesterFromDB = async (id: string) => {
  const result = await SemesterRegistrationModel.findById(id);
  return result;
};

const updateRegisteredSemesterIntoDB = async (
  id: string,
  payload: TSemesterRegistration,
) => {
  const result = await SemesterRegistrationModel.findById(id);
  return result;
};

export const SemesterRegistrationServices = {
  semesterRegistrationIntoDB,
  getAllRegisteredSemesterFromDB,
  getSingleRegisteredSemesterFromDB,
  updateRegisteredSemesterIntoDB,
};
