import { Schema, model } from 'mongoose';
import { TAdmin, TUserName } from './admin.interface';

const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    required: [true, 'First name is required!'],
    trim: true,
    maxlength: [20, "Name cann't be more than 20 characters!"],
  },
  middleName: String,
  lastName: {
    type: String,
    required: [true, 'Last name is required!'],
    trim: true,
    maxlength: [20, "Name cann't be more than 20 characters!"],
  },
});

const adminSchema = new Schema<TAdmin>({
  id: {
    type: String,
    required: [true, 'Admin ID is required!'],
  },
  user: {
    type: Schema.Types.ObjectId,
    required: [true, 'User ID is required!'],
    ref: 'User',
  },
  name: {
    type: userNameSchema,
    required: [true, 'Admin name is required!'],
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
    required: [true, 'Admin email must be required!'],
    unique: true,
  },
  dateOfBirth: {
    type: Schema.Types.Mixed,
  },
  contactNo: {
    type: String,
    required: [true, 'Admin contact number is required!'],
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
  profileImg: {
    type: String,
    default: '',
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const AdminModel = model<TAdmin>('Admin', adminSchema);

export default AdminModel;
