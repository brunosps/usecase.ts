import { Result } from './Result';

export const Failure = <U>(
  error: Error,
  failureType = 'FAILURE',
  context?: any,
  useCaseClass?: string,
): Result<U> => {
  return new Result<U>({
    resultType: failureType,
    isSuccess: false,
    error,
    context,
    useCaseClass,
  });
};
