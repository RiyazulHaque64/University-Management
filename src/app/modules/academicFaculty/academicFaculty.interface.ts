import { Model, Types } from 'mongoose';

export interface TAcademicFaculty {
  name: string;
}

export interface TAcademicFacultyMethod extends Model<TAcademicFaculty> {
  // eslint-disable-next-line no-unused-vars
  isAcademicFacultyExists(id: Types.ObjectId): Promise<TAcademicFaculty | null>;
}
