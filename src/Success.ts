import { Result } from './Result';

export const Success = <U>(
  value?: U,
  context?: any,
  useCaseClass?: string,
): Result<U> => {
  return new Result<U>({
    resultType: 'SUCCESS',
    isSuccess: true,
    data: value,
    context,
    useCaseClass,
  });
};
