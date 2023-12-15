import { Schema, model } from 'mongoose';
import {
  StudentMethods,
  StudentMethodsModel,
  TGuardian,
  TLocalGuardian,
  TStudent,
  TStudentName,
} from './student.interface';

const studentNameSchema = new Schema<TStudentName>({
  firstName: {
    type: String,
    required: [true, 'First name is required!'],
    // validate: {
    //   validator: function (value: string) {
    //     const capitalization = value.charAt(0).toUpperCase() + value.slice(0);
    //     return capitalization === value;
    //   },
    //   message: '{VALUE} must be capitalize!',
    // },
  },
  middleName: String,
  lastName: {
    type: String,
    required: [true, 'Last name is required!'],
  },
});

const guardianSchema = new Schema<TGuardian>({
  fatherName: {
    type: String,
    required: [true, "Father's name is required!"],
  },
  fatherOccupation: {
    type: String,
    required: [true, "Father's occupation is required!"],
  },
  fatherContactNo: {
    type: String,
    required: [true, "Father's contact number is required!"],
  },
  motherName: {
    type: String,
    required: [true, "Mother's name is required!"],
  },
  motherOccupation: String,
  motherContactNo: {
    type: String,
    required: [true, "Mother's contact number is required!"],
  },
});

const localGuardianSchema = new Schema<TLocalGuardian>({
  name: {
    type: String,
    required: [true, 'Local guardian name is required!'],
  },
  contactNo: {
    type: String,
    required: [true, 'Local guardian contact number is required!'],
  },
  address: {
    type: String,
    required: [true, 'Local guardian address is required!'],
  },
});

const studentSchema = new Schema<TStudent, StudentMethodsModel, StudentMethods>(
  {
    id: {
      type: String,
      required: [true, 'Student ID is required!'],
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'User id is required!'],
      ref: 'User',
    },
    name: {
      type: studentNameSchema,
      required: [true, 'Student name is required!'],
    },
    gender: {
      type: String,
      enum: {
        values: ['male', 'female', 'other'],
        message: '{VALUE} is not valid!',
      },
      required: true,
    },
    email: {
      type: String,
      required: [true, 'Student email must be required!'],
      unique: true,
    },
    dateOfBirth: {
      type: Schema.Types.Mixed,
    },
    contactNo: {
      type: String,
      required: [true, 'Student contact no is required!'],
    },
    emergencyContactNo: {
      type: String,
      required: [true, 'An emergency contact number is required!'],
    },
    bloodGroup: {
      type: String,
      enum: {
        values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        message: '{VALUE} is not valid!',
      },
    },
    presentAddress: {
      type: String,
      required: [true, 'Present address is required!'],
    },
    permanentAddress: {
      type: String,
      required: [true, 'Permanent address is required!'],
    },
    guardian: {
      type: guardianSchema,
      required: [true, 'Guardian information is required!'],
    },
    localGuardian: {
      type: localGuardianSchema,
      required: [true, 'Local guardian information is required!'],
    },
    profileImg: String,
    admissionSemester: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicSemester',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

studentSchema.methods.isUserExists = async function (id: string) {
  const existingUser = await StudentModel.findOne({ id });
  return existingUser;
};

export const StudentModel = model<TStudent, StudentMethodsModel>(
  'Student',
  studentSchema,
);
