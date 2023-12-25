import httpStatus from 'http-status';
import AppError from '../../error/appError';
import OfferedCourseModel from '../offeredCourse/offeredCourse.model';
import { TEnrolledCourse } from './enrolledCourse.interface';
import EnrolledCourseModel from './enrolledCourse.model';
import { StudentModel } from '../student/student.model';
import mongoose from 'mongoose';

const enrolledCourseIntoDB = async (id: string, payload: TEnrolledCourse) => {
  const isOfferedCourseExists = await OfferedCourseModel.findById(
    payload?.offeredCourse,
  );
  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered course is not found!');
  }
  const student = await StudentModel.findOne({ id }).select('_id');
  if (!student) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student is not found!');
  }
  const isStudentAlreadyEnrolled = await EnrolledCourseModel.findOne({
    semesterRegistration: isOfferedCourseExists?.semesterRegistration,
    course: payload?.offeredCourse,
    student: student?._id,
  });
  if (!isStudentAlreadyEnrolled) {
    throw new AppError(
      httpStatus.CONFLICT,
      'Student is already enrolled in this course!',
    );
  }
  if (isOfferedCourseExists.maxCapacity <= 0) {
    throw new AppError(httpStatus.BAD_GATEWAY, 'Room is full!');
  }
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const result = await EnrolledCourseModel.create({
      semesterRegistration: isOfferedCourseExists?.semesterRegistration,
      academicSemester: isOfferedCourseExists?.academicSemester,
      academicFaculty: isOfferedCourseExists?.academicFaculty,
      academicDepartment: isOfferedCourseExists?.academicDepartment,
      offeredCourse: payload?.offeredCourse,
      course: isOfferedCourseExists?.course,
      student: student?._id,
      faculty: isOfferedCourseExists?.faculty,
      isEnrolled: true,
    });
    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to enrolled course!',
      error,
    );
  }
};

export const EnrolledCourseServices = {
  enrolledCourseIntoDB,
};
