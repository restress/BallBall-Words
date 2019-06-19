var util = require('../../utils/util.js')
const app = getApp()

Component({
  properties: {
    journal_book_id: {
      type: String,
      value: ''
    },
    name: {
      type: String,
      value: ''
    },
    count: {
      type: Number,
      value: 0
    },
    background_id: {
      type: String,
      value: ''
    }
  },

  data: {
    // bookCoverUrl: config.service.bookCoverUrl,
    bookCoverUrl: "https://www.osinglar.top/content/",//todo
    bookCovers: [],
    newName: '',
    style: ''
  },

  // 用于加载的一些方法
  methods: {
    //点击封面反转
    onBooksTap: function (e) {
      // 初始化封面选中状态
      this.data.bookCovers = new Array(this.data.count)
      this.data.bookCovers[this.data.background_id - 1] = 'box-shadow: 0 0 12px #365c8d;'

      this.setData({
        newName: '',
        bookCovers: this.data.bookCovers,
        style: 'transform: rotateY(180deg);'
      })
    },

    //点击封面选择对面的单元
    onSettingsTap: function () {
      
      wx.navigateTo({
        url: '../settings/settings',
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

    onBlur: function (e) {
      this.setData({
        newName: e.detail.value
      })
    },

    //选择了单元之后，直接跳转就可以了
    onBookCoverTap: function (e) {
      // 更新封面选中状态
      this.data.bookCovers = new Array(this.data.count)
      this.data.bookCovers[e.target.id - 1] = 'box-shadow: 0 0 12px #365c8d;'

      this.setData({
        // background_id: e.target.id,
        bookCovers: this.data.bookCovers
      })
      

      wx.navigateTo({
        url: './word/word?book=' + (this.data.journal_book_id) + '&&part=' + e.target.id,
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

    onReturnButtonTap: function () {
      this.setData({
        style: ''
      })
    },

  }
})