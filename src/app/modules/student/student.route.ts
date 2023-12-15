import express from 'express';
import {
  deleteStudent,
  getAllStudents,
  getSingleStudent,
  updateStudent,
} from './student.controller';

const router = express.Router();

router.get('/', getAllStudents);
router.get('/:studentId', getSingleStudent);
router.patch('/:studentId', updateStudent);
router.delete('/:studentId', deleteStudent);

export const studentRoutes = router;
