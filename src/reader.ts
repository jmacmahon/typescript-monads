export class Reader<ReadOnlyState, T> {
  constructor (private readonly fn: (state: ReadOnlyState) => T) {}

  run (readOnlyState: ReadOnlyState): T {
    return this.fn(readOnlyState)
  }

  static resolve <ReadOnlyState, V> (val: V): Reader<ReadOnlyState, V> {
    return new Reader(() => val)
  }

  then <OutT> (fn: (input: T) => Reader<ReadOnlyState, OutT>): Reader<ReadOnlyState, OutT> {
    const newFn = (state: ReadOnlyState): OutT => {
      const value = this.run(state)
      const newReader = fn(value)
      return newReader.run(state)
    }
    return new Reader(newFn)
  }

  transform <OutT> (fn: (input: T) => OutT): Reader<ReadOnlyState, OutT> {
    return this.then(value => Reader.resolve(fn(value)))
  }
}
