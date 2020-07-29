import { ListWriter } from '../listWriter'
import { partition } from './helpers'

interface ReceivedMessage {
  id: string
  body: string
}

interface ConfirmHandle {
  handle: string
}

class ProcessError extends Error { }
class ConfirmError extends Error { }
type PipelineError = ProcessError | ConfirmError

function receive (): ListWriter<never, ReceivedMessage[]> {
  return ListWriter.pure([
    { id: 'foo', body: 'lorem ipsum' },
    { id: 'bar', body: 'dolor sit' },
    { id: 'baz', body: 'amet' }
  ])
}

function process (messages: ReceivedMessage[]): ListWriter<ProcessError, ConfirmHandle[]> {
  // Fake DB bulk insert
  const [succeeded, failed] = partition(messages, () => Math.random() < 0.5)
  const errors = failed.map((item) => new ProcessError(`process error for id ${item.id}`))
  const confirmations = succeeded.map(({ id }) => ({ handle: id }))
  return ListWriter.tell(errors).transform(() => confirmations)
}

function confirm (confirmations: ConfirmHandle[]): ListWriter<ConfirmError, void> {
  // Fake error-y confirmation
  const failed = partition(confirmations, () => Math.random() < 0.5)[1]
  const errors = failed.map((item) => new ConfirmError(`confirm error for handle ${item.handle}`))
  return ListWriter.tell(errors)
}

const errors: PipelineError[] =
  receive()
    .then(process)
    .then(confirm)
    .unbox()[1]

console.log(errors)
