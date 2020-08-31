import TextField from './component/text-field'
import Events from './utils/event'

/**
 * Graffiti
 * @param {*} id 容器id
 */
class Graffiti {
  constructor() {
    // 容器
    this.container = null

    // 容器高度
    this.containerHeight = 0

    // 容器高度/真实图片高度
    this.heightScale = 0

    // 容器宽度
    this.containerWidth = 0

    // 容器宽度/真实图片宽度
    this.widthScale = 0

    // 内部元素管理
    this.elementUiList = []

    // 监听器
    this.listener = {}

    this.event = new Events()
  }

  /**
   * 初始化
   * @param {*} id id
   * @param {*} height 容器高度
   * @param {*} width 容器宽度
   */
  init(id, width = 0, height = 0) {
    let dom = null
    if (typeof id === 'string') {
      dom = document.getElementById(id)
    } else {
      dom = id
    }
    this.containerHeight = height
    this.containerWidth = width
    if (height) {
      dom.style.height = `${height}px`
    }
    if (width) {
      dom.style.width = `${width}px`
    }
    if (dom) {
      dom.className = 'graffiti'
      this.container = dom
    }
  }

  /**
   * 添加背景图
   * @param {*} imgUrl 网络图片（本地图片暂不支持，在vue项目中经过打包会导致路径错误）
   */
  addBgImg(imgUrl) {
    const that = this
    if (!imgUrl) {
      console.error('添加背景图，图片地址不能为空')
      return
    }
    if (!imgUrl.includes('http')) {
      console.error('图片地址必须是网络地址')
      return
    }
    let img = new Image()
    img.src = imgUrl
    img.onload = function () {
      // 容器宽高
      const { containerHeight, containerWidth } = that
      // 容器宽度 与 真实图片宽度 缩放比例
      const widthScale = containerWidth / this.naturalWidth
      that.widthScale = widthScale
      // 容器高度 与 真实图片高度 缩放比例
      const heightScale = containerHeight / this.naturalHeight
      that.heightScale = heightScale
      // 设置图片背景
      that.container.style.backgroundImage = 'url(' + imgUrl + ')'
      that.container.style.backgroundSize = 'contain'
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
        width: `${width}px`,
        lineHeight: `${lineHeight}`,
        fontSize: `${fontSize}px`,
        letterSpacing: `${letterSpacing}em`,
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
  on(name, fn) {
    this.event.on(name, fn)
  }
}

export default Graffiti
