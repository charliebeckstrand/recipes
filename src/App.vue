<template>
    <div id="app">
        <router-view name="navbar" />
        <router-view class="container pt-3 mb-5" />
    </div>
</template>

<script>
export default {
    name: 'App',

    components: {

    },

    data: () => ({

    }),
    mounted () {

    }
};
</script>

<style lang="scss" scoped>
#app {
    height: 100%;
}
</style>
