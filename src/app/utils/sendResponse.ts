import { Response } from 'express';

export type TMeta = {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
};
type TResult<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  meta?: TMeta;
  data: T;
};

const sendResponse = <T>(res: Response, result: TResult<T>) => {
  const { statusCode, success, message, data, meta } = result;
  res.status(statusCode).json({
    success,
    message,
    meta,
    data,
  });
};
export default sendResponse;
