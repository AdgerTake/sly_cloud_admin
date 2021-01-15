<template>
  <div class="cash_ex">
    <a-card :loading="isDataLoading" :bordered="false">
      <header class="tab-header">
        <div class="header-left">
          <div class="header-time item">
            <span class="text-time">状态:</span>
            <a-select style="width: 120px;" v-model="status">
              <a-select-option :value="10">
                全部
              </a-select-option>
              <a-select-option :value="1">
                启用
              </a-select-option>
              <a-select-option :value="2">
                禁用
              </a-select-option>
            </a-select>
            <a-button type="primary" style="margin-left: 20px" @click="queryData" :loading="tableLoading">查询</a-button>
          </div>
        </div>
        <div class="header-btn item">
          <a-button-group>
            <!-- <a-button
              type="primary"
              @click="ToDoExcel()"
              :loading="tableLoading"
              
            >导出文件</a-button> -->
            <a-button type="primary" @click="showModal(1)" :loading="tableLoading" v-if="$getRule('y1$p3$b1$t1')">新增</a-button>
            <a-button type="primary" icon="sync" @click="Refresh" :loading="tableLoading"></a-button>
          </a-button-group>
        </div>
      </header>
      <a-table :columns="columns" :dataSource="dataSource" bordered :pagination="false" size="middle" :loading="tableLoading" :rowKey="(record) => record.id">
        <template slot-scope="active" slot="img">
          <img :src="active" alt="" style="width: 100px;">
        </template>
        <template slot-scope="active" slot="active">
          <div class="tab-btns">
            <a-button type="primary" @click="showModal(2, active)" v-if="$getRule('y1$p3$b1$c2')">详情</a-button>
            <a-button type="primary" @click="showModal(3, active)" v-if="$getRule('y1$p3$b1$b3')">编辑</a-button>
            <a-button type="danger" @click="delData(active)" v-if="$getRule('y1$p3$b1$s4')">删除</a-button>
          </div>
        </template>
      </a-table>
      <footer class="tab-footer">
        <span :class="pageNum !== 1? ['active btn']:'btn'" @click="goPrev(pageNum !== 1)">
          <a-icon type="left" style="color: #fff;font-size: 18px;border: 2px solid #fff;border-radius: 50%;padding: 2px;" />
        </span>
        <i>
          第<u>{{pageNum}}</u>页
        </i>
        <a-select default-value="20" @change="handleChange" style="margin-right: 20px;">
          <a-select-option value="20">
            20条/页
          </a-select-option>
          <a-select-option value="50">
            50条/页
          </a-select-option>
          <a-select-option value="100">
            100条/页
          </a-select-option>
          <a-select-option value="200">
            200条/页
          </a-select-option>
          <a-select-option value="500">
            500条/页
          </a-select-option>
        </a-select>
        <span :class="dataSource.length === pageList? ['active btn']:'btn'" @click="goNext(dataSource.length ===  pageList)">
          <a-icon type="right" style="color: #fff;font-size: 18px;border: 2px solid #fff;border-radius: 50%;padding: 2px;" />
        </span>
      </footer>
    </a-card>
    <a-modal
      :title="type == 1?'添加':type == 2?'详情':type == 3?'修改':''"
      :visible="visible"
      centered
      :confirm-loading="confirmLoading"
      @ok="modalOkHandle"
      @cancel="handleCancel"
    >
      <div class="modal-content">
        <div class="item">
          <span class="name">
            图片：
          </span>
          <div class="updata-img">
            <a-icon type="plus" v-show="!imgUrl" />
            <span v-show="!imgUrl">上传图片</span>
            <CliImg :widthRate="686" :heightRate="304" :disabled="type == 2"></CliImg>
            <img :src="imgUrl" alt="" v-show="imgUrl" @click="showBigImg(type == 2)" :class="[type == 2?'up':'']">
          </div>
        </div>
        <div class="item">
          <span class="name">
            位置：
          </span>
          <a-input-number v-model="dataSort" :min="1" :max="30" :disabled="type == 2"></a-input-number>
        </div>
        <div class="item">
          <span class="name">
            <a-select v-model="jumpType" :disabled="type == 2">
              <a-select-option :value="1">
                跳转连接
              </a-select-option>
              <a-select-option :value="2">
                商品编号
              </a-select-option>
            </a-select>
            ：
          </span>
          <a-input v-model="dataUrl" :placeholder="'请输入' + (jumpType == 1?'跳转链接':'商品编号')" :readOnly="type == 2"></a-input>
        </div>
        <div class="item">
          <span class="name">
            停留时长(s)：
          </span>
          <a-input-number v-model="dataTime" :min="1" :disabled="type == 2"></a-input-number>
        </div>
        <div class="item">
          <span class="name">
            状态：
          </span>
            <a-select style="width: 200px;" v-model="dataStatus" :disabled="type == 2">
              <a-select-option :value="1">
                启用
              </a-select-option>
              <a-select-option :value="2">
                禁用
              </a-select-option>
            </a-select>
        </div>
      </div>
    </a-modal>
    <a-modal
      v-model="bigImgVisible"
      title="查看图片"
      centered
      @ok="() => (bigImgVisible = false)"
    >
      <img :src="imgUrl" alt="" style="width: 100%;">
    </a-modal>
  </div>
