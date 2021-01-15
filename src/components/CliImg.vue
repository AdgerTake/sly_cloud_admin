
<template>
  <div class="vue-box" @click="click">
    <img :src="imgUrl" alt="" id="img" v-show="false">
    <input type="file" class="file" ref="input" accept="image/png,image/jpg,image/jpeg" @change="change($event)" :disabled="disabled">
  </div>
</template>
<script>
import Cropper from 'cropperjs'
import { mapMutations } from 'vuex'
import { message } from 'ant-design-vue'
import { uploadFile } from '@/https'
export default {
  props: {
    // 定义的宽高比
    widthRate: {
      type: Number,
      default: 1,
    },
    // 定义的宽高比
    heightRate: {
      type: Number,
      default: 1
    },
    imgUrl: {
      type: String,
      default: function() {
        return ''
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    imgSize: {
      type: Number,
      default: 2
    },
  },
  data() {
    return {
    }
  },
  beforeDestroy() {
    this.destoried();
  },
  methods: {
    ...mapMutations(['setImgUrl']),
    click() {
      this.$refs.input.click()
    },
    change(event) {
      if (event.target.files[0].size / 1024 / 1024 > this.imgSize) {
        message.warning(`图片不能大于${this.imgSize}M`)
      } else {
        let image = document.getElementById('img'); //预览对象
        this.clip(event, {
          resultObj: image,
          aspectWithRatio: Number(this.widthRate),
          aspectHeightRatio: Number(this.heightRate)
        })
      }
    },
    //初始化方法
    initilize(opt) {
      let self = this;
      this.options = opt;
      //创建dom
      this.createElement();
      this.resultObj = opt.resultObj;
      //初始化裁剪对象
      this.cropper = new Cropper(this.preview, {
        aspectRatio: opt.aspectWithRatio / opt.aspectHeightRatio,
        // aspectRatio: 1/1,
        autoCropArea: opt.autoCropArea || 0.8,
        viewMode: 2,
        guides: true,
        cropBoxResizable: true, //是否通过拖动来调整剪裁框的大小
        cropBoxMovable: true, //是否通过拖拽来移动剪裁框。
        dragCrop: false,
        dragMode: "move",//‘crop’: 可以产生一个新的裁剪框3 ‘move’: 只可以移动3 ‘none’: 什么也不处理
        zoomOnTouch: true,//是否可以通过拖动触摸来放大图像。
        scalable: true,
        // minCropBoxHeight: 750,
        // minCropBoxWidth: 750,
        background: false,
        checkOrientation: true,
        checkCrossOrigin: true,
        zoomable: false,
        zoomOnWheel: false,
        center: false,
        toggleDragModeOnDblclick: false,
        ready: function() {
          // console.log(self.cropper.rotate(90))
          if (opt.aspectRatio == 'Free') {
            let cropBox = self.cropper.cropBox;
            cropBox.querySelector('span.cropper-view-box').style.outline = 'none';
            self.cropper.disable();
          }
        }
      });
    },
    //创建一些必要的DOM，用于图片裁剪
    createElement() {
      //初始化图片为空对象
      this.preview = null;
      let str = '<div><img id="clip_image" src="originUrl"></div><button type="button" id="cancel_clip">取 消</button><button type="button" id="clip_button">确 定</button>';
      str += '<div class="crop_loading"><div class="crop_content"><div class="crop_text">图片修剪中...</div></div></div>';
      str += '<div class="crop_success"><div class="crop_success_text">上传成功</div></div></div>';

      let body = document.getElementsByTagName('body')[0];
      this.reagion = document.createElement('div');
      this.reagion.id = 'clip_container';
      this.reagion.className = 'container';
      this.reagion.innerHTML = str;
      //添加创建好的DOM元素
      body.appendChild(this.reagion);
      this.preview = document.getElementById('clip_image');

      //绑定一些方法
      this.initFunction();
    },
    //初始化一些函数绑定
    initFunction() {
      let self = this;
      this.clickBtn = document.getElementById('clip_button');
      this.cancelBtn = document.getElementById('cancel_clip');
      //确定事件
      this.addEvent(this.clickBtn, 'click', function() {
        self.crop();
      })
      //取消事件
      this.addEvent(this.cancelBtn, 'click', function() {
        self.destoried();
      })
      //清空input的值
      this.addEvent(this.fileObj, 'click', function() {
        this.value = '';
      })
    },
    //外部接口，用于input['file']对象change时的调用
    clip(e, opt) {
      this.fileObj = e.srcElement;
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) return false; //不是图片直接返回
      //调用初始化方法
      this.initilize(opt);
      //获取图片文件资源
      this.picValue = files[0];
      //去获取拍照时的信息，解决拍出来的照片旋转问题
      // Exif.getData( files[0] , function(){
      //   self.Orientation = Exif.getTag( files[0], 'Orientation');
      //   console.log(self.Orientation)
      // });
      //调用方法转成url格式
      this.originUrl = this.getObjectURL(this.picValue);
      //每次替换图片要重新得到新的url
      if (this.cropper) {
        this.cropper.replace(this.originUrl);
      }
    },
    //图片转码方法
    getObjectURL(file) {
      let url = null;
      if (window.createObjectURL != undefined) { // basic
        url = window.createObjectURL(file);
      } else if (window.URL != undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file);
      } else if (window.webkitURL != undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
      }
      return url;
    },
    //点击确定进行裁剪
    crop() {
      let self = this;
      let image = new Image();
      let croppedCanvas;
      let roundedCanvas;
      // Crop
      document.querySelector('.crop_loading').style.display = 'block'
      setTimeout(function() {
        croppedCanvas = self.cropper.getCroppedCanvas()
        // Round
        roundedCanvas = self.getRoundedCanvas(croppedCanvas)
        let imgData = roundedCanvas.toDataURL()
        image.src = imgData;
        //判断图片是否大于100k,不大于直接上传，反之压缩
        if (imgData.length < (100 * 1024)) {
          self.resultObj.src = imgData
          //图片上传
          self.postImg(imgData)
        } else {
          image.onload = function() {
            //压缩处理
            let data = self.compress(image, self.Orientation);
            self.resultObj.src = data;
            //图片上传
            self.postImg(data);
          }
        }
      }, 20)
    },
    //获取裁剪图片资源
    getRoundedCanvas(sourceCanvas) {
      let canvas = document.createElement('canvas');
      let context = canvas.getContext('2d');
      let width = sourceCanvas.width;
      let height = sourceCanvas.height;
      canvas.width = width;
      canvas.height = height;
      context.imageSmoothingEnabled = true;
      context.drawImage(sourceCanvas, 0, 0, width, height);
      context.globalCompositeOperation = 'destination-in';
      context.beginPath();
      context.rect(0, 0, width, height);
      context.fill();
      return canvas;
    },
    //销毁原来的对象
    destoried() {
      //移除事件
      this.clickBtn?this.removeEvent(this.clickBtn, 'click', null):''
      this.cancelBtn?this.removeEvent(this.cancelBtn, 'click', null):''
      this.fileObj?this.removeEvent(this.fileObj, 'click', null):''
      //移除裁剪框
      this.reagion && this.reagion.parentNode?this.reagion.parentNode.removeChild(this.reagion):''
      //销毁裁剪对象
      this.cropper?this.cropper.destroy():''
      this.cropper = null
    },
    //图片上传
    postImg(imageData) {
      console.log(imageData)
      this.getImage(imageData)
        .then(res => {
          var arr = res.split(','),
          mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]),
          n = bstr.length,
          u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          console.log(mime)
          let c = new File([u8arr], 'file.'+mime.split('/')[1], { type: mime });
          this.getuploadimgs(c, imageData)
        })
      // var arr = a.split(';'),
      // mime = arr[0].match(/:(.*?);/)[1],
      // bstr = atob(arr[1]),
      // n = bstr.length,
      // u8arr = new Uint8Array(n);
      // while (n--) {
      //   u8arr[n] = bstr.charCodeAt(n);
      // }
      // console.log(mime)
      // let c = new File([u8arr], 'file', { type: mime });
      // console.log(c)
      // this.$emit('callback', imageData)
      // console.log(object);
      // this.getuploadimgs(c)
      //这边写图片的上传
      // self.destoried();
      // window.setTimeout( function () {
      //   document.querySelector('.crop_loading').style.display = 'none';
      //   document.querySelector('.crop_success').style.display = 'block';
      //   //裁剪完后摧毁对象
      //     self.destoried();
      // },3000)
    },
    //图片旋转
    rotateImg(img, direction, canvas) {
      //最小与最大旋转方向，图片旋转4次后回到原方向
      const min_step = 0;
      const max_step = 3;
      if (img == null) return;
      //img的高度和宽度不能在img元素隐藏后获取，否则会出错
      let height = img.height;
      let width = img.width;
      let step = 2;
      if (step == null) {
        step = min_step;
      }
      if (direction == 'right') {
        step++;
        //旋转到原位置，即超过最大值
        step > max_step && (step = min_step);
      } else {
        step--;
        step < min_step && (step = max_step);
      }
      //旋转角度以弧度值为参数
      let degree = step * 90 * Math.PI / 180;
      let ctx = canvas.getContext('2d');
      switch (step) {
        case 0:
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0);
          break;
        case 1:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(degree);
          ctx.drawImage(img, 0, -height);
          break;
        case 2:
          canvas.width = width;
          canvas.height = height;
          ctx.rotate(degree);
          ctx.drawImage(img, -width, -height);
          break;
        case 3:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(degree);
          ctx.drawImage(img, -width, 0);
          break;
      }
    },
    //图片压缩
    compress(img, Orientation) {
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext('2d');
      //瓦片canvas
      let tCanvas = document.createElement("canvas");
      let tctx = tCanvas.getContext("2d");
      let initSize = img.src.length;
      let width = img.width;
      let height = img.height;
      //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
      let ratio;
      if ((ratio = width * height / 4000000) > 1) {
        console.log("大于400万像素")
        ratio = Math.sqrt(ratio);
        width /= ratio;
        height /= ratio;
      } else {
        ratio = 1;
      }
      canvas.width = width;
      canvas.height = height;
      //        铺底色
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      //如果图片像素大于100万则使用瓦片绘制
      let count;
      if ((count = width * height / 1000000) > 1) {
        count = ~~(Math.sqrt(count) + 1); //计算要分成多少块瓦片
        //            计算每块瓦片的宽和高
        let nw = ~~(width / count);
        let nh = ~~(height / count);
        tCanvas.width = nw;
        tCanvas.height = nh;
        for (let i = 0; i < count; i++) {
          for (let j = 0; j < count; j++) {
            tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);
            ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
          }
        }
      } else {
        ctx.drawImage(img, 0, 0, width, height);
      }
      //修复ios上传图片的时候 被旋转的问题
      if (Orientation != "" && Orientation != 1) {
        switch (Orientation) {
          case 6: //需要顺时针（向左）90度旋转
            this.rotateImg(img, 'left', canvas);
            break;
          case 8: //需要逆时针（向右）90度旋转
            this.rotateImg(img, 'right', canvas);
            break;
          case 3: //需要180度旋转
            this.rotateImg(img, 'right', canvas); //转两次
            this.rotateImg(img, 'right', canvas);
            break;
        }
      }
      //进行最小压缩
      // let ndata = canvas.toDataURL( 'image/jpeg' , 0.7);
      let ndata = canvas.toDataURL('image/png', 0.8);
      console.log('压缩前：' + initSize);
      console.log('压缩后：' + ndata.length);
      console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + "%");
      tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
      return ndata;
    },
    //添加事件
    addEvent(obj, type, fn) {
      if (obj.addEventListener) {
        obj.addEventListener(type, fn, false);
      } else {
        obj.attachEvent('on' + type, fn);
      }
    },
    //移除事件
    removeEvent(obj, type, fn) {
      if (obj.removeEventListener) {
        obj.removeEventListener(type, fn, false);
      } else {
        obj.detachEvent('on' + type, fn);
      }
    },
    //上传图片的方法
    getuploadimgs(file) {
      var form = new FormData()
      form.append('file', file)
      //执行提交方法
      console.log(file.size)
      console.log(form)
      uploadFile(form)
        .then(res => {
          this.destoried()
          this.setImgUrl(res.imgUrl)
        })
    },
    getImage(src) {
      return new Promise((resolve) => {
        var img = new Image()
        img.src = src
        img.onload = () => {
          // 缩放图片需要的canvas
          var canvas = document.createElement('canvas')
          var context = canvas.getContext('2d')
          // 图片原始尺寸
          var originWidth = img.width
          var originHeight = img.height
          // 最大尺寸限制，可通过国设置宽高来实现图片压缩程度
          var maxWidth = 1000,
            maxHeight = 1000;
          // 目标尺寸
          var targetWidth = originWidth,
            targetHeight = originHeight;
          // 图片尺寸超过400x400的限制
          if (originWidth > maxWidth || originHeight > maxHeight) {
            if (originWidth / originHeight > maxWidth / maxHeight) {
              // 更宽，按照宽度限定尺寸
              targetWidth = maxWidth;
              targetHeight = Math.round(maxWidth * (originHeight / originWidth));
            } else {
              targetHeight = maxHeight;
              targetWidth = Math.round(maxHeight * (originWidth / originHeight));
            }
          }
          // canvas对图片进行缩放
          canvas.width = targetWidth
          canvas.height = targetHeight
          // 清除画布
          context.clearRect(0, 0, targetWidth, targetHeight)
          // 图片压缩
          context.drawImage(img, 0, 0, targetWidth, targetHeight)
          /*第一个参数是创建的img对象；第二个参数是左上角坐标，后面两个是画布区域宽高*/
          //压缩后的图片base64 url
          /*canvas.toDataURL(mimeType, qualityArgument),mimeType 默认值是'image/jpeg';
          * qualityArgument表示导出的图片质量，只要导出为jpg和webp格式的时候此参数才有效果，默认值是0.92*/
          var url = canvas.toDataURL('image/jpeg', 0.92) //base64 格式
          resolve(url)
        }
      })
    },
  }
}
</script>
<style lang="scss">
.vue-box {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  z-index: 99;
}
.vue-box .file {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  top: 0;
  left: 0;
  display: none;
}
.vue-box .file button {
  background: #000;
}
input {
  -webkit-tap-highlight-color: rgba(255,0,0,0);
}
#clip_button {
  position: absolute;
  right: 10%;
  bottom: 20px;
  width: 80px;
  height: 40px;
  border: none;
  border-radius: 4px;
  background: #1890ff;
  color: #fff;
  font-size: 15px;
}
#cancel_clip {
  position: absolute;
  left: 10%;
  bottom: 20px;
  width: 80px;
  height: 40px;
  border: none;
  border-radius: 4px;
  color: #fff;
  background: #ff4d4f;
  font-size: 15px;
}
#cancel_clip:focus {
  outline: none;
}
#clip_button:focus {
  outline: none;
}
#clip_container.container {
  z-index: 99999;
  position: fixed;
  padding-top: 60px;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 100%;
  height:100%;
  background: #fff;
  // border: 6px solid rgb(63, 63, 63);
  border-radius: 8px;
}
#clip_container.container>div {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
#clip_image {
  max-width: 100%;
}
.cropper-container {
  font-size: 0;
  line-height: 0;
  position: relative;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  direction: ltr;
  -ms-touch-action: none;
  touch-action: none
}
.crop_loading,
.crop_success {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9;
}
.crop_loading .crop_content {
  position: absolute;
  top: 50%;
  left: 50%;
  text-align: center;
  background: #000;
  opacity: 0.9;
  width: 120px;
  height: 30px;
  vertical-align: middle;
  color: #fff;
  /* padding-top: 20px; */
  font-size: 16px;
  -webkit-border-radius: 4px;
  border-radius: 4px;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
}
.crop_size .crop_content {
  width: 190px;
}
.crop_loading .crop_content img {
  margin-top: 15px;
  margin-bottom: 10px;
}
.crop_success .crop_success_text {
  position: absolute;
  top: 50%;
  left: 50%;
  text-align: center;
  background: #000;
  opacity: 0.9;
  width: 120px;
  height: 30px;
  color: #fff;
  line-height: 30px;
  font-size: 16px;
  -webkit-border-radius: 4px;
  border-radius: 4px;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
.cropper-container img {
  /* Avoid margin top issue (Occur only when margin-top <= -height) */
  display: block;
  min-width: 0 !important;
  max-width: none !important;
  min-height: 0 !important;
  max-height: none !important;
  width: 100%;
  height: 100%;
  image-orientation: 0deg
}
.cropper-wrap-box,
.cropper-canvas,
.cropper-drag-box,
.cropper-crop-box,
.cropper-modal {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
.cropper-wrap-box {
  overflow: hidden;
}
.cropper-drag-box {
  opacity: 0;
  background-color: #fff;
}
.cropper-modal {
  opacity: .5;
  background-color: #000;
}
.cropper-view-box {
  display: block;
  overflow: hidden;
  width: 100%;
  height: 100%;
  outline: 1px solid #39f;
  outline-color: rgba(51, 153, 255, 0.75);
}
.cropper-dashed {
  position: absolute;
  display: block;
  opacity: .5;
  border: 0 dashed #eee
}
.cropper-dashed.dashed-h {
  top: 33.33333%;
  left: 0;
  width: 100%;
  height: 33.33333%;
  border-top-width: 1px;
  border-bottom-width: 1px
}
.cropper-dashed.dashed-v {
  top: 0;
  left: 33.33333%;
  width: 33.33333%;
  height: 100%;
  border-right-width: 1px;
  border-left-width: 1px
}
.cropper-center {
  position: absolute;
  top: 50%;
  left: 50%;
  display: block;
  width: 0;
  height: 0;
  opacity: .75
}
.cropper-center:before,
.cropper-center:after {
  position: absolute;
  display: block;
  content: ' ';
  background-color: #eee
}
.cropper-center:before {
  top: 0;
  left: -3px;
  width: 7px;
  height: 1px
}
.cropper-center:after {
  top: -3px;
  left: 0;
  width: 1px;
  height: 7px
}
.cropper-face,
.cropper-line,
.cropper-point {
  position: absolute;
  display: block;
  width: 100%;
  height: 100%;
  opacity: .1;
}
.cropper-face {
  top: 0;
  left: 0;
  background-color: #fff;
}
.cropper-line {
  background-color: #39f
}
.cropper-line.line-e {
  top: 0;
  right: -3px;
  width: 5px;
  cursor: e-resize
}
.cropper-line.line-n {
  top: -3px;
  left: 0;
  height: 5px;
  cursor: n-resize
}
.cropper-line.line-w {
  top: 0;
  left: -3px;
  width: 5px;
  cursor: w-resize
}
.cropper-line.line-s {
  bottom: -3px;
  left: 0;
  height: 5px;
  cursor: s-resize
}
.cropper-point {
  width: 5px;
  height: 5px;
  opacity: .75;
  background-color: #39f
}
.cropper-point.point-e {
  top: 50%;
  right: -3px;
  margin-top: -3px;
  cursor: e-resize
}
.cropper-point.point-n {
  top: -3px;
  left: 50%;
  margin-left: -3px;
  cursor: n-resize
}
.cropper-point.point-w {
  top: 50%;
  left: -3px;
  margin-top: -3px;
  cursor: w-resize
}
.cropper-point.point-s {
  bottom: -3px;
  left: 50%;
  margin-left: -3px;
  cursor: s-resize
}
.cropper-point.point-ne {
  top: -3px;
  right: -3px;
  cursor: ne-resize
}
.cropper-point.point-nw {
  top: -3px;
  left: -3px;
  cursor: nw-resize
}
.cropper-point.point-sw {
  bottom: -3px;
  left: -3px;
  cursor: sw-resize
}
.cropper-point.point-se {
  right: -3px;
  bottom: -3px;
  width: 20px;
  height: 20px;
  cursor: se-resize;
  opacity: 1
}
@media (min-width: 768px) {
  .cropper-point.point-se {
    width: 15px;
    height: 15px
  }
}
@media (min-width: 992px) {
  .cropper-point.point-se {
    width: 10px;
    height: 10px
  }
}
@media (min-width: 1200px) {
  .cropper-point.point-se {
    width: 5px;
    height: 5px;
    opacity: .75
  }
}
.cropper-point.point-se:before {
  position: absolute;
  right: -50%;
  bottom: -50%;
  display: block;
  width: 200%;
  height: 200%;
  content: ' ';
  opacity: 0;
  background-color: #39f
}
.cropper-invisible {
  opacity: 0;
}
.cropper-bg {
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC');
}
.cropper-hide {
  position: absolute;
  display: block;
  width: 0;
  height: 0;
}
.cropper-hidden {
  display: none !important;
}
.cropper-move {
  cursor: move;
}
.cropper-crop {
  cursor: crosshair;
}
.cropper-disabled .cropper-drag-box,
.cropper-disabled .cropper-face,
.cropper-disabled .cropper-line,
.cropper-disabled .cropper-point {
  cursor: not-allowed;
}
</style>