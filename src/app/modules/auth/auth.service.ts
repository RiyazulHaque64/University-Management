import httpStatus from 'http-status';
import AppError from '../../error/appError';
import { UserModel } from '../user/user.model';
import { TChangePassword, TLogin } from './auth.interface';
import { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import bcrypt from 'bcrypt';
import { createToken } from './auth.utils';
import jwt from 'jsonwebtoken';

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
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expiresIn as string,
  );
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expiresIn as string,
  );
  return {
    accessToken,
    refreshToken,
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

const refreshToken = async (token: string) => {
  const decoded = jwt.verify(token, config.jwt_refresh_secret as string);
  const { userId, iat } = decoded as JwtPayload;
  const user = await UserModel.isUserExistsByCustomID(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not exists!');
  }
  if (user?.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted!');
  }
  if (user?.status === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!');
  }
  if (
    user?.passwordChangeAt &&
    UserModel.isJWTIssuedBeforePasswordChanged(
      user?.passwordChangeAt,
      Number(iat),
    )
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not autorized!');
  }
  const jwtPayload = {
    userId: user?.id,
    role: user?.role,
  };
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expiresIn as string,
  );
  return accessToken;
};

const forgetPassword = (userId: string) => {
  const passwordResetLink = `http://localhost:3000?userId`;
  return passwordResetLink;
};
export const AuthServices = {
  loginUser,
  changePasswordIntoDB,
  refreshToken,
  forgetPassword,
};
