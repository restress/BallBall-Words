// pages/audio/audio.js
var wordDuration
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
var audioSrc = ['http://audio.xmcdn.com/group21/M07/43/69/wKgJLViSs2ziVoJMAAlbd6WA0tI318.mp3',
'http://aod.tx.xmcdn.com/group21/M08/4F/C6/wKgJKFiUWKmylyY5AA76pssbfoE885.mp3',
'http://audio.xmcdn.com/group23/M06/5E/EC/wKgJNFiW3UWyNKHhAAzdbEwYzgw437.mp3',
'http://audio.xmcdn.com/group23/M06/5F/37/wKgJL1iW3VGj5qE4ABGTI5raUdA393.mp3',
'http://audio.xmcdn.com/group23/M06/5E/EE/wKgJNFiW3VeR_dmAABCkxaIe9lU558.mp3',
'http://audio.xmcdn.com/group24/M00/5F/39/wKgJMFiXKOaAwqOyAA-dGSZ_Bng382.mp3',
'http://audio.xmcdn.com/group24/M00/5F/8A/wKgJNViXKPCh3UEFAA2Td2aHuyU191.mp3',
'http://audio.xmcdn.com/group24/M00/5F/3D/wKgJMFiXKPvDPTyIABO5V2k-hEA107.mp3',
'http://audio.xmcdn.com/group22/M06/60/90/wKgJM1iXKT-SZtakABBY2rfgASk809.mp3',
'http://audio.xmcdn.com/group22/M06/60/91/wKgJM1iXKUPhAYgFAA7V6iHYMAE932.mp3',
'http://audio.xmcdn.com/group22/M06/60/92/wKgJM1iXKU_SgEQyABMSz75FTVU717.mp3',
'http://audio.xmcdn.com/group22/M06/60/93/wKgJM1iXKVHigCYHAA2zTWpK7vE212.mp3',
'http://audio.xmcdn.com/group23/M06/60/A2/wKgJNFiXKa7RnBZ-AAzQXRM5GkE409.mp3',
'http://audio.xmcdn.com/group23/M06/60/A4/wKgJNFiXKbjj6q9KAA02ZxjT3rE043.mp3',
'http://audio.xmcdn.com/group23/M06/60/A4/wKgJNFiXKbrQixzTAAjVln4Xd10398.mp3',
'http://audio.xmcdn.com/group22/M0B/60/C9/wKgJLliXKcWQ2BFdAA6NQnvsdjE795.mp3',
'http://audio.xmcdn.com/group22/M00/60/96/wKgJM1iXKcuj4Q2YAAyK-ZFFcsc547.mp3',
'http://audio.xmcdn.com/group24/M01/5F/3F/wKgJMFiXKdLTDlw_AApPjMybUZ8841.mp3',
'http://audio.xmcdn.com/group24/M01/5F/3F/wKgJMFiXKdWQQj8LAAo3Djk0N4g347.mp3',
'http://audio.xmcdn.com/group24/M01/5F/40/wKgJMFiXKd3B9o2AAAlfjDLVAt8693.mp3',
'http://audio.xmcdn.com/group24/M01/5F/41/wKgJMFiXKeKgHoXPAAtp_lm3Qz8834.mp3',
'http://audio.xmcdn.com/group24/M01/5F/42/wKgJMFiXKeXCYMH0AAa2u3ubFew615.mp3',
'http://audio.xmcdn.com/group24/M01/5F/92/wKgJNViXKezSPN09AApUcUCk7Rc197.mp3',
'http://audio.xmcdn.com/group24/M01/5F/43/wKgJMFiXKe_xfh4FAAccxVply3E470.mp3',
'http://audio.xmcdn.com/group23/M07/77/C6/wKgJL1id0fvS0Bt4AAZQsENd3FA021.mp3']

var Util = require('../../../data/utils.js');

var order = ['red', 'yellow', 'blue', 'green', 'red']

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
    hidden: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //TODO 此处需要根据不同的课本和part来改变
    innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.src = audioSrc[options.part]

    innerAudioContext.onPlay(()=>{
      console.log('开始播放')
    })
    innerAudioContext.onError((res) =>{
      console.log(res.errMsg)
      console.log(res.errCode)
    })

    this.setData({
      playJapanesePart:"第"+options.part+"课"
    })

    var that = this;
    wx.request({
      url: 'https://www.osinglar.top/word/GetJsonWordList',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      //TODO此处需要根据进来的是什么来决定参数
      data: Util.json2Form({ BookId:1, PartId:1 }),
      complete: function (res) {
        wordDuration = res.data.length
        console.log('单词量' + wordDuration)
        if (res == null || res.data == null) {
          console.error('网络请求失败');
          return;
        }
        that.setData({
          //设置加载条
          hidden: !that.data.hidden
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
  autoSound: function () {
    var that = this;
    innerAudioContext.autoplay = true
    nowWord = 1
    console.log('播放单词'+nowWord)

    interval = setInterval(function(){
      console.log('播放个数22：：' + wordDuration);
      nowWord++;
      that.setData({
        wordNumber: nowWord
      })
      if (nowWord >= wordDuration){
        clearInterval(interval)
        console.log('播放个数22：：' + nowWord);
      }else{
        console.log('播放个数11：：' + nowWord);
        that.interval
      }
    },2000)

    this.interval;
  },
  //TODO 稍微按快一点就会有问题
  lastSound: function () {
    var that = this;
    clearInterval(interval)
    beginTime = beginTime - 2
    endTime = endTime - 2
    nowWord --
  
    //如果是第一个单词，那么就重复听写第一个单词
    if (beginTime <= 1) {
      beginTime = 0
      endTime = 2
      nowWord = 1
    }

    that.setData({
      wordNumber: nowWord
    })

    autoPlayLastWord = setTimeout(function () {
      console.log('第' + beginTime/2 + '个单词');
      innerAudioContext.pause()
      console.log('停了');
    }, wordTimeInterval)

    if (beginTime > 1) {
      innerAudioContext.startTime = beginTime
      innerAudioContext.play()
      this.autoPlayWord
    } else {
      beginTime = 0
      endTime = 2
      innerAudioContext.startTime = beginTime
      innerAudioContext.play()
      this.autoPlayWord
    }
   
  },
  nextSound: function () {
    var that = this;
    clearInterval(interval)
    beginTime = beginTime + 2
    endTime = endTime + 2
    nowWord++

    that.setData({
      wordNumber: nowWord
    })

    autoPlayWord = setTimeout(function () {
      console.log('第' +beginTime/2 + '个单词');
      innerAudioContext.pause()
      console.log('停了');
    }, wordTimeInterval)

    if (beginTime <= 1) {
      beginTime = 0
      innerAudioContext.startTime = beginTime
      innerAudioContext.play()
      this.autoPlayWord
    } else {
      innerAudioContext.play()
      this.autoPlayWord
    }
  }, 
  showAnswers: function () {
    clearInterval(interval)
    wx.navigateTo({
      url: '../answers/answers?book=' + 1 + '&&part=' + 1,
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
    
  }
})