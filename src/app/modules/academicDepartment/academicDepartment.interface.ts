import { Model, Types } from 'mongoose';

export interface TAcademicDepartment {
  name: string;
  academicFaculty: Types.ObjectId;
}

export interface TAcademicDepartmentMethod extends Model<TAcademicDepartment> {
  isAcademicDepartmentExists(
    // eslint-disable-next-line no-unused-vars
    id: Types.ObjectId,
  ): Promise<TAcademicDepartment | null>;
}
