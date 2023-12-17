import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { TCourse } from './course.interface';
import CourseModel from './course.model';
import AppError from '../../error/appError';
import httpStatus from 'http-status';

const createCourseIntoDB = async (payload: TCourse) => {
  const result = await CourseModel.create(payload);
  return result;
};

const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
  const searchableField = ['title', 'prefix', 'code'];
  const courseQuery = new QueryBuilder(
    CourseModel.find().populate('preRequisiteCourses.course'),
    query,
  )
    .search(searchableField)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await courseQuery.queryModel;
  return result;
};

const getCourseFromDB = async (id: string) => {
  const result = await CourseModel.findOne({
    _id: id,
  }).populate('preRequisiteCourses.course');
  return result;
};

const updateCourseIntoDB = async (id: string, payload: TCourse) => {
  const { preRequisiteCourses, ...remainingData } = payload;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const basicUpdatedCourse = await CourseModel.findByIdAndUpdate(
      id,
      remainingData,
      {
        new: true,
        runValidators: true,
        session,
      },
    );
    if (!basicUpdatedCourse) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course!');
    }
    if (preRequisiteCourses && preRequisiteCourses?.length) {
      const deletedPreRequisite = preRequisiteCourses
        .filter((course) => course?.course && course?.isDeleted)
        .map((el) => el?.course);
      const deletedPreRequisiteCourses = await CourseModel.findByIdAndUpdate(
        id,
        {
          $pull: {
            preRequisiteCourses: { course: { $in: deletedPreRequisite } },
          },
        },
        { new: true, runValidators: true, session },
      );
      if (!deletedPreRequisiteCourses) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course!');
      }
      const newPreRequisite = preRequisiteCourses.filter(
        (course) => course?.course && !course.isDeleted,
      );
      const addedPreRequisiteCourses = await CourseModel.findByIdAndUpdate(
        id,
        {
          $addToSet: { preRequisiteCourses: { $each: newPreRequisite } },
        },
        { new: true, runValidators: true, session },
      );
      if (!addedPreRequisiteCourses) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course!');
      }
    }
    await session.commitTransaction();
    await session.endSession();
    const result = await CourseModel.findById(id).populate(
      'preRequisiteCourses.course',
    );
    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course!');
  }
};

const deleteCourseFromDB = async (id: string) => {
  const result = await CourseModel.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  return result;
};

export const CourseServices = {
  createCourseIntoDB,
  getAllCoursesFromDB,
  getCourseFromDB,
  updateCourseIntoDB,
  deleteCourseFromDB,
};
