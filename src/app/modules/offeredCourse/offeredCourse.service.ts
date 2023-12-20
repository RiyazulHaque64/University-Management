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
  const result = await OfferedCourseModel.create({
    ...payload,
    academicSemester,
  });
  return result;
};

export const OfferedCourseServices = {
  createOfferedCourseIntoDB,
};
