import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AdminControllers } from './admin.controller';
import { adminValidations } from './admin.validation';

const router = Router();

router.get('/', AdminControllers.getAllAdmins);
router.get('/:id', AdminControllers.getAdmin);
router.patch(
  '/:id',
  validateRequest(adminValidations.updateAdminValidationSchema),
  AdminControllers.updateAdmin,
);
router.delete('/:id', AdminControllers.deleteAdmin);

export const facultyRoutes = router;
