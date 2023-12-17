import { SemesterRegisterControllers } from './semesterRegistration.controller';
import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { SemesterRegistrationValidations } from './semesterRegistration.validation';

const router = Router();

router.post(
  '/',
  validateRequest(
    SemesterRegistrationValidations.createSemesterRegistrationValidationSchema,
  ),
  SemesterRegisterControllers.semesterRegistration,
);

export const semesterRegistrationRoutes = router;
