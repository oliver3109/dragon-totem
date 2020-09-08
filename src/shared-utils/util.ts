/**
 * 检测是否为函数
 *
 * @param {*} fn 需要检测的函数
 * @returns boolean
 */
export function isFunction(fn: any): boolean {
  return fn instanceof Function
}

/**
 * 检测是否为对象
 *
 * @param {*} obj 检测对象
 * @returns boolean
 */
export function isObject(obj: any): boolean {
  return obj instanceof Object
}
/**
 * 检测是否为数组
 *
 * @param {*} arr 检测数组
 * @returns boolean
 */
export function isArray(arr: any): boolean {
  return arr instanceof Array
}

/**
 * 中划线转换驼峰
 * @param name 字符串
 * @returns string
 */
export function underLine2Hump(name: string): string {
  return name.replace(/-(\w)/g, function (all, letter) {
    return letter.toUpperCase();
  });
}

/**
 * 驼峰转换中划线
 * @param name 字符串
 * @returns string
 */
export function hump2Underline(name: string): string {
  return name.replace(/([A-Z])/g, "-$1").toLowerCase();
}

/**
 * 生成uuid
 * @returns string
 */
export function getUuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8

    return v.toString(16)
  })
}
/**
 * 获取样式属性的单位后缀
 * @param key style property
 * @returns string
 */
export function getStylePropUnit(styleProp: string): 'px' | 'em' | '' {
  const NeedAddPx = [
    'width',
    'lineHeight',
    'fontSize',
  ]
  const NeedAddEm = [
    'letterSpacing'
  ]
  if (NeedAddEm.includes(styleProp)) {
    return 'em'
  }
  if (NeedAddPx.includes(styleProp)) {
    return 'px'
  }
  return '';
}