import { Router } from 'express';
import { studentRoutes } from '../modules/student/student.route';
import { userRoutes } from '../modules/user/user.route';
import { academicSemesterRoutes } from '../modules/academicSemester/academicSemester.route';
import { AcademciFacultyRoutes } from '../modules/academicFaculty/academicFaculty.route';
import { AcademicDepartmentRoutes } from '../modules/academicDepartment/academicDepartment.route';
import { facultyRoutes } from '../modules/faculty/faculty.route';
import { adminRoutes } from '../modules/admin/admin.route';
import { courseRoutes } from '../modules/course/course.route';
import { semesterRegistrationRoutes } from '../modules/semesterRegistration/semesterRegistration.route';
import { offeredCourseRoutes } from '../modules/offeredCourse/offeredCourse.route';
import { authRoutes } from '../modules/auth/auth.route';
import { EnrolledCourseRoutes } from '../modules/enrolledCourse/enrolledCourse.route';

const router = Router();

const routes = [
  {
    path: '/users',
    route: userRoutes,
  },
  {
    path: '/admins',
    route: adminRoutes,
  },
  {
    path: '/faculties',
    route: facultyRoutes,
  },
  {
    path: '/students',
    route: studentRoutes,
  },
  {
    path: '/academic-semester',
    route: academicSemesterRoutes,
  },
  {
    path: '/academic-faculty',
    route: AcademciFacultyRoutes,
  },
  {
    path: '/academic-department',
    route: AcademicDepartmentRoutes,
  },
  {
    path: '/courses',
    route: courseRoutes,
  },
  {
    path: '/semester-registration',
    route: semesterRegistrationRoutes,
  },
  {
    path: '/offered-course',
    route: offeredCourseRoutes,
  },
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/enrolled-course',
    route: EnrolledCourseRoutes,
  },
];

routes.forEach((route) => router.use(route.path, route.route));

export default router;
