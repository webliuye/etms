<template>
  <div>
    <el-button type="primary" class ="allSource" @click="allSource">{{lookAll}}</el-button>
    <el-input
      placeholder="请输入目录名称"
      v-model="catalogueName">
      <i
      class="el-icon-search el-input__icon"
      slot="suffix"
      @click="findCatalogue">
      </i>
    </el-input>
    <el-tree ref="tree" class="sourceTree" :data="treeData" :accordion="true" :default-expanded-keys="expandTree"  :load="loadNode" :props="matrialProps" node-key="textbookCode" @node-click="handleNodeClick" @node-expand="expandNode" :indent="12" lazy></el-tree>
  </div>
  
</template>

<script>
  // import { getoneThemeTree, gettwoThemeTree, getoneSectionTree, gettwoSectionTree, getListTree, getThemeGuide } from 'api/source';
  import { getVersionDataTree } from 'api/common';
  import { getCatalogueSection } from 'api/source';
  import codeTree from 'views/mixins/check/codeTree';
  export default {
    name: 'sourceTree',
    props: {
      catalogueId:{
        type: String,
        default:''
      },
      subjectId:{
        type: String,
        default:''
      },
      currentId:{
        type: String,
        default:''
      },
      lookAll:{
        type: String,
        default:'查看所有资源'
      },
      navitem:{
        type: Object,
        default:null
      },
      expandList:{
        type: Array,
        default:()=>{
          return [];
        }
      }
    },
    data() {
      return {
        matrialProps: {
          children: 'children',
          label: 'nodeName'
        },
        searchData:{
          textbookCode:null,
          groups:''
        },
        catalogueName:'',
        treeData:[],
        oneThemeData:[],
        orgId:this.$store.state.user.userInfo.orgId,
        orgType:this.$store.state.user.userInfo.orgType,
        expandTree:[],
        expandData:[],
        currentNode:'',
      }
    },
    mixins:[codeTree],
    watch: {
      subjectId() {
        this.searchData.textbookCode=this.subjectId;
        this.getOneTree();
      } ,
      expandList(){  
        this.expandData=[];
        this.expandTree=[];   
        this.currentNode='';   
        var s=this.expandList;
        this.$store.commit('SET_LOCALTREEDATA',s);
      },
      currentId(){
        if(this.currentId){
            this.currentNode = this.currentId;
        }
        this.expandData=this.expandList;
        this.expandTree=this.expandList;    
      },
      navitem(){
        this.$store.commit('SET_CURRENTSOURCE',this.navitem);
        this.$emit('changeCode',this.navitem, {});
      }
    },
    created() {  
      if(this.$route.query.catalogueId && this.$route.query.textBookCode){
        this.getExpandVersion(this.$route.query.textBookCode);
        this.expandData.push(this.$route.query.catalogueId);
      }else{
        if(this.$store.state.source.currentSource){
          this.currentNode = this.$store.state.source.currentSource.textbookCode;
          this.expandData = this.$store.state.source.localTreeData;
        }
        if(this.currentId){
          this.currentNode = this.currentId;
          this.expandData=this.expandList;
          this.expandTree=this.expandList;   
          this.$store.commit('SET_CURRENTSOURCE',this.navitem);
          this.$emit('changeCode',this.navitem, {}); 
        }
      }
      this.getOneTree();
    },       
    methods: {   
      findCatalogue() {
        getCatalogueSection({catalogueName:this.catalogueName,subjectId:this.subjectId}).then(res => {
          if(res && res.length > 0){
            this.getExpandVersion(res[0].sectionTextBookCode);
            this.expandData.push(res[0].sectionCatalogueId);
            this.currentNode = res[0].sectionCatalogueId;
            this.$store.commit('SET_LOCALTREEDATA',[].concat(this.expandData).reverse());
            this.getOneTree();
          }
        });
      },
      getExpandVersion(val) {
        this.expandData = [];
        var vm = this;
        var properties = ["edition","stage","subject"];
        this.expandData.push(this.filterCode(val,properties));
        properties.push("grade", "volume");
        this.expandData.push(this.filterCode(val,properties));
        properties.push("chapter");
        this.expandData.push(this.filterCode(val,properties));
        properties.push("section");
        this.expandData.push(this.filterCode(val,properties));
      },
      handleNodeClick(data,nodeData) {
        this.$store.commit('SET_CURRENTSOURCE',data);
        this.$emit('changeCode', data, nodeData);
      }, 
      allSource() {
        this.$store.commit('SET_CURRENTSOURCE',null);
        this.$emit('changeCode', {}, {});
      },
      expandNode(data,nodeData) {
        var treeData = [];
        treeData.push(nodeData.data);
        var t = nodeData.parent;
        while(t && t.level > 0){
          treeData.push(t.data);
          t = t.parent;
        }
        var s;
        s = treeData.map(function(item){
          return item.textbookCode;
        });
        this.$store.commit('SET_EXPANDTREEDATA',treeData);
        this.$store.commit('SET_LOCALTREEDATA',s);
      },
      getOneTree() {
        this.searchData.textbookCode=this.subjectId;
        this.searchData.groups = 'stage,subject';
        getVersionDataTree(this.searchData).then(res => {
          var vm = this;
          this.oneThemeData = [];
          res.forEach(function(s){
            s.type = 1;
            vm.oneThemeData.push(s);
          });
          this.expandTree = this.expandData;
          this.treeData = this.oneThemeData;
        });
      },
      loadNode(node, resolve) {
        // setTimeout(this.con,200);
        var nodeData = node.data;
        var data;
        var vm = this;
        this.searchData.textbookCode = nodeData.textbookCode;
        if(nodeData.type == 1){
          this.searchData.groups = 'grade,volume';
          getVersionDataTree(this.searchData).then(res => {
            var vm = this;
            this.oneThemeData = [];
            res.forEach(function(s){
              s.type = 2;
            });
            data = res;
            this.$nextTick(() => {
              this.con();
            });
            resolve(data);
          });
        }else if(nodeData.type == 2) {
          this.searchData.groups = 'chapter';
          getVersionDataTree(this.searchData).then(res => {
            var vm = this;
            this.oneThemeData = [];
            res.forEach(function(s){
              s.type = 3;
            });
            data = res;
            resolve(data);
            this.$nextTick(() => {
              this.con();
            });
          });
        }else if(nodeData.type == 3) {
          this.searchData.groups = 'section';
          getVersionDataTree(this.searchData).then(res => {
            var vm = this;
            this.oneThemeData = [];
            res.forEach(function(s){
              s.type = 4;
            });
            data = res;
            resolve(data);
            this.$nextTick(() => {
              this.con();
            });
          });
        }else if(nodeData.type == 4) {
          this.searchData.groups = 'experiment';
          getVersionDataTree(this.searchData).then(res => {
            var vm = this;
            this.oneThemeData = [];
            res.forEach(function(s){
              s.type = 5;
              s.textbookCode = s.standardCode;
            });
            data = res;
            const $this = this;
            this.$nextTick(function(){
              if($this.currentNode){
                $this.$refs.tree.setCurrentKey($this.currentNode);
              }
            });
            resolve(data);
            this.$nextTick(() => {
              this.con();
            });
          });
        }else{
          data = [];
          resolve(data);
        }
      },
      con(){
        var tit=$('span.el-tree-node__label');
        tit.each((index,e)=>{
          e.setAttribute("title",e.innerHTML);
        });
      }
    },
    mounted() { 
      if(this.subjectId.length>0){
        this.searchData.textbookCode=this.subjectId;
        this.getOneTree();
      } 
    }
  }
</script>
<style rel="stylesheet/scss" lang="less" scoped>
  .left-tree {
    top: 0;
  }
  .allSource {
    display: block;
    width: 100%;
    text-align: center;
    font-size: 12px;
    line-height: 24px;
    margin-bottom: 8px;
  }
</style>
