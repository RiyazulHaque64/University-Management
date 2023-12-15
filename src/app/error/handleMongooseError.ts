import mongoose from 'mongoose';
import { TErrorSources, TGenericErrorResponse } from '../interface/error';

const handleMongooseError = (
  error: mongoose.Error.ValidationError,
): TGenericErrorResponse => {
  const errorSources: TErrorSources[] = Object.values(error.errors).map(
    (err: mongoose.Error.ValidatorError | mongoose.Error.CastError) => ({
      path: err.path,
      message: err.message,
    }),
  );
  const statusCode = 400;
  return {
    statusCode,
    message: 'Validation Error!',
    errorSources,
  };
};
export default handleMongooseError;
