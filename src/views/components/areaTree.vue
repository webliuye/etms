<template>
  <el-tree :data="rootData" :expand-on-click-node="false" :default-expanded-keys="[orgId]" :accordion="true" :load="loadNode" :props="matrialProps"  node-key="unitId" @node-click="handleNodeClick" lazy :indent="12"></el-tree>
</template>

<script>
  import { getInfo } from 'api/count';
  import { getTreeData } from 'api/common';
  export default {
    name: 'areaTree',
    props:{
      isSchool:{
        type: Boolean,
        default: true
      },
      isTop:{
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        matrialProps: {
          children: 'children',
          label: 'unitName',
          isLeaf: 'leaf'
        },
        treeData:[],
        dataAll:[],
        rootData:[],
        cityData:[],
        orgId:this.$store.state.user.userInfo.orgId,
        orgType:this.$store.state.user.userInfo.orgType
      }
    },
    created() {
    },
    methods: {
      handleNodeClick(data) {
        this.$emit('changeCode', data);
      },
      loadNode(node, resolve) {
        //setTimeout(this.con,200);//为一行做显示不全时，做悬浮文字；
        var nodeData = node.data;
        var data;
        var vm = this;
        if(nodeData.length == 0){  //阻止重复加载
          data = [];
          var rootObj = {};
          if(this.isTop){
            this.$store.dispatch('GetUserUnit').then(res => {
              if(res){
                rootObj.unitId = res.unitId;
                rootObj.unitType = res.unitType;
                rootObj.unitName = res.unitName;
                data.push(rootObj);
              }
              resolve(data);
            });
          }else{
            rootObj.unitId = this.orgId;
            rootObj.unitType = this.orgType;
            rootObj.unitName = '全部';
            data.push(rootObj);
            resolve(data);
          }

        }else{
          getTreeData({unitId:nodeData.unitId}).then(res => {
            if(vm.isSchool){
              res.filter(function(s){
                if(s.unitType == '225'){
                  s.leaf = true;
                }
              });
              data = res;
            }else{
              data = res.filter(function(item){
                if(item.unitType == '223'){
                  item.leaf = true;
                }
                return item.unitType != '225';
              });
            }
            resolve(data);
          });
        }
        this.$nextTick(() => {
          this.con();
        });
        // if(nodeData.type == '225'){
        //   data = [];
        // }else if(nodeData.type == '221'){
        //   data = this.dataAll.filter(function(item){
        //     return ((item.parentId == nodeData.id) && item.type == '222');
        //   });
        // }else {
        //   data = this.dataAll.filter(function(item){
        //     return item.parentId == nodeData.id;
        //   });
        // }

      },
      getType() {
        this.$emit('changeType', this.type);
      },
      con(){
        var tit=$('span.el-tree-node__label');
        tit.each((index,e)=>{
          e.setAttribute("title",e.innerHTML);
        });
      }
    },
    mounted() {
      // var rootObj = {};
      // rootObj.unitId = this.orgId;
      // rootObj.unitType = this.orgType;
      // rootObj.unitName = '全部';
      // this.rootData.push(rootObj);
    }
  }
</script>
<style rel="stylesheet/scss" lang="less" scoped>
  .left-tree {
    top: 0;
  }
</style>
