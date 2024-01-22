import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import AppError from '../error/appError';
import { TUserRole } from '../modules/user/user.interface';
import { UserModel } from '../modules/user/user.model';
import catchAsync from '../utils/catchAsync';

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers?.authorization;
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not autorized!');
    }
    let decoded;
    try {
      decoded = jwt.verify(
        token,
        config.jwt_access_secret as string,
      ) as JwtPayload;
    } catch (error) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not autorized!');
    }
    const { userId, role, iat } = decoded;
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
    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not autorized!');
    }
    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
