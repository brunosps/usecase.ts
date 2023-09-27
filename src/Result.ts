import { ErrorObject } from "./ErrorObject";
import { Failure } from "./Failure";
import { ResultProps, TransitionType } from "./Types";

export class Result<T> {
    resultType: string;
    data: T
    error: ErrorObject;
    useCaseClass: string;
    context: any;
    transitions: TransitionType[];

    private _isSuccess: boolean;

    constructor({
        resultType,
        isSuccess,
        error,
        data,
        context,
        useCaseClass,
        transitions }: ResultProps<T>) {

        this.resultType = resultType;
        this._isSuccess = isSuccess;
        this.data = {} as T;
        this.error = {} as ErrorObject;
        this.useCaseClass = ""

        if (data) {
            this.data = data;
        }

        if (error) {
            this.error = error;
        }

        if (useCaseClass) {
            this.useCaseClass = useCaseClass;
        }

        if (context) {
            this.context = context;
        }

        this.transitions = [];

        if (transitions) {
            this.transitions = transitions;
        }

        Object.freeze(this);
    }

    getValue(): T {
        return this.data;
    }

    isSuccess() {
        return this._isSuccess
    }

    isFailure() {
        return !this._isSuccess
    }

    getType() {
        return this.resultType;
    }

    getError() {
        return this.error;
    }

    getContext() {
        return this.context;
    }

    andThen<U>(f: (data: T, res: Result<T>) => Result<U>): Result<U> {
        if (this.isFailure()) {
            return Failure(this.error, this.resultType, this.context, this.useCaseClass, this.transitions);
        }

        const result = f(this.getValue(), this);

        return this.mergeContext<U>(result, this);
    }

    mergeContext<U>(result: Result<U>, mergeable: Result<T>) {
        return new Result<U>({
            resultType: result.resultType,
            isSuccess: result._isSuccess,
            error: result.error,
            data: result.data,
            useCaseClass: result.useCaseClass,
            context: { ...mergeable.context, ...result.context },
            transitions: [...mergeable.transitions, ...result.transitions],
        })
    }

    onSuccess(f: (data: T, res: Result<T>) => any): Result<T> {
        if (this._isSuccess) {
            f(this.getValue(), this);
        }

        return this;
    }

    onFailure(f: (error: ErrorObject, res: Result<T>) => any, failureType = "FAILURE"): Result<T> {
        if (this.isFailure() && this.resultType === failureType) {
            f(this.getError(), this);
        }

        return this;
    }

}