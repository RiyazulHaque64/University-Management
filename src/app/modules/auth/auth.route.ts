import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { authValidations } from './auth.validation';
import { AuthControllers } from './auth.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post(
  '/login',
  validateRequest(authValidations.loginValidationSchema),
  AuthControllers.loginUser,
);
router.post(
  '/change-password',
  auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
  validateRequest(authValidations.changePasswordValidationSchema),
  AuthControllers.changePassword,
);
router.post(
  '/refresh-token',
  validateRequest(authValidations.refreshTokenValidationSchema),
  AuthControllers.refreshToken,
);
router.post(
  '/forget-password',
  validateRequest(authValidations.forgetPasswordValidationSchema),
  AuthControllers.forgetPassword,
);
router.post(
  '/reset-password',
  validateRequest(authValidations.resetPasswordValidationSchema),
  AuthControllers.resetPassword,
);

export const authRoutes = router;
