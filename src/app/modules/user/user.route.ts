import express from 'express';
import { userCotroller } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import { studentValidations } from '../student/student.validation';
const router = express.Router();

router.post(
  '/create-student',
  // validateRequest(studentValidations.createStudentValidationSchema),
  userCotroller.createStudent,
);

export const userRoutes = router;
