// pages/settings/feedback/feedback.js
var app = getApp()
var that
var Util = require('../../../data/utils.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    content: "",
    connect: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    // 页面初始化 options为页面跳转所带来的参数
    app.getUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  getContent: function (e) {
    this.setData({
      content: e.detail.value
    })
    console.log('content:' + e.detail.value)
  },
  getConnection: function (e) {
    this.setData({
      connect: e.detail.value
    })
    console.log('connect:'+e.detail.value)
  },
  getNowFormatDate: function () {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
      + " " + date.getHours() + seperator2 + date.getMinutes()
      + seperator2 + date.getSeconds();
    return currentdate;
  },
  submitSuggestion: function () {
    //TODO 此处需要上传到数据库中
    that = this;
    //http://localhost:52016/Feedback/SetFeedback?feedbackContent=%22hhhh%22&&feedbackConnect=%22jjjj%22&&userNickname=%222222%22
   
    wx.request({
      url: 'https://www.osinglar.top/feedback/SetFeedback',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: Util.json2Form({feedbackContent: that.data.content, feedbackConnect: that.data.connect, userNickname: that.data.userInfo.nickName}),
      complete: function (res) {
        console.log(res)
        wx.showModal({
          title: '提示',
          content: '提交成功!',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            }
          }
        })

        if (res == null || res.data == null) {
          console.error('网络请求失败');
          wx.showModal({
            title: '提示',
            content: '提交成功!',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              }
            }
          })
          return;
        }



      }
    })

   
  }

})