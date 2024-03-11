<script setup>
const {locale, locales, setLocale} = useI18n()

const availableLocales = computed(() => {
  return (locales.value).filter(i => i.code !== locale.value)
})
const switchLocalePath = useSwitchLocalePath()

const canvas = ref(null)
const canvasImage = ref()
const fileObj = ref({
  name: '',
  type: ''
})
const onFileChange = (event) => {
  const file = event.target.files[0]
  const ctx = canvas.value.getContext('2d')

  if (!file) return

  fileObj.value.name = file.name
  fileObj.value.type = file.type

  const reader = new FileReader()
  reader.onload = function (event) {
    canvasImage.value = new Image();
    canvasImage.value.onload = function () {
      // 清除画布
      // ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);

      canvas.value.width = canvasImage.value.width
      canvas.value.height = canvasImage.value.height

      // 将上传的图片绘制到Canvas上
      ctx.drawImage(canvasImage.value, 0, 0, canvas.value.width, canvas.value.height);
      // 添加水印
      setWatermark(ctx)
    };
    canvasImage.value.src = event.target.result;
  };

  reader.readAsDataURL(file)
}

const watermarkText = ref(locale.value === 'cn' ? '仅供 xxx 验证使用' : 'Only for xxx verification use')
const watermarkColor = ref('#0000ff')
const watermarkOpacity = ref(0.3)
const watermarkSpacing = ref(5)
const watermarkTextSize = ref(2)
const watermarkAngle = ref(30)

const setWatermark = (ctx) => {
  const lines = watermarkText.value.split('\n');
  const textSize = watermarkTextSize.value * Math.max(15, Math.min(canvas.value.width, canvas.value.height) / 25);

  ctx.font = `bold ${textSize}px -apple-system,"Helvetica Neue",Helvetica,Arial,"PingFang SC","Hiragino Sans GB","WenQuanYi Micro Hei",sans-serif`;
  ctx.fillStyle = watermarkColor.value;
  ctx.globalAlpha = watermarkOpacity.value;

  // 保存当前绘图状态
  ctx.save();
  // 设置文字倾斜角度
  ctx.rotate(watermarkAngle.value * Math.PI / 180);

  lines.forEach((line, lineIndex) => {
    const textWidth = ctx.measureText(line).width;
    const textHeight = textSize; // 估算文字高度
    const textMargin = ctx.measureText('啊').width;
    // 计算每行文字的高度，包括行间距
    const lineHeight = textSize + watermarkSpacing.value * textSize;

    const x = Math.ceil(canvas.value.width / (textWidth + textMargin));
    const y = Math.ceil(canvas.value.height / (watermarkSpacing.value * textHeight));

// 计算绘制文本的 y 坐标，考虑行索引和行高
    const startY = lineHeight * lineIndex;

    for (let i = 0; i < x; i++) {
      for (let j = -y; j < y; j++) {
        // 计算绘制文本的y坐标，考虑行间距和行索引
        const yPos = startY + j * watermarkSpacing.value * textHeight;

        ctx.fillText(line, (textWidth + textMargin) * i, yPos);
      }
    }
  });

  // 恢复之前保存的绘图状态
  ctx.restore();

  ctx.globalAlpha = 1; // 重置全局透明度
};

const handleDownload = () => {
  // 保存图片
  const dataURL = canvas.value.toDataURL();
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = fileObj.value.name || 'image.png';
  link.click();
  link.remove();
}

const waterMarkTextChange = () => {
  if (!canvasImage.value) return;

  const ctx = canvas.value.getContext('2d');

  // 清除画布
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);

  // 将上传的图片绘制到Canvas上
  ctx.drawImage(canvasImage.value, 0, 0, canvas.value.width, canvas.value.height);

  // 添加水印
  setWatermark(ctx);

  ctx.globalAlpha = 1; // 重置全局透明度
}

</script>

