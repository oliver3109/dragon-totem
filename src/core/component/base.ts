/*
 * @Description: 组件基础类
 * @Auth: Oliver <81092048@qq.com>
 * @Date: 2020-08-22 13:48:48
 * @FilePath: /dragon-totem/src/core/component/base.ts
 */
import Event from '../utils/event'
import { uuid } from '../utils/util'

export default class Component {
  // TODO: 1. Component properties 组件的属性
  //          1) 唯一标识别（内部使用）
  //          2) 位置信息（相对于父容器）
  //          3) 真实DOM对象
  //          4) 自定义属性（用户指定）
  //          5) 是否可以移动
  event = new Event()
  uuid = uuid()
  location = { x: 0, y: 0 }
  element = null
  customAttr = {}
  status = {
    isCanMove: false,
  }

  /**
   * 初始化
   */
  init() {
    let s = setTimeout(() => {
      this.hookEvent('created')
      clearTimeout(s)
    }, 0)
  }

  /**
   * 内部事件触发
   * @param {*} eventName
   * @param {*} arg
   */
  hookEvent(eventName: string, arg?: any) {
    if (eventName === 'created') {
      this.onCreated()
    }
    if (eventName === 'render') {
      this.onRender()
    }
    if (eventName === 'update') {
      this.onUpdate()
    }
    if (eventName === 'destroy') {
      this.onDestroy()
    }
  }

  /**
   * 组件事件监听器（提供外部使用）
   * @param {*} eventName
   * @param {*} fn
   */
  on(eventName: string, fn: Function) {
    this.event.on(eventName, fn)
  }

  // TODO: 1. Component behavior 组件的行为
  //          1) 更新样式
  //          2) 更新位置
  //          3) 渲染
  //          4) 更新状态
  setStyle() { }
  updateLocation() { }
  render() { }
  updateStatus() { }
  // TODO: 2. Component life cycle 组件的声明周期
  //          1) 创建
  //          2) 渲染
  //          3) 更新
  //          4) 销毁
  onCreated(arg = this) {
    this.event.emit('created', arg)
  }
  onRender() { }
  onUpdate() { }
  onDestroy() { }
  // TODO: 3. Component event 组件的事件
  //          1) 点击
  //          2) 双击
  //          3) 右击
  //          4) 获取焦点
  //          5) 失去焦点
  onClick() { }
  onDoubleClick() { }
  onRightClick() { }
  onFocus() { }
  onBlur() { }
}

class Test extends Component {
  constructor() {
    super()
  }
}