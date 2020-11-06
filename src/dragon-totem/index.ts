import TextField, { TextFieldConfig } from '../components/text-field'
import Events from '../shared-utils/event'

/**
 * DragonTotem
 * @param {*} id 容器id
 */
export class DragonTotem {
  // 容器
  container: HTMLElement | null
  // 容器高度
  containerHeight = 0
  // 容器高度/真实图片高度
  heightScale = 0
  // 容器宽度
  containerWidth = 0
  // 容器宽度/真实图片宽度
  widthScale = 0
  // 内部元素管理
  elementUiList: Array<{ id: number; component: TextField }> = []
  // 监听器
  listener = {}
  // 事件对象
  event: Events = new Events()

  constructor(id: string | HTMLElement, width = 0, height = 0) {
    let dom: HTMLElement | null = null
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
  public addBgImg(img: HTMLImageElement): void {
    if (!img) {
      console.error('添加背景图，图片地址不能为空')
      return
    }
    if (!img.src.includes('http')) {
      console.error('图片地址必须是网络地址')
      return
    }
    img.onload = () => {
      const { containerHeight, containerWidth } = this
      // 计算 容器宽度 与 真实图片宽度 缩放比例
      const widthScale = containerWidth / img.naturalWidth
      this.widthScale = widthScale
      // 计算 容器高度 与 真实图片高度 缩放比例
      const heightScale = containerHeight / img.naturalHeight
      this.heightScale = heightScale
      // 设置图片背景
      if (this.container) {
        this.container.style.backgroundImage = 'url(' + img.src + ')'
        this.container.style.backgroundSize = '100% 100%'
      }
    }
  }

  /**
   * 添加文本输入框
   * @param {*} config
   */
  public addTextField(config: TextFieldConfig = {}): void {
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

    // 初始化li组件
    const id = this.elementUiList.length + 1
    const component = new TextField(this, 'li', {
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
    component.render()
    this.elementUiList.push({ id, component })
  }

  /**
   * 监听
   * @param {*} name 事件
   */
  public on(name: string, fn: (...arg) => void): void {
    if (this.event) {
      this.event.on(name, fn)
    }
  }

  /**
   * 销毁
   */
  public destory(): void {
    this.elementUiList.forEach((item) => {
      item.component.destory()
    })
    if (this.container) {
      this.container.removeAttribute('class')
      this.container.removeAttribute('style')
      this.container.innerHTML = ''
      setTimeout(() => {
        this.container = null
        this.elementUiList = []
      }, 0)
    }
    this.containerHeight = 0
    this.containerWidth = 0
    this.event = null
    this.widthScale = 0
    this.listener = {}
  }
}
