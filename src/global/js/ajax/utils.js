/**
 * @authors       Peter 王斐
 * @email         wangfeia@zbj.com
 * @date          2017-03-28 10:03
 * @description
 */

function genUUID() {
  function tempFunction() {
    var uuidIndex = 1// 闭包保存
    return function innerFunction() {
      return (new Date().getTime() + '' + uuidIndex++)
    }
  }

  return tempFunction()
}

module.exports = {
  uuid: genUUID()
}
