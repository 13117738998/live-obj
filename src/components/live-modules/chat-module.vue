<template lang='pug'>
  .chat-module
    .chat-title
      span 聊天
    .chat-box(ref="chatBox")
      .msg-row(v-for="item in msgList")
        .author {{ item.time }}{{ item.msg }}
    .chat-inp
      .inpWrap
        .notlogin(v-if="0")
          span 登录
          span 参与讨论
        input(v-model='chatVal' @keyup.enter="sendMsg")
        .sendBtn(@click.enter="sendMsg") 发送
      .expression(:style='`background-image: url(${require("@/assets/img/expression.png")})`')

</template>

<script>
import axios from 'axios'
export default {

  data () {
    return {
      chatVal: '',
      scanUrl: '/qrcode?data=' + encodeURIComponent(window.$globalconfig.CLOUD_API + 'wxmp/company/authorize?company_id=300349579591680&qrcode_scene_key=8c3f13c771f7401bb1d212bb6c544658'),
      msgList: [{
        time: '',
        msg: '123',
      }],
      online: 0,
      // 是否连接中
      connected: false,
      TYPES: {
        ErrorMessage: -1, // 错误消息
        Connected: 1, // 连接成功
        OnlineCount: 2, // 在线人数
        ChatMessage: 11, // 聊天消息
        JoinRoom: 21, // 进入房间
        LeaveRoom: 22, // 离开房间
      },
    }
  },
  created () {
    this.connect()
  },
  methods: {
    // addmsg () {
    //   this.msgList.push('123456')
    //   const ochatBox = this.$refs.chatBox
    //   this.$nextTick(() => {
    //     ochatBox.scrollTop = ochatBox.scrollHeight + 22
    //   })
    //   console.log(ochatBox.clientHeight)
    // },

    log (msg, iserror) {
      this.msgList.push({
        time: new Date(),
        iserror: iserror,
        msg: msg,
      })
    },
    send (type, data) {
      if (this.connected) {
        const datas = JSON.stringify({
          type: type,
          data: JSON.stringify(data || {}),
        })
        this.socket.send(datas)
        this.log('【SEND】' + datas)
      }
    },
    sendMsg () {
      if (this.chatVal) {
        console.log(this.chatVal)
        this.send(this.TYPES.ChatMessage, { content: this.chatVal })
        this.chatVal = ''
      }
    },

    connect () {
      console.log('开始连接服务器')
      const url = 'wss://cloudapp.720sg.com/vrlive/rooms/299105286881280/wschat?token='
      this.socket = new WebSocket(url)
      this.socket.onopen = e => {
        this.connected = true
        this.log('服务器连接成功')
      }
      this.socket.onclose = e => {
        let msg = '已从服务器断开连接'
        if (e) {
          msg = `已从服务器断开连接【${e.code}】`
          this.error(e)
        }
        this.log(msg, true)
        this.showMessage(msg, 'warning')
        this.connected = false
        this.user_id = ''
        this.nickname = ''
        this.avatar = ''
        this.nickname = ''
        this.online = 0
      }
      this.socket.onerror = e => {
        this.log('连接出错', true)
      }
      this.socket.onmessage = this.onmessage
    },
    onmessage (e) {
      if (typeof e.data === 'string') {
        this.log('【RECEIVE】' + e.data)
        const message = JSON.parse(e.data)
        if (!message) return
        const data = message.data
        // 错误消息
        if (message.type === this.TYPES.ErrorMessage) {
          console.log(data.error)
        } else if (message.type === this.TYPES.Connected) { // 连接服务器成功
          this.nickname = data.nickname
        } else if (message.type === this.TYPES.OnlineCount) {
          this.online = data.count
        } else if (message.type === this.TYPES.ChatMessage) { // 聊天消息
          console.log(`接收到【${data.nickname}】发送的消息【${data.content}】`)
        } else if (message.type === this.TYPES.LeaveRoom) { // 离开房间
          console.log(`【${data.nickname}】已离开房间【${this.room_id}】`, 'warning')
        }
      }
    },
  },
}
</script>
<style lang='stylus'>
.chat-module
  width 100%
  height 60%
  border-bottom 1px solid #ccc
  flex 1 1 60%
  .chat-title
    font-size 16px
    width 100%
    height 50px
    line-height 50px
    padding 0 16px
    font-weight 600
  .chat-box
    background rgba(244,244,244,1)
    width 100%
    height 81%
    font-size 12px
    padding-left 10px
    padding-top 22px
    overflow-y auto
    .msg-row
      margin-bottom 10px
      .author
        color #999
      .note
        color #333
    .msg-row > div
      display inline-block
  .chat-inp
    width 100%
    height 38px
    padding 8px 0 50px 10px
    display flex
    justify-content space-around
    .inpWrap
      width 271px
      height 22px
      background:rgba(237,237,237,1)
      border-radius: 11px
      position relative
      .sendBtn
        width 50px
        background-color #4887FF
        height 22px
        display inline-block
        position absolute
        right 0
        top 0
        line-height 22px
        color #ffffff
        border-bottom-right-radius 11px
        border-top-right-radius 11px
        text-align center
        cursor pointer
        font-size 12px
      .notlogin
        position absolute
        top 0
        left 0
        width 106%
        margin-left: 12px;
        line-height: 22px;
        span:nth-child(1)
          color #4887FF
        span:nth-child(2)
          color #333
      input
        width 100%
        border none
        outline none
        background:rgba(237,237,237,1)
        height 100%
        border-radius:11px
        padding 0 12px
    .expression
      width 20px
      height 20px
      cursor pointer
      background-size cover
</style>
