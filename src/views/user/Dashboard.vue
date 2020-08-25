<template>
    <div class="dashboard">
        <div v-if="currentUser && currentUser.uid" class="d-flex mb-3">
            <div class="ml-auto">
                <div>
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
