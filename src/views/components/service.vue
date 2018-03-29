<template>
  <div class="custom">
    <div id="custom_link" class="custom_link" @click="openService"><i></i>联系客服</div>
    <div class="custom_bottom">
        <span><img src="../../assets/login-icon/ERWEIMA.png" alt=""></span>
        扫描二维码关注
    </div>
  </div>
</template>
<script>
    export default {    
        methods: {    
          openService() {
            const url = window.location.href;
            ysf.product({
              show: 0, // 1为打开， 其他参数为隐藏（包括非零元素）
              title: '实验教学管理公共服务平台',
              desc: "来自实验教学管理公共服务平台",
              url: url,
              note : url
            });
            jQuery("#YSF-BTN-HOLDER").trigger("click");
          }
        }  
    }
</script>
<style rel="stylesheet/less" lang="less">
  
  .custom {
        width: 125px;
        position: fixed;
        background-color: #fff;
        z-index: 99;
        bottom: 50px;
        right: 30px;
        text-align: center;
        img {
            width: 100%;
            vertical-align: middle;
        }
        .custom_link{
          cursor: pointer;          
          background-color: #00A0E9;
          line-height: 32px; 
          padding: 10px 0; 
          color: #fff; 
          font-size: 13px;       
          i{
            display: inline-block;
            width: 32px;
            height: 32px; 
            vertical-align: middle;
            background: url("../../assets/login-icon/qiyu.png") no-repeat center center;
            margin-right: 8px;
          }          
        }
        .custom_bottom {
          margin-top: 5px;
          padding-bottom: 5px;
          border: 1px solid #ddd;
          span {
            height: 85px;
            margin-top: 10px;
          }
        }
    }
</style>