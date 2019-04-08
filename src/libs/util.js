import { Message } from "iview";
const util = {};

/**
 * 错误提示
 * @param msg
 */
util.showError = function (msg) {
  Message.destroy()
  Message.error({
    content: msg,
    duration: 30,
    closable: true
  })
}
/**
 * 成功提示
 * @param msg
 */
util.showSuccess = function (msg) {
  Message.destroy()
  Message.success({
    content: msg,
    duration: 5,
    closable: true
  })
}
/**
 * 警告提示
 * @param msg
 */
util.showWarning = function (msg) {
  Message.destroy()
  Message.warning({
    content: msg,
    duration: 10,
    closable: true
  })
}
/**
 * 生成图片
 * @param src 图片路径
 */
util.newImage = function (src) {
  let img = new Image();
  img.src = src;
  return img;
}

export default util;
