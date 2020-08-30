<template>
    <div
        class="spinner"
    >
        <font-awesome-icon
            :icon="['fal', 'spinner-third']"
            :size="size"
            :style="{
                color: color
            }"
            spin
            fixed-width
        />
    </div>
</template>

<script>
export default {
    name: 'PageLoader',
    data: () => ({

    }),
    components: {

    },
    props: {
        color: String,
        size: String
    }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/_colors';
</style>
