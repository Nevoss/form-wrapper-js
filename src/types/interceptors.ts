export interface InterceptorFulfilled {
  (value?: any): Promise<any>
}

export interface InterceptorRejected {
  (value?: any): any
}

export interface Interceptor {
  fulfilled: InterceptorFulfilled | null
  rejected: InterceptorRejected | null
}
