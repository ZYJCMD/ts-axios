import { Canceler, CancelExecutor, CancelTokenSource } from '../types'

import { Cancel } from './Cancel'

interface ResolvePromise {
  (reason?: Cancel): void
}
export default class CancelToken {
  promise: Promise<Cancel>
  reason?: Cancel

  constructor(executor: CancelExecutor) {
    //之后使用resolvePromise来改变状态
    let resolvePromise: ResolvePromise
    this.promise = new Promise<Cancel>(resolve => {
      resolvePromise = resolve
    })
    executor(message => {
      if (this.reason) {
        return
      }
      this.reason = new Cancel(message) //类既可以作为类型又可以作为值
      resolvePromise(this.reason)
    })
  }

  throwIfRequested() {
    if (this.reason) {
      throw this.reason
    }
  }

  static source(): CancelTokenSource {
    let cancel!: Canceler
    const token = new CancelToken(c => {
      cancel = c
    })
    return {
      cancel, //报错是因为前面赋值包了一层函数,所以前面强制置为不为空
      token //所以这里返回的类型还是cancelToken形状的吗
    }
  }
}
