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
    message: 'Academic faculty is created successfully!',
    data: result,
  });
});

export const EnrolledCourseControllers = {
  enrolledCourse,
};
