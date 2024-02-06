import express from 'express';
import auth from '../../middlewares/auth';
import parseDataFromBody from '../../middlewares/parseDataFromBody';
import validateRequest from '../../middlewares/validateRequest';
import { upload } from '../../utils/sendImageToCloudinary';
import { adminValidations } from '../admin/admin.validation';
import { facultyValidations } from '../faculty/faculty.validation';
import { studentValidations } from '../student/student.validation';
import { USER_ROLE } from './user.constant';
import { userCotroller } from './user.controller';
import { userValidations } from './user.validation';
const router = express.Router();

router.post(
  '/create-student',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  upload.single('file'),
  parseDataFromBody,
  validateRequest(studentValidations.createStudentValidationSchema),
  userCotroller.createStudent,
);

router.post(
  '/create-faculty',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  upload.single('file'),
  parseDataFromBody,
  validateRequest(facultyValidations.createFacultyValidationSchema),
  userCotroller.createFaculty,
);

router.post(
  '/create-admin',
  auth(USER_ROLE.superAdmin),
  upload.single('file'),
  parseDataFromBody,
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
