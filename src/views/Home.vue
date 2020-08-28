<template>
    <div class="home">

    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'Home',
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

    },
    mounted () {

    }
}
</script>

<style lang="scss" scoped>

</style>
