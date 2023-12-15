import { Router } from 'express';
import { FacultyControllers } from './faculty.controller';
import validateRequest from '../../middlewares/validateRequest';
import { facultyValidations } from './faculty.validation';

const router = Router();

router.get('/', FacultyControllers.getAllFaculties);
router.get('/:id', FacultyControllers.getFaculty);
router.patch(
  '/:id',
  validateRequest(facultyValidations.updateFacultyValidationSchema),
  FacultyControllers.updateFaculty,
);
router.delete('/:id', FacultyControllers.deleteFaculty);

export const facultyRoutes = router;
