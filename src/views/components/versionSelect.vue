<template>
	<div>
    <el-select v-model="formData.versionValue" placeholder="请选择" class="selectwidth" @change="changeVersion">
      <el-option
        v-for="(item,index)  in versionData"
        :key="index"
        :label="item.nodeName"
        :value="item.textbookCode">
      </el-option>
    </el-select>
    <el-select v-model="formData.gradeTerm" placeholder="请选择" class="selectwidth" @change="changeGradeTerm">
      <el-option
        v-for="(item,index)  in gradeTermData"
        :key="index"
        :label="item.nodeName"
        :value="item.textbookCode">
      </el-option>
    </el-select>
    <el-select v-model="formData.oneThemeId" placeholder="请选择" class="selectwidth" @change="changeOneTheme">
      <el-option
        v-for="(item,index)  in oneThemeData"
        :key="index"
        :label="item.nodeName"
        :value="item.textbookCode">
      </el-option>
    </el-select>
    <el-select v-model="formData.twoThemeId" placeholder="请选择" class="selectwidth" @change="changeTwoTheme">
      <el-option
        v-for="(item,index)  in twoThemeData"
        :key="index"
        :label="item.nodeName"
        :value="item.textbookCode">
      </el-option>
    </el-select>
    <el-select v-model="formData.catalogueId" placeholder="请选择" class="selectwidth" @change="changeCatalogueId">
      <el-option
        v-for="(item,index)  in idData"
        :key="index"
        :label="item.nodeName"
        :value="item.standardCode">
      </el-option>
    </el-select>
    <!-- <el-cascader
      :options="versionData"
      @active-item-change="handleItemChange"
      :props="props"
    ></el-cascader> -->
  </div>
</template>

