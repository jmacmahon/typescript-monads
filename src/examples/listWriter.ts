import { ListWriter } from '../listWriter'
import { partition } from './helpers'

interface ReceivedMessage {
  id: string
  body: string
}

function receive (): ListWriter<never, ReceivedMessage[]> {
  return ListWriter.pure([
    { id: 'foo', body: 'lorem ipsum' },
    { id: 'bar', body: 'dolor sit' },
    { id: 'baz', body: 'amet' }
  ])
}

type MyError =
  { error: 'process error', message: string }
  | { error: 'confirm error', message: string }
interface ConfirmHandle { handle: string }

function process (messages: ReceivedMessage[]): ListWriter<MyError, ConfirmHandle[]> {
  // Fake DB bulk insert
  const [succeeded, failed] = partition(messages, () => Math.random() < 0.5)
  const errors = failed.map((item): MyError => ({ error: 'process error', message: JSON.stringify(item) }))
  const confirmations = succeeded.map(({ id }) => ({ handle: id }))
  return ListWriter.tell(errors).transform(() => confirmations)
}

function confirm (confirmations: ConfirmHandle[]): ListWriter<MyError, undefined> {
  // Fake error-y confirmation
  const failed = partition(confirmations, () => Math.random() < 0.5)[1]
  const errors = failed.map((item): MyError => ({ error: 'confirm error', message: JSON.stringify(item) }))
  return ListWriter.tell(errors)
}

const errors = receive()
  .then(process)
  .then(confirm)
  .unbox()[1]

console.log(errors)
