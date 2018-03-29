<template>
<master-page title="实验开出统计">
    <div class="dashboard-container">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="科目统计" name="first">
          <keep-alive>
            <OpenCountSubject v-if="activeName=='first'"></OpenCountSubject>
          </keep-alive>
        </el-tab-pane>
        <el-tab-pane label="教师统计" name="second">
          <keep-alive>
            <OpenCountTeacher v-if="activeName=='second'"></OpenCountTeacher>
          </keep-alive>
        </el-tab-pane>
        <!-- <el-tab-pane label="学段统计" name="third"></el-tab-pane> -->
        <el-tab-pane label="班级统计" name="fourth">
          <keep-alive>
            <OpenCountClass v-if="activeName=='fourth'"></OpenCountClass>
          </keep-alive>
        </el-tab-pane>
        <el-tab-pane label="年度统计" name="five">
          <keep-alive>
            <OpenCountYears v-if="activeName=='five'"></OpenCountYears>
          </keep-alive>
        </el-tab-pane>
      </el-tabs>
      
      
      <!-- <OpenCountGrade v-if="activeName=='third'"></OpenCountGrade> -->
      
    </div>
    </master-page>
</template>

<script>
    import OpenCountSubject from './tabs/openCountSubject';
    import OpenCountTeacher from './tabs/openCountTeacher';
    // import OpenCountGrade from './tabs/openCountGrade';
    import OpenCountClass from './tabs/openCountClass';
    import OpenCountYears from './tabs/openCountYears';
    import MasterPage from 'views/layout/MasterPage';
    export default {
      name: 'openRecord',
      components: { MasterPage,OpenCountSubject, OpenCountTeacher, OpenCountClass, OpenCountYears},
      data() {
        return {
          activeName:'first'
        }
      },
      created() {
      },
      methods : {
        handleClick() {

        }
      }
    }
</script>
