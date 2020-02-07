export class List<T> {
  constructor (private readonly value: T[]) { }

  static box = <T> (value: T): List<T> => new List([value])

  unbox = (): T[] => this.value

  then <OutT> (fn: (input: T) => List<OutT>): List<OutT> {
    const results = this.value.map(fn).map(list => list.unbox())
    const flattened = ([] as OutT[]).concat(...results)
    return new List(flattened)
  }

  transform <OutT> (fn: (input: T) => OutT): List<OutT> {
    return this.then(value => List.box(fn(value)))
  }
}
