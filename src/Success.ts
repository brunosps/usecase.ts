import { Result } from "./Result";
import { TransitionType } from "./Types";

export const Success = <U,>(value?: U, context?: any, useCaseClass?: string, transitions?: TransitionType[]): Result<U> => {
    return new Result<U>(
        {
            resultType: "SUCCESS",
            isSuccess: true,
            data: value,
            context: context,
            useCaseClass: useCaseClass,
            transitions,
        },
    );
}