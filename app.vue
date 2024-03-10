<template>
    <NuxtLayout>
        <NuxtPage></NuxtPage>
    </NuxtLayout>
</template>

<script setup>
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const nuxtApp = useNuxtApp()

for(const [key,component] of Object.entries(ElementPlusIconsVue)){
  nuxtApp.vueApp.component(key,component)
}

</script>
<style>
body{
    background-color: #fcfcfd;
    padding: 0;
    margin: 0 auto;
}

h1,h2,h3,h4,h5,h6{
    margin: 0;
    padding: 0;
}
</style>