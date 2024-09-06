import { Context } from './Context';
import { Failure } from './Failure';
import { Result } from './Result';
import { Success } from './Success';

interface IUseCase<I, O> {
  execute(input?: I): Promise<Result<O>>;
}

export class UseCase<I, O> implements IUseCase<I, O> {
  execute(input?: I): Promise<Result<O>> {
    throw new Error('Method not implemented.');
  }

  async call(params: I): Promise<Result<O>> {
    const result = await this.execute(params);

    if (result.isFailure()) {
      return Failure(
        result.error,
        result.resultType,
        result.context,
        this.constructor.name,
      );
    }

    return Success(
      result.data,
      {
        [this.constructor.name]: new Context<I, O>(params, result.data),
      },
      this.constructor.name,
    );
  }

  static async call<X, Y>(params: X): Promise<Result<Y>> {
    const self = new this<X, Y>();
    return await self.call(params);
  }
}
