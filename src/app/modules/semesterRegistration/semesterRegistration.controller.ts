import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import { SemesterRegistrationServices } from './semesterRegistration.service';

const semesterRegistration = catchAsync(async (req, res) => {
  const result = await SemesterRegistrationServices.semesterRegestrationIntoDB(
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Semster is registered successfully',
    data: result,
  });
});

export const SemesterRegisterControllers = {
  semesterRegistration,
};
