export class ErrorObject {
    constructor(
        public property: string,
        public errors: string[],
    ) { }

    toString(): string {
        return `${this.property}: ${this.errors.join(", ")}`
    }
}