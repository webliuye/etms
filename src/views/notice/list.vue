<template>
  <div class="con-box">
    <div class="filter-container" v-if="isAdmin&&(orgType!='225')"  >
      <router-link :to="{ path: '/notice/releace'}" class="  filter-item " ><el-button type="primary" icon="el-icon-plus">添加</el-button></router-link>
    </div>
    <el-row :gutter="50" >
      <el-col :span="12"  v-for="(item,index)  in list" :key="index" >
        <div  class="notice_panel"   @click="goNoticeDetail(item)" >
            <el-button v-if="isAdmin&&(orgId==item.unitId)"   @click.stop="handlePlanList(item.id)"  type="text" class="fr" icon="el-icon-delete"></el-button>
            <h6>{{item.title}}</h6>

          <p>
            <span>{{item.createTime}}</span>
            <span>{{item.unitName}}</span>
          </p>
          <!-- 有内边距\有左边框不能超出范围，超出隐藏，不能换行 -->
          <p >
           {{item.content}}
          </p>

        </div>
          <br>
      </el-col>

    </el-row>
    <div v-if="!list||list.length==0" style="position:fixed;top:50%;left:50%;">
      暂无公告
    </div>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="pages.sizes"
        :page-size="listQuery.size" layout="total, sizes, prev, pager, next, jumper" :total="pages.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import { getNoticeList, deleteNotice } from 'api/notice';
  export default {
    data() {
      return {
        listLoading: false,
        list: null,
        unitId:"",
        listQuery: {
          page: 1,
          size: 50
        },
        isAdmin:'',
        pages:{
          total:1,
          sizes:[10,20,30, 50]
        },
        orgId:this.$store.state.user.userInfo.orgId,
        orgType:this.$store.state.user.userInfo.orgType
      }
    },
    created() {
      this.orgType==='225'?this.isAdmin=false:this.isAdmin=true;
      this.getList();
    },
    methods: {
      getList() { // 获取表格数据
        this.listLoading = true;
        getNoticeList(this.listQuery).then(response => {
          this.list = response.data;
          this.pages.total = response.total;
          if(response.total>this.listQuery.size){
            this.listLoading = false;}
        }).catch(err => {
          this.listLoading = false;
        });
      },
      handleSizeChange(val) { // 显示多少页
        this.listQuery.size = val;
        this.getList();
      },
      handleCurrentChange(val) {  // 点击页数
        this.listQuery.page = val;
        this.getList();
      },
      goshoolDetail(item){

      },
      goNoticeDetail(item){
        if(this.isAdmin){
           this.$router.push({ name: 'NoticeDetail',params:{id:item.id,isAdmin:true}});
        }else{
           this.$router.push({ name: 'SchoolNoticeDetail',params:{id:item.id,isAdmin:false}});
        }

      },
      handlePlanList(rowid){ // 删除
        this.$confirm('你确定要删除这些内容?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteNotice(rowid).then(response => {
            this.$message({
              message: '操作成功',
              type: 'success'
            });
            this.getList();
          });
        });
      }
    }
  }
</script>
<style lang="less" scoped>

  .notice_panel{
      border-left:2px solid #ccc;
      padding:0 8px;
      color:#666;
      font-size:12px;
      white-space:nowrap;
      cursor: pointer;
      /* 不换行 */
      overflow:hidden;
      position: relative;
      height:78px;
      transition: all 0.3s linear;
      .el-button{
        position: absolute;
        top:-5px;
        right:5px;
         opacity: 0;
      }
      &:hover .el-button {
        opacity: 1;
      }
      &:hover{
        border-left:5px solid #34a5f4;
        transition: all 0.3s linear;
        h6{
          border: none;
          color: #20a0ff;
          background: transparent;
          padding-left: 0;
          padding-right: 0;
          transition: all 0.3s linear;
        }
      }
      h6{
        overflow:hidden;
        text-overflow:ellipsis;
        color:#333;
        margin:0;
        font-size: 14px;
      }
      p{
        margin:8px 0 16px 0;
        overflow:hidden;
        text-overflow:ellipsis;
        span{
          &:nth-child(1){
            border-right:1px solid #999;
          }
          padding:0 16px;
        }
      }


    }
    hr{
        margin-left:13px;color:#999;
      }
      .pagination-container{
        margin-top:32px;
        background: #fff;
        border:none;
      }
</style>


