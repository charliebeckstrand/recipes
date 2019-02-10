<template>
    <div id="app">
        <router-view />
    </div>
</template>

<style lang="scss">
html,
body {
    height: 100%;
}
.container > * + * {
    margin-top: 1rem;
}
#app {
    height: 100%;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
</style>
