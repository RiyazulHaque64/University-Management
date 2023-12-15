import { academicSemesterControllers } from './academicSemester.controller';
import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { academicSemesterValidations } from './academicSemester.validation';

const router = Router();

router.post(
  '/create-academic-semester',
  validateRequest(academicSemesterValidations.createAcademicSemesterValidation),
  academicSemesterControllers.createAcademicSemester,
);

router.get(
  '/academic-semesters',
  academicSemesterControllers.getAllAcademicSemesters,
);

router.get('/:id', academicSemesterControllers.getAnAcademicSemester);

export const academicSemesterRoutes = router;
