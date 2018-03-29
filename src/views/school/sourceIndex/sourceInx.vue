//登录的资源首页1024
<template>
	<div>
		<div class="source-container">
			<SourceSubject @changeSubject="changeSubject" :subject="subjectId"></SourceSubject>
		</div>
		<SubjectSource v-if="subjectId != '0'" :subjectId="subjectId" :navData="navData"></SubjectSource>
		<IndexSource v-if="subjectId == '0'"></IndexSource>
	</div>
</template>

<script>
	import { mapGetters } from 'vuex';
	import SourceSubject from './sourceSubject/index';
	import SubjectSource from 'views/school/sourceIndex/subjectSrc';
	import IndexSource from 'views/school/sourceIndex/sIndex';
	export default {
		name : 'sourceIndex',
		components : { SourceSubject, SubjectSource, IndexSource},
		data () {
			return {
				sourceName:'',
				subjectId:'0',
				navData:null
			};
		},
		created () {
			if(this.$route.params.subjectId){
				this.subjectId=this.$route.params.subjectId;
			}else if(this.$store.state.commonData.sourceSubjectId){
				this.subjectId = this.$store.state.commonData.sourceSubjectId;
			}
			if(this.$route.params.navData&&this.$route.params.navData.length>0){
				this.navData=this.$route.params.navData;
			};

		},
		methods: {
			changeSubject(id) {
				this.subjectId = id;
			}
		},
		mounted() {
		}
	}
</script>
<style  rel="stylesheet/less" lang="less" scoped>
	.source-container {
		padding: 0;
		margin-bottom: 0;
	}
</style>
