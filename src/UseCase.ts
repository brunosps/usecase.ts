import { Failure } from "./Failure";
import { Result } from "./Result";
import { Success } from "./Success";
import { TransitionType } from "./Types";

export class UseCase<I, O>{
    execute(input?: I): Result<O> {
        throw new Error("Method not implemented.");
    }

    __call(params?: I): Result<O> {
        const result = this.execute(params)
        const transition = this.transition(params as I, result);
        const transitions = [...result.transitions, transition];

        if (result.isFailure()) {
            return Failure(transition.outputValues, transition.resultType, transition.context, this.constructor.name, transitions);
        }


        return Success(transition.outputValues, transition.context, this.constructor.name, transitions)
    }

    transition(input: I, result: Result<O>): TransitionType {
        return {
            resultType: result.getType(),
            isSuccess: result.isSuccess,
            useCaseClass: this.constructor.name,
            inputValues: input,
            outputValues: result.isFailure() ? result.getError() : result.getValue(),
            context: { ...result.getContext(), ...input, ...result.getValue() },
        }
    }

    static call<X, Y>(params?: X): Result<Y> {
        const self = new this<X, Y>;
        return self.__call(params);
    }

    call<X, Y>(_useCase: typeof UseCase<X, Y>, params: X): Result<Y> {
        return _useCase.call<X, Y>(params);
    }

}