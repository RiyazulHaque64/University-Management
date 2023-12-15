import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { UserModel } from './user.model';

const findLastId = async (semesterInfo: TAcademicSemester) => {
  const lastStudent = await UserModel.findOne(
    { role: 'student' },
    { _id: 0, id: 1 },
  )
    .sort({ createdAt: -1 })
    .lean();
  const year = lastStudent?.id.substring(0, 4);
  const semesterCode = lastStudent?.id.substring(4, 6);

  if (year === semesterInfo.year && semesterCode === semesterInfo.code) {
    return lastStudent && lastStudent.id.substring(6);
  } else {
    return '0';
  }
};

export const studentIdGenerator = async (payload: TAcademicSemester) => {
  const studentId: string =
    payload.year +
    payload.code +
    (Number(await findLastId(payload)) + 1).toString().padStart(4, '0');
  return studentId;
};