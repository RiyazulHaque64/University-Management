import httpStatus from 'http-status';
import { Types } from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/appError';
import AcademicSemesterModel from '../academicSemester/academicSemester.model';
import { semesterRegistrationStatus } from './semesterRegistration.const';
import { TSemesterRegistration } from './semesterRegistration.interface';
import SemesterRegistration from './semesterRegistration.model';

const semesterRegistrationIntoDB = async (payload: TSemesterRegistration) => {
  const academicSemester = payload?.academicSemester;
  const checkRegistered = await SemesterRegistration.findOne({
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
    await SemesterRegistration.findOne({
      $or: [
        {
          status: semesterRegistrationStatus.ONGOING,
        },
        {
          status: semesterRegistrationStatus.UPCOMING,
        },
      ],
    });
  if (isThereAnyUpcomingOrOngoingSemester) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `There is already an ${isThereAnyUpcomingOrOngoingSemester.status} registered semister`,
    );
  }
  const result = await SemesterRegistration.create(payload);
  return result;
};

const getAllRegisteredSemesterFromDB = async (
  query: Record<string, unknown>,
) => {
  const semesterRegistrationQuery = new QueryBuilder(
    SemesterRegistration.find().populate('academicSemester'),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await semesterRegistrationQuery.queryModel;
  return result;
};

const getSingleRegisteredSemesterFromDB = async (id: Types.ObjectId) => {
  const result = await SemesterRegistration.isSemesterRegistrationExists(id);
  return result;
};

const updateRegisteredSemesterIntoDB = async (
  id: string,
  payload: TSemesterRegistration,
) => {
  const isSemesterRegistrationExists = await SemesterRegistration.findById(id);
  const currentSemesterStatus = isSemesterRegistrationExists?.status;
  const requestedStatus = payload?.status;
  if (!isSemesterRegistrationExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "This semester registration doesn't exists!",
    );
  }
  if (currentSemesterStatus === semesterRegistrationStatus.ENDED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `This semester is already ${currentSemesterStatus}`,
    );
  }
  if (
    currentSemesterStatus === semesterRegistrationStatus.UPCOMING &&
    requestedStatus === semesterRegistrationStatus.ENDED
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You cann't directly change ${currentSemesterStatus} to ${requestedStatus}`,
    );
  }
  if (
    currentSemesterStatus === semesterRegistrationStatus.ONGOING &&
    requestedStatus === semesterRegistrationStatus.UPCOMING
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You cann't change ${currentSemesterStatus} to ${requestedStatus}`,
    );
  }
  const result = await SemesterRegistration.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).populate('academicSemester');
  return result;
};

export const SemesterRegistrationServices = {
  semesterRegistrationIntoDB,
  getAllRegisteredSemesterFromDB,
  getSingleRegisteredSemesterFromDB,
  updateRegisteredSemesterIntoDB,
};
