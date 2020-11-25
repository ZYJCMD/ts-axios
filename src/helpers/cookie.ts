const cookie = {
  read(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)')) //[^;]表示它的值 [标记一个中括号表达式的开始
    return match ? decodeURIComponent(match[3]) : null
  }
}

export default cookie
