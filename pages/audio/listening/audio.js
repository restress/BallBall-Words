// pages/audio/audio.js
var wordDuration//记录单词有多少个
var beginTime=0;
var endTime=2;
var wordTimeInterval = 2000; //单词之间的时间间距
var nowWord//目前的单词是第几个
var innerAudioContext
var interval =null //记时函数
var autoPlayWord = null
var autoPlayLastWord = null
var book=1;//记录是第几本书
var part=1;//记录是第几个部分
var audioList;//记录单词
var nowWord;
var wordSum;
var wordPass;
var tempAudioPath = ''
// const emitter = new EventEmitter()
// emitter.setMaxListeners(100)//指定一个最大监听数量
// emitter.setMaxListeners(0)//或者关闭最大监听阈值
var bookIdd;
var partIdd;

var Util = require('../../../data/utils.js');


Page({
  /**
   * 页面的初始数据
   */
  data: {
    playJapanesePart: "第1课",
    wordDuration:"",
    wordNumber:1,
    nowWord:0,
    toView: 'red',
    scrollTop: 100,
    hidden: false,
    audioList:"",
    nowWord:"",
    definition:"",
    pronounce:"",
    description:"",
    percent:1,
    wordSum:0,
    wordPass:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      playJapanesePart:"第"+options.part+"课"
    })

    var that = this;
    bookIdd = options.book
    partIdd = options.part
    if (bookIdd == 4) {
      partIdd = 25 + Number(options.part);
      bookIdd = 3;
    }

    wx.request({
      url: 'https://www.osinglar.top/word/GetJsonWordList',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      //TODO此处需要根据进来的是什么来决定参数
      data: Util.json2Form({ BookId: bookIdd, PartId: partIdd }),
      complete: function (res) {
        wordDuration = res.data.length
        // console.log('单词量' + wordDuration)

        if (res == null || res.data == null) {
          console.error('网络请求失败');
          return;
        }

        //任选一个听写
        var idx = Math.floor(Math.random() * (res.data.length - 1))
        that.setData({
          //设置加载条
          hidden: !that.data.hidden,
          audioList: res.data,
          nowWord: res.data[idx],
          definition: res.data[idx].WordContent,
          pronounce: res.data[idx].WordPronounciation,
          description: res.data[idx].WordDescription,
          showNot: false,
        })

        wordSum= res.data.length
        wordPass=0

        var japanWord = that.data.nowWord.WordContent
        var fdStart = japanWord.indexOf("～");
        if (fdStart == 0) {
          //表示strCode是以~开头；
          japanWord = that.data.nowWord.WordContent.replace("～", "");
        } 

        //TODO 此处需要根据不同的课本和part来改变
        innerAudioContext = wx.createInnerAudioContext()
        innerAudioContext.src = 'http://fanyi.baidu.com/gettts?lan=jp&text=' + encodeURIComponent(japanWord) + '&spd=3&source=web'
        innerAudioContext.autoplay = true
        
        innerAudioContext.onPlay(() => {
          // console.log('开始播放')
        })
        innerAudioContext.onError((res) => {
          // console.log(res.errMsg)
          // console.log(res.errCode)
        })

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
    this.setData({
      wordNumber:1
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    innerAudioContext.stop()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    innerAudioContext.stop()
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
  nextSound: function () {

    var that = this;
    //删掉已经听过的单词
    // console.log(that.data.audioList)
    var position = that.data.audioList.indexOf(that.data.definition)
    that.data.audioList.splice(position, 1)
    // console.log(that.data.audioList)

  
    //任选一个听写
    var idx = Math.floor(Math.random() * (that.data.audioList.length - 1))

    wordPass = wordPass + 1//每次按下next都算是见过一次面了
    // console.log(wordPass)
    // console.log(wordSum)

    that.setData({
      //设置加载条
      nowWord: that.data.audioList[idx],
      definition: that.data.audioList[idx].WordContent,
      pronounce: that.data.audioList[idx].WordPronounciation,
      description: that.data.audioList[idx].WordDescription,
      showNot: false,
      percent: wordPass * 100 / wordSum 
    })

    var japanWord = that.data.nowWord.WordContent
    var fdStart = japanWord.indexOf("～");
    if (fdStart == 0) {
      //表示strCode是以~开头；
      japanWord = that.data.nowWord.WordContent.replace("～", "");
    } 

    //TODO 此处需要根据不同的课本和part来改变
    innerAudioContext.src = 'http://fanyi.baidu.com/gettts?lan=jp&text=' + encodeURIComponent(japanWord) + '&spd=3&source=web'
    innerAudioContext.autoplay = true
    // console.log(that.data.nowWord)

    innerAudioContext.onPlay(() => {
      // console.log('开始播放')
    })
    innerAudioContext.onError((res) => {
      // console.log(res.errMsg)
      // console.log(res.errCode)
    })

  },
  showAnswer: function(){
    this.setData({
      showNot: true
    })
  },
  stillSound:function(){
    var that = this
    var japanWord = that.data.nowWord.WordContent
    var fdStart = japanWord.indexOf("～");
    if (fdStart == 0) {
      //表示strCode是以~开头；
      japanWord = that.data.nowWord.WordContent.replace("～", "");
    }

    //TODO 此处需要根据不同的课本和part来改变
    innerAudioContext.src = 'http://fanyi.baidu.com/gettts?lan=jp&text=' + encodeURIComponent(japanWord) + '&spd=3&source=web'
    innerAudioContext.autoplay = true
    // console.log(that.data.nowWord)

    innerAudioContext.onPlay(() => {
      // console.log('开始播放')
    })
    innerAudioContext.onError((res) => {
      // console.log(res.errMsg)
      // console.log(res.errCode)
    })
  }
})