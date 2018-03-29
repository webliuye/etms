<template>
	<master-page title="目录标准管理">
		<div class="filter-container">
      <p class="version">请选择教材版本</p>
      <div class="version-div">
        <el-row :gutter="24">
          <el-col :span="8"  v-for="(item,index)  in versionData" :key="index" class="version-version">
            <p>{{item.name}}</p>
            <div  v-for="items in item.subjects" :key="items.code">
              <div class="version-select version-subject">
                <span class="fl"><strong>* {{items.name}}</strong></span>
                <div class="fr selectstyle">
                  <el-select v-model="items.setAllVersion" size="small" placeholder="全部设置为" clearable @change="setAllVersion(items)">
                    <el-option
                      v-for="itemVersion in items.selectOptions"
                      :key="itemVersion.code"
                      :label="itemVersion.name"
                      :value="itemVersion.code">
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div class="version-select" v-for="itemGrade in items.grades" :key="itemGrade.code">
                <span class="fl">{{itemGrade.name}}</span>
                <div class="fr selectstyle">
                  <el-select v-model="itemGrade.self.code" size="small" placeholder="请选择版本" clearable @change="changeVersion(items,itemGrade)">
                    <el-option
                      v-for="itemVersion in items.selectOptions"
                      :key="itemVersion.code"
                      :label="itemVersion.name"
                      :value="itemVersion.code">
                    </el-option>
                  </el-select>
                </div>
              </div>
            </div>
          </el-col>
          <!-- <el-col :span="8">
            <p>初中</p>
            <div v-for="(item,index)  in versionData" v-if="item.learningperiodId == 2" class="version-select">
              <span class="fl">{{item.subjectName}}</span>
              <div class="fr selectstyle">
                <span v-if="item.state == 1">{{item.editionName}}</span>
                <el-select v-if="item.state != 1" v-model="item.editionId" size="small">
                  <el-option
                    v-for="items in item.editionVoList"
                    :key="items.editionId"
                    :label="items.editionName"
                    :value="items.editionId">
                  </el-option>
                </el-select>
              </div>
            </div>
          </el-col>
          <el-col :span="8">
            <p>高中</p>
            <div v-for="(item,index)  in versionData" v-if="item.learningperiodId == 3" class="version-select">
              <span class="fl">{{item.subjectName}}</span>
              <div class="fr selectstyle">
                <span v-if="item.state == 1">{{item.editionName}}</span>
                <el-select v-if="item.state != 1" v-model="item.editionId" size="small">
                  <el-option
                    v-for="items in item.editionVoList"
                    :key="items.editionId"
                    :label="items.editionName"
                    :value="items.editionId">
                  </el-option>
                </el-select>
              </div>
            </div>
          </el-col> -->
        </el-row>
      </div>
      <div class="search-select">
        <el-button type="primary" @click="postVersion"class="fr" :loading="loading">确 定</el-button>
      </div>
		</div>
</master-page>
</template>

