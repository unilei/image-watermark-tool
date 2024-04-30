<script setup>
const {locale, locales, setLocale} = useI18n()
// import imageCompression from "browser-image-compression";

const availableLocales = computed(() => {
  return (locales.value).filter(i => i.code !== locale.value)
})
const switchLocalePath = useSwitchLocalePath()

const repeatTextStatus = ref(true)
const singleXPos = ref(0)
const singleYPos = ref(0)
const singleInitStatus = ref(true)
const multiInitStatus = ref(true)

const canvas = ref(null)
const canvasImage = ref()
const fileObj = ref({
  name: '',
  type: ''
})
const fileObject = ref({})
const onFileChange = (event) => {
  const file = event.target.files[0]
  const ctx = canvas.value.getContext('2d')

  if (!file) return

  fileObject.value = file
  if (repeatTextStatus.value) {
    multiInitStatus.value = true
  } else {
    singleInitStatus.value = true
  }

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
const watermarkSingleAngle = ref(0)

const setWatermark = (ctx) => {
  const lines = watermarkText.value.split('\n');
  const textSize = watermarkTextSize.value * Math.max(15, Math.min(canvas.value.width, canvas.value.height) / 25);

  ctx.font = `bold ${textSize}px -apple-system,"Helvetica Neue",Helvetica,Arial,"PingFang SC","Hiragino Sans GB","WenQuanYi Micro Hei",sans-serif`;
  ctx.fillStyle = watermarkColor.value;
  ctx.globalAlpha = watermarkOpacity.value;

  // 保存当前绘图状态
  ctx.save();

  //当水印是铺满图片场景下
  if (repeatTextStatus.value) {
    if (multiInitStatus.value) {
      multiInitStatus.value = false
      watermarkAngle.value = 30
    }
    // 设置文字倾斜角度
    ctx.rotate(watermarkAngle.value * Math.PI / 180);

    lines.forEach((line, lineIndex) => {
      const textWidth = ctx.measureText(line).width;
      const textHeight = textSize; // 估算文字高度
      const textMargin = ctx.measureText('哈').width;
      // 计算每行文字的高度，包括行间距
      const lineHeight = textSize + watermarkSpacing.value * textSize;

      // 计算水印的宽度
      const diagonalLength = Math.sqrt(canvas.value.width ** 2 + canvas.value.height ** 2);
      const x = Math.ceil(diagonalLength / (textWidth + textMargin));
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
    })
  } else {
    if (singleInitStatus.value) {
      watermarkSingleAngle.value = 0
    }
    ctx.rotate(watermarkSingleAngle.value * Math.PI / 180);
    // 当水印不是铺满图片场景下
    lines.forEach((line, lineIndex) => {

      if (singleInitStatus.value) {
        singleInitStatus.value = false
        singleXPos.value = Math.ceil((canvas.value.width - ctx.measureText(line).width) / 2)
        singleYPos.value = Math.ceil((canvas.value.height - textSize) / 2)
      }

      // 计算绘制文本的 y 坐标，考虑行索引和行高
      const startY = textSize * lineIndex + singleYPos.value;

      ctx.fillText(line, singleXPos.value, startY);
    })

  }

  // 恢复之前保存的绘图状态
  ctx.restore();

  ctx.globalAlpha = 1; // 重置全局透明度
};
const downloadLoading = ref(false)
const handleDownload = () => {
  if (!canvas.value) return;

  downloadPercentStatus.value = true
  downloadLoading.value = true;

  setTimeout(() => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', canvas.value.toDataURL());
    xhr.responseType = 'blob';

    xhr.onloadstart = () => {
      // downloadLoading.value = true;
    };

    xhr.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;
        // 更新进度条
        updateProgressBar(percentComplete);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const link = document.createElement('a');
        const blob = new Blob([xhr.response], {type: fileObject.value.type});
        const url = URL.createObjectURL(blob);

        link.href = url;
        link.download = fileObj.value.name || 'image.png';
        link.click();

        URL.revokeObjectURL(url);
        link.remove();
      }
    };

    xhr.onloadend = () => {
      downloadLoading.value = false;
      // 重置进度条
      resetProgressBar();
    };

    xhr.send();
  }, 500)

};

