//资源首页统计报表的组件
<template>
    <div class="dashborad tabsID">      
     
      <div class="countBox">
        <el-row :gutter="24">
          <el-col :span="12">
            <div style="position:relative;">
              <span class="more" @click="goRank()">
                更多>
              </span>
              <div>                        
                <h4>实验开出排行</h4>  
                <div class="listBox">                 
                  <p class="newItem"  v-for=" (item,index) in RankList" :key="index"  >               
                    <el-row>
                      <el-col :span="2">
                        <span v-if="index==0" class="firstA"></span> 
                        <span v-if="index==1" class="second"></span> 
                        <span v-if="index==2" class="third"></span> 
                        <span v-if="index>2">{{index+1}}</span> 
                      </el-col>
                      <el-col :span="18"> {{item.unitName}} </el-col>
                      <el-col :span="4" style="text-align:right;">{{item.totalRate| numberTrans}} </el-col>
                    </el-row>                             
                  </p>                    
                </div>           
              </div>
            </div>           
          </el-col>
          <el-col :span="12">
            <div style="position:relative;">
              <span class="more"  @click="goSrcPlan()">
                更多>
              </span>
              <div>                        
                <h4>实验目录</h4>  
                <div class="listBox ">
                   <p class="newItem"  v-for="(item,index) in testList" :key="index"  >               
                    <el-row>
                      <el-col :span="10">                       
                        {{item.stageName + item.gradeName + item.subjectName}}
                      </el-col>
                      <el-col :span="10">{{item.editionName}} </el-col>
                      <el-col :span="4" style="text-align:right;">{{item.catalogueCount}}</el-col>
                    </el-row>                             
                  </p>              
                </div>            
              </div>
            </div>           
          </el-col>
        </el-row>
      </div>
      <div class="countBox" v-if="userUnit.unitType=='223'">
        <el-row :gutter="24">
          <el-col :span="12">
            <div style="position:relative;">
              <span class="more" @click="goRankWarn()">
                更多>
              </span>
              <div>                        
                <h4>实验开出预警</h4>  
                <div class="listBox ">
                  <p  class="newItem" v-for="(item,index) in warnData" :key="index"  >               
                    <el-row :gutter="8"> 
                       <el-col :span="2">
                        <span v-if="index==0" class="firstA"></span> 
                        <span v-if="index==1" class="second"></span> 
                        <span v-if="index==2" class="third"></span> 
                        <span v-if="index>2">{{index+1}}</span> 
                      </el-col>                     
                      <el-col :span="10" :title="item.unitName">{{item.unitName}} </el-col>
                      <el-col :span="8" >{{item.amount}} </el-col>
                      <el-col :span="4" >{{item.classDate.substr(0,10)}}</el-col>
                    </el-row>                             
                  </p>          
                </div>           
              </div>
            </div>           
          </el-col>
          <el-col :span="12">
            <div style="position:relative;">
              <span class="more" @click="gosrcRecord()">
                更多>
              </span>
              <div>                        
                <h4>实验开出记录</h4>  
                <div class="listBox ">
                  <p class="listItem"  v-for="(item,index) in openData" @click="goRDDetail(item)" :key="index"  >               
                    <el-row :gutter="8">                      
                      <el-col :span="21" :title="item.name">{{item.unitName}} |{{item.subjectName}}| {{item.name}}</el-col>
                      <el-col :span="3" >{{item.createDate.substr(5,5)}}</el-col>
                    </el-row>                             
                  </p>              
                </div>            
              </div>
            </div>           
          </el-col>
        </el-row>
      </div>
    </div>
