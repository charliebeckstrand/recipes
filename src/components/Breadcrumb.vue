<template>
    <div>
        <b-breadcrumb :items="breadcrumbItems" />
    </div>
</template>

<script>
export default {
    name: "breadcrumb",
    props: ['breadcrumbItems']
};
</script>
