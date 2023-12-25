import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { enrolledCourseValidations } from './enrolledCourse.validation';
import { EnrolledCourseControllers } from './enrolledCourse.controller';
import auth from '../../middlewares/auth';

const router = Router();

router.post(
  '/courseEnrollement',
  auth('student'),
  validateRequest(
    enrolledCourseValidations.createEnrolledCourseValidationSchema,
  ),
  EnrolledCourseControllers.enrolledCourse,
);

export const EnrolledCourseRoutes = router;
