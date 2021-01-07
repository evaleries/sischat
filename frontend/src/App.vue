<template>
    <div id="app">
        <div class="row">
            <div class="col-12 mt-2">
                <div v-if="alert.message" :class="`alert ${alert.type}`">{{alert.message}}</div>
            </div>
        </div>
        <router-view></router-view>
    </div>
</template>

<style scoped>
    #app {
        overflow-x: hidden;
    }
</style>

<script>
export default {
    name: 'app',
    computed: {
        alert () {
            return this.$store.state.alert
        }
    },
    watch:{
        $route (to, from){
            this.$store.dispatch('alert/clear');
        }
    } 
};
</script>
