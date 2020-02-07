import { Maybe } from '../maybe'

interface Graph {
  title: string
  caption: Maybe<string>
}

const graphs: Graph[] = []

function getGraphByTitle (title: string): Maybe<Graph> {
  const graph = graphs.find(graph => graph.title === title)
  return graph === undefined ? Maybe.nothing() : Maybe.just(graph)
}

const getGraphCaption = (graph: Graph): Maybe<string> => graph.caption

function firstWord (sentence: string): Maybe<string> {
  const [firstWord] = sentence.split(' ')
  return firstWord === undefined ? Maybe.nothing() : Maybe.just(firstWord)
}

const firstWordOfCaption = (title: string): Maybe<string> => {
  return Maybe.box(title)
    .then(getGraphByTitle)
    .then(getGraphCaption)
    .then(firstWord)
}

console.log('foo', firstWordOfCaption('foo'))
console.log('bar', firstWordOfCaption('bar'))
console.log('baz', firstWordOfCaption('baz'))
console.log('quux', firstWordOfCaption('quux'))
