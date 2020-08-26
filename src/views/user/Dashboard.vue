<template>
    <div class="dashboard">
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
                <div class="ml-auto">
                    <router-link class="btn btn-success" :to="{name: 'CreateRecipe'}">
                        <font-awesome-icon :icon="['far', 'plus']" /> Create Recipe
                    </router-link>
                </div>
            </div>
        </div>



    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'Dashboard',
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
