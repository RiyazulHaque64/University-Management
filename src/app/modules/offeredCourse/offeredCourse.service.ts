import httpStatus from 'http-status';
import AppError from '../../error/appError';
import SemesterRegistrationModel from '../semesterRegistration/semesterRegistration.model';
import { TOfferedCourse } from './offeredCourse.interface';
import OfferedCourseModel from './offeredCourse.model';
import AcademicFacultyModel from '../academicFaculty/academicFaculty.model';
import AcademicDepartmentModel from '../academicDepartment/academicDepartment.model';
import CourseModel from '../course/course.model';
import FacultyModel from '../faculty/faculty.model';

const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
  const {
    semesterRegistration,
    academicFaculty,
    academicDepartment,
    course,
    faculty,
    section,
    days,
    startTime,
    endTime,
  } = payload;
  const isSemesterRegistrationExits =
    await SemesterRegistrationModel.findById(semesterRegistration);
  if (!isSemesterRegistrationExits) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Semester registration is not found!',
    );
  }
  const academicSemester = isSemesterRegistrationExits.academicSemester;
  const isAcademicFacultyExits =
    await AcademicFacultyModel.findById(academicFaculty);
  if (!isAcademicFacultyExits) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic faculty is not found!');
  }
  const isAcademicDepartmentExits =
    await AcademicDepartmentModel.findById(academicDepartment);
  if (!isAcademicDepartmentExits) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Academic department is not found!',
    );
  }
  const isCourseExits = await CourseModel.findById(course);
  if (!isCourseExits) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course is not found!');
  }
  const isFacultyExits = await FacultyModel.findById(faculty);
  if (!isFacultyExits) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty is not found!');
  }
  const isDepartmentBelongToFaculty = await AcademicDepartmentModel.findOne({
    academicFaculty,
    _id: academicDepartment,
  });
  if (!isDepartmentBelongToFaculty) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `${isAcademicDepartmentExits?.name} is not belong to ${isAcademicFacultyExits?.name}`,
    );
  }
  const iSameOfferedCourseExistsWithSameRegisteredSemisterWithSameSection =
    await OfferedCourseModel.findOne({
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
  const assignedShedules = await OfferedCourseModel.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select('days startTime endTime');

  assignedShedules?.forEach((shedule) => {
    const existingStartTime = new Date(`1970-01-01T${shedule?.startTime}`);
    const existingEndTime = new Date(`1970-01-01T${shedule?.endTime}`);
    const newStartTime = new Date(`1970-01-01T${startTime}`);
    const newEndTime = new Date(`1970-01-01T${endTime}`);

    if (existingEndTime > newStartTime && existingStartTime < newEndTime) {
      throw new AppError(
        httpStatus.CONFLICT,
        `${isFacultyExits?.name?.firstName} is not available at that time or day`,
      );
    }
  });
  const result = await OfferedCourseModel.create({
    ...payload,
    academicSemester,
  });
  return result;
};

export const OfferedCourseServices = {
  createOfferedCourseIntoDB,
};
