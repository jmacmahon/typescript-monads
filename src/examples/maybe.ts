import { Maybe } from '../maybe'

interface Graph {
  title: string
  caption: Maybe<string>
}

const graphs: Graph[] = [
  { title: 'foo', caption: Maybe.just('lorem ipsum') },
  { title: 'bar', caption: Maybe.just('') },
  { title: 'baz', caption: Maybe.nothing() }
]

function getGraphByTitle (title: string): Maybe<Graph> {
  const graph = graphs.find(graph => graph.title === title)
  return graph === undefined ? Maybe.nothing() : Maybe.just(graph)
}

const getGraphCaption = (graph: Graph): Maybe<string> => graph.caption

function firstWord (sentence: string): Maybe<string> {
  const matchResult = /^([^ ]+)/.exec(sentence)
  return matchResult === null ? Maybe.nothing() : Maybe.just(matchResult[1])
}

function toUpper (raw: string): string {
  return raw.toUpperCase()
}

const firstWordOfCaption = (title: string): Maybe<string> => {
  return Maybe.box(title)
    .then(getGraphByTitle)
    .then(getGraphCaption)
    .then(firstWord)
    .transform(toUpper)
}

console.log('uppercased first word of caption for foo:', firstWordOfCaption('foo').unbox('nothing'))
console.log('uppercased first word of caption for bar:', firstWordOfCaption('bar').unbox('nothing'))
console.log('uppercased first word of caption for baz:', firstWordOfCaption('baz').unbox('nothing'))
console.log('uppercased first word of caption for quux:', firstWordOfCaption('quux').unbox('nothing'))
