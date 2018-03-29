<template>
 <div class="all-content">
  <div class="grid-content">
    <img class="bgColor" src="../../../assets/img/sy-bg.png" />
  </div>
  <div class="main-content">
    <p class="noData" v-if="listDataBln">本周没有实验安排</p>
    <div class="item-content" v-for="(item,index)  in planList" :key="index">
     <img class="pos-img" src="../../../assets/img/pin.png" />
     <p class="top-con">
      <span class="plan-name" :title="item.planDetailName">{{item.planDetailName}}</span>
      <span class="class-name"  :title="item.classNames">
        <span v-for="ite in item.classNames.split('、')" :key="ite" class="itespan">{{ite}}</span>
      </span>
      <span class="fr span-info2">第{{item.classTime}}节课 </span>
      <span class="fr span-info2" style="width:80px;">{{item.classDate}}</span>
      <span class="fr span-info" :title='item.tercherName'>{{item.tercherName}}</span>
      <span class="fr span-info2" style="text-align:center;"> {{item.subjectName}}</span>
     </p>
     <p class="b-con">
     <span v-for="ite in item.resourceTypeCountList" :key="ite" class="spanList"   @click="goSource(ite)" >
        <span v-for="(items,index) in allSourceType" v-if="ite.sourceType == items.value" :key="index"> <img :src="imgPaths[items.value]"> {{items.label}} ({{ite.typeCount}})</span>
      </span>
      <span class="plan-desc">预约说明：{{item.description}}</span>
      <a href="javascript:;" class="fr" @click="goArrange(item)">安排</a>
     </p>
    </div>
  </div>
 </div>
</template>

<script>
import { getTesterPlan } from "api/index";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      imgPaths: {},
      planList: [],
      listDataBln: true
    };
  },
   computed: {
			...mapGetters([
			'allSourceType'
			])
	 	},
  created() {
    const vm = this;
		this.$store.dispatch("GetAllSourceType").then(res => {
			res.forEach(function(s) {
				let t = require(`src/assets/sourceImg/tiny/${s.value}.png`);
				vm.imgPaths[s.value] = t;
			});
		});
    getTesterPlan().then(res => {
      console.log(res);
      this.listDataBln = true;
      this.planList = res;
      if (res && res.length > 0) {
        this.listDataBln = false;
      }
    });

    this.planNumber = 5;
    this.bookingNumber = 5;
    this.arrangeNumber = 5;
    this.logNumber = 5;
  },
  methods: {
    goArrange(item) {
      this.$router.push({
        name: "ReviseArrange",
        params: {
          planDetailId: item.planDetailId,
          bookingId: item.bookingId,
          row: item
        }
      });
    },
    goSource(item) {
      this.$router.push({ name: 'Source', query: {catalogueId:item.catalogueId,textBookCode:item.textBookCode}});
    },
  }
};
</script>
<style lang="less" scoped>
@base-bg: #00a0e9;
@hoverColor: #00a0e9;
.grid-content {
  background-color: #fff;
  padding: 24px;
  display: flex;
  justify-content: space-between;
}
.plan-div {
  width: 182px;
  height: 84px;
  border: 1px solid #eee;
  border-radius: 4px;
  cursor: pointer;
  justify-content: space-around;
}
.arrange {
  border: 1px solid #00a0e9;
}
.plan-div img {
  float: left;
  display: inline;
  margin-left: 24px;
  margin-top: 12px;
  padding-right: 4px;
}
.plan-div p {
  line-height: 48px;
}
.plan-div p.b-con {
  float: left;
  display: inline;
  padding-left: 4px;
  padding-top: 6px;
  font-size: 12px;
  color: #333;
  line-height: 24px;
}
.plan-div p.top-con {
  font-size: 12px;
}
.plan-div p.b-con span {
  font-size: 24px;
}
.to-div {
  width: 60px;
  height: 84px;
}
.to-div img {
  display: block;
  margin: 0 auto;
  padding-top: 12px;
}
.main-content {
  margin-top: 36px;
  height: 600px;
  position: relative;
}
.index-left {
  position: absolute;
  width: 60px;
  left: 0;
  top: -12px;
  background-color: #ccc;
  height: 600px;
}
.index-right {
  padding-left: 84px;
  width: 100%;
}
.item-content {
  position: relative;
  width: 100%;
  background: url("../../../assets/img/plan-bg.png") center center no-repeat;
  background-size: 100% 100%;
}
.pos-img {
  position: absolute;
  left: -4px;
  top: -12px;
}
.item-content p.top-con {
  padding: 8px 0 0;
  font-size: 12px;
  line-height: 28px;
  margin: 8px 32px 0;
  border-bottom: 1px dashed @base-bg;
}
.item-content p.b-con {
  padding: 0 32px 8px;
  margin: 0;
  line-height: 48px;
  font-size: 12px;
  color: #333;
}
.item-content p .plan-name {
  display: inline-block;
  width: 30%;
  max-width: 360px;
  min-width: 240px;
  font-weight: bold;
  overflow: hidden;
}
.item-content p .plan-desc {
  display: inline-block;
  max-width: 800px;
  line-height: 24px;
  font-weight: bold;
  overflow: hidden;
}
.item-content p .class-name {
  display: inline-block;
}
.item-content p a {
  margin-right: 8px;
  margin-top: 8px;
  display: inline-block;
  width: 64px;
  line-height: 32px;
  background-color: #00a0e9;
  color: #fff;
  text-align: center;
}
.bgColor {
  display: block;
  margin: 0 auto;
  max-width: 1094px;
  width: 100%;
}
.item-content p.top-con .span-info {
  width: 12%;
  text-align: left;
  padding-right: 16px;
  padding-left: 8px;
  min-width: 100px;
  overflow: hidden;
  height: 28px;
}
.item-content p.top-con .span-info2 {
  width: 60px;
  padding-right: 8px;
  text-align: right;
}
.item-content p .class-name {
  display: inline-block;
  width: 30%;
  overflow: hidden;
}
.itespan {
  padding: 5px 8px;
  border: 1px solid #ccc;
  margin: 0 4px;
  border-radius: 12px;
}
.main-content p.noData {
  width: 100%;
  text-align: center;
  color: #333;
  font-size: 16px;
  line-height: 460px;
  height: 460px;
  background: #fff;
}
.spanList {
  cursor: pointer;
  float: left;
  padding: 0 24px 0 0;
  span {
    padding-right: 16px;
    line-height: 14px;
    img {
      vertical-align: middle;
    }
  }
}
</style>
