import mongoose from 'mongoose';
import config from '../../config';
import AcademicSemesterModel from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import { StudentModel } from '../student/student.model';
import { TUser } from './user.interface';
import { UserModel } from './user.model';
import { facultyAndAdminIdGenerator, studentIdGenerator } from './user.utils';
import AppError from '../../error/appError';
import httpStatus from 'http-status';
import { TFaculty } from '../faculty/faculty.interface';
import AcademicDepartmentModel from '../academicDepartment/academicDepartment.model';
import FacultyModel from '../faculty/faculty.model';
import AdminModel from '../admin/admin.model';

const createStudentIntoDB = async (password: string, payload: TStudent) => {
  const admissionSemester = await AcademicSemesterModel.findById(
    payload.admissionSemester,
  );

  const userData: Partial<TUser> = {};
  userData.password = password || (config.default_password as string);
  userData.role = 'student';
  userData.email = payload?.email;

  // Generate user or student id
  if (admissionSemester) {
    userData.id = await studentIdGenerator(admissionSemester);
  } else {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Selected admission semester has not exists!',
    );
  }
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const newUser = await UserModel.create([userData], { session });
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user!');
    }

    payload.id = newUser[0].id;
    payload.user = newUser[0]._id;

    const newStudent = await StudentModel.create([payload], { session });
    if (!newStudent.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create student!');
    }
    await session.commitTransaction();
    await session.endSession();
    return newStudent[0];
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to create student!',
      error,
    );
  }
};

const createFacultyIntoDB = async (password: string, payload: TFaculty) => {
  const userData: Partial<TUser> = {};
  userData.id = await facultyAndAdminIdGenerator('faculty');
  userData.password = password || config.default_password;
  userData.role = 'faculty';
  userData.email = payload?.email;

  const checkAcademicDepartment = await AcademicDepartmentModel.findById(
    payload?.academicDepartment,
  );

  if (checkAcademicDepartment) {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();
      const newUser = await UserModel.create([userData], { session });
      if (!newUser.length) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user!');
      }
      payload.id = newUser[0].id;
      payload.user = newUser[0]._id;
      const newFaculty = await FacultyModel.create([payload], { session });
      if (!newFaculty.length) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create faculty!');
      }
      await session.commitTransaction();
      await session.endSession();
      return newFaculty[0];
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to create faculty!',
        error,
      );
    }
  } else {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Academic department id is not valid!',
    );
  }
};

const createAdminIntoDB = async (password: string, payload: TFaculty) => {
  const userData: Partial<TUser> = {};
  userData.id = await facultyAndAdminIdGenerator('admin');
  userData.password = password || config.default_password;
  userData.role = 'admin';
  userData.email = payload?.email;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const newUser = await UserModel.create([userData], { session });
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user!');
    }
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id;
    const newAdmin = await AdminModel.create([payload], { session });
    if (!newAdmin.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin!');
    }
    await session.commitTransaction();
    await session.endSession();
    return newAdmin[0];
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to create admin!',
      error,
    );
  }
};

const getMeFromDB = async (userId: string, role: string) => {
  let result = null;
  if (role === 'student') {
    result = await StudentModel.findOne({ id: userId }).populate('user');
  }
  if (role === 'faculty') {
    result = await FacultyModel.findOne({ id: userId }).populate('user');
  }
  if (role === 'admin') {
    result = await AdminModel.findOne({ id: userId }).populate('user');
  }

  return result;
};

const changeStatusIntoDB = async (id: string, payload: { status: string }) => {
  const user = await UserModel.findById(id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not exists!');
  }
  if (user?.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted!');
  }
  const result = await UserModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  if (payload.status === 'in-progress') {
    return result;
  } else {
    return null;
  }
};

export const userService = {
  createStudentIntoDB,
  createFacultyIntoDB,
  createAdminIntoDB,
  getMeFromDB,
  changeStatusIntoDB,
};
