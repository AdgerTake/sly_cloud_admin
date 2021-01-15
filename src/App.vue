<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <router-view></router-view>
    </div>
  </a-config-provider>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import { mapMutations } from 'vuex'
export default {
  name: 'App',
  data() {
    return {
      isLoginView: '',
      locale: zhCN,
      timeout: null
    }
  },
  created() {
    sessionStorage.getItem('userInfo')?
    this.setUserInfo(JSON.parse(this.$CryptoJS.Decrypt(sessionStorage.getItem('userInfo'))))
    :''
    // document.addEventListener('mousemove', (e) => {
      // if(this.timeout !== null) clearTimeout(this.timeout)
      // this.timeout = setTimeout(() => {
        // this.handle(e)
      // }, 2000)
    // })
  },
  methods: {
    ...mapMutations(['setUserInfo']),
    handle(e) {
      this.$refs.ci.style.top = e.clientY+1 + 'px'
      this.$refs.ci.style.left = e.clientX+1 + 'px'
    }
  }
}
</script>

<style lang="scss">
html, body, div, span, h1, h2, h3, h4, h5, h6, p, a, big, em, img, samp, small, strong,
sub, sup, var, b, u, i, center, dl, dt, dd, ol, ul, li, form, label, legend, table,
caption, tbody, tfoot, thead, tr, th, td, article, aside, footer, header, hgroup, main,
menu, nav, output, section, summary, time, mark, audio, video, input {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
  text-decoration: none;
}
article, aside, details, figcaption, figure,
footer, header, hgroup, main, menu, nav, section {
  display: block;
}
th {
  font-weight: 700 !important;
}
*[hidden] {
  display: none;
}
body {
  line-height: 1;
  font-family: -apple-system, BlinkMacSystemFont,
    "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell",
    "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
}
ol, ul {
  list-style: none;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}
a:active {
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
  -webkit-user-select: none;
  -moz-user-focus: none;
  -moz-user-select: none;
}
a:focus {
  text-decoration: none !important;
}
#app {
  height: 100%;
}
p {
  margin: 0;
}
.ant-table-body {
  margin: 0 !important;
}
::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 8px;  /*高宽分别对应横竖滚动条的尺寸*/
  height: 8px;
  }
::-webkit-scrollbar-thumb  {
  /*滚动条里面小方块*/
  border-radius: 10px;
  box-shadow: inset  0  0  5px  rgba(53, 53, 53, 0.2);
  background:#ddd;
  }
::-webkit-scrollbar-track  {
  /*滚动条里面轨道*/
  // box-shadow: inset 0 0 5px rgba(0,  0,  0,  0.2);
  //  border-radius:  10px;
  background:#12162800;
  }
::-webkit-scrollbar-corner  {
  width: 0;
  background:#12162800;
}
.ci {
  position: fixed;
  top: 0;
  left: 0;
  display: block;
  width: 20px;
  height: 20px;
  background: #000;
}
.tab-btns {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  button {
    margin: 5px 5px 0;
    flex: 1;
    max-width: 100px;
  }
}
.tab-header {
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  .query {
    margin-left: 32px;
  }
  .header-left {
    display: flex;
    flex-wrap: wrap;
    .header-time {
      margin-right: 20px;
    }
    .item {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }
    .text-time {
      font-weight: bold;
      margin-right: 20px;
    }
  }
  .header-btn {
    display: flex;
    justify-content: flex-end;
    min-width: 230px;
    .item {
      display: flex;
      align-items: center;
    }
  }
}
.tab-footer {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  -moz-user-select:none;/*火狐*/
  -webkit-user-select:none;/*webkit浏览器*/
  -ms-user-select:none;/*IE10*/
  -khtml-user-select:none;/*早期浏览器*/
  user-select:none;
  >i {
    margin: 0 20px;
  }
  >u {
    min-width: 16px;
    display: inline-block;
    text-align: center;
  }
  .btn {
    border-radius: 50%;
    background: #ccc;
    height: 30px;
    width: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: no-drop;
  }
  .active {
    background: #40a9ff;
    cursor: pointer;
  }
}

.updata-img {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100px;
  min-height: 100px;
  background-color: #fafafa;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  color: rgba($color: #000000, $alpha: .65);
  cursor: pointer;
  padding: 5px;
  margin-right: 10px;
  >img {
    width: 100%;
  }
  .up {
    position: relative;
    z-index: 100;
  }
  .delete {
    display: none;
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 3px;
    color: rgb(247, 59, 59);
    border-radius: 100%;
    border: 2px solid rgb(247, 59, 59);
  }
  .vertical-align-top, .zoom-in {
    display: none;
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    margin: auto;
    z-index: 10;
    width: 20px;
    height: 20px;
    font-size: 20px;
    color: rgb(255, 255, 255);
    cursor: pointer;
  }
  .zoom-in {
    z-index: 100;
    cursor: pointer;
  }
}
.updata-img:hover {
  .delete {
    display: block;
  }
  .vertical-align-top {
    display: block;
  }
  .zoom-in {
    display: block;
  }
}
</style>
