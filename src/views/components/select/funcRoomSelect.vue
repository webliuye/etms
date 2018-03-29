<template>
          <el-select v-model="roomType" @change="getRoom" placeholder="请选择教室">
            <el-option value='' label="全部教室里类别"></el-option>
            <el-option
              v-for="(item,index)  in classRooms"
              :key="index"
              :label="item.label"
              :value="item.value" v-if="item.value != 1">
            </el-option>
          </el-select>
</template>

<script>
    import { mapGetters } from 'vuex';
    export default {
        name: 'funcRoomSelect',
         data() {
            return {
              roomType:''
            }
        },
        computed: {
          ...mapGetters([
            'classRooms'
          ])
        },
        created() {
          this.$store.dispatch('GetClassRooms').then(res => {
          });
        },       
        methods: {    
          getRoom() {
            this.$emit('changeRoom', this.roomType);
          }
        }  
    }
</script>
