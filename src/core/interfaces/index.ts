export interface Style {
  width?: number | string; // 文本输入框宽度(px)
  lineHeight?: number | string; // 字体行高
  fontSize?: number | string; // 字体大小(px)
  letterSpacing?: number | string; // 字体距离(em)
  color?: string; // 颜色
  fontWeight?: string | number; // 字体粗细
  textAlign?: 'left' | 'center' | 'right' // 对齐方式
  [index: string]: any
}

export interface TextFieldConfig {
  id?: number; // 唯一标记
  text?: string; // 文字
  x?: number; // 坐标x
  y?: number; // 坐标y
  style?: Style; // 样式
  classList?: Array<string>; // 样式列表
  data?: any; // 携带数据
}