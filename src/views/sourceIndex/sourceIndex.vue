//非登录资源首页1024
<template>
	<div >
		<div class="kfu" style="z-index:10000">
			<p>	<img src="~assets/login-icon/qiyu.png" @click="callCustom" alt="/">联系客服</p>
			<p>
				<img src="~assets/login-icon/ERWEIMA.png" alt="/"/>
				<p style="text-align:center;margin:0;font-size:12px">扫二维码关注</p>
			</p>
		</div>
    <div v-if="!showSrc">
      <img src="~assets/login-icon/banner-home.png" style="width:100%;" alt="">
    </div>
		<div style="background:#fff;" v-if="showSrc">
			<div class="box">
				<el-row :gutter="24">
					<el-col :span="16">
						<div class="ltl">
							<img src="~assets/img/logo.png" alt="图片丢失">
							{{titleInfo}}
						</div>
					</el-col>
					<el-col :span="8">
						<div class="lrl">
							<el-input placeholder="资源名称或关键字" v-model="keyWord" >	
                <i
                class="el-icon-search el-input__icon"
                slot="suffix"
                @click="handleIconClick">
                </i>		
							</el-input>
						</div>				
					</el-col>
				</el-row>
			</div>
		</div>
		<div class="source-box"  v-if="showSrc">
			<div class="box" >
				<SourceSubject @changeSourceName='changeSourceName' @changeSubject="changeSubject" :subject="subjectId"></SourceSubject>
			</div>		
		</div>
		<div class="box">
      <Carsoul  v-if="subjectId == '0'" :showCout="showSrc" ></Carsoul>
			<SubjectSource v-if="subjectId != '0' && showSrc" :subjectId="subjectId" :navData="navData"></SubjectSource>      
			<IndexSource v-if="subjectId == '0'&& showSrc"></IndexSource>
			<CountTable v-if="subjectId == '0' && showRank"></CountTable>
		</div>
	</div>
</template>

<script>
import SourceSubject from "views/components/sourceSubject";
import SubjectSource from "./subjectSource";
import Carsoul from "./carsoul";
import IndexSource from "./index";
import CountTable from "./countTable";
import { mapGetters } from 'vuex';
import { getNojoinTitle } from 'api/common';
export default {
  name: "sourceIndex",
  components: { SourceSubject, SubjectSource,  CountTable,IndexSource,Carsoul },
  data() {
    return {
      sourceName: "",
      subjectId: "0",
      navData: null,
      keyWord: "",
      showSrc:false,
      showRank:false,
      titleInfo:this.$store.getters.objApi.INDEX_TITLE,
      userInfo:{}
    };
  },
   computed: {
        ...mapGetters([
          'userUnit'
        ])
   },
  created() {  
    this.$store.dispatch('GetUserUnit');
      var state=JSON.parse(localStorage.getItem('ObjAPI')).state;
      if(state==1){
        this.showSrc=true;
        this.showRank=true;
      }else if(state==2){
            this.showSrc=true;
            this.showRank=false;
      }else  if(state==3){
            this.showSrc=false;
            this.showRank=true;
      };
    getNojoinTitle().then(res => {
      if(res){
        this.titleInfo = res;
      }
    });  
  
    this.userInfo=this.userUnit;
    if (this.$route.params.subjectId) {
      this.subjectId = this.$route.params.subjectId;
    }else if(this.$store.state.commonData.sourceSubjectId){
      this.subjectId = this.$store.state.commonData.sourceSubjectId;
    }

    if (this.$route.params.navData && this.$route.params.navData.length > 0) {
      this.navData = this.$route.params.navData;
    }
  },
  methods: {
    changeSourceName(name) {
      this.sourceName = name;
      if (this.subjectId == "0") {
        if (name == "") {
          this.$message({
            message: "请输入资源名字",
            type: "warning"
          });
          return;
        }
        this.$router.push({
          name: "SearchSource",
          params: { sourceName: name }
        });
      }
    },
    changeSubject(id) {
      this.subjectId = id;
    },
    handleIconClick(){
      if(this.keyWord){
        this.$router.push({name: 'SearchSrc', params: {sourceName: this.keyWord}});
      }else{
         this.$message({
            message: "请输入资源名字",
            type: "warning"
          });
          return
      }       
    },
     callCustom() {
            var userdata = [{
              "key" : "type",
              "value" : this.userInfo.unitType,
              "label" : "用户类型"
            }, {
              "key" : "unitname",
              "value" : this.userInfo.unitName,
              "label" : "单位名称"
            }];
            var args = {
              uid : this.userInfo.unitId,
              name : this.userInfo.unitName,
              // email : this.userInfo.email,
              // mobile : this.userInfo.mobile,
              groupid : '93586',
              data : JSON.stringify(userdata)
            };
            ysf.config(args);
            ysf.product({
              show : 0, // 1为打开， 其他参数为隐藏（包括非零元素）
              title : '实验教学9.5',
              desc : '来自实验教学9.5',
              note : '实验教学9.5'
            });
            ysf.open();
        },
  },
  mounted() {}
};
</script>
<style  rel="stylesheet/less" lang="less" scoped>
@hoverColor: rgb(77, 179, 255);
.title {
  background: "#ddd";
  color: #666;
  font-size: 12px;
  > div {
    width: 1024px;
    margin: 0 auto;
    padding: 4px 8px 6px;
    span {
      font-size: 12px;
      vertical-align: middle;
      margin: 0;
    }
    img {
      display: inline-block;
      height: 16px;
      vertical-align: middle;
    }
  }
}
.box {
  width: 1024px;
  margin: 0 auto;
}
.source-box {
  padding: 0;
  margin: 0;
  background: #4b98ff;
}

.ltl {
  img {
    vertical-align: middle;
  }
  color: #20a0ff;
  font-size: 24px;
  font-weight: 900;
}
.el-col {
  overflow: hidden;
}
.lrl {
  height: 87px;
  width: 100%;
  position: relative;
  .el-input {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }
}
.user-center {
  padding-left: 20px;
  margin-left: 8px;
  background: url(~assets/img/icon-user-center.png) center left no-repeat;
  &:hover {
    color: @hoverColor;
  }
}
.user-kf {
  padding-left: 20px;
  margin-left: 8px;
  background: url(~assets/img/icon-kf.png) center left no-repeat;
  &:hover {
    color: @hoverColor;
  }
}
.user-change {
  padding-left: 20px;
  margin-left: 8px;
  color: #ff6709;
  background: url(~assets/img/icon-change.png) center left no-repeat;
  &:hover {
    color: @hoverColor;
  }
}
.user-out {
  padding-left: 20px;
  margin-left: 8px;
  background: url(~assets/img/user-out.png) center left no-repeat;
  &:hover {
    color: @hoverColor;
  }
}
.kfu {
  position: fixed;
  right: 2%;
  bottom: 5%;
  p:first-child { 
	border: 1px solid #ddd;
    background: #20a0ff;
    padding: 8px;
    color: #fff;
    font-size: 12px;
    cursor: pointer;
    img {      
      vertical-align: middle;
      padding-right: 8px;
    }
  }
  p:nth-child(2) {
	border: 1px solid #ddd;  
	background: #fff;
	margin: 0;
    padding: 0;
    >p {
      margin: 0;
      padding: 0;
    }
  }
}
</style>
