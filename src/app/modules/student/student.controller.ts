import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import {
  deleteStudentFromDB,
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  updateStudentIntoDB,
} from './student.service';

export const getAllStudents = catchAsync(async (req, res) => {
  const result = await getAllStudentsFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Students are retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

export const getSingleStudent = catchAsync(async (req, res) => {
  const { studentId } = req.params;
  const result = await getSingleStudentFromDB(studentId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student is retrieved successfully',
    data: result,
  });
});

export const updateStudent = catchAsync(async (req, res) => {
  const result = await updateStudentIntoDB(
    req.params.studentId,
    req.body.student,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student has updated successfully!',
    data: result,
  });
});

export const deleteStudent = catchAsync(async (req, res) => {
  await deleteStudentFromDB(req.params.studentId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student was deleted successfully!',
    data: null,
  });
});
