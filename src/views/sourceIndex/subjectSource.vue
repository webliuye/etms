//非登录的科目目录
<template>
  <div class="source-container" style="padding:16px 24px;">
    <div class="nav" >
      <span @click="subjectGetList" style="font-weight:900;" >{{subjectName}}</span>
      <span v-for="(item,index) in navList" :key="index" @click="savetextbookCode(item,index)"><span style="color:#ccc;padding:0 5px;">>></span ><span class="baNav">{{item.nodeName}}</span></span>
      <span ><span style="color:#999;padding:0 5px;">>></span >资源列表</span>
    </div>
    <div class="version-div">
    <div class="left-tree" style="max-height:640px;top:8px;">
        <SourceTree @changeCode="changeCode" :subjectId="subjectId" :expandList="expandData" :currentId="currentNode" :navitem="navitem"></SourceTree>
      </div>
    </div>
    <div class="right-content">
         <div class="search-select">
          <el-form  :model="formData"  :label-position="'left'"  style="width:60%;">
             <el-form-item label="类  别:" class="checkRadio sourceRadio" :label-width="formLabelWidth">
              <el-radio-group v-model="searchData.resourceType" @change="getList">
                <el-radio-button label="">全部</el-radio-button>
                <el-radio-button v-for="(item,index)  in sourceType" :key="index" :label="item.value">{{item.label}}</el-radio-button>
              </el-radio-group>
            </el-form-item>

          </el-form>
        </div>
        <!-- <div class="search-select">
          <el-form  :model="formData" :label-position="'left'"  :inline="true" style="width:60%;">
             <el-form-item label="筛  选:" :label-width="formLabelWidth" class="checkRadio sourceRadio">
               <el-checkbox-group v-model="sortArray" >
                <el-checkbox label="recommend" value="recommend">推荐</el-checkbox>
                <el-checkbox label="sourceCollectCount" value="sourceCollectCount">收藏</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <el-form-item label="排  序:" class="checkRadio sourceRadio" :label-width="formLabelWidth">
              <el-radio-group v-model="searchData.sortBy" @change="getList">
                <el-radio-button label="sourceViewCount">最热</el-radio-button>
                <el-radio-button label="createTime">最新</el-radio-button>
                <el-radio-button label="downloadNum">下载</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </div> -->
          <div class="source-content">
            <p class="noData" v-if="listDataBln">暂无数据</p>
            <el-row>
              <el-col :span="24" v-for="(item, index) in list" :key="index" >
                <div style="position:relative;">
                  <el-card :body-style="{ padding: '0px',clear:'both',height:'0'}">
                    <div :class="item.resourceType" @click="toDetail(item)" class="srcTypeimage"></div>
                    <div class="panelBody" >
                      <div class="fr"  v-if="item.resourceType=='RS_TYPE_VIDEO'" @click="toDetail(item)" >查看</div>
                      <div class="fr" v-else  @click="toDetail(item)" >下载</div>
                      <strong class="el-button--text sourceTitle" style="cursor:pointer;" :title="item.name"  @click="toDetail(item)">{{item.name}}</strong>
                      <p :title="item.intro">{{item.intro}}</p>
                      <p class="nav" >
                        <i style="font-weight:900; font-style: normal;"> 教材：</i>
                        <span @click="subjectGetList"  >{{subjectName}}</span>
                           <span v-for="(ite, index) in item.guides.slice(1)" :key="ite.textbookCode" @click="savetextCode(ite,index,item)"><span style="color:#ccc;padding:0 5px;">>></span ><span class="baNav">{{ite.nodeName}}</span></span>
                      </p>
                      <div>
                        <span class="panelSpan">资源ID: {{item.serialNumber}}</span>
                        <span class="panelSpan"><img src="~assets/sourceImg/eye.png">  {{item.sourceViewCount}}次</span>
                        <span class="panelSpan"><img src="~assets/sourceImg/favorite.png"> {{item.sourceCollectCount}}次</span>
                        <span class="panelSpan"  v-if="item.resourceType!='RS_TYPE_VIDEO'" ><img src="~assets/sourceImg/dlGray.png"> {{item.downloadNum}}次</span>
                        <span class="panelSpan"><img src="~assets/sourceImg/sizer.png"> {{item.resourceSize || 0}}</span>
                        <span class="panelSpan"><img src="~assets/sourceImg/timer.png"> {{item.createTime}}</span>
                      </div>
                    </div>
                  </el-card>
                  <img src="~assets/sourceImg/vip.png" v-if="item.isVip" class="vip">
                </div>
              </el-col>
            </el-row>
          </div>
          <div v-show="!listLoading" class="pagination">
            <Pagination :pages="pages" :searchData="searchData" @getTableData="getList"></Pagination>
          </div>
    </div>
  </div>
