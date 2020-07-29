export function partition<T> (items: T[], predicate: (item: T) => boolean): [T[], T[]] {
  const lefts: T[] = []
  const rights: T[] = []
  items.forEach(item => {
    if (predicate(item)) {
      lefts.push(item)
    } else {
      rights.push(item)
    }
  })
  return [lefts, rights]
}
