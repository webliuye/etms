<template>
  <div class="demo">
    <canvas :id="id" :width="width" :height="height" style="background:transparent;"></canvas>
    <div>{{stagesub}}</div>
  </div>

</template>

<script>
  export default {
    props: {
      width: {
        type: String,
        default: '80'
      },
        height: {
        type: String,
        default: '80'
      },
      id : {
        type: String,
        default:'canvas'
      },
      stagesub: {
        type: String,
        default:'canvas'
      },
      percent:{
        type: Number,
        default: 20
      },
      color:{
        type: String,
        default: '#e4393c'
      }
    },
    methods: {
      init(){
        var vm=this;
        const width =this.width;
        const height = this.height;
          var canv = document.getElementById(this.id);
          var ctx= canv.getContext("2d");
          ctx.clearRect(0,0,80,80);
         //起始一条路径
            ctx.beginPath();
            //设置当前线条的宽度
            ctx.lineWidth = 8; //10px
            //设置笔触的颜色
            ctx.strokeStyle = '#06224a';
            //arc() 方法创建弧/曲线（用于创建圆或部分圆）
            ctx.arc(width/2, height/2,height/2-8, 0, 2 * Math.PI);
            var x=vm.percent;
            //绘制已定义的路径
            ctx.stroke();
            ctx.beginPath();
            ctx.lineWidth = 8;
            ctx.strokeStyle = this.color;
            ctx.arc(width/2, height/2,height/2-8, -90 * Math.PI / 180, (-x * 3.6 - 90) * Math.PI / 180,true);
            ctx.stroke();
            ctx.font = 'bold 14px Arial';
            ctx.fillStyle = '#5ca8f9';
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';
            ctx.fillText(vm.percent+'%', width/2, height/2);
      }
    },
    mounted(){
     this.init();
    }
  }
</script>

<style lang="less" scoped>
  .demo{
    padding:8px 0;
    // display: inline-block;
    max-width:104px;
    text-align: center;
    margin:0 auto;
    div{
      padding:8px;
      font-size:14px;
    }
  }

</style>
