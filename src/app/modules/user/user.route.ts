import express from 'express';
import { userCotroller } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import { studentValidations } from '../student/student.validation';
import { facultyValidations } from '../faculty/faculty.validation';
const router = express.Router();

router.post(
  '/create-student',
  validateRequest(studentValidations.createStudentValidationSchema),
  userCotroller.createStudent,
);

router.post(
  '/create-faculty',
  validateRequest(facultyValidations.createFacultyValidationSchema),
  userCotroller.createFaculty,
);

export const userRoutes = router;
