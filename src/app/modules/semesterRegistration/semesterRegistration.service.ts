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
  const isThereAnyUpcomingOrOngoingSemester =
    await SemesterRegistrationModel.findOne({
      $or: [
        {
          status: 'ONGOING',
        },
        {
          status: 'UPCOMING',
        },
      ],
    });
  if (isThereAnyUpcomingOrOngoingSemester) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `There is already an ${isThereAnyUpcomingOrOngoingSemester.status} registered semester!`,
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
  payload: Partial<TSemesterRegistration>,
) => {
  const isSemesterRegistrationExists =
    await SemesterRegistrationModel.findById(id);
  if (!isSemesterRegistrationExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "This register semester doesn't found!",
    );
  }
  if (isSemesterRegistrationExists?.status === 'ENDED') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `This semester is already ${isSemesterRegistrationExists?.status}`,
    );
  }
};

export const SemesterRegistrationServices = {
  semesterRegistrationIntoDB,
  getAllRegisteredSemesterFromDB,
  getSingleRegisteredSemesterFromDB,
  updateRegisteredSemesterIntoDB,
};
