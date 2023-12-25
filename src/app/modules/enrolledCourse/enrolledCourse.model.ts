import { Schema, model } from 'mongoose';
import { TEnrolledCourse } from './enrolledCourse.interface';

const courseMarksSchema = new Schema({
  classTest1: { type: Number, required: true },
  midTerm: { type: Number, required: true },
  classTest2: { type: Number, required: true },
  finalTerm: { type: Number, required: true },
});

const enrolledCourseSchema = new Schema<TEnrolledCourse>({
  semesterRegistration: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'semesterRegistration',
  },
  academicSemester: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'AcademicSemester',
  },
  academicFaculty: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'AcademicFaculty',
  },
  academicDepartment: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'AcademicDepartment',
  },
  offeredCourse: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'OfferedCourse',
  },
  course: { type: Schema.Types.ObjectId, required: true, ref: 'Course' },
  student: { type: Schema.Types.ObjectId, required: true, ref: 'Student' },
  faculty: { type: Schema.Types.ObjectId, required: true, ref: 'Faculty' },
  isEnrolled: { type: Boolean, required: true },
  courseMarks: { type: courseMarksSchema, required: true },
  grade: {
    type: String,
    enum: ['A', 'B', 'C', 'D', 'F', 'NA'],
    required: true,
  },
  gradePoints: { type: Number, required: true, min: 0, max: 4, default: 0 },
  isCompleted: { type: Boolean, required: true },
});

const EnrolledCourseModel = model('EnrolledCourse', enrolledCourseSchema);

export default EnrolledCourseModel;
