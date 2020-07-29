export class ListWriter<W, T> {
  private constructor (private readonly value: T, private readonly written: W[]) { }

  static pure <T>(val: T): ListWriter<never, T> {
    return new ListWriter(val, [])
  }

  then <OutT, NewW> (fn: (input: T) => ListWriter<NewW, OutT>): ListWriter<W | NewW, OutT> {
    const result = fn(this.value)
    const empty: Array<W | NewW> = []
    const combinedWritten = empty.concat(this.written, result.written)
    return new ListWriter(result.value, combinedWritten)
  }

  transform <OutT> (fn: (input: T) => OutT): ListWriter<W, OutT> {
    return this.then((val) => ListWriter.pure(fn(val)))
  }

  unbox (): [T, W[]] {
    return [this.value, this.written]
  }

  static tell <W> (writeItems: W[]): ListWriter<W, undefined> {
    return new ListWriter(undefined, writeItems)
  }
}
