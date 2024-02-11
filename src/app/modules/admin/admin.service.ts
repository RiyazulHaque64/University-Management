import httpStatus from 'http-status';
import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/appError';
import { UserModel } from '../user/user.model';
import { TAdmin } from './admin.interface';
import AdminModel from './admin.model';

const getAllAdminsFromDB = async (query: Record<string, unknown>) => {
  const searchableField = [
    'email',
    'id',
    'contactNo',
    'name.firstName',
    'name.lastName',
    'name.middleName',
  ];
  const adminQuery = new QueryBuilder(
    AdminModel.find({ isDeleted: false }),
    query,
  )
    .search(searchableField)
    .filter()
    .sort()
    .limit()
    .paginate()
    .fields();

  const result = await adminQuery.queryModel;
  const meta = await adminQuery.countTotal();
  return {
    result,
    meta,
  };
};

const getAdminFromDB = async (id: string) => {
  const result = await AdminModel.findOne({
    _id: id,
    isDeleted: false,
  });
  return result;
};

const updateAdminIntoDB = async (id: string, payload: TAdmin) => {
  const { name, ...remainingData } = payload;
  const updateData: Record<string, unknown> = { ...remainingData };
  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      updateData[`name.${key}`] = value;
    }
  }
  const result = await AdminModel.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deletAdminFromDB = async (id: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const deletedAdmin = await AdminModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedAdmin) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete admin!');
    }
    const userId = deletedAdmin.user;
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
    return deletedAdmin;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to delete admin!',
      error,
    );
  }
};

export const AdminServices = {
  getAllAdminsFromDB,
  getAdminFromDB,
  updateAdminIntoDB,
  deletAdminFromDB,
};
