/* eslint-disable @typescript-eslint/no-namespace,no-inner-declarations */

import { Writer, Monoid, or, bitwise, list } from '../monoidWriter'
import { partition } from './helpers'

namespace Example1 {
  // Uses a Writer with an "or" monoid, to tell if there was an error along the way

  interface ReceivedMessage {
    id: string
    body: string
  }

  type BatchResult<T> = Writer<T, boolean, Monoid<boolean>>

  function receive (): BatchResult<ReceivedMessage[]> {
    return Writer.pure([
      { id: 'foo', body: 'lorem ipsum' },
      { id: 'bar', body: 'dolor sit' },
      { id: 'baz', body: 'amet' }
    ], or)
  }

  interface ConfirmHandle { handle: string }

  function process (messages: ReceivedMessage[]): BatchResult<ConfirmHandle[]> {
    // Fake DB bulk insert
    const [succeeded, failed] = partition(messages, () => Math.random() < 0.5)
    const confirmations = succeeded.map(({ id }) => ({ handle: id }))
    return Writer.tell(failed.length > 0, or).transform(() => confirmations)
  }

  function confirm (confirmations: ConfirmHandle[]): BatchResult<void> {
    // Fake error-y confirmation
    const failed = partition(confirmations, () => Math.random() < 0.5)[1]
    return Writer.tell(failed.length > 0, or)
  }

  export function example1 (): void {
    const errors = receive()
      .then(process)
      .then(confirm)
      .unbox()[1]

    console.log(errors)
  }
}

console.log('Example 1')
Example1.example1()

namespace Example2 {
  // The same as Example 1, but with a "bitwise" monoid, to give an error code that indicates which steps failed

  interface ReceivedMessage {
    id: string
    body: string
  }

  const processErrorCode = 1 << 0
  const confirmErrorCode = 1 << 1

  type BatchResult<T> = Writer<T, number, Monoid<number>>

  function receive (): BatchResult<ReceivedMessage[]> {
    return Writer.pure([
      { id: 'foo', body: 'lorem ipsum' },
      { id: 'bar', body: 'dolor sit' },
      { id: 'baz', body: 'amet' }
    ], bitwise)
  }

  interface ConfirmHandle { handle: string }

  function process (messages: ReceivedMessage[]): BatchResult<ConfirmHandle[]> {
    // Fake DB bulk insert
    const [succeeded, failed] = partition(messages, () => Math.random() < 0.5)
    const errorCode = failed.length > 0 ? processErrorCode : 0
    const confirmations = succeeded.map(({ id }) => ({ handle: id }))
    return Writer.tell(errorCode, bitwise).transform(() => confirmations)
  }

  function confirm (confirmations: ConfirmHandle[]): BatchResult<void> {
    // Fake error-y confirmation
    const failed = partition(confirmations, () => Math.random() < 0.5)[1]
    const errorCode = failed.length > 0 ? confirmErrorCode : 0
    return Writer.tell(errorCode, bitwise)
  }

  export function example2 (): void {
    const errors = receive()
      .then(process)
      .then(confirm)
      .unbox()[1]

    console.log(errors)
  }
}

console.log('Example 2')
Example2.example2()

namespace Example3 {
  // The same as Example 2, but with a "list" monoid, to collect each error emitted

  interface ReceivedMessage {
    id: string
    body: string
  }

  type BatchResult<T> = Writer<T, Error[], Monoid<Error[]>>
  const errorList: Monoid<Error[]> = list()

  function receive (): BatchResult<ReceivedMessage[]> {
    return Writer.pure([
      { id: 'foo', body: 'lorem ipsum' },
      { id: 'bar', body: 'dolor sit' },
      { id: 'baz', body: 'amet' }
    ], errorList)
  }

  interface ConfirmHandle { handle: string }

  function process (messages: ReceivedMessage[]): BatchResult<ConfirmHandle[]> {
    // Fake DB bulk insert
    const [succeeded, failed] = partition(messages, () => Math.random() < 0.5)
    const errors = failed.map(failure => new Error(`process failed for message id: ${failure.id}`))
    const confirmations = succeeded.map(({ id }) => ({ handle: id }))
    return Writer.tell(errors, errorList).transform(() => confirmations)
  }

  function confirm (confirmations: ConfirmHandle[]): BatchResult<void> {
    // Fake error-y confirmation
    const failed = partition(confirmations, () => Math.random() < 0.5)[1]
    const errors = failed.map(failure => new Error(`confirm failed for confirm handle: ${failure.handle}`))
    return Writer.tell(errors, errorList)
  }

  export function example3 (): void {
    const errors = receive()
      .then(process)
      .then(confirm)
      .unbox()[1]

    console.log(errors)
  }
}

console.log('Example 3')
Example3.example3()
