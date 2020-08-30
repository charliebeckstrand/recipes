<template>
    <div
        class="badge border border-secondary text-secondary"
    >
    <!--         :class="{
                'bg-info': tag.tag == 'breakfast',
                'bg-primary': tag.tag == 'lunch',
                'bg-danger': tag.tag == 'dinner'
            }" -->
        {{tag.tag}}
    </div>
</template>

<script>
export default {
    name: 'Tag',
    data: () => ({

    }),
    components: {

    },
    props: {
        tag: Object
    }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/_colors';
</style>
