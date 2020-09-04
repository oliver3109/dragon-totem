export interface Style {
  [index: string]: string
}

export interface TextFieldConfig {
  id?: number;
  text?: string;// 文字
  x?: number; // 坐标x
  y?: number; // 坐标y
  width?: number; // 文本输入框宽度(px)
  lineHeight?: number; // 字体行高
  fontSize?: number; // 字体大小(px)
  letterSpacing?: number; // 字体距离(em)
  classList?: Array<string>;
  style?: Style;
  data?: any,
}