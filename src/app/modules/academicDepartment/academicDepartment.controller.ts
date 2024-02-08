import httpStatus from 'http-status';
import { Types } from 'mongoose';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AcademicDepartmentServices } from './academicDepartment.service';

const createAcademicDepartment = catchAsync(async (req, res) => {
  const result =
    await AcademicDepartmentServices.createAcademicDepartmentIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Department is created successfully!',
    data: result,
  });
});

const getAllAcademicDepartments = catchAsync(async (req, res) => {
  const result =
    await AcademicDepartmentServices.getAllAcademicDepartmentFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Department are retrieved successfully!',
    meta: result?.meta,
    data: result?.result,
  });
});

const getAnAcademicDepartment = catchAsync(async (req, res) => {
  const result = await AcademicDepartmentServices.getAnAcademicDepartmentFromDB(
    new Types.ObjectId(req.params.id),
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Department was retrieved successfully!',
    data: result,
  });
});

const updateAnAcademicDepartment = catchAsync(async (req, res) => {
  const result =
    await AcademicDepartmentServices.updateAnAcademicDepartmentIntoDB(
      req.params.id,
      req.body,
    );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Department is updated successfully!',
    data: result,
  });
});

export const AcademicDepartmentControllers = {
  createAcademicDepartment,
  getAllAcademicDepartments,
  getAnAcademicDepartment,
  updateAnAcademicDepartment,
};