</template>
<script>
import CliImg from '@/components/CliImg'
import { bgBannerSearch, bgBannerAdd, bgBannerUpdate, bgBannerRemove } from '@/https'
import { mapState, mapMutations } from 'vuex'
  export default {
    data() {
      return {
        isDataLoading: true,
        tableLoading: true,
        columns: [
          {
            title: '图片',
            dataIndex: 'imgUrl',
            align: 'center',
            scopedSlots: { customRender: 'img'},
          },
          {
            title: '位置',
            dataIndex: 'sort',
            width: '',
            align: 'center',
            customRender: (c) => {
              return c?c:'--'
            }
          },
          // {
          //   title: '类型',
          //   dataIndex: 'type',
          //   width: '',
          //   align: 'center',
          //   customRender: (c) => {
          //     return c?c:'--'
          //   }
          // },
          {
            title: '跳转链接/商品编号',
            dataIndex: 'jumpUrl',
            align: 'center',
            customRender: (c) => {
              return c?c:'--'
            }
          },
          {
            title: '停留时长(s)',
            dataIndex: 'stayTime',
            align: 'center',
            customRender: (c) => {
              return c?c:'--'
            }
          },
          {
            title: '状态',
            dataIndex: 'status',
            align: 'center',
            customRender: (c) => {
              return c?c == 1? '启用':'停用':'--'
            }
          },
          {
            title: '创建时间',
            dataIndex: 'createTime',
            align: 'center',
            customRender: (c) => {
              return c?c.slice(0, 19):'--'
            }
          },
          {
            title: '创建人',
            dataIndex: 'creatorName',
            align: 'center',
            customRender: (c) => {
              return c?c:'--'
            }
          },
          {
            title: '操作',
            align: 'center',
            scopedSlots: { customRender: 'active'},
          },
        ],
        dataSource: [],
        pageNum: 1,
        pageList: 20,
        status: 10,
        visible: false,
        type: 1,
        dataSort: 1,
        dataUrl: '',
        dataTime: 1,
        dataStatus: 1,
        confirmLoading: false,
        bannerId: '',
        bigImgVisible: false,
        jumpType: 1
      }
    },
    computed: {
      ...mapState(['imgUrl', 'userInfo']),
      titleArr() {
        let arr = []
        this.columns.map((item, index)=> {
          if (index !== this.columns.length -1) {
            arr.push(item.title)
          }
        })
        return arr
      }
    },
    created() {
      this.init()
    },
    methods: {
      ...mapMutations(['setImgUrl']),
      init() {
        bgBannerSearch(this.pageNum, this.pageList, this.status)
          .then(res => {
            this.dataSource = res.list
            this.isDataLoading = false
            this.tableLoading = false
          })
      },
      modalOkHandle() {
        if (!this.imgUrl) {
          this.$message.warning('请上传图片')
        } else if (!this.dataSort) {
          this.$message.warning('请输入位置')
        } else if (!this.dataTime) {
          this.$message.warning('请输入停留时长')
        } else if (this.type == 1) {
          let url = ''
          if (this.jumpType == 1) {
            url = 'url=' + this.dataUrl
          } else if (this.jumpType == 2) {
            url = 'id=' + this.dataUrl
          }
          this.confirmLoading = true
          bgBannerAdd(this.imgUrl, this.dataSort, url, this.dataTime, this.dataStatus, this.userInfo.loginUser.id, this.userInfo.loginUser.name)
            .then(res => {
              this.handleCancel()
              this.Refresh()
              this.$message.success(res.msg)
            })
        } else if (this.type == 3) {
          let url = ''
          if (this.jumpType == 1) {
            url = 'url=' + this.dataUrl
          } else if (this.jumpType == 2) {
            url = 'id=' + this.dataUrl
          }
          this.confirmLoading = true
          bgBannerUpdate(this.bannerId, this.imgUrl, this.dataSort, url, this.dataTime, this.dataStatus, this.userInfo.loginUser.id, this.userInfo.loginUser.name)
            .then(res => {
              this.handleCancel()
              this.Refresh()
              this.$message.success(res.msg)
            })
        } else {
          this.handleCancel()
        }
      },
      delData(data) {
        let _this = this
        this.$confirm({
          title: '确定要删除此banner吗?',
          content: '删除数据后不能恢复,请谨慎操作!',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk() {
            console.log(data.id)
            bgBannerRemove(data.id)
              .then(res => {
                _this.$message.success(res.msg)
                _this.Refresh()
              })
          }
        })
      },
      handleCancel() {
        this.visible = false
        this.confirmLoading = false
        this.setImgUrl('')
        this.dataSort = 1
        this.dataUrl = ''
        this.dataTime = 1
        this.dataStatus = 1
        this.jumpType = 1
      },
      showModal(n, data) {
        this.type = n
        this.visible = true
        if (n == 2 || n == 3) {
          let url = data.jumpUrl.split('=')
          if (url[0] == 'url') {
            this.jumpType = 1
          } else if (url[0] == 'id') {
            this.jumpType = 2
          }
          this.bannerId = data.id
          this.setImgUrl(data.imgUrl)
          this.dataSort = data.sort
          this.dataUrl = url[1]
          this.dataTime = data.stayTime
          this.dataStatus = data.status
        }
      },
      handleChange(value) {
        this.pageList = Number(value)
        this.init()
      },
      goPrev(bol) {
        if (bol) {
          this.pageNum--
          this.tableLoading = true
          this.init()
        }
      },
      goNext(bol) {
        if (bol) {
          this.pageNum++
          this.tableLoading = true
          this.init()
        }
      },
      Refresh() {
        this.pageNum = 1
        this.status = 10
        this.tableLoading = true
        this.init()
      },
      queryData () {
        this.tableLoading = true
        this.init()
      },
      showBigImg(bol) {
        this.bigImgVisible = bol
      }
    },
    components: {
      CliImg
    }
  }
</script>

<style lang="scss" scoped>
.modal-content {
  display: flex;
  flex-direction: column;
  .item {
    display: flex;
    align-items: center;
    margin: 10px 0;
    .name {
      width: 150px;
      text-align: right;
      font-weight: bold;
    }
    input {
      width: 200px;
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
      >img {
        width: 100%;
      }
      .up {
        position: relative;
        z-index: 100;
      }
    }
  }
}
</style>