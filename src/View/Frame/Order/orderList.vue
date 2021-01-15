<template>
  <div class="cash_ex">
    <a-card :loading="isDataLoading" :bordered="false">
      <header class="tab-header">
        <div class="header-left">
          <div class="header-time item">
            <span class="text-time">订单编号:</span>
            <a-input style="width: 180px" v-model="orderId" placeholder="请输入订单编号进行搜索" :maxLength='120' ref="orderId" @change="orderIdChange" @keyup="keyQuery">
              <a-icon type="enter" slot="suffix" style="color: #ccc;"/>
            </a-input>
          </div>
          <div class="header-time item">
            <span class="text-time">云店收件快递单号:</span>
            <a-input style="width: 200px" v-model="sendNumber" placeholder="请输入快递单号进行搜索" :maxLength='20' @keyup="keyQuery">
              <a-icon type="enter" slot="suffix" style="color: #ccc;"/>
            </a-input>
          </div>
          <div class="header-time item">
            <span class="text-time">手机号码:</span>
            <a-input style="width: 180px" v-model="mobile" placeholder="请输入手机号码进行搜索" :maxLength='11'/>
          </div>
          <div class="header-time item">
            <span class="text-time">订单状态:</span>
            <a-select style="width: 120px;" v-model="orderStatus">
              <a-select-option :value="0">
                全部
              </a-select-option>
              <a-select-option :value="2">
                未支付
              </a-select-option>
              <a-select-option :value="3">
                已撤单
              </a-select-option>
              <a-select-option :value="4">
                物流收取用户衣物
              </a-select-option>
              <a-select-option :value="5">
                洗涤中
              </a-select-option>
              <a-select-option :value="6">
                工厂寄回
              </a-select-option>
              <a-select-option :value="7">
                已取衣
              </a-select-option>
              <a-select-option :value="8">
                售后
              </a-select-option>
              <a-select-option :value="1">
                已删除
              </a-select-option>
            </a-select>
          </div>
          <!-- <div class="header-time item">
            <span class="text-time">支付方式:</span>
            <a-select style="width: 120px;" v-model="payType">
              <a-select-option :value="0">
                全部
              </a-select-option>
              <a-select-option :value="1">
                微信支付
              </a-select-option>
              <a-select-option :value="2">
                余额支付
              </a-select-option>
            </a-select>
          </div> -->
          <!-- <div class="header-time item">
            <span class="text-time">订单来源:</span>
            <a-select style="width: 120px;" v-model="shopStatus">
              <a-select-option :value="1">
                上架
              </a-select-option>
              <a-select-option :value="2">
                下架
              </a-select-option>
            </a-select>
          </div> -->
          <div class="header-time item">
            <span class="text-time">日期选择:</span>
            <a-range-picker v-model="dateArrAll"/>
          </div>
          <a-button type="primary" style="margin-left: 20px" @click="queryData" :loading="tableLoading">查询</a-button>
        </div>
        <div class="header-btn item">
          <a-button-group>
            <a-button
              type="primary"
              @click="ToDoExcel()"
              :loading="tableLoading"
              v-if="$getRule('#y1$s5$d1$d4#')"
            >导出文件</a-button>
            <a-button type="primary" icon="sync" @click="Refresh" :loading="tableLoading"></a-button>
          </a-button-group>
        </div>
      </header>
      <a-table :columns="columns" :dataSource="dataSource" bordered :pagination="false" size="middle" :loading="tableLoading" :rowKey="(record) => record.id">
        <template slot-scope="active" slot="detailsList">
          <p v-for="(item, index) in active.detailsList" :key="item.id" v-show="active.detailsList.length">
            {{index + 1 +'、'}}{{item.nameGoods}}</p>
          <span v-show="!active.detailsList.length">/</span>
        </template>
        <template slot-scope="active" slot="active">
          <div class="tab-btns">
            <a-button type="primary" @click="goDetails(active)" v-if="$getRule('#y1$s5$d1$c1#')">详情</a-button>
            <!-- <a-button type="primary" v-if="$getRule('y1$s5$s2$s5')">退款</a-button> -->
            <a-button type="primary" :ghost="true" @click="goRecording(active)" v-if="$getRule('#y1$s5$d1$q3#') && (active.statusDelivery == 42 && active.statusOrder == 4)" :loading="tableLoading">签收</a-button>
            <a-button type="primary" :ghost="true" @click="deliverGoods(active)" v-if="$getRule('#y1$s5$d1$f5#') && active.statusOrder == 5" :loading="tableLoading">发货</a-button>
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
  </div>
