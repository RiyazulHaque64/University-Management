import { Model, Types } from 'mongoose';

export type TPreRequisiteCourse = {
  course: Types.ObjectId;
  isDeleted: boolean;
};

export interface TCourse {
  title: string;
  prefix: string;
  code: number;
  credits: number;
  preRequisiteCourses: TPreRequisiteCourse[];
  isDeleted: boolean;
}

export interface TCourseFaculties {
  course: Types.ObjectId;
  faculties: [Types.ObjectId];
}

export interface TCourseMethod extends Model<TCourse> {
  isCourseExists(
    // eslint-disable-next-line no-unused-vars
    id: Types.ObjectId,
  ): Promise<TCourse | null>;
}
