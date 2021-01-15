<template>
  <div class="cash_ex">
    <a-card :loading="isDataLoading" :bordered="false">
      <header class="tab-header">
        <div class="header-left">
        </div>
        <div class="header-btn item">
          <a-button-group>
            <!-- <a-button
              type="primary"
              @click="ToDoExcel()"
              :loading="tableLoading"
              
            >导出文件</a-button> -->
            <a-button type="primary" @click="showModal(1)" :loading="tableLoading" v-if="$getRule('y1$s5$f3$t1')">新增</a-button>
            <a-button type="primary" icon="sync" @click="Refresh" :loading="tableLoading"></a-button>
          </a-button-group>
        </div>
      </header>
      <a-table :columns="columns" :dataSource="dataSource" bordered :pagination="false" size="middle" :loading="tableLoading" :rowKey="(record) => record.id">
        <template slot-scope="active" slot="active">
          <div class="tab-btns">
            <a-button type="primary" @click="showModal(2, active)" v-if="$getRule('y1$s5$f3$c2')">详情</a-button>
            <a-button type="primary" @click="showModal(3, active)" v-if="$getRule('y1$s5$f3$b3')">编辑</a-button>
            <!-- <a-button type="danger" @click="delData(active)" v-if="$getRule('y1$s5$f3$s4')">删除</a-button> -->
          </div>
        </template>
      </a-table>
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
            附加服务名称：
          </span>
          <a-input v-model="serviceName" placeholder="请输入附加服务名称" :readOnly="type == 2"></a-input>
        </div>
        <div class="item">
          <span class="name">
            附加服务费：
          </span>
          <a-input v-model="servicePrice" :disabled="type == 2" :min="1" placeholder="请输入附加服务费"></a-input>
        </div>
        <div class="item" v-if="type != 1">
          <span class="name">
            状态：
          </span>
            <a-select style="width: 120px;" v-model="serviceStatus" :disabled="type == 2">
              <a-select-option :key="1">
                启用
              </a-select-option>
              <a-select-option :key="2">
                禁用
              </a-select-option>
            </a-select>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { addServiceSearch, addServiceAdd, addServiceUpdate } from '@/https'
import { mapState } from 'vuex'
  export default {
    data() {
      return {
        isDataLoading: true,
        tableLoading: true,
        columns: [
          {
            title: '商品类型',
            dataIndex: 'name',
            width: '',
            align: 'center',
            customRender: (c) => {
              return c?c:'--'
            }
          },
          {
            title: '附加服务费',
            dataIndex: 'price',
            width: '',
            align: 'center',
            customRender: (c) => {
              return c?c / 100:'--'
            }
          },
          {
            title: '状态',
            dataIndex: 'status',
            width: '',
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
        visible: false,
        type: 1,
        serviceName: '',
        servicePrice: '',
        confirmLoading: false,
        serviceId: '',
        serviceStatus: 1
      }
    },
    computed: {
      ...mapState(['userInfo']),
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
      init() {
        addServiceSearch()
          .then(res => {
            this.dataSource = res
            this.isDataLoading = false
            this.tableLoading = false
          })
      },
      modalOkHandle() {
        if (!this.serviceName) {
          this.$message.warning('请输入附加服务名称')
        } else if (!this.servicePrice) {
          this.$message.warning('请输入附加服务费')
        } else if (this.type == 1) {
          this.confirmLoading = true
          addServiceAdd(this.serviceName, this.servicePrice * 100, 1, this.userInfo.loginUser.id, this.userInfo.loginUser.name)
            .then(res => {
              this.handleCancel()
              this.Refresh()
              this.$message.success(res.msg)
            })
        } else if (this.type == 3) {
          this.confirmLoading = true
          addServiceUpdate(this.serviceId, this.serviceName, this.servicePrice * 100, this.serviceStatus, this.userInfo.loginUser.id, this.userInfo.loginUser.name)
            .then(res => {
              this.Refresh()
              this.handleCancel()
              this.$message.success(res.msg)
            })
        } else {
          this.handleCancel()
        }
      },
      handleCancel() {
        this.visible = false
        this.serviceName = ''
        this.servicePrice = ''
        this.confirmLoading = false
      },
      showModal(n, data) {
        this.type = n
        this.visible = true
        if (n == 2 || n == 3) {
          this.serviceId = data.id
          this.serviceName = data.name
          this.servicePrice = data.price / 100
          this.serviceStatus = data.status
        }
      },
      Refresh() {
        this.pageNum = 1
        this.tableLoading = true
        this.init()
      },
      queryData () {
        this.tableLoading = true
        this.init()
      },
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
      padding: 10px;
      >img {
        width: 100%;
      }
    }
  }
}
</style>