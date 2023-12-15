import httpStatus from 'http-status';
import {
  deleteStudentFromDB,
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  updateStudentIntoDB,
} from './student.service';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';

export const getAllStudents = catchAsync(async (req, res) => {
  const result = await getAllStudentsFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Students are retrieved successfully',
    data: result,
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
