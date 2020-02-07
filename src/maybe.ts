export class Maybe<T> {
  private constructor (private readonly _value?: T) { }

  static just<T>(value: T): Maybe<T> {
    return new Maybe(value)
  }

  static nothing<T>(): Maybe<T> {
    return new Maybe()
  }

  static box = <T> (value: T): Maybe<T> => Maybe.just(value)

  then <OutT> (fn: (input: T) => Maybe<OutT>): Maybe<OutT> {
    if (this._value === undefined) {
      return Maybe.nothing()
    }
    return fn(this._value)
  }

  transform <OutT> (fn: (input: T) => OutT): Maybe<OutT> {
    return this.then(value => Maybe.box(fn(value)))
  }
}
