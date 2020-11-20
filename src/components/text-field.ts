import {
  TEXT_FIELD_FOUCS,
  TEXT_FIELD_DELETE,
  CONTAINER_CLICK,
} from '../shared-utils/event'
import { DragonTotem } from '../dragon-totem'
import { hump2Underline, getStylePropUnit } from '../shared-utils/util'

export interface Style {
  width?: number | string // 文本输入框宽度(px)
  lineHeight?: number | string // 字体行高
  fontSize?: number | string // 字体大小(px)
  letterSpacing?: number | string // 字体距离(em)
  color?: string // 颜色
  fontWeight?: string | number // 字体粗细
  textAlign?: 'left' | 'center' | 'right' // 对齐方式
  [index: string]: any
}

export interface TextFieldConfig {
  id?: number // 唯一标记
  text?: string // 文字
  x?: number // 坐标x
  y?: number // 坐标y
  style?: Style // 样式
  classList?: Array<string> // 样式列表
  data?: any // 携带数据
}

interface Coordinate {
  l: number
  r: number
  t: number
  b: number
  n: number
}

export default class TextField {
  // DragonTotem 对象
  dragonTotem: DragonTotem
  // 外层容器DOM对象
  container: HTMLElement
  // HTML tag 标签
  tag: keyof HTMLElementTagNameMap = 'li'
  // 当前组件DOM对象
  document: HTMLElement
  // 配置项
  config: TextFieldConfig
  // 菜单
  menu: HTMLElement

  /**
   * 组件构造函数
   * @param {*} dragon-totem 主对象
   * @param {*} tag html标签
   * @param {*} config 元素配置
   */
  constructor(
    dragonTotem: DragonTotem,
    tag: keyof HTMLElementTagNameMap,
    config: TextFieldConfig,
  ) {
    // DragonTotem 对象
    this.dragonTotem = dragonTotem

    // 外层容器DOM对象
    const container = dragonTotem.container
    this.container = container as any

    // 当前组件DOM对象
    this.document = document.createElement(tag)

    // 相关配置项
    this.config = config

    // 初始化
    this.init(config)

    // 当前组件的菜单对象
    this.menu = this.initMenu()

    // 构建
    this.buildComponent()

    // 初始化右键菜单事件
    this.initContextMenuEvent()
  }

  // 获取组件DOM对象
  get realElement(): HTMLElement {
    return this.document
  }

  // 获取组件DOM样式
  get documentStyle(): Style | undefined {
    return this.config.style
  }

  get component(): this {
    return this
  }

  /**
   * 初始化组件
   */
  init(config: TextFieldConfig): void {
    // 配置样式
    const { x = 0, y = 0, classList = [], style = {}, data = {} } =
      config || this.config
    this.document.setAttribute('class', classList.join(' '))
    for (const key in style) {
      this.document.style.setProperty(
        hump2Underline(key),
        `${style[key]}${getStylePropUnit(key)}`,
      )
    }
    for (const key in data) {
      this.document.dataset[key] = data[key]
    }
    this.document.style.left = `${x}px`
    this.document.style.top = `${y}px`
    this.document.id = 'TEXT-FIELD-' + config.id
  }

  /**
   * 初始化菜单
   */
  initMenu(): HTMLElement {
    // 添加菜单
    const ul = document.createElement('ul')
    ul.id = 'dragon-totem__menu_' + this.config.id
    ul.className = 'dragon-totem__menu'
    const li = document.createElement('li')
    const a = document.createElement('a')
    a.className = 'dragon-totem__menu__delete'
    a.href = '###'
    a.innerText = '删除'
    li.appendChild(a)
    ul.appendChild(li)
    document.body.appendChild(ul)
    return ul
  }

  /**
   * 构造组件
   */
  buildComponent(): void {
    const li = this.document
    li.style.userSelect = 'none'
    const element = document.createElement('div')
    element.className = 'element'
    const span = document.createElement('span')
    span.innerText = this.config.text || '双击编辑文本'
    element.onclick = (e) => {
      this.menu && (this.menu.style.display = 'none')
      const lis = this.container.querySelectorAll(
        'li.item.item-comp.item-comp-border',
      )
      lis.forEach((item) => {
        item.classList.remove('item-comp-border')
      })
      li.classList.remove('item-comp-hover')
      li.classList.add('item-comp-border')
      this.dragonTotem.event.emit(TEXT_FIELD_FOUCS, this.component)
      e.stopImmediatePropagation()
    }

    span.oninput = () => {
      // 监听输入改变 config里面的数据
      const text = span.innerText
      this.config.text = text
    }

    element.ondblclick = (e) => {
      this.stop()
      span.contentEditable = 'true'
      setTimeout(() => {
        const selection = window.getSelection()
        if (selection) {
          const range = document.createRange()
          range.selectNodeContents(span)
          selection.removeAllRanges()
          selection.addRange(range)
        }
      }, 0)
      e.stopImmediatePropagation()
    }

    this.container.onclick = () => {
      this.render()
      this.menu && (this.menu.style.display = 'none')
      const lis = this.container.querySelectorAll('li.item.item-comp')
      lis.forEach((item) => {
        item.classList.add('item-comp-hover')
        item.classList.remove('item-comp-border')
      })
      this.dragonTotem.event.emit(CONTAINER_CLICK)
    }
    span.onblur = (e) => {
      this.render()
      li.classList.add('item-comp-hover')
      li.classList.remove('item-comp-border')
      if (
        !span.innerText ||
        span.innerText == '' ||
        span.innerText.length === 0
      ) {
        span.innerText = '双击编辑文本'
      }
      e.preventDefault()
    }
    element.appendChild(span)
    const elementBox = document.createElement('div')
    elementBox.className = 'element-box'
    elementBox.appendChild(element)
    // 添加内部对象
    li.appendChild(elementBox)
  }

