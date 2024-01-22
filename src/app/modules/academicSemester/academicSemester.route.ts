import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { academicSemesterControllers } from './academicSemester.controller';
import { academicSemesterValidations } from './academicSemester.validation';

const router = Router();

router.post(
  '/create-academic-semester',
  validateRequest(academicSemesterValidations.createAcademicSemesterValidation),
  academicSemesterControllers.createAcademicSemester,
);

router.get(
  '/academic-semesters',
  auth('admin'),
  academicSemesterControllers.getAllAcademicSemesters,
);

router.get('/:id', academicSemesterControllers.getAnAcademicSemester);

export const academicSemesterRoutes = router;
