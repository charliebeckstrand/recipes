<template>
    <div class="home">

    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'Home',
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

    },
    data: () => ({

    }),
    mounted () {

    }
}
</script>

<style lang="scss" scoped>

</style>