</template>
<script>
import { getInfo } from "api/manageCenter";
import { mapGetters } from 'vuex';
import { getRankData, getTestData,getTestopenData,testWarnData } from "api/sourceIndex";
export default {
  components: {},
  data() {
    return {
      sourceNum: null,
      teachSrcNum: null,
      hotName: "",
      rcmName: "",
      newName: "",
      hotpages: null,
      rcmpages: null,
      newpages: null,
      hotList: [],
      rcmList: [],
      newList: [],
      subjectList: [],
      hotlt: false,
      hotrt: false,
      rcmlt: false,
      rcmrt: false,
      newlt: false,
      newrt: false,
      countList: [],
      resourceSize: "",
      hotSearchData: {
        subjectId: "",
        sort: "sourceViewCount",
        size: 10,
        page: 1
      },
      rcmSearchData: {
        subjectId: "",
        sort: "recommend",
        recommend: "true",
        size: 10,
        page: 1
      },
      newSearchData: {
        subjectId: "",
        sort: "createTime",
        size: 10,
        page: 1
      },
      RankList:[],
      warnData:[],
      noticeList:[],
      testList:[],
      openData:[],      
      picArray: [
        { src: require("../../assets/sourceImg/ba.png") },
        { src: require("../../assets/sourceImg/bb.png") }
        // 'http://chuantu.biz/t6/101/1508218602x2936639052.png',
        // 'http://chuantu.biz/t6/101/1508218640x2918527206.png'
      ]
    };
  },
  computed: {
        ...mapGetters([
          'userUnit'
        ])
      },
  created() {
    this.$store.dispatch('GetUserUnit').then(data=>{
        if(data.unitType=='223'){
       //获取实验开出记录信息
      getTestopenData().then(res=>{
        this.openData=res.data;
      });
      //获取实验开出预警
      testWarnData().then(res=>{
          if(res){
          this.warnData=res;
        }else{
          this.warnData=[{unitName:"暂无信息"}]
        }
      })
    }  
    });
    getRankData().then(res=>{
      if(res){
        if(res.length>5){
          this.RankList=res.slice(0,5);
        }else{
           this.RankList=res
        }
      }else{
         this.RankList=[{unitName:"暂无信息"}]
      }     
    });
    //实验目录信息
    getTestData().then(res=>{
      if(res){
        this.testList=res;
      }else{
         this.testList=[{name:"暂无信息"}]
      }
    }) ;
   
  },
  methods: {
    goRank(){
        this.$router.push({ name: "SrcRank"});
    },
    goRankWarn(){
        this.$router.push({ name: "SrcRankWarn"});
    },
    goSrcPlan(){
        this.$router.push({ name: "SrcPlan"});
    },
    gosrcRecord(){
        this.$router.push({ name: "SrcRecord"});
    },
    goRDDetail(item){
        this.$router.push({name: 'SrcRecordDetail',params:{id:item.courseId}});
    }

  },
  mounted(){

  }
};
</script>
<style  rel="stylesheet/less" lang="less" scoped>
.dashborad {
  padding: 0;
  color: #333;
  font-size: 14px;
  .topB {
    padding: 8px 16px;
    background: #fff;
    .r_tb {
      border: 1px solid #ddd;
      height: 250px;
      padding: 16px 24px;
      color: #666;
      .pbox {
        border-bottom: 1px solid #ddd;
        padding: 0px 0 16px 0;
        margin: 16px 0;
      }
      .pcon {
        span {
          display: inline-block;
          width: 45%;
          margin: 16px 0;
          font-size: 16px;
          font-weight: bold;
          a {
            color: #00a0e9;
          }
        }
      }
      .sourceBox {
        background: url("~assets/sourceImg/sourceBox.png");
        width: 68px;
        height: 62px;
      }
      h3 {
        font-size: 16px;
        margin: 0 0 20px 0;
        span {
          color: #00a0e9;
        }
      }
    }

    .el-carousel__item {
      img {
        display: block;
        width: 1400px;
        height: 250px;
        margin: 0 50%;
        transform: translateX(-50%);
      }
      // background:url('~assets/sourceImg/carsoulPic.png');
      // background-size:cover;
    }
  }
  .ipBox {
    margin-top: 8px;
    padding: 24px 16px 0px;
    background: #fff;
  }

  .tabsBox {
    position: absolute;
    width: 100%;
    top: -12px;
    left: 0;
  }
  h4 {
    padding: 0px;
    font-size: 16px;
    padding-left: 16px;
    margin: 0;
    line-height: 16px;
    background: url("~assets/sourceImg/sqB.png") no-repeat;
  }

  .el-col-12 {
    border-right: 1px solid #ddd;
    &:nth-child(2n) {
      border-right: 1px solid transparent;
    }
  }
  .listBox {
    padding: 16px 8px 0px;
    // border-bottom:1px solid #ddd;
    margin-bottom: 8px;
    height: 350px;
    span {
      display: inline-block;
      width: 48px;
      padding-left: 5px;
      height: 20px;
      &.firstA {
        float: left;
        padding-left: 0px;
        background: url("~assets/sourceImg/firstA.png") no-repeat;
      }
      &.second {
        float: left;
        padding-left: 0px;
        background: url("~assets/sourceImg/second.png") no-repeat;
      }
      &.third {
        float: left;
        padding-left: 0px;
        background: url("~assets/sourceImg/third.png") no-repeat;
      }
    }
    .listItem {
      height: 19px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      margin-right: 12px;
      cursor: pointer;
      &:hover {
        color: #00a0e9;
      }

      img {
        vertical-align: middle;
        padding-right: 16px;
      }
    }
  }
  .btnBox {
    margin-right: 24px;
    cursor: pointer;
    img {
      border: 1px solid #fff;
    }
    img:active {
      border-bottom: 1px solid #ccc;
      border-right: 1px solid #ccc;
    }
    span:first-child {
      padding-right: 16px;
    }
  }
}
.noticeBox {
  padding: 8px 8px 0px;
  // border-bottom:1px solid #ddd;
  margin-bottom: 8px;
  height: 170px;
  overflow: hidden;
  .listItem {
    cursor: pointer;
    margin:8px 0;
    &:hover {
      color: #00a0e9;
    }
  }
}
.NewBox {
  margin-top: 8px;
  padding: 24px 16px 32px;
  background: #fff;
  .listBox {
    height: 186px;
    .el-col-12 {
      height: 35px;
    }
  }
  h4 {
    padding: 0px;
    font-size: 16px;
    padding-left: 16px;
    margin: 0;
    line-height: 16px;
    background: url("~assets/sourceImg/sqB.png") no-repeat;
  }
  .newItem {
    padding: 8px 0px;
    margin: 0;
    cursor: pointer;
    &:hover {
      color: #00a0e9;
    }
  }
}
.srcType {
  color: #666;
  margin: 0;
  padding: 0 8px 8px 0;
  margin-right: 32px;
  float: left;
  .blue {
    color: #00a0e9;
  }
  img {
    vertical-align: middle;
    padding-right: 8px;
  }
}
.countBox {
  margin-top: 8px;
  padding: 24px 16px 16px;
  background: #fff;
  h4 {
    padding-bottom: 8px;
    border-bottom: 1px solid rgb(209, 219, 229);
  }
  .listBox {
    padding: 8px 8px 0px;
    height: 186px;
    overflow: hidden;  
  }
  
}
.more {
  color: #00a0e9;
  position: absolute;
  top: 0;
  right: 0;
  cursor: pointer;
}
.listBox{
  .el-col{
  overflow: hidden;
  height:19px;
}
}
</style>