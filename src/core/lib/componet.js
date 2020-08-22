/**
 * @file Componet类
 * @deprecated HTML元素对象
 */

import { TEXT_FIELD_FOUCS, CONTAINER_CLICK } from '../constant/event'

export default class Component {
  constructor(graffiti, tag, config) {
    const container = graffiti.container
    console.log('初始化 Component 对象....')
    this.graffiti = graffiti
    this.container = container
    this.document = document.createElement(tag)
    this.config = config
    this.init(config)
    // 获取dom对象
    let li = this.componentElement
    let element = document.createElement('div')
    element.className = 'element'
    let span = document.createElement('span')
    span.innerText = config.text || '双击编辑文本'
    element.onclick = (e) => {
      li.classList.remove('item-comp-hover')
      li.classList.add('item-comp-border')
      graffiti.listener[TEXT_FIELD_FOUCS](this)
      e.stopImmediatePropagation()
    }
    element.ondblclick = (e) => {
      this.stop()
      span.contentEditable = 'true'
      setTimeout(() => {
        let selection = window.getSelection()
        let range = document.createRange()
        range.selectNodeContents(span)
        selection.removeAllRanges()
        selection.addRange(range)
      }, 0)
      e.stopImmediatePropagation()
    }
    this.container.onclick = () => {
      this.render()
      li.classList.add('item-comp-hover')
      li.classList.remove('item-comp-border')
      graffiti.listener[CONTAINER_CLICK]()
    }
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

    // 自定义右键菜单
    element.oncontextmenu = (event) => {
      const menu = document.getElementById('graffiti__menu')
      menu.style.display = 'block'
      console.dir(this.container)
      console.dir(menu)
      menu.style.left = '20px'
      menu.style.top = '10px'
      return false
    }
  }

  // 获取组件真实dom对象
  get componentElement() {
    return this.document
  }

  /**
   * 初始化组件
   */
  init(config) {
    // 配置样式
    let { x = 0, y = 0, classList = [], style = {}, data = {} } =
      config || this.config
    this.document.classList = classList
    for (const key in style) {
      this.document.style[key] = style[key]
    }
    for (const key in data) {
      this.document.dataset[key] = data[key]
    }
    this.document.style.left = `${x}px`
    this.document.style.top = `${y}px`
  }

  /**
   * div 拖动事件
   */
  onMove() {
    console.log(this.container.offsetWidth)
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
  onMoveOutBoundary(obj, sent = {}) {
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
    this.container.appendChild(this.document)
    this.onMove()
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
  setStyle(style) {
    for (const key in style) {
      this.document.style[key] = style[key]
    }
  }
}
