import express from 'express';
import { userCotroller } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import { studentValidations } from '../student/student.validation';
import { facultyValidations } from '../faculty/faculty.validation';
import { adminValidations } from '../admin/admin.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';
import { userValidations } from './user.validation';
import { upload } from '../../utils/sendImageToCloudinary';
import parseDataFromBody from '../../middlewares/parseDataFromBody';
const router = express.Router();

router.post(
  '/create-student',
  auth(USER_ROLE.admin),
  upload.single('file'),
  parseDataFromBody,
  validateRequest(studentValidations.createStudentValidationSchema),
  userCotroller.createStudent,
);

router.post(
  '/create-faculty',
  auth(USER_ROLE.admin),
  validateRequest(facultyValidations.createFacultyValidationSchema),
  userCotroller.createFaculty,
);

router.post(
  '/create-admin',
  validateRequest(adminValidations.createAdminValidationSchema),
  userCotroller.createAdmin,
);

router.get('/me', auth('admin', 'student', 'faculty'), userCotroller.getMe);

router.patch(
  '/change-status/:id',
  auth('admin'),
  validateRequest(userValidations.changeStatusValidationSchema),
  userCotroller.changeStatus,
);

export const userRoutes = router;
