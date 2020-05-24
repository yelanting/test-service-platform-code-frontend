<template>
    <div id="app" name="fade">
        <router-view />
    </div>
</template>

<script>

import * as defaultSettings from './configs/settings'
export default {
    name: 'app',
    mounted () {
        document.title = defaultSettings.defaultPlatformTitle
    }
}
</script>

<style>
#app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    /* color: #2c3e50; */
    /* margin-top: 60px; */
}

.modal-open {
    overflow-y: scroll;
}

.container {
    padding-right: 15px !important;
}

body {
    padding-right: 15px !important;
}
</style>
