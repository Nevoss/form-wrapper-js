import { InterceptorHandler } from '../types'

export class InterceptorManager {
  /**
   * holds all the function that should run on the chain
   */
  $handlers: InterceptorHandler[] = []

  /**
   * adding function to the handlers chain
   * and returns the position of the handler in the chain
   *
   * @param fulfilled
   * @param rejected
   */
  public use(fulfilled: Function | null, rejected: Function | null): number {
    this.$handlers.push({
      fulfilled,
      rejected,
    })

    return this.$handlers.length - 1
  }

  /**
   * eject a handler from the chain, by his position.
   *
   * @param position
   */
  public eject(position: number): void {
    if (this.$handlers[position]) {
      this.$handlers[position] = null
    }
  }

  /**
   * letting you merge more interceptors to the handlers array
   * NOTICE: this will put the interceptors at the BEGINNING of the chain
   *
   * @param interceptors
   */
  public merge(interceptors: InterceptorHandler[]): InterceptorManager {
    this.$handlers = [...interceptors, ...this.$handlers]

    return this
  }

  /**
   * run over the handlers
   *
   * @param func
   */
  public forEach(func: Function): void {
    this.$handlers.forEach((handler: InterceptorHandler) => {
      if (handler !== null) {
        func(handler)
      }
    })
  }
}
