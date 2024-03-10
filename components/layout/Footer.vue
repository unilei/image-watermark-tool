<template>
    <div class="mt-[200px]">
        <p class="font-mono text-[12px] text-center text-gray-400">
            AI导航专业版是一个专业的AI人工智能平台，提供最新、最全面的AI教程和工具。
        </p>
<!--      <div class="fixed top-0 bottom-0 left-0 right-0 mx-auto" id="myWidget"></div>-->
    </div>
</template>

<script setup>
function _turnstileCb() {
  console.debug('_turnstileCb called');

  turnstile.render('#myWidget', {
    sitekey: '0x4AAAAAAALa7gajkh0dOCQc',
    theme: 'light',
  });
}
onMounted(()=>{

})
</script>

<style scoped>
</style>
