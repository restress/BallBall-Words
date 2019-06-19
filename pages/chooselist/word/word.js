// pages/word/word.js
// var list = require('../../data/word-list.js')
//获取应用实例
var app = getApp()
var that;
var Util = require('../../../data/utils.js');
var list;
var wordsListLen;
var familiarLevel;
var levelArr;
var selectArr;//可供选择的单词的数组
var innerAudioContext;
var wordSum;
var wordPass;
var tempAudioPath = '';
var likelyStr = "";
var bookId;
var partId;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    list :"",
    wordsListLen:"",
    hidden: false,
    content:'',
    proficiency:1,
    toneIcon:'../../../images/0.png',
    percent:1,
    wordPass:0,
    wordSum:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    bookId = options.book
    partId = options.part
    if(bookId == 4 ){
      partId = 25 + Number(options.part);
      bookId = 3;
    }

    wx.request({
      url: 'https://www.osinglar.top/word/GetJsonWordList',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",  
      data: Util.json2Form({ BookId: bookId, PartId: partId }), 
      complete:function(res){
        //legnth是一个单元有多少个单词
        wordsListLen = res.data.length
        console.log(wordsListLen)
        var idx = Math.floor(Math.random() * (wordsListLen-1)) 
        var word
        that.setData({
          list: res.data,
          word: res.data[idx],
          content: res.data[idx].WordContent,
          pron: res.data[idx].WordPronounciation,
          definition: res.data[idx].WordDescription,
          tone: res.data[idx].WordTone,
          toneIcon: '../../../images/' + res.data[idx].WordTone+'.png',
          hidden: !that.data.hidden
        })
        // console.log(res.data)
        // console.log(that.data.list)
        wx.setStorage({
          key: that.data.content,
          data: 1,
        })
        // console.log(that.data.list)
        wordSum = that.data.list.length*2//因为有2熟练度，实际上是要见三次面的
        wordPass = 0
        // console.log(wordPass+':'+wordSum)
        if(res == null || res.data == null){
          console.error('网络请求失败');
          return;
        }

        that.read()
      }
    })

    //因为这个ding需要用很多次，所以直接下载下来吧
    wx.downloadFile({
      url: 'https://www.osinglar.top/Content/right.mp3',
      success: function (res) {
        tempAudioPath = res.tempFilePath
      },
      fail: function (err) {
        console.log(err)
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
    //关掉页面之后所有storage全部清除
    wx.clearStorage()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.clearStorage()
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
    that = this;

    //收集单词中的汉字
    var reg = new RegExp("[\u4e00-\u9fa5]+")
    var matchList = reg.exec(that.data.content)
    var arrChar = []
    
    // console.log(matchList)

    if(matchList != null){
      var dateList = matchList[0].split('');
      for (var i in dateList) {
        arrChar = arrChar.concat(dateList[i]);
        // console.log(arrChar)
        that.findLikeWord(dateList[i])
      }
    }else{
      that.setData({
        likelywords: "",
        showNot: true
      })
    }
  },

  findLikeWord: function(japanChar){
    wx.request({
      url: 'https://www.osinglar.top/word/GetJsonWordLikelyList',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: Util.json2Form({ japanWord: japanChar}),
      complete: function (res) {
        //legnth列表有多少个单词
        var listLength = res.data.length
        
        // console.log(res.data)

        for (var i = 0; i < listLength; i++) {
          if (res.data[i].WordContent != that.data.content) {
            likelyStr = likelyStr + res.data[i].WordContent + '(' + res.data[i].WordPronounciation + ')' + ':   ' +res.data[i].WordDescription + '\n'
          }
        }

        that.setData({
          likelywords: likelyStr,
          showNot: true
        })

        if (res == null || res.data == null) {
          console.error('网络请求失败');
          return;
        }

      }
    })
  },

  next: function () {
    //选择下一个的时候 ding一声
    innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.src = tempAudioPath
    innerAudioContext.autoplay = true
    innerAudioContext.onPlay(() => {
      // console.log('开始播放ding')
    })
    innerAudioContext.onError((res) => {
      // console.log(res.errMsg)
    })

    that = this
  
    likelyStr = ""
    wordPass = wordPass + 1//每次按下next都算是见过一次面了
    this.setData({
      showNot: false,
      percent: wordPass*100/ wordSum 
    })
    // console.log(wordPass+':'+wordSum+':'+that.data.list.length)

    //这里设置用户熟练度到本地
    //TODO 其实没有考虑到熟练度为空的时候的情况
    familiarLevel = wx.getStorageSync(that.data.content)
    // console.log(familiarLevel)
    familiarLevel++
    // console.log(familiarLevel)
    //如果熟练度到2了就删掉
    if (familiarLevel == 2) {
      //判断位置删除
      var position = that.data.list.indexOf(that.data.content)
      that.data.list.splice(position,1)
    }else{
      wx.setStorage({
        key: that.data.content,
        data: familiarLevel,
      })
    }

    //TODO 显示完这个框之后会怎么样 此处应该让他们选择是否再来一次 哈哈
    if(that.data.list.length == 0){
      wx.showToast({
        title: '恭喜您学完本课',
        icon: 'success',
        duration: 2000
      }) 
    }else{
      var idx = Math.floor(Math.random() * (that.data.list.length - 1))
      this.setData({
        content: this.data.list[idx].WordContent,
        pron: this.data.list[idx].WordPronounciation,
        definition: this.data.list[idx].WordDescription,
        tone: this.data.list[idx].WordTone,
        toneIcon: '../../../images/' + this.data.list[idx].WordTone + '.png',
        proficiency: familiarLevel
      })
      that.read()
    }

  },

  read: function () {
    var japanWord = that.data.content
    var fdStart = that.data.content.indexOf("～");
    if (fdStart == 0) {
      //表示strCode是以~开头；
      japanWord = that.data.content.replace("～", "");
    } 
    innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.src = 'http://fanyi.baidu.com/gettts?lan=jp&text=' + encodeURIComponent(japanWord)+'&spd=3&source=web'
    innerAudioContext.autoplay = true
    innerAudioContext.onPlay(() => {
      // console.log('开始播放')
    })
    innerAudioContext.onError((res) => {
      // console.log("chucuole")
      // console.log(res.errMsg)
      // console.log(res.errCode)
      wx.showToast({
        title: '读音走丢了TAT',  //标题  
        mask: false,  //是否显示透明蒙层，防止触摸穿透，默认：false  
        success: function () { }, //接口调用成功的回调函数  
        fail: function () { },  //接口调用失败的回调函数  
        complete: function () { } //接口调用结束的回调函数  
      })
    })
  
  },

  showListen: function (event) {
    wx.navigateTo({
      url: '../../audio/listening/audio?book=' + bookId + '&&part=' + partId,
      success: function (res) {
        // success
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },

})