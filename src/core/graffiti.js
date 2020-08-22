import Component from './lib/componet'

const MENU_HTML = `
<ul class="graffiti__menu" id="graffiti__menu">
  <li><a href="###">删除</a></li>
</ul>`

/**
 * Graffiti
 * @param {*} id 容器id
 */
class Graffiti {
  constructor(id) {
    this.id = id
    // 容器
    this.container = null
    // 内部元素管理
    this.elementUiList = []
    // 监听器
    this.listener = {}
  }

  /**
   * 初始化
   */
  init() {
    let dom = document.getElementById(this.id)
    if (dom) {
      dom.className = 'graffiti'
      dom.innerHTML = MENU_HTML
      this.container = dom
    }
  }

  /**
   * 添加背景图
   * @param {*} imgUrl
   */
  addBgImg(imgUrl) {
    const that = this
    if (!imgUrl) {
      console.error('添加背景图，图片地址不能为空')
      return
    }
    let img = new Image()
    img.src = imgUrl
    img.onload = function () {
      that.container.style.width = this.naturalWidth + 'px'
      that.container.style.height = this.naturalHeight + 'px'
      that.container.style.backgroundImage = 'url(' + imgUrl + ')'
    }
  }

  /**
   * 添加文本输入框
   * @param {*} config
   */
  addTextField(config = {}) {
    const {
      text = '双击输入文字', // 文字
      x, // 坐标x
      y, // 坐标y
      width = 100, // 文本输入框宽度(px)
      lineHeight = 1, // 字体行高
      fontSize = 26, // 字体大小(px)
      letterSpacing = 0, // 字体距离(em)
      data = {},
    } = config
    // 初始化li组件
    let liComponet = new Component(this, 'li', {
      text,
      x,
      y,
      classList: ['item item-comp item-comp-hover'],
      style: {
        width: `${width}px`,
        lineHeight: `${lineHeight}`,
        fontSize: `${fontSize}px`,
        letterSpacing: `${letterSpacing}em`,
      },
      data: Object.assign(data, {
        id: this.elementUiList.length + 1,
      }),
    })
    // 渲染
    liComponet.render()

    this.elementUiList.push(liComponet)
  }

  /**
   * 监听
   * @param {*} name 事件
   */
  on(name, fn) {
    this.listener[name] = fn
  }
}

export default Graffiti
