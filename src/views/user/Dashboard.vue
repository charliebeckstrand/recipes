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
                <div class="ml-auto">
                    
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
