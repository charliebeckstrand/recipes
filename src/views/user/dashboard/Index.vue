<template>
    <div class="dashboard page">
        <div
            v-sticky="{
                zIndex: 11,
                stickyTop: 0
            }"
            class="bg-white py-3 sticky-title"
        >
            <div class="d-flex align-items-center">
                <div>
                    <h1
                        class="font-weight-bold mb-0"
                    >
                        Dashboard
                    </h1>
                </div>
            </div>
        </div>

        <b-nav
            class="mb-3"
            tabs
        >
            <b-nav-item
                :to="{
                    path: '/dashboard/my-recipes'
                }"
            >
                My Recipes
            </b-nav-item>
          </b-nav>

        <router-view />
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'UserDashboard',
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
