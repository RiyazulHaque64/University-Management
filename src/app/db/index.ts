import config from '../config';
import { UserModel } from '../modules/user/user.model';

const superAdmin = {
  id: 'SA-001',
  email: 'riyazulhaque64@gmail.com',
  password: config.super_admin_pass,
  role: 'superAdmin',
  status: 'in-progress',
};

export const seedSuperAdmin = async () => {
  const isSuperAdminExists = await UserModel.findOne({ role: 'superAdmin' });
  if (!isSuperAdminExists) {
    await UserModel.create(superAdmin);
  }
};
