<script setup>
const canvas = ref(null)
const canvasImage = ref()
const fileObj = ref({
  name:'',
  type:''
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

const watermarkText = ref('仅供 xxx 验证使用')
const watermarkColor = ref('#0000ff')
const watermarkOpacity = ref(0.3)
const watermarkSpacing = ref(5)
const watermarkTextSize = ref(2)

const setWatermark = (ctx) => {
  const textSize = watermarkTextSize.value * Math.max(15, Math.min(canvas.value.width, canvas.value.height) / 25);

  ctx.font = `bold ${textSize}px -apple-system,"Helvetica Neue",Helvetica,Arial,"PingFang SC","Hiragino Sans GB","WenQuanYi Micro Hei",sans-serif`;
  ctx.fillStyle = watermarkColor.value;
  ctx.globalAlpha = watermarkOpacity.value;

  const textWidth = ctx.measureText(watermarkText.value).width;
  const textMargin = ctx.measureText('啊').width;

  const x = Math.ceil(canvas.value.width / (textWidth + textMargin));
  const y = Math.ceil(canvas.value.height / (watermarkSpacing.value * textSize));

  // 创建一个二维数组来记录每个区域是否已经绘制过水印文本
  const drawnAreas = Array.from({length: x + 1}, () => Array.from({length: y + 1}, () => false));
  // 保存当前绘图状态
  ctx.save();
  // 设置文字倾斜角度为30度
  ctx.rotate(45 * Math.PI / 180);

  for (let i = 0, k = 0; k <= x ; i = ++k) {
    for (let j = 0, l = -y; l < y ; j = ++l) {
      const xIndex = i;
      const yIndex = j + y;

      // 跳过已经绘制过的区域
      if (drawnAreas[xIndex][yIndex]) continue;

      ctx.fillText(watermarkText.value, (textWidth + textMargin) * i, watermarkSpacing.value * textSize * j);

      // 标记当前区域已经绘制过水印文本
      drawnAreas[xIndex][yIndex] = true;
    }
  }

  // 恢复之前保存的绘图状态
  ctx.restore();

  ctx.globalAlpha = 1; // 重置全局透明度
}
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
    <h1 class="text-center text-[22px] font-bold mt-[40px]">Image Watermark Tool </h1>
    <p class="text-center text-[22px]">图片水印打码工具</p>
    <p class="text-center text-[12px] font-bold text-red-600 bg-[#F4F01E] mt-[14px] p-[10px]">
      我们提供一种安全的方法，让您可以在本地设备上为您的图片添加水印，无需任何网络连接。这是保护您敏感证件（如身份证、驾照、护照等）隐私的理想选择。<br>
      We provide a secure method that allows you to add watermarks to your images locally on your device, without any network connection required. This is an ideal choice for protecting the privacy of your sensitive documents, such as ID cards, driver's licenses, passports, etc.
    </p>

    <div class="text-center mt-[40px]">
      <input type="file" accept="image/*" @change="onFileChange">
    </div>


    <div class="max-w-[520px] mx-auto mt-[40px] p-[10px]">
      <ul class="flex flex-col gap-[12px]">
        <li class="flex flex-row items-center gap-4">
          <label class="min-w-[70px] font-bold text-[12px]">水印文字</label>
          <el-input v-model="watermarkText" type="textarea" placeholder="请输入内容"
                    @change="waterMarkTextChange"></el-input>
        </li>
        <li class="flex flex-row items-center gap-4">
          <label class="min-w-[70px] font-bold text-[12px]">水印颜色</label>
          <el-color-picker v-model="watermarkColor" @change="waterMarkTextChange"></el-color-picker>
        </li>
        <li class="flex flex-row items-center gap-4">
          <label class="min-w-[70px] font-bold text-[12px]">水印透明度</label>
          <el-slider v-model="watermarkOpacity" :min="0" :max="1" :step="0.1" @change="waterMarkTextChange"></el-slider>
        </li>
        <li class="flex flex-row items-center gap-4">
          <label class="min-w-[70px] font-bold text-[12px]">水印间距</label>
          <el-slider v-model="watermarkSpacing" :min="1" :max="16" :step="0.5"
                     @change="waterMarkTextChange"></el-slider>
        </li>
        <li class="flex flex-row items-center gap-4">
          <label class="min-w-[70px] font-bold text-[12px]">水印大小</label>
          <el-slider v-model="watermarkTextSize" :min="0.1" :max="10" :step="0.1"
                     @change="waterMarkTextChange"></el-slider>
        </li>
      </ul>

    </div>

    <div class="max-w-[520px] w-full mx-auto my-[40px] p-[10px] text-center" v-show="canvasImage">
      <el-button type="primary" @click="handleDownload">Download</el-button>
    </div>

    <div class="text-center my-[40px] max-w-[520px]  w-full mx-auto p-[10px]" v-show="canvasImage">
      <canvas ref="canvas"></canvas>
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