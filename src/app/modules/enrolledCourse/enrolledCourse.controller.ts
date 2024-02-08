import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { EnrolledCourseServices } from './enrolledCourse.service';

const enrolledCourse = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await EnrolledCourseServices.enrolledCourseIntoDB(
    userId,
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Enrolled course successfully!',
    data: result,
  });
});

const getMyEnrolledCourses = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await EnrolledCourseServices.getMyEnrolledCoursesFromDB(
    userId,
    req.query,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Enrolled course retrieved successfully!',
    meta: result.meta,
    data: result.result,
  });
});

const updateEnrolledCourseMarks = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await EnrolledCourseServices.updateEnrolledCourseMarksIntoDB(
    userId,
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Enrolled course marks updated successfully!',
    data: result,
  });
});

export const EnrolledCourseControllers = {
  enrolledCourse,
  updateEnrolledCourseMarks,
  getMyEnrolledCourses,
};
