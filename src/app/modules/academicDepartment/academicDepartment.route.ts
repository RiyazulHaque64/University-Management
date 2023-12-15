import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicDepartmentValidations } from './academicDepartment.validation';
import { AcademicDepartmentControllers } from './academicDepartment.controller';

const router = Router();

router.post(
  '/create-academic-department',
  validateRequest(
    AcademicDepartmentValidations.createAcademicDepartmentValidationSchema,
  ),
  AcademicDepartmentControllers.createAcademicDepartment,
);

router.get(
  '/academic-departments',
  AcademicDepartmentControllers.getAllAcademicDepartments,
);

router.get('/:id', AcademicDepartmentControllers.getAnAcademicDepartment);
router.patch(
  '/:id',
  validateRequest(
    AcademicDepartmentValidations.updateAcademicDepartmentValidationSchema,
  ),
  AcademicDepartmentControllers.updateAnAcademicDepartment,
);

export const AcademicDepartmentRoutes = router;
