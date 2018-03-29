<template>
	<master-page title="班级设置">
		<div class="filter-container">
			<ManageClass v-if="manageBoolean"></ManageClass>
			<TeacherClass v-if="techerBoolean"></TeacherClass>
		</div>
	</master-page>
</template>
<script>
	import MasterPage from 'views/layout/MasterPage';
	import ManageClass from 'views/school/classManage/schoolClassManage';
	import TeacherClass from 'views/school/classManage/teacherClass';
	export default {
		name: 'manageClassIndex',
		components: { MasterPage, ManageClass, TeacherClass},
		data() {
			return {
				techerBoolean:false,
				manageBoolean:false,
				roleCode: this.$store.state.user.userInfo.roleCode
			};
		},
		created() {
			if(this.roleCode == '304'){
        this.techerBoolean = true;
      }else{
        this.manageBoolean = true;
      }
		},
		methods: {
		}
	}
</script>
