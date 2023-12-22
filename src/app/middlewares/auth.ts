import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../error/appError';
import httpStatus from 'http-status';
import config from '../config';
import { TUserRole } from '../modules/user/user.interface';
import { UserModel } from '../modules/user/user.model';

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers?.authorization;
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not autorized!');
    }
    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload;
    const { userId, role } = decoded;
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
    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not autorized!');
    }
    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