const downloadPercentStatus = ref(false)
const downloadPercentComplete = ref(0);
const updateProgressBar = (percentComplete) => {
  // 更新进度条的显示
  // 你可以根据下载进度来更新你的进度条的样式或长度等
  downloadPercentComplete.value = percentComplete;
};

const resetProgressBar = () => {
  // 重置进度条的显示
  // 可能是隐藏进度条或将进度条长度重置为初始状态等
  setTimeout(() => {
    downloadPercentStatus.value = false;
    downloadPercentComplete.value = 0;
  }, 3000)
};

const handleDownload1 = () => {
  if (!canvas.value) return
  downloadLoading.value = true
  setTimeout(() => {
    // 保存图片
    const dataURL = canvas.value.toDataURL();
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = fileObj.value.name || 'image.png';
    link.click();
    link.remove();
    downloadLoading.value = false
  }, 2000)
}

const waterMarkColorChange = (e) => {
  watermarkColor.value = e
  waterMarkTextChange()
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
const repeatStatusChange = (e) => {
  repeatTextStatus.value = e
  if (repeatTextStatus.value) {
    multiInitStatus.value = true
  } else {
    singleInitStatus.value = true
  }
  if (!canvasImage.value) return;
  waterMarkTextChange()
}
</script>

<template>
  <div>
    <p class="text-center p-[10px] sm:p-[0] sm:h-[40px] sm:leading-[40px] text-[12px] font-bold text-white bg-[#5d5cde]">
      {{ $t('yourImageWillNotBeSentToAnyServer') }}
    </p>

    <div class="flex flex-col sm:flex-row">
      <div class="bg-[#8881] sm:h-[calc(100vh-40px)] w-full sm:w-[520px] overflow-y-auto relative">
        <div class="sm:h-[calc(100vh-180px)] sm:overflow-y-auto">
          <div class="p-[20px]">
            <NuxtLink v-for="locale in availableLocales" :key="locale.code" :to="switchLocalePath(locale.code)">
              🌐 {{ locale.name }}
            </NuxtLink>
            <h1 class="text-[22px] font-bold my-[20px] flex gap-1 flex-row items-center ">
              {{ $t('websiteName') }}
              <nuxt-link class="text-[12px] text-red-500"
                         href="https://github.com/unilei/image-watermark-tool.git" target="_blank">
<!--                <Icon name="uil:github" color="black" size="24"/>-->
                <img style="width: 24px;height: 24px;" src="@/assets/icon/mdi--github.svg" alt="github">
              </nuxt-link>
            </h1>
          </div>

          <ul class="flex flex-col gap-[12px]">
            <li class="flex flex-col gap-1  px-[20px] ">
              <label class="min-w-[70px] font-bold text-[12px]">
                {{ $t('imageFullyCoveredTheWatermark') }}
              </label>
              <el-switch v-model="repeatTextStatus"
                         style="--el-switch-on-color: #5d5cde; --el-switch-off-color: #ff4949"
                         @change="repeatStatusChange"
              >

              </el-switch>
            </li>
            <li class="flex flex-col gap-1  px-[20px] ">
              <label class="min-w-[70px] font-bold text-[12px]">{{ $t('watermarkText') }}</label>
              <el-input v-model="watermarkText" type="textarea" placeholder="请输入内容"
                        @change="waterMarkTextChange"></el-input>
            </li>
            <li class="flex flex-col  px-[20px]   gap-1">
              <label class="min-w-[70px] font-bold text-[12px]">{{ $t('watermarkColor') }}</label>
              <client-only>
                <el-color-picker v-model="watermarkColor" @active-change="waterMarkColorChange"></el-color-picker>
              </client-only>
            </li>
            <li class="flex flex-col  px-[20px]  gap-1">
              <label class="min-w-[70px] font-bold text-[12px]">{{ $t('watermarkOpacity') }}</label>
              <client-only>
                <el-slider
                    v-model="watermarkOpacity" :min="0" :max="1" :step="0.1"
                    @change="waterMarkTextChange">
                </el-slider>
              </client-only>
            </li>
            <li class="flex flex-col px-[20px]  gap-1" v-if="repeatTextStatus">
              <label class="min-w-[70px] font-bold text-[12px]">{{ $t('watermarkSpacing') }}</label>
              <client-only>
                <el-slider v-model="watermarkSpacing" :min="1" :max="16" :step="0.5"
                           @change="waterMarkTextChange"></el-slider>
              </client-only>
            </li>
            <li class="flex flex-col  px-[20px]  gap-1">
              <label class="min-w-[70px] font-bold text-[12px]">{{ $t('watermarkSize') }}</label>
              <client-only>
                <el-slider v-model="watermarkTextSize" :min="0.1" :max="10" :step="0.1"
                           @change="waterMarkTextChange"></el-slider>
              </client-only>
            </li>
            <li class="flex flex-col  px-[20px]  gap-1" v-if="repeatTextStatus">
              <label class="min-w-[70px] font-bold text-[12px]">{{ $t('watermarkAngle') }}</label>
              <client-only>
                <el-slider v-model="watermarkAngle" :min="0" :max="90" :step="1"
                           @change="waterMarkTextChange"></el-slider>
              </client-only>
            </li>
            <li class="flex flex-col  px-[20px]  gap-1" v-if="!repeatTextStatus">
              <label class="min-w-[70px] font-bold text-[12px]">{{ $t('watermarkAngle') }}</label>
              <client-only>
                <el-slider v-model="watermarkSingleAngle" :min="-90" :max="90" :step="1"
                           @change="waterMarkTextChange"></el-slider>
              </client-only>
            </li>
            <li class="flex flex-col  px-[20px]  gap-1" v-if="!repeatTextStatus">
              <label class="min-w-[70px] font-bold text-[12px]">{{ $t('watermarkleftright') }}</label>
              <client-only>
                <el-slider v-model="singleXPos" :min="0" :max="canvas.width" :step="1"
                           @change="waterMarkTextChange"></el-slider>
              </client-only>
            </li>
            <li class="flex flex-col  px-[20px]  gap-1" v-if="!repeatTextStatus">
              <label class="min-w-[70px] font-bold text-[12px]">{{ $t('watermarktopbottom') }}</label>
              <client-only>
                <el-slider v-model="singleYPos" :min="0" :max="canvas.height" :step="1"
                           @change="waterMarkTextChange"></el-slider>
              </client-only>
            </li>
          </ul>
        </div>
        <p class="hidden sm:block h-[120px] absolute bottom-0 left-0 right-0 w-full text-[12px] font-semibold text-[#666] p-[10px]">
          <Icon name="emojione-v1:circled-information-source"></Icon>
          {{ $t('websiteDesc') }}
        </p>
      </div>
      <div class="bg-[#8881] sm:bg-white p-[20px] sm:h-[calc(100vh-40px)] w-full sm:overflow-y-auto">

        <h1 class="hidden sm:flex text-center text-[22px] font-bold mt-[40px] sm:gap-1 sm:flex-row sm:items-center sm:justify-center">
          {{ $t('websiteName') }}

          <nuxt-link class="text-[12px] text-red-500"
                     href="https://github.com/unilei/image-watermark-tool.git" target="_blank">
            <img style="width: 24px;height: 24px;" src="@/assets/icon/mdi--github.svg" alt="github">
          </nuxt-link>
        </h1>

        <div class="text-center mt-[14px] sm:mt-[40px]">
          <input type="file" accept="image/*" @change="onFileChange">
        </div>


        <div class="max-w-[520px] w-full mx-auto my-[12px] sm:my-[40px] p-[10px] text-center" v-show="canvasImage">
          <el-button :loading="downloadLoading"
                     color="#5d5cde" type="primary"
                     @click="handleDownload">
            {{ $t('download') }}
          </el-button>
          <el-progress class="mt-3"
                       v-if="downloadPercentStatus"
                       :percentage="downloadPercentComplete"
                       color="#5d5cde"
          />
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

:deep(.el-slider) {
  --el-slider-main-bg-color: #5d5cde;
}
</style>