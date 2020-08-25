<template>
    <div id="app">
        <router-view name="navbar" />
        <router-view class="container py-3" />
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

</style>
