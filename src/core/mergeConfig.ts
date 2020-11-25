import { isPlainObject, deepMerge } from '../helpers/util'
import { AxiosRequestConfig } from '../types'

const strats = Object.create(null)

function defaultStart(val1: any, val2: any): any {
  return typeof val2 !== undefined ? val2 : val1 //优先取合并2中的策略
}

function fromVal2Strat(val1: any, val2: any): any {
  if (typeof val2 !== undefined) {
    return val2
  }
}

function deepMergeStrat(val1: any, val2: any): any {
  if (isPlainObject(val2)) {
    return deepMerge(val1, val2)
  } else if (typeof val2 !== undefined) {
    return val2
  } else if (isPlainObject(val1)) {
    //val2是空的
    return deepMerge(val1)
  } else if (typeof val1 !== undefined) {
    return val1
  }
}

const stratKeysFromVal2 = ['url', 'params', 'data']
stratKeysFromVal2.forEach(key => {
  strats[key] = fromVal2Strat
})

const stratKeysDeepMerge = ['headers', 'auth']
stratKeysDeepMerge.forEach(key => {
  strats[key] = deepMergeStrat
})

export default function mergeConfig(
  config1: AxiosRequestConfig,
  config2?: AxiosRequestConfig
): AxiosRequestConfig {
  if (!config2) {
    //config2是用户的设置
    config2 = {}
  }
  const config = Object.create(null)
  for (let key in config2) {
    mergeFiled(key)
  }
  for (let key in config1) {
    if (!config2[key]) {
      mergeFiled(key)
    }
  }

  function mergeFiled(key: string): void {
    const strat = strats[key] || defaultStart
    config[key] = strat(config1[key], config2![key])
  }

  return config
}
