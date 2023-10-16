
import { Result } from "./Result"
import { TransitionType } from "./Types"

export const Failure = <U,>(error: Error, failureType = "FAILURE", context?: any, useCaseClass?: string, transitions?: TransitionType[]): Result<U> => {
    return new Result<U>({
        resultType: failureType,
        isSuccess: false,
        error,
        context,
        useCaseClass,
        transitions,
    })
}