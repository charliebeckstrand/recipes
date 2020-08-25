<template>
    <div class="profile">
        
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'Profile',
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
