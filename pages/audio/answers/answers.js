// pages/audio/answers/answers.js
var app = getApp()
var that;
var Util = require('../../../data/utils.js');
var wordsListLen;
var initData = ''
var extraLine = [];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: "",
    text:initData,
    hidden: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    wx.request({
      url: 'https://www.osinglar.top/word/GetJsonWordList',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: Util.json2Form({ BookId: options.book, PartId: options.part }),
      complete: function (res) {
        wordsListLen = res.data.length

        console.log("this is for" + wordsListLen)

        for (var i = 0; i < wordsListLen; i++){
          extraLine.push('\n' +(i+1)+'.'+res.data[i].WordContent + '\n'  + '/'  + res.data[i].WordPronounciation + '/' + '\n'+ res.data[i].WordDescription)
        }

        console.log(extraLine)

        that.setData({
          text: initData + '\n' + extraLine.join('\n'),
          hidden: !that.data.hidden
        })

        if (res == null || res.data == null) {
          console.error('网络请求失败');
          return;
        }
      }
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
  add: function (e) {
    extraLine.push('other line')
    this.setData({
      text: initData + '\n' + extraLine.join('\n')
    })
  }
})