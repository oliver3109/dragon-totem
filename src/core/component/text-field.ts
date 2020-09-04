/*
 * @Description: 文本输入框组件
 * @Auth: Oliver <81092048@qq.com>
 * @Date: 2020-08-21 22:50:22
 * @FilePath: /dragon-totem/src/core/component/text-field.ts
 */

import {
  TEXT_FIELD_FOUCS,
  TEXT_FIELD_DELETE,
} from '../constant/event'
import DragonTotem from '../dragon-totem'
import { TextFieldConfig, Style } from '../interfaces/index';

interface Coordinate {
  l: number;
  r: number;
  t: number;
  b: number;
  n: number;
}

export default class TextField {
  // DragonTotem 对象
  dragonTotem: DragonTotem;
  // 外层容器DOM对象
  container: HTMLElement;
  // HTML tag 标签
  tag: keyof HTMLElementTagNameMap = 'li';
  // 当前组件DOM对象
  document: HTMLElement;
  // 配置项
  config: TextFieldConfig;
  // 菜单
  menu: HTMLElement;

  /**
   * 组件构造函数
   * @param {*} dragon-totem 主对象
   * @param {*} tag html标签
   * @param {*} config 元素配置
   */
  constructor(dragonTotem: DragonTotem, tag: keyof HTMLElementTagNameMap, config: TextFieldConfig) {
    // DragonTotem 对象
    this.dragonTotem = dragonTotem

    // 外层容器DOM对象
    const container = dragonTotem.container
    this.container = container

    // 当前组件DOM对象
    this.document = document.createElement(tag)

    // 相关配置项
    this.config = config

    // 当前组件的菜单对象
    this.menu = this.initMenu()

    this.init(config)

    // 构建
    this.buildComponent()

    // 初始化右键菜单事件
    this.initContextMenuEvent()
  }

  // 获取组件真实dom对象
  get componentElement() {
    return this.document
  }

  /**
   * 初始化组件
   */
  init(config: TextFieldConfig) {
    // 配置样式
    let { x = 0, y = 0, classList = [], style = {}, data = {} } =
      config || this.config
    this.document.setAttribute('class', classList.join(' '))
    let styleStr = this.document.getAttribute('style') || ''
    for (const key in style) {
      styleStr += `${key}:${style[key]};`
    }
    this.document.setAttribute('style', styleStr)
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
  initMenu() {
    // 添加菜单
    let ul = document.createElement('ul')
    ul.id = 'dragon-totem__menu'
    ul.className = 'dragon-totem__menu'
    let li = document.createElement('li')
    let a = document.createElement('a')
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
  buildComponent() {
    let li = this.document
    li.style.userSelect = 'none'
    let element = document.createElement('div')
    element.className = 'element'
    let span = document.createElement('span')
    span.innerText = this.config.text || '双击编辑文本'

    element.onclick = (e) => {
      this.menu.style.display = 'none'

      const lis = this.container.querySelectorAll(
        'li.item.item-comp.item-comp-border'
      )
      lis.forEach((item) => {
        item.classList.remove('item-comp-border')
      })
      li.classList.remove('item-comp-hover')
      li.classList.add('item-comp-border')
      this.dragonTotem.event.emit(TEXT_FIELD_FOUCS, this)


      e.stopImmediatePropagation()
    }

    element.ondblclick = (e) => {
      this.stop()
      span.contentEditable = 'true'
      setTimeout(() => {
        let selection = window.getSelection()
        if (selection) {
          let range = document.createRange()
          range.selectNodeContents(span)
          selection.removeAllRanges()
          selection.addRange(range)
        }
      }, 0)
      e.stopImmediatePropagation()
    }

    this.container.onclick = () => {
      this.render()
      this.menu.style.display = 'none'
      const lis = this.container.querySelectorAll('li.item.item-comp')
      lis.forEach((item) => {
        item.classList.add('item-comp-hover')
        item.classList.remove('item-comp-border')
      })
      this.dragonTotem.event.emit(TEXT_FIELD_FOUCS)
      span.onblur = (e) => {
        this.render()
        li.classList.add('item-comp-hover')
        li.classList.remove('item-comp-border')
        e.preventDefault()
      }
      element.appendChild(span)
      let elementBox = document.createElement('div')
      elementBox.className = 'element-box'
      elementBox.appendChild(element)
      // 添加内部对象
      li.appendChild(elementBox)
    }
  }

  /**
   * 初始化自定义菜单显示事件
   */
  initContextMenuEvent() {
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
      '.dragon-totem__menu__delete'
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
  onMove() {
    let sent = {
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
  onMoveOutBoundary(obj: HTMLElement, sent: Coordinate) {
    let dmW = document.documentElement.clientWidth || document.body.clientWidth
    let dmH =
      document.documentElement.clientHeight || document.body.clientHeight

    let l = sent.l || 0
    let r = sent.r || dmW - obj.offsetWidth
    let t = sent.t || 0
    let b = sent.b || dmH - obj.offsetHeight
    let n = sent.n || 10

    obj.onmousedown = function (ev) {
      let oEvent = ev || event
      let sentX = oEvent.clientX - obj.offsetLeft
      let sentY = oEvent.clientY - obj.offsetTop

      document.onmousemove = function (ev) {
        let oEvent = ev || event

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
  render() {
    if (this.container && this.document) {
      this.container.appendChild(this.document)
      this.onMove()
    }
  }

  /**
   * 停止移动
   */
  stop() {
    document.onmouseup = null
    this.document.onmousedown = null
  }

  /**
   * 设置样式
   * @param {*} style
   */
  setStyle(style: Style) {
    let styleStr = this.document.getAttribute('style') || ''
    for (const key in style) {
      styleStr += `${key}:${style[key]};`
    }
    this.document.setAttribute('style', styleStr)
  }

  /**
   * 销毁
   */
  destory() {
    this.document.remove()
  }
}
