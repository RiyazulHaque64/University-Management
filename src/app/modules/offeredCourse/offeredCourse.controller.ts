import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { OfferedCourseServices } from './offeredCourse.service';

const createOfferedCourse = catchAsync(async (req, res) => {
  const result = await OfferedCourseServices.createOfferedCourseIntoDB(
    req.body?.offeredCourse,
  );
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Offered course is created successfully',
    data: result,
  });
});

export const OfferedCourseControllers = {
  createOfferedCourse,
};
