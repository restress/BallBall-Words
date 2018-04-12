// pages/word/word.js
// var list = require('../../data/word-list.js')
//获取应用实例
var app = getApp()
var that;
var Util = require('../../../data/utils.js');
var list;
var wordsListLen;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list :"",
    wordsListLen:"",
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
      complete:function(res){
        //TODO 此处是我修改的，但是这个length是什么样的，还不清楚
        wordsListLen = res.data.length
        var idx = Math.floor(Math.random() * (wordsListLen-1)) 
        var word;

        that.setData({
          list:res.data,
          word: res.data[idx],
          content: res.data[idx].WordContent,
          pron: res.data[idx].WordPronounciation,
          definition: res.data[idx].WordDescription,
          tone: res.data[idx].WordTone,
          hidden: !that.data.hidden
        })

        if(res == null || res.data == null){
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

  show: function () {
    this.setData({
      showNot: true
    })
  },


  next: function () {
    this.setData({
      showNot: false
    })
    // var idx = Math.floor(Math.random() * 19) 
    var idx = Math.floor(Math.random() * (wordsListLen - 1)) 

    this.setData({
      // content: word.content,
      // pron: word.pron,
      // definition: word.definition,
      // audio: word.audio,
      // tone:word.tone
      content:this.data.list[idx].WordContent,
      pron: this.data.list[idx].WordPronounciation,
      definition: this.data.list[idx].WordDescription,
      tone: this.data.list[idx].WordTone,
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