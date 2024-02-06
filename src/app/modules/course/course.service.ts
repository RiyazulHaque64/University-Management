import httpStatus from 'http-status';
import mongoose, { Types } from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/appError';
import { TCourse, TCourseFaculties } from './course.interface';
import Course, { CourseFaculties } from './course.model';

const createCourseIntoDB = async (payload: TCourse) => {
  const result = await Course.create(payload);
  return result;
};

const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
  const searchableField = ['title', 'prefix', 'code'];
  const courseQuery = new QueryBuilder(
    Course.find({ isDeleted: false }).populate('preRequisiteCourses.course'),
    query,
  )
    .search(searchableField)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await courseQuery.queryModel;
  // const meta = await courseQuery.countTotal()
  return result;
};

const getCourseFromDB = async (id: Types.ObjectId) => {
  const result = await Course.isCourseExists(id);
  return result;
};

const updateCourseIntoDB = async (id: string, payload: TCourse) => {
  const { preRequisiteCourses, ...remainingData } = payload;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const basicUpdatedCourse = await Course.findByIdAndUpdate(
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
      const deletedPreRequisiteCourses = await Course.findByIdAndUpdate(
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
      const addedPreRequisiteCourses = await Course.findByIdAndUpdate(
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
    const result = await Course.findById(id).populate(
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
  const result = await Course.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  return result;
};

const assingFacultiesWithCourseIntoDB = async (
  id: Types.ObjectId,
  payload: TCourseFaculties,
) => {
  const isCourseExists = await Course.isCourseExists(id);
  if (!isCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, "The course doesn't exists");
  }
  const result = await CourseFaculties.findByIdAndUpdate(
    id,
    {
      course: id,
      $addToSet: { faculties: { $each: payload.faculties } },
    },
    { upsert: true, new: true },
  ).populate('faculties');
  return result;
};

const getFacultiesWithCourseFromDB = async (id: string) => {
  const result = await CourseFaculties.findOne({ course: id }).populate(
    'faculties',
  );
  return result;
};

const removeFacultiesFromCourseIntoDB = async (
  id: Types.ObjectId,
  payload: TCourseFaculties,
) => {
  const isCourseExists = await Course.isCourseExists(id);
  if (!isCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, "The course doesn't exists");
  }
  const result = await CourseFaculties.findByIdAndUpdate(
    id,
    {
      $pull: { faculties: { $in: payload.faculties } },
    },
    { new: true },
  ).populate('faculties');
  return result;
};

export const CourseServices = {
  createCourseIntoDB,
  getAllCoursesFromDB,
  getCourseFromDB,
  updateCourseIntoDB,
  deleteCourseFromDB,
  assingFacultiesWithCourseIntoDB,
  removeFacultiesFromCourseIntoDB,
  getFacultiesWithCourseFromDB,
};
