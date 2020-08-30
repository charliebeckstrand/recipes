<template>
    <div class="user page">
        <router-view />
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'User',
    data: () => ({

    }),
    components: {

    },
    computed: {
        ...mapState({
            currentUser: state => state.user.user
        })
    },
    watch: {

    },
    directives: {

    },
    methods: {

    }
}
</script>

<style lang="scss" scoped>

</style>
