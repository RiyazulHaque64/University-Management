import { Router } from 'express';
import { AcademicFacultyControllers } from './academicFaculty.controller';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicFacultyValidations } from './academicFaculty.validation';

const router = Router();

router.post(
  '/create-academic-faculty',
  validateRequest(
    AcademicFacultyValidations.createAcademicFacultyValidationSchema,
  ),
  AcademicFacultyControllers.createAcademicFaculty,
);

router.get(
  '/academic-faculties',
  AcademicFacultyControllers.getAllAcademicFaculties,
);

router.get('/:id', AcademicFacultyControllers.getAnAcademicFaculty);
router.patch('/:id', AcademicFacultyControllers.updateAnAcademicFaculty);

export const AcademciFacultyRoutes = router;
