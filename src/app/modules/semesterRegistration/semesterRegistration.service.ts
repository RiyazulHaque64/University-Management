import httpStatus from 'http-status';
import AppError from '../../error/appError';
import AcademicSemesterModel from '../academicSemester/academicSemester.model';
import { TSemesterRegistration } from './semesterRegistration.interface';
import SemesterRegistrationModel from './semesterRegistration.model';

const semesterRegestrationIntoDB = async (payload: TSemesterRegistration) => {
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

export const SemesterRegistrationServices = {
  semesterRegestrationIntoDB,
};
