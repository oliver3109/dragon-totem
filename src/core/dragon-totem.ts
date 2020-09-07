import TextField from './component/text-field'
import Events from './utils/event'
import { TextFieldConfig } from './interfaces/index';

/**
 * DragonTotem
 * @param {*} id 容器id
 */
export class DragonTotem {
  // 容器
  container: HTMLElement;
  // 容器高度
  containerHeight = 0;
  // 容器高度/真实图片高度
  heightScale = 0;
  // 容器宽度
  containerWidth = 0;
  // 容器宽度/真实图片宽度
  widthScale = 0;
  // 内部元素管理
  elementUiList: Array<{ id: number, componet: any }> = [];
  // 监听器
  listener = {}
  // 事件对象
  event = new Events()

  constructor(id: string | HTMLElement, width = 0, height = 0) {
    let dom = null
    if (typeof id === 'string') {
      dom = document.getElementById(id)
      if (!dom) {
        throw new Error('找不到DOM')
      }
    } else {
      dom = id
    }
    this.containerHeight = height
    this.containerWidth = width
    dom.style.height = `${height}px`
    dom.style.width = `${width}px`
    dom.className = 'dragon-totem'
    this.container = dom
  }

  /**
   * 添加背景图
   * @param {*} img 网络图片（本地图片暂不支持，在vue项目中经过打包会导致路径错误）
   */
  public addBgImg(img: HTMLImageElement) {
    const that = this
    if (!img) {
      console.error('添加背景图，图片地址不能为空')
      return
    }
    if (!img.src.includes('http')) {
      console.error('图片地址必须是网络地址')
      return
    }
    img.onload = function () {
      const { containerHeight, containerWidth } = that
      // 计算 容器宽度 与 真实图片宽度 缩放比例
      const widthScale = containerWidth / img.naturalWidth
      that.widthScale = widthScale
      // 计算 容器高度 与 真实图片高度 缩放比例
      const heightScale = containerHeight / img.naturalHeight
      that.heightScale = heightScale
      // 设置图片背景
      if (that.container) {
        that.container.style.backgroundImage = 'url(' + img.src + ')'
        that.container.style.backgroundSize = 'contain'
      }
    }
  }

  /**
   * 添加文本输入框
   * @param {*} config
   */
  public addTextField(config: TextFieldConfig = {}) {
    const {
      text = '双击输入文字', // 文字
      x, // 坐标x
      y, // 坐标y
      style: {
        color = '#676767', // 文本颜色
        width = 94, // 文本输入框宽度(px)
        lineHeight = 20, // 字体行高
        fontSize = 14, // 字体大小(px)
        letterSpacing = 0, // 字体距离(em)
      } = {},
      data = {},
    } = config
    const that = this

    // 初始化li组件
    let id = that.elementUiList.length + 1
    let componet = new TextField(that, 'li', {
      id,
      text,
      x,
      y,
      classList: ['item item-comp item-comp-hover'],
      style: {
        color,
        width,
        lineHeight,
        fontSize,
        letterSpacing,
      },
      data: Object.assign(data, {
        id,
      }),
    })
    // 渲染
    componet.render()
    that.elementUiList.push({ id, componet })
  }

  /**
   * 监听
   * @param {*} name 事件
   */
  public on(name: string, fn: Function) {
    this.event.on(name, fn)
  }
}