</template>
<script>
import { searchOrders, confirmRecived, sendToUser } from '@/https'
import { mapState, mapMutations } from 'vuex'
  export default {
    data() {
      return {
        isDataLoading: true,
        tableLoading: true,
        columns: [
          {
            title: '订单编号',
            dataIndex: 'orderNo',
            width: '',
            align: 'center',
            customRender: (c) => {
              return c?c:'--'
            }
          },
          {
            title: '会员昵称',
            dataIndex: 'userName',
            width: '',
            align: 'center',
            customRender: (c) => {
              return c?c:'--'
            }
          },
          {
            title: '云店收件快递单号',
            dataIndex: 'sendNo',
            width: '',
            align: 'center',
            customRender: (c) => {
              return c?c:'--'
            }
          },
          {
            title: '云店寄回快递单号',
            dataIndex: 'sendbackNo',
            width: '',
            align: 'center',
            customRender: (c) => {
              return c?c:'--'
            }
          },
          {
            title: '手机号码',
            dataIndex: 'userMobile',
            align: 'center',
            customRender: (c) => {
              return c?c:'--'
            }
          },
          {
            title: '订单状态',
            dataIndex: 'statusOrder',
            align: 'center',
            customRender: (c) => {
              return c?this.orderStatusHandle(c):'--'
            }
          },
          {
            title: '支付方式',
            dataIndex: 'payType',
            align: 'center',
            customRender: (c) => {
              return c?this.payTypeHandle(c):'--'
            }
          },
          {
            title: '订单商品',
            align: 'center',
            scopedSlots: { customRender: 'detailsList'}
          },
          {
            title: '订单数量',
            dataIndex: 'countGoods',
            align: 'center',
            customRender: (c) => {
              return c?c:'--'
            }
          },
          {
            title: '订单总价（元）',
            dataIndex: 'moneyNeedPay',
            align: 'center',
            customRender: (c) => {
              return c?c / 100:'--'
            }
          },
          {
            title: '订单创建时间',
            dataIndex: 'timeCreate',
            align: 'center',
            customRender: (c) => {
              return c?c.slice(0, 19):'--'
            }
          },
          {
            title: '操作',
            align: 'center',
            scopedSlots: { customRender: 'active'},
          },
        ],
        dataSource: [],
        dateArrAll: [],
        dateArr: [],
        pageNum: 1,
        pageList: 20,
        orderId: '',
        orderIdHc: '',
        orderStatus: 0,
        payType: 0,
        mobile: '',
        sendNumber: '',
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
        this.dateArr = this.dateArrAll.map(item => {
          return this.$moment(item).format('YYYY-MM-DD HH:mm:ss')
        })
        searchOrders(this.pageNum, this.pageList, this.orderId || null, this.orderStatus || null, this.mobile || null, this.sendNumber || null, this.dateArr[0], this.dateArr[1])
          .then(res => {
            console.log(res.length)
            this.dataSource = res
            this.isDataLoading = false
            this.tableLoading = false
          })
      },
      ToDoExcel() {
        searchOrders(null, null, this.orderId, this.orderStatus, this.mobile, this.sendNumber, this.dateArr[0], this.dateArr[1])
          .then(res => {
            let arr = []
            res.map(item => {
              let goodsNames = ''
                item.appOrderInfos.map((citem, index) => {
                  goodsNames + citem.goodsName + (index + 1 == item.appOrderInfos.length?'，':'')
                  return citem
                })
              arr.push([
                item.orderId,
                item.appMember.wxNickName,
                item.acceptNumber,
                item.sendNumber,
                item.appMember.mobile,
                item.orderStatus,
                item.payType,
                goodsNames,
                item.orderNumber,
                item.payPrice,
                item.createTime
              ])
            })
            this.$ToDoExcel(`订单列表`, this.titleArr, arr)
          })
      },
      orderStatusHandle(status) {
        if (status == 2) {
          return '未支付'
        } else if (status == 3) {
          return '已撤单'
        } else if (status == 4) {
          return '物流收取用户衣物'
        } else if (status == 5) {
          return '洗涤中'
        } else if (status == 6) {
          return '工厂寄回'
        } else if (status == 7) {
          return '已取衣'
        } else if (status == 8) {
          return '售后'
        } else if (status == 1) {
          return '已删除'
        }
      },
      payTypeHandle(type) {
        if (type == 1) {
          return '微信支付'
        } else if (type == 2) {
          return '账户支付'
        } else if (type == 3) {
          return '混合支付'
        }
      },
      goDetails(data) {
        this.$router.push({name: 'order/list/details', query: {id: data.orderNo}})
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
        this.orderId = ''
        this.sendNumber = ''
        this.orderStatus = 0
        this.mobile = ''
        this.tableLoading = true
        this.init()
      },
      queryData () {
        this.tableLoading = true
        this.init()
      },
      keyQuery(e) {
        if(e.keyCode == 13) {
          this.tableLoading = true
          this.init()
        }
      },
      goRecording(data) {
        this.$confirm({
          title: '确认对当前订单进行签收操作？',
          content: () => <div style="color:red;">操作后数据不可恢复，请谨慎操作</div>,
          onOk:() => {
            this.tableLoading = true
            confirmRecived(data.orderNo, this.userInfo.loginUser.name, this.userInfo.loginUser.id)
              .then((res) => {
                this.tableLoading = false
                this.$message.success(res.msg)
                this.Refresh()
              })
          },
          onCancel() {
            console.log('Cancel')
          },
          class: 'test',
        })
      },
      deliverGoods(data) {
        this.tableLoading = true
        sendToUser(data.orderNo, this.userInfo.loginUser.name, this.userInfo.loginUser.id)
          .then(res => {
            if (!res.success) {
              this.$message.error(res.msg)
            } else {
              this.$message.success(res.msg)
              this.Refresh()
            }
          })
      },
      orderIdChange(e) {
        if (e.target.value.length == 17) {
          this.orderIdHc = e.target.value.split(',')[0]
        } else if (e.target.value.length > 17) {
          this.orderId = this.orderIdHc
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
.modal-content {
  display: flex;
  flex-direction: column;
  .content-t {
    display: flex;
    flex-wrap: wrap;
    .item {
      min-width: 400px;
    }
  }
  .item {
    flex: 1;
    display: flex;
    align-items: center;
    margin: 10px 0;
    min-height: 50px;
    .name {
      width: 120px;
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
    .list {
      .sp {
        display: flex;
      }
    }
  }
}
</style>