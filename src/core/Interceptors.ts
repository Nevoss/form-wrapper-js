import {
  Interceptor,
  InterceptorFulfilled,
  InterceptorRejected,
} from '../types/interceptors'

export class Interceptors {
  /**
   * All the interceptors
   */
  private chain: Interceptor[] = []

  /**
   * Interceptors constructor
   *
   * @param interceptors
   */
  public constructor(interceptors: Interceptor[] = []) {
    this.merge(interceptors)
  }

  /**
   * Adding Interceptor to the chain
   * and returns the position of the Interceptor in the chain
   *
   * @param fulfilled
   * @param rejected
   */
  public use(
    fulfilled: InterceptorFulfilled | null,
    rejected: InterceptorRejected | null = null
  ): number {
    this.chain.push({
      fulfilled,
      rejected,
    })

    return this.chain.length - 1
  }

  /**
   * eject an Interceptor from the chain, by his position.
   *
   * @param position
   */
  public eject(position: number): Interceptors {
    if (this.chain[position]) {
      this.chain[position] = {
        fulfilled: null,
        rejected: null,
      }
    }

    return this
  }

  /**
   * letting you merge more interceptors to the chain
   * NOTICE: this will put the interceptors at the BEGINNING of the chain
   *
   * @param interceptors
   */
  public merge(interceptors: Interceptor[]): Interceptors {
    this.chain = [...interceptors, ...this.chain]

    return this
  }

  /**
   * return all the Interceptors in the chain
   */
  public all(): Interceptor[] {
    return this.chain
  }

  /**
   * run over the chain
   *
   * @param callback
   */
  public forEach(callback: Function): void {
    this.chain.forEach((interceptor: Interceptor): void => {
      callback(interceptor)
    })
  }
}
