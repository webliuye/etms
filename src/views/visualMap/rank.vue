<template>
   <div class="tabs">
     <div class="tablist">
       <p class="tabItem" v-for="(item,index) in tablist" :key="index" :class="{isactive:index==active}" @click="changeActive(index)">{{item.label}} </p>
     </div>
     <div class="content">

      <div class="item" v-for="(item,index) in contentList" :key="'1'+index">
        <span>{{index+1}}</span><span :title="item.name">{{item.name}}</span> <span>{{item.percent}}%</span>
      </div>
     </div>
   </div>
</template>
<script>
import { rankTen } from "api/visual";
export default {
  name: "rank",
  props: {
    unitId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      active:null,
      tablist: [{ label: "开出率" }, { label: "分组" }, { label: "演示" }],
      data: "开出率",
      dataArray: [],
      contentList: []
    };
  },
  created() {
    this.active=0;
    this.getAllData();
    this.Inter();
    // 在钩子函数中调用我在method 里面写的scroll()方法，注意此处不要忘记加this,我在这个位置掉了好几次坑，都是因为忘记写this。
  },
  watch: {
    unitId(val) {
      this.active = 0;
      this.getAllData();
    }
  },
  methods: {
    changeActive(index) {
      this.active = index;
      this.data = this.tablist[index].label;
       this.contentList=this.dataArray[index];
    },
    getAllData() {
      this.getRankData(0);
      this.getRankData(1);
      this.getRankData(2);
    },
    Inter() {
      window.visual_rank_timer = setInterval(() => {
        this.active++;
        if (this.active > 2) {
          this.active = 0;
        }
        this.contentList=this.dataArray[this.active];
      }, 10000);
    },
    getRankData(i) {
      var sortBy;
      if (i == 0) {
        sortBy = "total";
      }
      if (i == 1) {
        sortBy = "group";
      }
      if (i == 2) {
        sortBy = "demo";
      }
      var queryData = {
        unitId: this.unitId,
        sortBy,
        limit: 10
      };
      const vm=this;
      rankTen(queryData).then(res => {
        if (res && res.length > 0) {
          res.forEach(function(e) {
            var percent;
            percent = Math.round(e.totalRate * 100);
            e.percent = percent;
          });

          vm.dataArray[i]=res;
          if(i==0){
             vm.contentList=res;
          }
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.tabs {
  width: 100%;
  height: 100%;
  padding: 8px 0;
  margin-top: -16px;
  .content {
    width: 100%;
    height: 46vh;
    box-sizing: border-box;
    overflow: hidden;
    margin-top: 8px;
    .item {
      span {
        padding: 0;
        margin: 0;
        display: inline-block;
        width: 15%;
        box-sizing: border-box;
        text-align: center;
        overflow: hidden;
        white-space: nowrap;
        line-height: 4.2vh;
        color: #7cffb7;
      }
      border-bottom: 1px dashed rgba(255, 255, 255, 0.3);
      &:last-child {
        border-bottom: none;
      }
      span:nth-child(2) {
        text-align: left;
        width: 66%;
        color: #7cffb7;
      }
      span:nth-child(1) {
        display: inline-block;

        background: url(~assets/visual/circle.png) no-repeat;
        background-size: 18px 18px;
        background-position: 50% 50%;
        text-align: center;
        color: #7cffb7;
      }
      span:nth-child(3) {
        text-align: right;
        width: 15%;
        color: #73e4e8;
      }
    }
  }
  .tablist {
    width: 100%;
    height: 40px;
    position: relative;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    box-sizing: border-box;
    .tabItem {
      text-align: center;
      margin: 0;
      float: left;
      width: 33.33%;
      color: #20a0ff;
      height: 40px;
      line-height: 38px;
      box-sizing: border-box;
      cursor: pointer;
    }
    .tabItem.isactive {
      font-weight: bold;
      color: #0070ff;
      border-bottom: 4px solid #73e4e8;
      transition: all 0.3s linear;
    }
  }
}
</style>
