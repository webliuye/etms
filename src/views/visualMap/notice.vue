<template>

<div id="box">
  <div class="srcoll" :class="{anim:animate==true}" id="scroll">
    <div class="item" v-for="(item,index) in dataList" :key="index" >
      <span class="user-icon"> </span><span class="testName" :title="item.courseName">{{item.courseName}}</span> <br/>
      <span class="teacherName" :title="item.teacherName">{{item.teacherName}}</span><span class="schoolName" :title="item.schoolName">{{item.schoolName}}</span> <span class="date">{{item.dateTime}}</span>
</div>

  </div>
</div>
</template>
<script>
import { getLiveNotice } from "api/visual";
export default {
  props: {
    unitId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      dataList:[],
      first:true,
      animate:true,
      num:0,
      totalnum:0
    };
  },
  mounted() {
    this.interval();
  },
  watch:{
    unitId(val){
      this.getNoticeData()
    },
    dataList(val){
      if(val.length<=10){
        this.animate=false;
      }else{
        if(val.length>10){
          clearInterval(window.timer_visual_notice);
          this.num=val.length-10;
          this.animate=true;
          this.scroll();
        }
      }
    }
  },
  methods: {
    getNoticeData(){
      const vm=this;
      getLiveNotice({courseCount:10}).then(res=>{
        vm.dataList= vm.dataList.concat(res);
      })
    },
    scroll(){
      const vm=this;
      const con=document.getElementById('scroll');
      con.style.marginTop=-80*vm.num+"px";
      setTimeout(()=>{
        vm.animate=false;
        vm.dataList=vm.dataList.slice(-10);
        con.style.marginTop="0px";
        vm.interval();
      },1500);

    },
    interval(){
      window.timer_visual_notice=setInterval(this.getNoticeData,10000);
    }
  }
};
</script>

<style lang="less" scoped>
  #box{
    height: 82vh;
    width:100%;
    overflow: hidden;
    margin-top: 16px;
    .anim {
      transition: all 1.5s;
    }
    .srcoll{
      position: relative;
      min-height: 100%;
      width:100%;
      padding: 0 16px;
      div.item{
        height: 80px;
        overflow: hidden;
        box-sizing: border-box;
        padding:8px 0;
        border-bottom: 1px dashed rgba(255,255,255,0.3);
      }
      span{
        display: inline-block;
        overflow: hidden;
        white-space: nowrap;
        box-sizing: border-box;
        text-overflow:ellipsis;
      }
      span.user-icon{
        display: inline-block;
        width:40px;
        height:40px;
        background: url('~assets/img/icon-user-group.png') 100% 0% no-repeat;
        background-size:200% 200%;
      }
      span.testName{
        width : calc(~"100% - 40px");
        line-height: 40px;
        padding-left:16px;
        overflow: hidden;
      }
      span.teacherName{
        width:48px;
        line-height: 24px;
      }
      span.schoolName{
      width : calc(~"100% - 84px");
      padding-left:8px;
      line-height:24px;
      }
      span.date{
        width:32px;
        line-height: 24px;
        text-align: right;
      }
    }
  }
</style>
