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
 * deepClone
 * @param obj
 * @returns {*}
 */
util.clone = function (obj) {
  var c = obj instanceof Array ? [] : {};
  for (var i in obj)
    if (obj.hasOwnProperty(i)) {
      var prop = obj[i];
      if (typeof prop == 'object') {
        if (prop instanceof Array) {
          c[i] = [];
          for (var j = 0; j < prop.length; j++) {
            if (typeof prop[j] != 'object') {
              c[i].push(prop[j]);
            } else {
              c[i].push(this.clone(prop[j]));
            }
          }
        } else {
          c[i] = this.clone(prop);
        }
      } else {
        c[i] = prop;
      }
    }
  return c;
}
/**
 *
 * @param fn
 * @param delay
 * @returns {Function}
 */
util.debounce = function (fn, delay) { // 防止抖动
  let timer = null
  return function () {
    let context = this
    let args = arguments
    clearTimeout(timer)
    timer = setTimeout(function () {
      fn.apply(context, args)
    }, delay)
  }
}
util.addZero = function (num) {
  return num < 10 ? '0' + num : num
}

/**
 * 日期格式转换
 * @param time
 * @returns {string}
 */
util.dateFomat = function (time) {
  let year = time.getFullYear()
  let month = time.getMonth() + 1
  let date = time.getDate()
  let hours = time.getHours()
  let minutes = time.getMinutes()

  let _time = `${year}-${this.addZero(month)}-${this.addZero(date)} ${this.addZero(hours)}:${this.addZero(minutes)}`
  return _time
}
/*
 * 时间(Date)转时间戳(Timestamp)
 **/
util.dateToTimestamp = function (date) {
  let copiedDate = new Date(date.getTime())
  return Math.floor(copiedDate.getTime() / 1000)
}

/**
 * 给树形数据添加属性
 * @param item  数据 tree data
 * @param prop  添加的属性
 * @param value 添加的属性值
 * @param bool  true 只给子节点加属性，false 父节点也添加属性
 */
util.setChildenProp = function (item, prop, value, bool) {
  if (bool) {
    item.forEach(item => {
      if (item.children) {
        this.setChildenProp(item.children, prop, value, bool)
      } else {
        item[prop] = value
      }
    })
  } else {
    item.forEach(item => {
      if (item.children) {
        item[prop] = value
        this.setChildenProp(item.children, prop, value, bool)
      } else {
        item[prop] = value
      }
    })
  }
}

/**
 * 设置树形数据指定的属性
 * @param item
 * @param prop
 * @param value
 * @param specified
 */
util.setSpecifiedProp = function (item, prop, value, specified) {
  item.forEach(item => {
    if (item.children) {
      this.setSpecifiedProp(item.children, prop, value, specified)
    } else {
      let isTrue = true
      for (let prop in specified) {
        if (item[prop] !== specified[prop]) {
          isTrue = false
        }
      }
      if (isTrue) {
        item[prop] = value
      }
    }
  })
}

/**
 * 满足条件的数据返回
 * @param item
 * @param specified
 * @param result
 */
util.getSpecifiedData = function (item, specified, result) {
  item.forEach(item => {
    if (item.children) {
      this.getSpecifiedData(item.children, specified, result)
    } else {
      let isTrue = true
      for (let prop in specified) {
        if (item[prop] !== specified[prop]) {
          isTrue = false
        }
      }
      if (isTrue) {
        result.push(item)
      }
    }
  })
}

export default util;
