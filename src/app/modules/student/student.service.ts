import mongoose from 'mongoose';
import { StudentModel } from './student.model';
import AppError from '../../error/appError';
import httpStatus from 'http-status';
import { UserModel } from '../user/user.model';
import { TStudent } from './student.interface';
import QueryBuilder from '../../builder/QueryBuilder';

export const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
  const studentSearchableField = ['email', 'name.firstName', 'presentAddress'];
  const studentQuery = new QueryBuilder(
    StudentModel.find().populate('user').populate('admissionSemester'),
    query,
  )
    .search(studentSearchableField)
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await studentQuery.queryModel;
  return result;
};

export const getSingleStudentFromDB = async (id: string) => {
  const result = await StudentModel.findOne({ id })
    .populate('user')
    .populate('admissionSemester');
  return result;
};

export const updateStudentIntoDB = async (
  id: string,
  payload: Partial<TStudent>,
) => {
  const { name, guardian, localGuardian, ...remainingData } = payload;
  const modifiedUpdatedData: Record<string, unknown> = { ...remainingData };
  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }
  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedUpdatedData[`guardian.${key}`] = value;
    }
  }
  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedUpdatedData[`localGuardian.${key}`] = value;
    }
  }
  const result = await StudentModel.findOneAndUpdate(
    { id },
    modifiedUpdatedData,
    {
      new: true,
      runValidators: true,
    },
  );
  return result;
};

export const deleteStudentFromDB = async (id: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const deletedStudent = await StudentModel.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete student!');
    }
    const deletedUser = await UserModel.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete user!');
    }
    await session.commitTransaction();
    await session.endSession();
    return deletedStudent;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to delete student!',
      error,
    );
  }
};

// let searchTerm = '';
// const filterQueryObj = { ...query };
// if (query?.searchTerm) {
//   searchTerm = query.searchTerm as string;
// }
// const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];
// excludeFields.forEach((field) => delete filterQueryObj[field]);
// let sort = '-createdAt';
// if (query?.sort) {
//   sort = query?.sort as string;
// }
// let limit = 0;
// if (query?.limit) {
//   limit = Number(query?.limit) as number;
// }
// let page = 0;
// let skip = 0;
// if (query?.page) {
//   page = Number(query?.page);
//   skip = (page - 1) * limit;
// }
// let fields = '-__v';
// if (query?.fields) {
//   fields = (query?.fields as string).split(',').join(' ');
// }

// const searchQuery = StudentModel.find({
//   $or: studentSearchableField.map((field) => ({
//     [field]: { $regex: searchTerm, $options: 'i' },
//   })),
// });
// const filterQuery = searchQuery.find(filterQueryObj);
// const sortQuery = filterQuery.sort(sort);
// const paginationQuery = sortQuery.skip(skip);
// const limitQuery = paginationQuery.limit(limit);

// const result = await limitQuery
//   .select(fields)
//   .populate('user')
//   .populate('admissionSemester');
// return result;
