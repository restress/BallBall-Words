// pages/chooselist/swiperlist.js
var util = require('../../utils/util.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    authorized: true, // 默认值设置为 true 以防止授权数据在 onLoad 之后才返回
    bookList: [],
    bookCoverUrl: "https://www.osinglar.top/content/",
    bookCovers: [],
    name: '',
    background_id: '',
    hidden: false,
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getBookList()
    //看用户是否已经授权，如果没有授权就跳转到授权页面
    var that = this;
   
    // 判断是否已经授权
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {//授权了，可以获取用户信息了
          wx.getUserInfo({
            success: (res) => {
              //此处log的是用户信息
              // console.log(res)
            }
          })
        } else {//未授权，跳到授权页面
          wx.redirectTo({
            url: '../authorize/authorize',//授权页面
          })
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


  onRefreshBookList: function () {
    this.getBookList()
  },

  onBookCoverTap: function (e) {
    // 更新封面选中状态
    this.data.bookCovers = new Array(12)
    this.data.bookCovers[e.target.id - 1] = 'box-shadow: 0 0 12px #365c8d;'

    this.setData({
      // background_id: e.target.id,
      bookCovers: this.data.bookCovers
    })
  },

  //按返回键
  onReturnButtonTap: function () {
    this.getBookList()
    this.setData({
      //此处的style是添加本子的那个style
      // style: ''
    })
  },

  // 获取单词本列表
  getBookList:function () {
    var that = this
    wx.request({
      url: "https://www.osinglar.top/word/GetJsonBookList",
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      complete: function (res) {
        that.setData({
          bookList: res.data,
          hidden: !that.data.hidden
        })
        // console.log(res.data)
        // console.log(that.data.bookList)

        if (res == null || res.data == null) {
          console.error('网络请求失败');
          return;
        }
      }
    })
    
  },

})