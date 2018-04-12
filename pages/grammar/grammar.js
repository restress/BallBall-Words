// pages/grammar/grammar.js

var list = require('../../data/word-list.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
    var idx = Math.floor(Math.random() * 499) + 1
    var word = list.wordList[idx]
    this.setData({
      content: word.content,
      pron: word.pron,
      definition: word.definition,
      audio: word.audio,
      tone: word.tone
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
  show: function () {
    this.setData({
      showNot: true
    })
  },


  next: function () {
    this.setData({
      showNot: false
    })
    var idx = Math.floor(Math.random() * 499) + 1
    var word = list.wordList[idx]

    this.setData({
      content: word.content,
      pron: word.pron,
      definition: word.definition,
      audio: word.audio,
      tone: word.tone
    })
  },

  read: function () {
    console.log(this.data.audio)
    wx.playVoice({
      filePath: this.data.audio,
      success: function (res) {
        console.log('ok')
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  }
})