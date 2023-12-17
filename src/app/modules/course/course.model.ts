import { Schema, model } from 'mongoose';
import { TCourse, TPreRequisiteCourse } from './course.interface';

const preRequisiteCourseSchema = new Schema<TPreRequisiteCourse>(
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

const CourseModel = model<TCourse>('Course', courseSchema);

export default CourseModel;
