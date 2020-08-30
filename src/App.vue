<template>
    <div id="app">
        <router-view name="navbar" />
        <router-view class="container" />
    </div>
</template>

<script>
export default {
    name: 'App',
    data: () => ({

    }),
    components: {

    }
};
</script>

<style lang="scss" scoped>
#app {
    height: 100%;
}
</style>
