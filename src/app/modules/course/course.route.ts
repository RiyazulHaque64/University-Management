import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CourseControllers } from './course.controller';
import { courseValidations } from './course.validation';

const router = Router();

router.post(
  '/create-course',
  validateRequest(courseValidations.createCourseValidationSchema),
  CourseControllers.createCourse,
);
router.get('/', CourseControllers.getAllCourses);
router.get('/:id', CourseControllers.getCourse);
router.patch(
  '/:id',
  validateRequest(courseValidations.updateCourseValidationSchema),
  CourseControllers.updateCourse,
);
router.delete('/:id', CourseControllers.deleteCourse);
router.put(
  '/:courseId/assign-faculties',
  validateRequest(courseValidations.courseFacultiesValidationSchema),
  CourseControllers.assignFacultiesWithCourse,
);
router.delete(
  '/:courseId/remove-faculties',
  CourseControllers.removeFacultiesFromCourse,
);

export const courseRoutes = router;
