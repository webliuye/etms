<template>
<div>
  <video-player  class="vjs-custom-skin"
                 ref="videoPlayer"
                 :options="playerOptions"
                 :playsinline="true"
                 customEventName="customstatechangedeventname"
                   @play="onPlayerPlay($event)"
                    @pause="onPlayerPause($event)"
                    @ended="onPlayerEnded($event)"
                    @loadeddata="onPlayerLoadeddata($event)"
                    @waiting="onPlayerWaiting($event)"
                    @playing="onPlayerPlaying($event)"
                    @canplay="onPlayerCanplay($event)"
                    @canplaythrough="onPlayerCanplaythrough($event)"
                    @ready="playerReadied"
                    @statechanged="playerStateChanged($event)">

  </video-player>
  <!-- <video controls src="http://etmsresource-ly-tx.ly100.cn/mp4/2017/11/99eb6b805bbdab93b3b1ca7a6d6040b0.mp4?sign=tFRNPxWobOTkAa9ok2VxYJoxXuNhPTEyNTM5OTczOTEmaz1BS0lEa0liZVMwaUs3ZHR0ZDdBdHVmQVBWTzFOVEp0QzgxV2wmZT0xNTEwNTY2Njk1ODM4JnQ9MTUxMDU2NjY5NTc3OCZyPTg1MDgxNzU5MSZmPS9tcDQvMjAxNy8xMS85OWViNmI4MDViYmRhYjkzYjNiMWNhN2E2ZDYwNDBiMC5tcDQmYj1seWV0bXNyZXNvdXJjZQ=="></video> -->
  <div class="mes"  v-if="open">
    <div class="content">
      <img src="~assets/sourceImg/qqc.png">
      <div class="fl">
          <p>尊敬的用户：</p>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;您观看的是<span style="color:#FFC125;">Vip资源</span>，申请开通vip资源后，就可观看哦~</p>
          <el-button type="primary" size="small"  class="fr" @click="goOpen">申请开通</el-button>
      </div>
    </div>
  </div>
  <div id="rotage" @click="rotage"  title="旋转视频角度"></div>
</div>

</template>

<script>
  // Similarly, you can also introduce the plugin resource pack you want to use within the component
  // require('some-videojs-plugin')
  require('video.js/dist/video-js.css');
  require('vue-video-player/src/custom-theme.css');
 import { videoPlayer } from 'vue-video-player'
  export default {
     name: 'Nvideo',
     components: {
      videoPlayer
    },
    props: {
        src: {
          type: String,
          default: 'http://static.smartisanos.cn/common/video/t1-ui.mp4'
        },
        isVip:{
          type: Boolean,
          default:false
        }
     },
    data() {
      return {
        // videojs options
        open:false,
        playerOptions: {
          muted: true,
          language: 'zh-CN',
          playbackRates: [0.7, 1.0, 1.5, 2.0],
          sources: [{
            type: "video/mp4",
            src: "https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm"
          }],
          poster: ""

        },
        rotateNum:1
      }
    },
    mounted() {
      this.player.height_=480;
      setTimeout(() => {
        this.player.muted(false)
      }, 500);
      //  this.player.play();

    },
    computed: {
      player() {
        return this.$refs.videoPlayer.player
      }
    },
    created(){
      if(this.isVip){
        this.open=true;
      }else{
         this.playerOptions.sources[0].src=this.src;
      }
      // this.playerOptions.sources[0].src="http://3838.vod.myqcloud.com/3838_a01c9ac2b12e11e6870e1d9d2d19e9b4.f20.mp4";
    },
    methods: {
      // listen event
      onPlayerPlay(player) {
        if(this.isVip){
          setTimeout(() => {
              this.player.pause();
              this.open=true;
              // this.playerOptions.sources[0].src="";
          }, 15000);
        }
      },
      goOpen(){
          this.$router.push({name:'OpenSource'});
      },
      onPlayerPause(player) {
        // console.log('player pause!', player)
      },
      onPlayerEnded(player) {
        this.$emit('showTest');
      },
      onPlayerLoadeddata(player) {
        // console.log('player Loadeddata!', player)
      },
      onPlayerWaiting(player) {
        // console.log('player Waiting!', player)
      },
      onPlayerPlaying(player) {
        // console.log('player Playing!', player)
      },
      onPlayerTimeupdate(player) {
        console.log('player Timeupdate!', player.currentTime())
      },
      onPlayerCanplay(player) {
        // console.log('player Canplay!', player)
      },
      onPlayerCanplaythrough(player) {
        // console.log('player Canplaythrough!', player)
      },
      // or listen state event
      playerStateChanged(playerCurrentState) {
        console.log('player current update state', playerCurrentState)
      },
      // player is ready
      playerReadied(player) {
        // seek to 10s
        player.currentTime(0)
        // console.log('example 01: the player is readied', player)
      },
      rotage(){

       var rotate=90*this.rotateNum;
       $('.vjs-tech').css({
         'transform':'rotate('+rotate+'deg)',
         '-ms-transform':'rotate('+rotate+'deg)',
         '-o-transform':'rotate('+rotate+'deg)',
         '-webkit-transform':'rotate('+rotate+'deg)',
         '-moz-transform':'rotate('+rotate+'deg)',
       })
       if( this.rotateNum%2){
          $('.vjs-tech').css({
        'width':'50%',
        'left':'25%'
       })
       }else{
            $('.vjs-tech').css({
        'width':'100%',
        'left':'0'
       })
       }
        this.rotateNum++;
        if(this.rotateNum==5){
         this.rotateNum==1;
        }

      }
    }
  }
</script>
<style lang="less" scoped>
.video-player{
  position:relative;
  min-height: 480px;
}
.preview-box  #rotage{//在预览视频的时候隐藏旋转按钮
  display: none;
}


#rotage{
  width:32px;
  height:32px;
 position:absolute;
  z-index:8;
  bottom:0;
  left:50%;
  background: url('~assets/img/rotage.png');
  cursor: pointer;
}
.mes{
  width:100%;
  height:480px;
  position:absolute;
  background:#3c3c3c;
  z-index:8;
  top:0;
  left:0;
  color:#fFF;
  .content{
    img{
      display:block;
      margin:0 auto;
    }
    width:480px;
    margin:10% auto;
    position:relative;
    div{
      position:absolute;
      top:50px;
      left:0;

    }
  }
}
</style>
<style lang="less">
 .preview-box #vjs_video_3{
  min-height:480px;
  background:#000;
}
</style>
