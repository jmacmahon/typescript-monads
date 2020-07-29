export class Writer<T, W, M extends Monoid<W>> {
  private constructor (private readonly value: T, private readonly written: W, private readonly monoid: M) { }

  static pure <T, W, M extends Monoid<W>>(val: T, monoid: M): Writer<T, W, M> {
    return new Writer(val, monoid.empty, monoid)
  }

  then <OutT> (fn: (input: T) => Writer<OutT, W, M>): Writer<OutT, W, M> {
    const result = fn(this.value)
    const combinedWritten = this.monoid.concat(this.written, result.written)
    return new Writer(result.value, combinedWritten, this.monoid)
  }

  transform <OutT> (fn: (input: T) => OutT): Writer<OutT, W, M> {
    return this.then((val) => Writer.pure(fn(val), this.monoid))
  }

  unbox (): [T, W] {
    return [this.value, this.written]
  }

  static tell <W, M extends Monoid<W>> (writeItem: W, monoid: M): Writer<undefined, W, M> {
    return new Writer(undefined, writeItem, monoid)
  }
}

export interface Monoid<T> {
  empty: T
  concat: (u: T, v: T) => T
}

export const list = <A>(): Monoid<A[]> => ({
  empty: [],
  concat: (u, v) => ([] as A[]).concat(u, v)
})

export const sum: Monoid<number> = {
  empty: 0,
  concat: (u, v) => u + v
}

export const bitwise: Monoid<number> = {
  empty: 0,
  concat: (u, v) => u | v
}

export const or: Monoid<boolean> = {
  empty: false,
  concat: (u, v) => u || v
}
