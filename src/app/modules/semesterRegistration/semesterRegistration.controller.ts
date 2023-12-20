import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import { SemesterRegistrationServices } from './semesterRegistration.service';

const semesterRegistration = catchAsync(async (req, res) => {
  const result = await SemesterRegistrationServices.semesterRegistrationIntoDB(
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Semster is registered successfully',
    data: result,
  });
});

const getAllsemesterRegistration = catchAsync(async (req, res) => {
  const result =
    await SemesterRegistrationServices.getAllRegisteredSemesterFromDB(
      req.query,
    );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Semsters are retrieved successfully',
    data: result,
  });
});

const getSinglesemesterRegistration = catchAsync(async (req, res) => {
  const result =
    await SemesterRegistrationServices.getSingleRegisteredSemesterFromDB(
      req.params.id,
    );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Semster is retrieved successfully',
    data: result,
  });
});

const updateSemesterRegistration = catchAsync(async (req, res) => {
  const result =
    await SemesterRegistrationServices.updateRegisteredSemesterIntoDB(
      req.params.id,
      req.body,
    );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Semster is updated successfully',
    data: result,
  });
});

export const SemesterRegisterControllers = {
  semesterRegistration,
  getAllsemesterRegistration,
  getSinglesemesterRegistration,
  updateSemesterRegistration,
};
