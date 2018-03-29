<template>
	<div>
		<TeacherSup v-if="!powerLog"></TeacherSup>
		<TeacherEasy v-if="powerLog"></TeacherEasy>
	</div>
</template>

<script>
	import { mapGetters } from 'vuex'
	import TeacherSup from 'views/dashboard/default/teacherSup'
	import TeacherEasy from 'views/dashboard/default/teacherEasy'
	export default {
		components: {
      TeacherSup,
      TeacherEasy
    },
		data() {
			return {
			};
		},
		computed: {
	    ...mapGetters([
        'powerLog'
      ])
	  },
		created() {
		},
		methods: {
			
		}
	}
</script>
 <style lang="less" scoped>

</style>