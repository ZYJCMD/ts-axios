# ts-axios

## 项目简介

1. 使用 Typescript 构建 axios---并提交到 node
2. 将 ts 版本还原为 JS 构建 axios---ing

## 重构 Axios 库一些 tricky 的写法

1. 将 Axios function 的 prototype 等于一个对象，这样既可以直接调用 Axios 又可以通过.方法来使用
