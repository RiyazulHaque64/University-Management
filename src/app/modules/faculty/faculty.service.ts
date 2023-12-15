import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { TFaculty } from './faculty.interface';
import FacultyModel from './faculty.model';
import AppError from '../../error/appError';
import httpStatus from 'http-status';
import { UserModel } from '../user/user.model';

const getAllFacultiesFromDB = async (query: Record<string, unknown>) => {
  const searchableField = [
    'email',
    'id',
    'contactNo',
    'name.firstName',
    'name.lastName',
    'name.middleName',
  ];
  const facultyQuery = new QueryBuilder(
    FacultyModel.find({ isDeleted: false }).populate('academicDepartment'),
    query,
  )
    .search(searchableField)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await facultyQuery.queryModel;
  return result;
};

const getFacultyFromDB = async (id: string) => {
  const result = await FacultyModel.findOne({
    _id: id,
    isDeleted: false,
  }).populate('academicDepartment');
  return result;
};

const updateFacultyIntoDB = async (id: string, payload: TFaculty) => {
  const { name, ...remainingData } = payload;
  const updateData: Record<string, unknown> = { ...remainingData };
  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      updateData[`name.${key}`] = value;
    }
  }
  const result = await FacultyModel.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteFacultyFromDB = async (id: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const deletedFaculty = await FacultyModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedFaculty) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete faculty!');
    }
    const userId = deletedFaculty.user;
    const deletedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete user!');
    }
    await session.commitTransaction();
    await session.endSession();
    return deletedFaculty;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to delete faculty!',
      error,
    );
  }
};

export const FacultyServices = {
  getAllFacultiesFromDB,
  getFacultyFromDB,
  updateFacultyIntoDB,
  deleteFacultyFromDB,
};
