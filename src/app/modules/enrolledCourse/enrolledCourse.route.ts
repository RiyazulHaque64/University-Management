import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../user/user.constant';
import { EnrolledCourseControllers } from './enrolledCourse.controller';
import { enrolledCourseValidations } from './enrolledCourse.validation';

const router = Router();

router.post(
  '/courseEnrollement',
  auth(USER_ROLE.student),
  validateRequest(
    enrolledCourseValidations.createEnrolledCourseValidationSchema,
  ),
  EnrolledCourseControllers.enrolledCourse,
);

export const EnrolledCourseRoutes = router;