<script>
	import { getVersionDataTree } from 'api/common';
	export default {
		data() {
			return {
        props: {
          label: 'nodeName',
          value: 'textbookCode',
          children: 'versions'
        },
				formData: {
					versionValue:'',   //版本科目
          gradeTerm:'',   //年级学期
          oneThemeId:'',   //一级主题
          twoThemeId:'',  //二级主题
          catalogueId:'', //实验目录
				},
				searchData:{
          textbookCode:null,
          groups:''
        },
				versionData:[],
        gradeTermData:[],
        oneThemeData:[],
        twoThemeData:[],
        idData:[],
        defaultGrade:false,  //判断首次加载不清空年级学期
        defaultOneTheme:false,
        defaultTwoTheme:false,
        defaultcatalogueId:false,
        queryData:{
          versionValue:'',   //版本科目
          gradeTerm:'',   //年级学期
          oneThemeId:'',   //一级主题
          twoThemeId:'',  //二级主题
          catalogueId:''
        }
			}
		},
		created() {
			var vm = this;
      vm.searchData.groups = 'stage,subject';
      if(this.$route.params.isEdit && this.$route.params.isEdit !== 'false'){
        if(!this.$route.params.catalogueId || !this.$route.params.textbookCode){
          this.$message({
            message: '编辑失败,缺失catalogueId',
            type: 'warning'
          });
          this.$route.go(-1);
        }else{
          this.queryData.catalogueId = this.$route.params.catalogueId;
          this.getVersion(this.$route.params.textbookCode);
        }
      }else{
        var defaultData = [].concat(this.$store.state.source.localTreeData).reverse();
        defaultData.forEach(function(s,t){
          if(t == 0){
            vm.queryData.versionValue = s;
          }else if(t == 1){
            vm.queryData.gradeTerm = s;
            vm.defaultGrade = true;
          }else if(t == 2){
            vm.queryData.oneThemeId = s;
            vm.defaultOneTheme = true;
          }else if(t == 3){
            vm.queryData.twoThemeId = s;
            vm.defaultTwoTheme = true;
          }else if(t == 4){
            vm.queryData.catalogueId = s;
            vm.defaultcatalogueId = true;
          }
        });

        getVersionDataTree(vm.searchData).then(res => {
          res.forEach(function(s){
            s.versions = [];
          });
          vm.versionData = res;
          vm.formData.versionValue = vm.queryData.versionValue;
          vm.changeVersion();
        });
      }
		},
		methods: {
      handleItemChange(val){
        console.log(val);
      },
      getVersion(val) {
        var vm = this;
        var properties = ["edition","stage","subject"];
        this.queryData.versionValue = this.filterCode(val,properties);
        properties.push("grade", "volume");
        this.queryData.gradeTerm = this.filterCode(val,properties);
        properties.push("chapter");
        this.queryData.oneThemeId = this.filterCode(val,properties);
        properties.push("section");
        this.queryData.twoThemeId = this.filterCode(val,properties);
        this.defaultGrade = true;
        this.defaultOneTheme = true;
        this.defaultTwoTheme = true;
        this.defaultcatalogueId = true;
        getVersionDataTree(vm.searchData).then(res => {
          vm.versionData = res;
          vm.formData.versionValue = vm.queryData.versionValue;
          vm.changeVersion();
        });
      },
      populate(_this, obj) {
        for (let k in _this){
          if (obj.hasOwnProperty(k)){
            _this[k] = obj[k];
          }
        }
        return _this;
      },
      pad(num, size) {
        let s = String(num);
        while (s.length < (size || 2)) {
            s = "0" + s;
        }
        return s;
      },
      mergeCode(opt) {
        opt = this.populate({
          edition: null,
          stage: null,
          subject: null,
          grade: null,
          term: null,
          volume: null,
          chapter: null,
          section: null
        }, opt);
        let code = '0000';
        for (let k in opt) {
          code += opt[k] ? this.pad(opt[k], 2) : '00';
        }
        return code;
      },
      filterCode(code, properties) {
        var pos = {
          //edition: 4,
          stage: 6,
          subject: 8,
          grade: 10,
          term: 12,
          volume: 14,
          chapter: 16,
          section: 18
        };
        code = (code || '00000000000000000000') && this.pad(code, 20);
        let opt = {};
        for(let k in properties){
          opt[properties[k]] = code[pos[properties[k]]] + code[pos[properties[k]]+1];
        }
        return this.mergeCode(opt);
      },
			changeVersion() {
				var vm = this;
        this.gradeTermData = [];
        this.formData.gradeTerm = '';
        var data1 = {};
        data1.groups = 'grade,volume';
        data1.textbookCode = this.formData.versionValue;
        if(!this.formData.versionValue){
          this.gradeTermData = [];
          this.changeGradeTerm();
          return;
        }
        getVersionDataTree(data1).then(res => {
          vm.gradeTermData = res;
          if(vm.defaultGrade){
          	if(this.queryData.gradeTerm){
              this.formData.gradeTerm = this.queryData.gradeTerm;
              vm.changeGradeTerm();
            }
          	vm.defaultGrade = false;
          }else{
            vm.changeGradeTerm();
          }
        });
			},
			changeGradeTerm() {
				var vm = this;
        this.oneThemeData = [];
        this.formData.oneThemeId = '';
        var data2 = {};
        data2.groups = 'chapter';
        data2.textbookCode = this.formData.gradeTerm;
        if(!this.formData.gradeTerm){
          this.oneThemeData = [];
          this.changeOneTheme();
          return;
        }
        getVersionDataTree(data2).then(res => {
          vm.oneThemeData = res;
          if(vm.defaultOneTheme){
            if(this.queryData.oneThemeId){
              this.formData.oneThemeId = this.queryData.oneThemeId;
              vm.changeOneTheme();
            }
          	vm.defaultOneTheme = false;
          }else{
            vm.changeOneTheme();
          }
        });
			},
			changeOneTheme() {
				var vm = this;
				this.twoThemeData = [];
        this.formData.twoThemeId = '';
        var data3 = {};
        data3.groups = 'section';
        data3.textbookCode = this.formData.oneThemeId;
        if(!this.formData.oneThemeId){
          this.twoThemeData = [];
          this.changeTwoTheme();
          return;
        }
        getVersionDataTree(data3).then(res => {
          vm.twoThemeData = res;
          if(vm.defaultTwoTheme){
          	if(this.queryData.twoThemeId){
              this.formData.twoThemeId = this.queryData.twoThemeId;
              vm.changeTwoTheme();
            }
          	vm.defaultTwoTheme = false;
          }else{
            vm.changeTwoTheme();
          }
        });
			},
			changeTwoTheme() {
				var vm = this;
				this.idData = [];
        this.formData.catalogueId = '';
        var data4 = {};
        data4.groups = 'experiment';
        data4.textbookCode = this.formData.twoThemeId;
        if(!this.formData.twoThemeId){
          this.idData = [];
          this.changeCatalogueId()
          return;
        }
        getVersionDataTree(data4).then(res => {
        	this.idData = res;
        	if(this.defaultcatalogueId){
            this.formData.catalogueId = this.queryData.catalogueId;
            this.changeCatalogueId();
            this.defaultcatalogueId = false;
          }else{
            this.changeCatalogueId();
          }
        });
			},
			changeCatalogueId(){
				this.$emit('changeCatalogue', this.formData.catalogueId);
			}
		}
	}
</script>

