# Image Watermark Tool
Image Watermark Tool 是一个开源项目，用户可以在本地设备上给自己的图片（如身份证、驾照、护照等）添加水印，无需任何网络连接，并具有轻松的一键网站部署功能。
👉 [Image Watermark Tool](https://watermark.aicompasspro.com)

[English](https://github.com/unilei/image-watermark-tool/blob/master/README.EN.md) | 简体中文

## 快速开始

### 在 Vercel 上部署
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/unilei/image-watermark-tool.git&project-name=image-watermark-tool&repository-name=image-watermark-tool)

### 在 Vercel 上手动部署 操作方法

```
1. fork 本项目
2. 在 [Vercel] 官网点击 [New Project]
3. 点击 [Import Git Repository] 并选择你 fork 的此项目并点击 [import]
4. 然后直接点 [Deploy] 接着等部署完成即可
```

### 1. 克隆项目

```bash
git clone https://github.com/unilei/image-watermark-tool.git
```

### 2. 安装依赖
```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install
```
### 3. 运行到浏览器

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev
```

### 4. 在浏览器打开 [http://localhost:3001](http://localhost:3001)
![success_deploy.jpg](https://www.aicompasspro.com/api/imghosting/file/fddc13c78a10d7f841ac1.png)

#### 如何部署到自己服务器？ NUXT.JS 打包部署文档
[部署文档](https://nuxt.com/docs/getting-started/deployment)

### 如何通过 Docker 部署

### 1. 方式一
```bash
docker pull ghcr.io/chung1912/image-watermark-tool:master
```

```bash
docker run -it --name image-watermark-tool \
-p 3000:3000 \
--restart always \
ghcr.io/chung1912/image-watermark-tool:master
```

### 2. 方式二
```bash
docker pull ghcr.io/chung1912/image-watermark-tool-nginx:master
```

```bash
docker run -it --name image-watermark-tool-nginx \
-p 8080:80 \
-p 8443:443 \
-v /path/to/private.pem:/etc/nginx/private.pem  \
-v /path/to/private.key:/etc/nginx/private.key \
--restart always \
ghcr.io/chung1912/image-watermark-tool-nginx:master
```