</template>

<script>
  import SourceTree from 'views/components/sourceTree1';
  import { mapGetters } from 'vuex';
  import { getListData } from 'api/sourceIndex';
  import Pagination from 'views/components/page/pagination';
  export default {
    name : 'sourceView',
    components : { SourceTree, Pagination },
    props: {
    	subjectId: {
        type: String,
        default:''
      },
      navData: {
        type: Array,
        default:[]
      }

    },
    data () {
      return {
        list:null,
        sortArray:[],
        subjectName:'',
        navList:[],
        navitem:null,
        listLoading:false,
        expandData:[],
        currentNode:'',
        pages:{
          total:1,
          sizes:[5,10,20,30]
        },
        searchData : {
          page:1,
          size:5,
          sourceName:'',
          resourceType:'',
          textbookCode:null,
          sortArray:'',
          sortBy:'sourceViewCount'
        },
        formData: {
          editionId:null,
          learningPeriodId:null,
          gradeId:null,
          volumeId:null,
          oneThemeId:null,
          twoThemeId:null,
          testTableId:null
        },
        // orgType:this.$store.state.user.userInfo.orgType,
        // orgId:this.$store.state.user.userInfo.orgId,
        formLabelWidth:'60px',
        treeData:[],
        listDataBln:false
      };
    },
    watch: {
    	subjectId() {
         console.log(this.subjectId);
        this.sourceSubject.forEach(e=>{
          if(e.textbookCode===this.subjectId){
            this.subjectName=e.nodeName;
          }
        });
        this.navList=[];   this.searchData.textbookCode = this.subjectId;
        this.searchData = jQuery.extend(this.searchData,this.formData);

    		this.getList();
      },
      sortArray(){
        this.searchData.sortArray=this.sortArray.join(',');
        this.getList();
      }
    },
    computed: {
      ...mapGetters([
        'sourceType',
        'sourceSubject'
      ])
    },
    created() {
      this.sortArray = this.searchData.sortArray.split(",");
      this.$store.dispatch('GetSourceType');
      this.searchData.textbookCode = this.subjectId;
       this.sourceSubject.forEach(e=>{
          if(e.textbookCode===this.subjectId){
            this.subjectName=e.nodeName;
          }
        });
      this.getList();
      if(this.navData&&this.navData.length>0){
        //从预览页面进来的数据
          this.navList=this.navData.slice(1);
          this.navitem=this.navList[this.navList.length-1];
          this.currentNode=this.navitem.textbookCode;
          this.expandData=[];
          this.navList.forEach((e)=>{
            this.expandData.push(e.textbookCode);
          });
          this.searchData = jQuery.extend(this.searchData,this.formData,this.navitem);
          this.getList();
      }
    },
    methods : {
      savetextbookCode(item,index){
       this.navitem=item;
       this.currentNode=item.textbookCode;
       this.navList=this.navList.slice(0,index+1);
       this.expandData=[];
       this.navList.forEach((e)=>{
         this.expandData.push(e.textbookCode);
       });
       this.searchData = jQuery.extend(this.searchData,this.formData,this.navList[index]);
       this.getList();      //  this.expandData=index;
      },
      //从资源路径点击时的效果
       savetextCode(item,index,scope){
       this.navitem=item;
       this.currentNode=item.textbookCode;
       this.navList=scope.guides.slice(1).slice(0,index+1);
       this.expandData=[];
       this.navList.forEach((e)=>{
         this.expandData.push(e.textbookCode);
       });
       this.searchData = jQuery.extend(this.searchData,this.formData,this.navList[index]);
       this.getList();      //  this.expandData=index;
      },
      subjectGetList(){
         this.navList=[];
         this.currentNode=null;
         this.searchData ={
          page:1,
          size:5,
          sourceName:'',
          resourceType:'',
          textbookCode:this.subjectId,
          sortBy:'sourceViewCount'
        };
          this.getList();
      },
      getList() {
        this.listLoading = true;
        this.listDataBln = false;
        if(!this.$store.state.commonData.resourceValue[this.subjectId]){
          this.$store.state.commonData.resourceValue[this.subjectId] = {};
        }
        getListData(this.searchData).then(res => {
          if(!res.data || res.data.length < 1){
            this.listDataBln = true;
          }
          this.list = res.data;
          this.pages.total = res.total;
          if(this.pages.total>this.searchData.size){
            this.listLoading = false;
          }
        });
      },
      findItem(){
        this.getList();
      },
      changeCode(data, nodeData){
        console.log(data,nodeData);
        if(nodeData.data){
          this.treeData = [];
          this.treeData.push(nodeData.data);
          this.navList=[];
          this.navList.push(nodeData.data);
          var t = nodeData.parent;
          while(t && t.level > 0){
            this.treeData.push(t.data);
            this.navList.push(t.data);
            t = t.parent;
          }
          var s;
          s = this.treeData.map(function(item){
            return item.textbookCode;
          });
          this.navList=this.navList.reverse();
          if(this.navData&&this.navData.length>1&&!nodeData.parent){
            this.navList=this.navData;
          };
          this.$store.commit('SET_LOCALTREEDATA',s);
        }else{
          var s;
          s = this.navList.map(function(item){
            return item.textbookCode;
          });
          s=s.reverse();
           this.$store.commit('SET_LOCALTREEDATA',s);
        }
        this.searchData = jQuery.extend(this.searchData,this.formData,data);
        this.getList();
      },
      // handleSizeChange(val) { // 显示多少页+
      //   this.searchData.size = val;
      //   this.getList();
      // },
      // handleCurrentChange(val) {  // 点击页数
      //   this.searchData.page = val;
      //   this.getList();
      // },
      toDetail(item){
        if(this.$store.getters.token){
          this.$router.push({ name: "SourcePre", params: { id: item.resourceId } });
        }else{
          this.$store.state.commonData.loginshow=true;
        }
      }
    },
    mounted () {
        this.$store.dispatch('GetSourceSubject');
    }
  }
