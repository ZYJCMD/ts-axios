import { ResolvedFn, RejectedFn } from '../types'

interface Intercerptor<T> {
  resolved: ResolvedFn<T>
  rejectd?: RejectedFn
}

export default class InterceptorManager<T> {
  private intercerptors: Array<Intercerptor<T> | null>

  constructor() {
    this.intercerptors = []
  }

  use(resolved: ResolvedFn<T>, rejectd?: RejectedFn): number {
    this.intercerptors.push({
      resolved,
      rejectd
    })
    return this.intercerptors.length - 1
  }

  forEach(fn: (intercerptor: Intercerptor<T>) => void): void {
    this.intercerptors.forEach(interceptor => {
      if (interceptor !== null) {
        fn(interceptor)
      }
    })
  }

  eject(id: number): void {
    if (this.intercerptors[id]) {
      this.intercerptors[id] = null
    }
  }
}