<template>
  <div>
    <p class="text-center p-[10px] sm:p-[0] sm:h-[40px] sm:leading-[40px] text-[12px] font-bold text-white bg-[#5d5cde]">
      {{ $t('yourImageWillNotBeSentToAnyServer') }}
    </p>

    <div class="flex flex-col sm:flex-row">
      <div class="bg-[#8881] p-[20px] sm:h-[calc(100vh-40px)] w-full sm:w-[520px] overflow-y-auto relative">
        <div class="sm:h-[calc(100vh-180px)] sm:overflow-y-auto">
          <NuxtLink v-for="locale in availableLocales" :key="locale.code" :to="switchLocalePath(locale.code)">
            🌐 {{ locale.name }}
          </NuxtLink>

          <h1 class="text-[22px] font-bold my-[20px]">
            {{ $t('websiteName') }}
            <nuxt-link class="text-[12px] text-red-500"
                       href="https://github.com/unilei/image-watermark-tool.git" target="_blank">
              Github
            </nuxt-link>
          </h1>
          <ul class="flex flex-col gap-[12px]">
            <li class="flex flex-col gap-1">
              <label class="min-w-[70px] font-bold text-[12px]">{{ $t('watermarkText') }}</label>
              <el-input v-model="watermarkText" type="textarea" placeholder="请输入内容"
                        @change="waterMarkTextChange"></el-input>
            </li>
            <li class="flex flex-col  gap-1">
              <label class="min-w-[70px] font-bold text-[12px]">{{ $t('watermarkColor') }}</label>
              <client-only>
                <el-color-picker v-model="watermarkColor" @change="waterMarkTextChange"></el-color-picker>
              </client-only>
            </li>
            <li class="flex flex-col  gap-1">
              <label class="min-w-[70px] font-bold text-[12px]">{{ $t('watermarkOpacity') }}</label>
              <client-only>
                <el-slider
                    v-model="watermarkOpacity" :min="0" :max="1" :step="0.1"
                    @change="waterMarkTextChange">
                </el-slider>
              </client-only>
            </li>
            <li class="flex flex-col  gap-1">
              <label class="min-w-[70px] font-bold text-[12px]">{{ $t('watermarkSpacing') }}</label>
              <client-only>
                <el-slider v-model="watermarkSpacing" :min="1" :max="16" :step="0.5"
                           @change="waterMarkTextChange"></el-slider>
              </client-only>
            </li>
            <li class="flex flex-col gap-1">
              <label class="min-w-[70px] font-bold text-[12px]">{{ $t('watermarkSize') }}</label>
              <client-only>
                <el-slider v-model="watermarkTextSize" :min="0.1" :max="10" :step="0.1"
                           @change="waterMarkTextChange"></el-slider>
              </client-only>
            </li>
            <li class="flex flex-col gap-1">
              <label class="min-w-[70px] font-bold text-[12px]">{{ $t('watermarkAngle') }}</label>
              <client-only>
                <el-slider v-model="watermarkAngle" :min="0" :max="90" :step="1"
                           @change="waterMarkTextChange"></el-slider>
              </client-only>
            </li>
          </ul>
        </div>
        <p class="hidden sm:block h-[120px] absolute bottom-0 left-0 right-0 w-full text-center text-[12px] font-semibold text-[#666] p-[10px]">
          {{ $t('websiteDesc') }}
        </p>
      </div>
      <div class="bg-[#8881] sm:bg-white p-[20px] sm:h-[calc(100vh-40px)] w-full sm:overflow-y-auto">

        <h1 class="hidden sm:block text-center text-[22px] font-bold mt-[40px]">
          {{ $t('websiteName') }}

          <nuxt-link class="text-[12px] text-red-500"
                     href="https://github.com/unilei/image-watermark-tool.git" target="_blank">
            Github
          </nuxt-link>
        </h1>

        <div class="text-center mt-[14px] sm:mt-[40px]">
          <input type="file" accept="image/*" @change="onFileChange">
        </div>


        <div class="max-w-[520px] w-full mx-auto my-[12px] sm:my-[40px] p-[10px] text-center" v-show="canvasImage">
          <el-button type="primary" @click="handleDownload">{{ $t('download') }}</el-button>
        </div>

        <div class="text-center my-[40px] max-w-[520px]  w-full mx-auto p-[10px]" v-show="canvasImage">
          <canvas ref="canvas"></canvas>
        </div>
      </div>

    </div>


  </div>
</template>

<style scoped>
canvas {
  box-sizing: border-box;
  width: 100%;
  border: 1px dashed #AAA;
  border-radius: 8px;
}
</style>