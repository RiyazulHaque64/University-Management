import { TLogin } from './auth.interface';

const loginUser = async (payload: TLogin) => {
  console.log(payload);
};

export const AuthServices = {
  loginUser,
};
