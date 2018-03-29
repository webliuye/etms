<template>
    <transition name="fade" mode="out-in">
        <router-view :key="key"></router-view>
    </transition>
</template>
<script>
    export default {
        computed: {
            key() {
                return this.$route.name !== undefined
                            ? this.$route.name + new Date()
                            : this.$route + new Date()
            }
        }
    }
</script>