/**
 * 检测是否为函数
 *
 * @param {*} fn 需要检测的函数
 * @returns boolean
 */
export function isFunction(fn: any) {
  return fn instanceof Function
}
/**
 * 检测是否为对象
 *
 * @param {*} obj 检测对象
 * @returns boolean
 */
export function isObject(obj: any) {
  return obj instanceof Object
}
/**
 * 检测是否为数组
 *
 * @param {*} arr 检测数组
 * @returns boolean
 */
export function isArray(arr: any) {
  return arr instanceof Array
}

/**
 * 生成uuid
 */
export function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8

    return v.toString(16)
  })
}
