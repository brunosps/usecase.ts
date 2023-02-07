import { ErrorObject } from "./ErrorObject";

export type TransitionType = {
    resultType: string;
    isSuccess: boolean;
    useCaseClass: string;
    inputValues: any;
    outputValues: any;
    context: any;
}

export type ResultProps<T> = {
    resultType: string;
    isSuccess: boolean;
    error?: ErrorObject;
    data?: T;
    context?: any;
    useCaseClass?: string;
    transitions?: TransitionType[];
}