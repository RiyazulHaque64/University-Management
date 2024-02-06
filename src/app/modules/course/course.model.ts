import httpStatus from 'http-status';
import { Schema, Types, model } from 'mongoose';
import AppError from '../../error/appError';
import {
  TCourse,
  TCourseFaculties,
  TCourseMethod,
  TPreRequisiteCourse,
} from './course.interface';

const preRequisiteCourseSchema = new Schema<TPreRequisiteCourse, TCourseMethod>(
  {
    course: {
      type: Schema.Types.ObjectId,
      required: [true, 'Prerequisite course ID is required!'],
      ref: 'Course',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false },
);
const courseSchema = new Schema<TCourse>(
  {
    title: {
      type: String,
      unique: true,
      trim: true,
      required: [true, 'Course name is required!'],
    },
    prefix: {
      type: String,
      trim: true,
      required: [true, 'Prefix is required!'],
    },
    code: {
      type: Number,
      unique: true,
      trim: true,
      required: [true, 'Course code is required!'],
    },
    credits: {
      type: Number,
      required: [true, 'Course credits is required!'],
    },
    preRequisiteCourses: {
      type: [preRequisiteCourseSchema],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

courseSchema.statics.isCourseExists = async function (id: Types.ObjectId) {
  const course = await Course.findOne({ _id: id, isDeleted: false }).populate(
    'preRequisiteCourses.course',
  );
  if (!course) {
    throw new AppError(httpStatus.NOT_FOUND, "The course doesn't exists");
  }
  return course;
};

courseSchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getQuery();
  const isCourseExists = await Course.findOne(query);
  if (!isCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, "The course doesn't exists");
  }
  next();
});

const Course = model<TCourse, TCourseMethod>('Course', courseSchema);

const courseFacultiesSchema = new Schema<TCourseFaculties>({
  course: {
    type: Schema.Types.ObjectId,
    required: [true, 'Course ID is required!'],
    unique: true,
  },
  faculties: {
    type: [Schema.Types.ObjectId],
    ref: 'Faculty',
  },
});

export const CourseFaculties = model<TCourseFaculties>(
  'CourseFaculty',
  courseFacultiesSchema,
);

export default Course;