  /**
   * 初始化自定义菜单显示事件
   */
  initContextMenuEvent(): void {
    // 自定义右键菜单
    this.document.oncontextmenu = (event) => {
      // 获取当前点击的坐标数据
      const { x, y } = event
      // 获取容器数据
      const {
        offsetTop,
        offsetHeight,
        offsetLeft,
        offsetWidth,
      } = this.container

      // 显示菜单
      this.menu.style.display = 'block'
      this.menu.style.left = `${x}px`
      // 判断菜单是否超出底部
      if (offsetTop + offsetHeight < y + this.menu.offsetHeight) {
        this.menu.style.top = `${y - this.menu.offsetHeight - 10}px`
      } else {
        this.menu.style.top = `${y}px`
      }
      // 判断菜单是否超出右侧
      if (offsetLeft + offsetWidth < x + this.menu.offsetWidth) {
        this.menu.style.left = `${x - this.menu.offsetWidth - 10}px`
      } else {
        this.menu.style.left = `${x}px`
      }
      return false
    }

    // 获取删除
    const dragonTotemMenuDelete = this.menu.querySelector(
      '.dragon-totem__menu__delete',
    )
    if (dragonTotemMenuDelete) {
      (dragonTotemMenuDelete as HTMLElement).onclick = () => {
        this.dragonTotem.event.emit(TEXT_FIELD_DELETE, this)
        this.destory()
        this.menu.remove()
      }
    }
  }

  /**
   * div 拖动事件
   */
  onMove(): void {
    const sent = {
      l: 0, //设置div在父元素的活动范围，10相当于给父div设置padding-left：10;
      r: this.container.offsetWidth - this.document.offsetWidth, // offsetWidth:当前对象的宽度， offsetWidth = width+padding+border
      t: 0,
      b: this.container.offsetHeight - this.document.offsetHeight,
      n: 10,
    }
    this.onMoveOutBoundary(this.document, sent)
  }

  /**
   * 边界
   * @param obj 被拖动的div
   * @param sent 设置div在容器中可以被拖动的区域
   */
  onMoveOutBoundary(obj: HTMLElement, sent: Coordinate): void {
    const dmW =
      document.documentElement.clientWidth || document.body.clientWidth
    const dmH =
      document.documentElement.clientHeight || document.body.clientHeight

    const l = sent.l || 0
    const r = sent.r || dmW - obj.offsetWidth
    const t = sent.t || 0
    const b = sent.b || dmH - obj.offsetHeight
    // const n = sent.n || 10

    obj.onmousedown = (ev) => {
      const oEvent = ev
      const sentX = oEvent.clientX - obj.offsetLeft
      const sentY = oEvent.clientY - obj.offsetTop

      document.onmousemove = (ev) => {
        const oEvent = ev
        let slideLeft = oEvent.clientX - sentX
        let slideTop = oEvent.clientY - sentY

        if (slideLeft <= l) {
          slideLeft = l
        }
        if (slideLeft >= r) {
          slideLeft = r
        }
        if (slideTop <= t) {
          slideTop = t
        }
        if (slideTop >= b) {
          slideTop = b
        }

        obj.style.left = slideLeft + 'px'
        obj.style.top = slideTop + 'px'
        this.config.x = slideLeft
        this.config.y = slideTop
      }
      document.onmouseup = function () {
        document.onmousemove = null
        document.onmouseup = null
      }

      return false
    }
  }

  /**
   * 渲染组件在容器中显示
   */
  render(): void {
    if (this.container && this.document) {
      this.container.appendChild(this.document)
      this.onMove()
    }
  }

  /**
   * 停止移动
   */
  public stop(): void {
    document.onmouseup = null
    this.document.onmousedown = null
  }

  /**
   * 设置样式
   * @param {*} style
   */
  public setStyle(style: Style): void {
    for (const key in style) {
      if (this.config.style) {
        this.config.style[key] = style[key]
      }
      this.document.style.setProperty(
        hump2Underline(key),
        `${style[key]}${getStylePropUnit(key)}`,
      )
    }
  }

  /**
   * 销毁
   */
  public destory(): void {
    this.document.remove()
    // 从容器中删除
    this.dragonTotem.elementUiList.splice(
      this.dragonTotem.elementUiList.findIndex((i) => i.id == this.config.id),
      1,
    )
    this.menu.remove()
    setTimeout(() => {
      this.document = null
      this.menu = null
    }, 0)
    this.tag = null
    this.config = null
  }
}