<script>
    import store from 'store';
    import MasterPage from '../layout/MasterPage';
    import {getGuidesVersion, postGuidesVersion, getVersion, setVersion} from 'api/guides';
    export default {
        components: {
            MasterPage
        },
        data() {
          return {
            loading:false,
            versionData: [],
            formData:{
              'voList':[]
            }
          }
        },
        created() {
          getVersion().then(res => {
            if(res && res.length > 0){
              res.forEach(function(u){
                u.subjects.forEach(function(v){
                  v.setAllVersion = '';
                  v.grades.forEach(function(w){
                    w.preventBlooean = false;
                    if(w.parent && !w.self){
                      w.self = {};
                      w.self.code = w.parent[0].code;
                      w.self.name = w.parent[0].name;
                    }else if(!w.parent && !w.self){
                      w.self = {};
                      w.self.code = '';
                      w.self.name = '';
                    }
                  });
                })
              });
              this.versionData = res;
            }
          });
          // getGuidesVersion().then(res => {
          //   // res.subjectMaterialVos.forEach(function(item){
          //   //   if(!item.edition){
          //   //     item.edition = "1";
          //   //   }
          //   //   item.learningperiod = item.learningperiodId;
          //   //   item.subject = item.subjectId;
          //   // });
          //   res.forEach(function(item){
          //     if(item.editionVoList.length == 0){
          //       item.editionId = '';
          //     }
          //   });
          //   this.versionData = res;
          // });
        },
        methods: {
          setAllVersion(items){
            if(!items.setAllVersion){
              return;
            }
            items.grades.forEach(function(s){
              s.self.code = items.setAllVersion;
              s.preventBlooean = true;
            });
          },
          changeVersion(items,itemGrade){
            if(itemGrade.preventBlooean){
              itemGrade.preventBlooean = false;
              return;
            }else{
              items.setAllVersion = '';
            }
          },
          postVersion() {
            //var versionData = this.versionData
            if(this.loading){
              return;
            }
            this.loading = true;
            var vm = this;
            var versionData = [];
            versionData = JSON.parse(JSON.stringify(this.versionData));
            console.log(versionData);
            versionData.forEach(function(u){
              u.subjects.forEach(function(v){
                v.grades.forEach(function(w){
                  // if(w.self.code && w.parent && w.self.code == w.parent.code){
                  //   w.self = null;
                  // }else
                  if(w.self.code){
                    var t = v.selectOptions.filter(function(x){
                      return w.self.code == x.code;
                    });
                    if(t.length > 0){
                      w.self.name = t[0].name;
                    }
                  }else{
                    w.self = null;
                  }
                });
              });
            });
            setVersion(versionData).then(res => {
              vm.loading = false;
              vm.$router.push({ name: 'Guides' });
            }).catch(error => {
              vm.loading = false;
            });
            // var array = this.versionData.filter(function(item){
            //   return item.editionId;
            // });
            // if(array.length == 0){
            //   this.$message('请联系客服关联版本');
            //   return;
            // }
            // this.formData.voList = this.versionData.filter(function(item){
            //   if(item.state != 1){
            //     item.edition = item.editionId;
            //     item.subject = item.subjectId;
            //     item.learningperiod = item.learningperiodId;
            //   }
            //   return (item.state != 1) && item.edition;
            // });
            // var vm = this;
            // if(this.formData.voList.length == 0){
            //   vm.$router.push({ name: 'Guides' });
            // }else{
            //   postGuidesVersion(this.formData).then(res => {
            //     vm.$router.push({ name: 'Guides' });
            //   });
            // }
          }
        }
    }
</script>
<style type="text/css" scoped>
  .version {
    font-size: 14px;
    line-height: 42px;
    margin: 0;
    border-bottom: 1px solid #e0e0e0;
    width: 100%;
  }
  .version-div {
    margin-top: 16px;
    padding: 0;
    min-height: 100%;
  }
  .version-div p {
    width: 100%;
    height: 42px;
    padding-left: 24px;
    font-size: 14px;
    line-height: 42px;
    background-color: #dddddd;
    color: #9a9a9a;
    border: 1px solid #e0e0e0;
    margin: 0;
  }
  .version-select {
    width: 100%;
    height: 42px;
    border: 1px solid #e0e0e0;
    border-left:1px solid #c0c0c0;
    border-right:1px solid #c0c0c0;
    border-bottom: none;
    padding: 0 24px;
  }
  .version-version .version-select:last-child {
    border-bottom: 1px solid #c0c0c0;
  }
  .version-select.version-subject {

  }
  .version-grade {
    border: 1px dashed #e0e0e0;
  }
  .version-select span {
    font-size: 12px;
    line-height: 42px;
    color: #333;
  }
  .selectstyle {
    width: 156px;
    margin-top: 6px;
    text-align: right;
  }
  .selectstyle input {
    font-size: 12px;
  }
  .selectstyle span {
    line-height: 30px;
  }
  .search-select {
    padding-right: 24px;
    margin-top: 16px;
  }
</style>
