import httpStatus from 'http-status';
import AppError from '../../error/appError';
import { UserModel } from '../user/user.model';
import { TChangePassword, TLogin } from './auth.interface';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import bcrypt from 'bcrypt';

const loginUser = async (payload: TLogin) => {
  const user = await UserModel.isUserExistsByCustomID(payload?.id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not exists!');
  }
  if (user?.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted!');
  }
  if (user?.status === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!');
  }
  const passwordCheck = await UserModel.isPasswordMatched(
    payload?.password,
    user?.password,
  );
  if (!passwordCheck) {
    throw new AppError(httpStatus.FORBIDDEN, 'User or pasword is invalid!');
  }
  const jwtPayload = {
    userId: user?.id,
    role: user?.role,
  };
  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: '1h',
  });
  return {
    accessToken,
    needsPasswordChange: user?.needsPasswordChange,
  };
};

const changePasswordIntoDB = async (
  userData: JwtPayload,
  payload: TChangePassword,
) => {
  const user = await UserModel.isUserExistsByCustomID(userData?.userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not exists!');
  }
  if (user?.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted!');
  }
  if (user?.status === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!');
  }
  const passwordCheck = await UserModel.isPasswordMatched(
    payload?.oldPassword,
    user?.password,
  );
  if (!passwordCheck) {
    throw new AppError(httpStatus.FORBIDDEN, 'User or pasword is invalid!');
  }
  const newHashedPassword = await bcrypt.hash(
    payload?.newPassword,
    Number(config.salt_rounds),
  );
  await UserModel.findOneAndUpdate(
    { id: userData?.userId, role: userData?.role },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangeAt: new Date(),
    },
    { new: true, runValidators: true },
  );
  return null;
};

export const AuthServices = {
  loginUser,
  changePasswordIntoDB,
};
