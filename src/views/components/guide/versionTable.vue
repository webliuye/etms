<template>
  <div class="versionTable">
    <el-table :data="tableData" fit highlight-current-row style="width: 100%">
      <el-table-column prop="name"  align="left" label="学段学科" min-width="180">
        <template slot-scope="scope">
          <a href='javascript:;' v-if="scope.row.stageId != 3" @click="goPreview(scope.row)" class="el-button--text">{{scope.row.stageName + scope.row.gradeName + scope.row.subjectName}}</a>
          <a href='javascript:;' v-if="scope.row.stageId == 3" @click="goPreview(scope.row)" class="el-button--text">{{scope.row.gradeName + scope.row.subjectName}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="editionName" align="left" label="教材版本" min-width="100"></el-table-column>
      <el-table-column prop="catalogueCount"  align="right" label="实验目录数" min-width="140"></el-table-column>
      <el-table-column prop="mustCount"  align="right" label="必做数" min-width="140"></el-table-column>
      <el-table-column prop="noMustCount"  align="right" label="选做数" min-width="140"></el-table-column>
      <el-table-column v-if="edit" align="center" label="操作" width="100">
        <template slot-scope="scope">
          <a href='javascript:;' @click="GuidesEdit(scope.row)" v-if="!publish" class="el-button--text" style="margin-right:0;">编辑</a>
          <span v-if="publish"  style="color:#ddd">编辑</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import { getPlansme } from 'api/booking';
    import {scrollTable} from 'utils/index'
    export default {
        name: 'versionTable',
        props: {
          tableData: {
            type: Array,
            default:[]
          },
          edit: {
            type: Boolean,
            default: false
          },
          publish: {
            type: Boolean,
            default: false
          }
        },
        data() {
            return {
              plan:'',
              planData:[]
            }
        },
        created() {
        },
        methods: {
          GuidesEdit(row){
            this.$store.commit('SET_PLANSELECT',null);
            this.$router.push({name:'GuidesEdit', params: {id: row.textbookCode, stageId: row.stageId, subjectId: row.subjectId, gradeId: row.gradeId, editionId: row.editionId}, query: row});
          },
          goPreview(row) {
            this.$emit('goPreview', row);
          }
        },
        mounted(){
          scrollTable('.versionTable')
        }
    }
</script>
