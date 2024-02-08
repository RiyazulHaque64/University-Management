import httpStatus from 'http-status';
import { Types } from 'mongoose';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { OfferedCourseServices } from './offeredCourse.service';

const createOfferedCourse = catchAsync(async (req, res) => {
  const result = await OfferedCourseServices.createOfferedCourseIntoDB(
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Offered course is created successfully',
    data: result,
  });
});

const getAllOfferedCourse = catchAsync(async (req, res) => {
  const result = await OfferedCourseServices.getAllOfferedCoursesFromDB(
    req.query,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered course are retrieved successfully',
    data: result,
  });
});

const getSingleOfferedCourse = catchAsync(async (req, res) => {
  const result = await OfferedCourseServices.getSingleOfferedCourseFromDB(
    new Types.ObjectId(req.params.id),
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered course is retrieved successfully',
    data: result,
  });
});

const updateOfferedCourse = catchAsync(async (req, res) => {
  const result = await OfferedCourseServices.updateOfferedCourseIntoDB(
    req.params.id,
    req.body?.offeredCourse,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered course is updated successfully',
    data: result,
  });
});

const getMyOfferedCourses = catchAsync(async (req, res) => {
  const result = await OfferedCourseServices.getMyOfferedCoursesFromDB(
    req.user.userId,
    req.query,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered course are retrieved successfully',
    meta: result?.meta,
    data: result?.result,
  });
});

export const OfferedCourseControllers = {
  createOfferedCourse,
  updateOfferedCourse,
  getAllOfferedCourse,
  getSingleOfferedCourse,
  getMyOfferedCourses,
};
