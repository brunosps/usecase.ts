export class Context<I, O> {
  _inputParams: I;
  _outputParams: O;

  constructor(input: I, data: O) {
    this._inputParams = input;

    this._outputParams = data;

    Object.entries({ ...input, ...data }).forEach(([k, v]) => {
      Object.defineProperty(this, k, {
        writable: false,
        configurable: true,
        enumerable: true,
        value: v,
      });
    });
  }
}
