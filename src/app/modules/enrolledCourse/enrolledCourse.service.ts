import httpStatus from 'http-status';
import mongoose from 'mongoose';
import AppError from '../../error/appError';
import CourseModel from '../course/course.model';
import Faculty from '../faculty/faculty.model';
import OfferedCourse from '../offeredCourse/offeredCourse.model';
import SemesterRegistration from '../semesterRegistration/semesterRegistration.model';
import Student from '../student/student.model';
import { TEnrolledCourse } from './enrolledCourse.interface';
import EnrolledCourse from './enrolledCourse.model';
import { calculateGradeAndPoint } from './enrolledCourse.utils';

const enrolledCourseIntoDB = async (id: string, payload: TEnrolledCourse) => {
  const isOfferedCourseExists = await OfferedCourse.findById(
    payload?.offeredCourse,
  );
  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered course is not found!');
  }
  const course = await CourseModel.findById(isOfferedCourseExists.course);
  const student = await Student.findOne({ id }).select('_id');
  if (!student) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student is not found!');
  }
  const isStudentAlreadyEnrolled = await EnrolledCourse.findOne({
    semesterRegistration: isOfferedCourseExists?.semesterRegistration,
    course: payload?.offeredCourse,
    student: student?._id,
  });
  if (isStudentAlreadyEnrolled) {
    throw new AppError(
      httpStatus.CONFLICT,
      'Student is already enrolled in this course!',
    );
  }
  if (isOfferedCourseExists.maxCapacity <= 0) {
    throw new AppError(httpStatus.BAD_GATEWAY, 'Room is full!');
  }
  const semesterRegistration = await SemesterRegistration.findById(
    isOfferedCourseExists.semesterRegistration,
  ).select('maxCredit');

  const enrolledCourses = await EnrolledCourse.aggregate([
    {
      $match: {
        semesterRegistration: isOfferedCourseExists.semesterRegistration,
        student: student._id,
      },
    },
    {
      $lookup: {
        from: 'courses',
        foreignField: '_id',
        localField: 'course',
        as: 'enrolledCourseData',
      },
    },
    {
      $unwind: '$enrolledCourseData',
    },
    {
      $group: {
        _id: null,
        totalEnrolledCredits: { $sum: '$enrolledCourseData.credits' },
      },
    },
    {
      $project: {
        _id: 0,
        totalEnrolledCredits: 1,
      },
    },
  ]);

  const totalCredits =
    enrolledCourses.length > 0 ? enrolledCourses[0].totalEnrolledCredits : 0;
  if (
    totalCredits &&
    semesterRegistration?.maxCredit &&
    totalCredits + course?.credits > semesterRegistration?.maxCredit
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You have excedded maximum number of credits!',
    );
  }
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const result = await EnrolledCourse.create(
      [
        {
          semesterRegistration: isOfferedCourseExists?.semesterRegistration,
          academicSemester: isOfferedCourseExists?.academicSemester,
          academicFaculty: isOfferedCourseExists?.academicFaculty,
          academicDepartment: isOfferedCourseExists?.academicDepartment,
          offeredCourse: payload?.offeredCourse,
          course: isOfferedCourseExists?.course,
          student: student?._id,
          faculty: isOfferedCourseExists?.faculty,
          isEnrolled: true,
        },
      ],
      { session },
    );
    if (!result.length) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Failed to enrolled course!',
      );
    }
    const maxCapacity = isOfferedCourseExists.maxCapacity;
    await OfferedCourse.findByIdAndUpdate(
      isOfferedCourseExists._id,
      { maxCapacity: maxCapacity - 1 },
      { session },
    );
    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to enrolled course!',
      error,
    );
  }
};

const updateEnrolledCourseMarksIntoDB = async (
  userId: string,
  payload: Partial<TEnrolledCourse>,
) => {
  const { semesterRegistration, offeredCourse, student, courseMarks } = payload;
  const isSemesterRegistrationExists =
    await SemesterRegistration.findById(semesterRegistration);
  if (!isSemesterRegistrationExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Semester registration doesn't exists!",
    );
  }
  const isOfferedCourseExists = await OfferedCourse.findById(offeredCourse);
  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Offered course doesn't exists!");
  }
  const isStudentExists = await Student.findById(student);
  if (!isStudentExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Student doesn't exists!");
  }
  const faculty = await Faculty.findOne({ id: userId }, { _id: 1 });
  const isCourseBelongToFaculty = await EnrolledCourse.findOne({
    semesterRegistration,
    offeredCourse,
    student,
    faculty: faculty?._id,
  });
  if (!isCourseBelongToFaculty) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are forbidden!');
  }
  const modifiedPayload: Record<string, unknown> = { ...courseMarks };
  if (courseMarks?.finalTerm) {
    const { classTest1, midTerm, classTest2, finalTerm } =
      isCourseBelongToFaculty.courseMarks;
    const totalMarks =
      Math.ceil(classTest1 * 0.1) +
      Math.ceil(midTerm * 0.3) +
      Math.ceil(classTest2 * 0.1) +
      Math.ceil(finalTerm * 0.5);
    const result = calculateGradeAndPoint(totalMarks);
    modifiedPayload.grade = result.grade;
    modifiedPayload.gradePoints = result.gradePoints;
    modifiedPayload.isCompleted = true;
  }
  if (courseMarks && Object.keys(courseMarks).length) {
    for (const [key, value] of Object.entries(courseMarks)) {
      modifiedPayload[`courseMarks.${key}`] = value;
    }
  }
  const result = await EnrolledCourse.findByIdAndUpdate(
    isCourseBelongToFaculty._id,
    modifiedPayload,
    { new: true, runValidators: true },
  );
  return result;
};

export const EnrolledCourseServices = {
  enrolledCourseIntoDB,
  updateEnrolledCourseMarksIntoDB,
};
