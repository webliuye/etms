<template>
  <el-tree :data="rootData" :expand-on-click-node="false" :default-expanded-keys="[orgId]" :accordion="true" :load="loadNode" :props="matrialProps" node-key="unitId" @node-click="handleNodeClick" lazy></el-tree>
</template>

<script>
  import { mapGetters } from 'vuex';
  // import { getInfo } from 'api/count';
  import { getTreeData } from 'api/sourceIndex';
  export default {
    name: 'areaTree',
    data() {
      return {
        matrialProps: {
          children: 'children',
          label: 'unitName'
        },
        treeData:[],
        dataAll:[],
        rootData:[],
        cityData:[],
        expanded:[],
        orgId:this.$store.state.commonData.userUnit.unitId,
        orgType:this.$store.state.commonData.userUnit.unitType
      }
    },
    computed:{
        ...mapGetters([
          'userUnit'
        ])
    },
    created() {
        this.$store.dispatch('GetUserUnit');
        this.orgType=this.userUnit.orgType;
    },
    methods: {
      handleNodeClick(data) {
        this.$emit('changeCode', data);
      },
      loadNode(node, resolve) {
        setTimeout(this.con,200);//为一行做显示不全时，做悬浮文字；
        var nodeData = node.data;
        var data;
        var vm = this;
        if(nodeData.length == 0){  //阻止重复加载
          data = [];
          var rootObj = {};
          rootObj.unitId = this.orgId;
          rootObj.unitType = this.orgType;
          rootObj.unitName = '全部';
          data.push(rootObj);
          resolve(data);
        }else{
          getTreeData({unitId:nodeData.unitId}).then(res => {
            if(vm.isSchool){
              data = res;
            }else{
              data = res.filter(function(item){
                return item.unitType != '225';
              });
            }
            resolve(data);
          });
        }

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
        })
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