</script>
<style rel="stylesheet/scss" lang="less" scoped>
.table-in {
  border: none;
  box-sizing: border-box;
  width: 100%;
  td {
     border:1px solid #ccc;
     text-align: center;
  }
}

.el-card.checkRadio{
  font-weight:normal;
  font-size:12px;
  min-height:48px;
  // margin-bottom:24px;
  padding:8px 16px;
   border:1px solid transparent;
   border-radius:0;
   box-shadow:none;
   border-bottom:1px solid #eee;

}
 .el-row{

   .el-card{
    //  margin-bottom:24px;
     padding:16px 16px;
     height:132px;
     border-radius: 0;
     box-shadow:none;
     border:1px solid transparent;
     border-bottom:1px solid #eee;
     position:relative;
     .fr{
          padding:12px 24px;
          background:#00a0e9;
          color:#fff;
          margin-top:24px;
          cursor: pointer;
          &:hover{
              font-size:14px;
              font-weight: 900;
          }
        }
     &:hover{
       border-radius: 0;
       border: 1px solid #00a0e9;
     }

     .image {
        width: 60px;
        padding-top: 8px;
        height:auto;
        float:left;
        cursor: pointer;
      }

     .panelBody{
        font-size:12px;
        margin-left:60px;
        white-space:nowrap;
        padding:0 0 0 16px;

        p{
          overflow:hidden;
          text-overflow:ellipsis;
          width: 80%;
          margin:8px 0;
          padding:0 0;
        }
        .panelSpan{
          padding-right:24px;
          img{
          display: inline-block;
          vertical-align:middle;
          }
        }
        .sourceTitle {
          display: inline-block;
          max-width: 440px;
          font-size: 16px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          color: #333;
          &:hover {
            color:#ff0000;
          }
        }
     }
  }
  .vip{
    position:absolute;
    top:0;
    right:0;
  }
 }

.pagination{
  margin-top:0px;
  padding:5px 0px;
  background: #fff;
  // border:1px solid #d3dce6;
  text-align: center;
}

.search-select {
  padding-bottom: 0;
  .el-form{
    height:32px;
  }
}
.nav{
  font-size:12px;
  padding:0 0 16px 0;
  color:#333;
  white-space:nowrap;
	text-overflow:ellipsis;
  >span{
    font-size:12px;
    font-weight:400;
    cursor: pointer;
    &:hover{
        color:#00a0e9;
    }
  }
  .baNav{


  }
}

</style>
