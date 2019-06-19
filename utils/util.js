const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 显示失败提示
var showModal = (title, content, doStringify = false) => {
  wx.hideToast()
  wx.showModal({
    title,
    content: doStringify ? JSON.stringify(content) : content,
    showCancel: false
  })
}

// 获取手帐本列表
var getBookList = (e, alert = false) => {
  var app = getApp()

  // 若存在有效 skey 则执行请求，否则直接返回
  if (app.globalData.skey) {
    if (alert) {
      showLoading('正在刷新')
    }

    wx.request({
      url: "https://www.osinglar.top/word/GetJsonBookList",
      method: 'GET',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: res => {
        if (res.data.success) {
          if (alert) {
            showSuccess('刷新成功')
          }

          // 更新bookList全局变量
          app.globalData.bookList = res.data.data

          // 刷新页面数据
          if (e.data.bookList !== res.data.data) {
            e.setData({
              bookList: res.data.data
            })
          }
        } else {
          if (res.data.errMsg) {
            showModal('刷新失败', res.data.errMsg)
          } else {
            showModal('刷新失败', 'statusCode: ' + res.statusCode)
          }
        }
      },
      fail: error => {
        showModal('刷新失败', error, true)
      }
    })
  }
}

module.exports = {
  formatTime: formatTime,
  showModal,
  getBookList
}
