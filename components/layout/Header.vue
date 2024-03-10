<template>
  <div class="  flex flex-row items-center justify-between top-0 bg-slate-200/50 px-[120px] py-[10px] gap-[20px]">
    <div @click="goHome()">
      <h1 class="font-mono text-center text-[22px] font-bold text-orange-600 cursor-pointer">
        AI指南专业版
      </h1>
      <div  class="font-mono text-[12px] text-orange-600 cursor-pointer">aicompasspro.com</div>
    </div>

  </div>

</template>

<script setup>
const router = useRouter()
const goHome = () => {
  router.push('/')
}
</script>

<style scoped>

</style>