import httpStatus from 'http-status';
import AppError from '../../error/appError';
import { TAcademicDepartment } from '../academicDepartment/academicDepartment.interface';
import AcademicDepartment from '../academicDepartment/academicDepartment.model';
import Course from '../course/course.model';
import {
  default as Faculty,
  default as FacultyModel,
} from '../faculty/faculty.model';
import SemesterRegistration from '../semesterRegistration/semesterRegistration.model';
import { TOfferedCourse } from './offeredCourse.interface';
import OfferedCourse from './offeredCourse.model';
import { hashTimeConflict } from './offeredCourse.utils';

const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
  const {
    semesterRegistration,
    academicDepartment,
    course,
    faculty,
    section,
    days,
    startTime,
    endTime,
  } = payload;
  const isSemesterRegistrationExits =
    await SemesterRegistration.findById(semesterRegistration);
  if (!isSemesterRegistrationExits) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Semester registration is not found!',
    );
  }
  const isAcademicDepartmentExits =
    await AcademicDepartment.findById(academicDepartment);
  if (!isAcademicDepartmentExits) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Academic department is not found!',
    );
  }
  const isCourseExits = await Course.findById(course);
  if (!isCourseExits) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course is not found!');
  }
  const isFacultyExits = await FacultyModel.findById(faculty);
  if (!isFacultyExits) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty is not found!');
  }
  const isDepartmentBelongToFaculty = await Faculty.findOne({
    _id: isFacultyExits._id,
    academicDepartment: isAcademicDepartmentExits._id,
  });
  if (!isDepartmentBelongToFaculty) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `${isAcademicDepartmentExits?.name} is not belong to Mr. ${isFacultyExits?.name?.firstName}`,
    );
  }
  const iSameOfferedCourseExistsWithSameRegisteredSemisterWithSameSection =
    await OfferedCourse.findOne({
      semesterRegistration,
      course,
      section,
    });
  if (iSameOfferedCourseExistsWithSameRegisteredSemisterWithSameSection) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Offered course with same section is already exists!`,
    );
  }
  const assignedShedules = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select('days startTime endTime');
  const newShedule = {
    days,
    startTime,
    endTime,
  };
  if (hashTimeConflict(assignedShedules, newShedule)) {
    throw new AppError(
      httpStatus.CONFLICT,
      `${isFacultyExits?.name?.firstName} is not available at that time or day`,
    );
  }
  payload.academicSemester = isSemesterRegistrationExits.academicSemester;
  payload.academicFaculty = isAcademicDepartmentExits.academicFaculty;
  const result = await OfferedCourse.create(payload);
  return result;
};

const updateOfferedCourseIntoDB = async (
  id: string,
  payload: Pick<TOfferedCourse, 'faculty' | 'days' | 'startTime' | 'endTime'>,
) => {
  const { faculty, days, startTime, endTime } = payload;
  const isOfferedCourseExists =
    await OfferedCourse.findById(id).populate('academicDepartment');
  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered course is not found!');
  }
  const semesterRegistration = isOfferedCourseExists.semesterRegistration;
  const isSemesterRegistrationExists =
    await SemesterRegistration.findById(semesterRegistration);
  if (isSemesterRegistrationExists?.status !== 'UPCOMING') {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `You cann't update this offered course as it is ${isSemesterRegistrationExists?.status}`,
    );
  }
  const isFacultyExits = await FacultyModel.findById(faculty);
  if (!isFacultyExits) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty is not found!');
  }
  const isDepartmentBelongToFaculty = await Faculty.findOne({
    _id: isFacultyExits._id,
    academicDepartment: isOfferedCourseExists.academicDepartment,
  });
  if (!isDepartmentBelongToFaculty) {
    const academicDepartment =
      isOfferedCourseExists.academicDepartment as unknown as TAcademicDepartment;
    throw new AppError(
      httpStatus.NOT_FOUND,
      `${academicDepartment?.name} is not belong to Mr. ${isFacultyExits?.name?.firstName}`,
    );
  }
  const assignedShedules = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  });
  const newShedule = {
    days,
    startTime,
    endTime,
  };
  if (hashTimeConflict(assignedShedules, newShedule)) {
    throw new AppError(
      httpStatus.CONFLICT,
      `${isFacultyExits?.name?.firstName} is not available at that time or day`,
    );
  }
  const result = await OfferedCourse.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

export const OfferedCourseServices = {
  createOfferedCourseIntoDB,
  updateOfferedCourseIntoDB,
};
