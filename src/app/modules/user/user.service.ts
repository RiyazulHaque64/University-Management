import mongoose from 'mongoose';
import config from '../../config';
import AcademicSemesterModel from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import { StudentModel } from '../student/student.model';
import { TUser } from './user.interface';
import { UserModel } from './user.model';
import { facultyIdGenerator, studentIdGenerator } from './user.utils';
import AppError from '../../error/appError';
import httpStatus from 'http-status';
import { TFaculty } from '../faculty/faculty.interface';
import AcademicDepartmentModel from '../academicDepartment/academicDepartment.model';
import FacultyModel from '../faculty/faculty.model';

const createStudentIntoDB = async (password: string, payload: TStudent) => {
  const admissionSemester = await AcademicSemesterModel.findById(
    payload.admissionSemester,
  );

  const userData: Partial<TUser> = {};
  userData.password = password || (config.default_password as string);
  userData.role = 'student';

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
  userData.id = await facultyIdGenerator();
  userData.password = password || config.default_password;
  userData.role = 'faculty';

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

export const userService = {
  createStudentIntoDB,
  createFacultyIntoDB,
};
// const isUserExists = await StudentModel.findOne({ email: payload.email });
// if (!isUserExists) {
//   const newUser = await UserModel.create(userData);
//   const { _id: defaultId, id: generatedId } = newUser;
//   if (defaultId && generatedId) {
//     payload.id = generatedId;
//     payload.user = defaultId;
//     const newStudent = await StudentModel.create(payload);
//     return newStudent;
//   }
// } else {
//   throw new Error('Email is already exists!');
// }
