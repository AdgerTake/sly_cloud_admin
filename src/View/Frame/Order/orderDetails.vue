<template>
  <div style="margin: 20px;">
    <div class="header">
      <a-descriptions title="订单记录" layout="vertical" bordered :column="4">
        <a-descriptions-item label="用户昵称">
          {{orderDetails.userName}}
        </a-descriptions-item>
        <a-descriptions-item label="手机号码">
          {{orderDetails.userMobile}}
        </a-descriptions-item>
        <a-descriptions-item label="订单状态">
          {{orderStatusHandle(orderDetails.statusOrder)}}
        </a-descriptions-item>
        <a-descriptions-item label="支付方式">
          {{payType(orderDetails.payType)}}
        </a-descriptions-item>
        <a-descriptions-item label="云店收件快递单号">
          {{orderDetails.sendNo}}
        </a-descriptions-item>
        <a-descriptions-item label="云店寄回快递单号">
          {{orderDetails.sendbackNo}}
        </a-descriptions-item>
        <a-descriptions-item label="订单编号">  
          {{orderDetails.orderNo}}
        </a-descriptions-item>
        <a-descriptions-item label="订单数量">
          {{orderDetails.countGoods}}
        </a-descriptions-item>
        <a-descriptions-item label="订单总价（元）">
          {{orderDetails.moneyNeedPay / 100}}
        </a-descriptions-item>
        <!-- <a-descriptions-item label="优惠券抵扣（元）">
          {{orderDetails.couponDiscountPrice / 100 || 0}}
        </a-descriptions-item>
        <a-descriptions-item label="账户余额抵扣（元）">
          {{orderDetails.accountPayMoney / 100 || 0}}
        </a-descriptions-item> -->
        <a-descriptions-item label="实际支付（元）" v-if="orderDetails.orderStatus >= 4">
          {{orderDetails.moneyNeedPay / 100}}
        </a-descriptions-item>
        <a-descriptions-item label="应该支付（元）" v-if="orderDetails.orderStatus < 4">
          {{orderDetails.moneyNeedPay / 100}}
        </a-descriptions-item>
      </a-descriptions>
    </div>
    <div class="content">
      <p class="shops">商品下单记录</p>
      <a-table bordered :data-source="orderInfos" :columns="columns" :pagination="false" :rowKey="(record) => record.id">
      </a-table>
    </div>
    <div class="content">
      <p class="shops">商品明细记录</p>
      <a-table bordered :data-source="clothesList" :columns="detailsColumns" :pagination="false" :rowKey="(record) => record.id">
        <template slot="processStatus">
          {{orderStatusHandle(orderDetails.statusOrder)}}
        </template>
        <template slot-scope="active" slot="imgs">
          <!-- <span v-for="item in active.clothesList" :key="item.id">
            <i v-if="item.clothingImg">
              <img :src="citem" alt="" v-for="citem in item.clothingImg.split(',')" :key="citem">
            </i>
          </span> -->
          <a-button type="primary" @click="showModal(active)">图片查看</a-button>
        </template>
      </a-table>
    </div>
    <a-modal
      v-model="modal1Visible"
      title="查看图片"
      centered
      @ok="imgOkHandle"
      @cancel="modal1Visible = false"
    >
      <div class="content" style="flex: 1;display: flex; flex-wrap: wrap;">
        <div class="updata-img" style="margin-top: 2px;margin-bottom:2px;" v-for="citem in clothesListData" :key="citem">
          <img :src="citem" alt="" v-show="citem"  class="up" @click="showBigImg(citem)">
          <a-icon type="zoom-in" class="zoom-in"  @click="showBigImg(citem)"/>
        </div>
      </div>
    </a-modal>
    <a-modal
      v-model="bigImgVisible"
      title="查看图片"
      centered
      @ok="() => (bigImgVisible = false)"
    >
      <img :src="bigImgUrl" alt="" style="width: 100%;">
    </a-modal>
  </div>
</template>

<script>
import { orderDetails } from '@/https'
export default {
  data() {
    return {
      orderInfos: [],
      columns: [
        {
          title: '商品编号',
          dataIndex: 'codeGoods',
          align: 'center',
          customRender: (c) => {
            return c?c:'--'
          }
        },
        {
          title: '商品名称',
          dataIndex: 'nameGoods',
          align: 'center',
          customRender: (c) => {
            return c?c:'--'
          }
        },
        {
          title: '商品数量',
          dataIndex: 'goodsNum',
          align: 'center',
          customRender: (c) => {
            return c?c:'--'
          }
        },
        {
          title: '商品单价（元）',
          align: 'center',
          customRender: (c) => {
            return c?c.specialOffer == 1?c.priceSpecial / 100:c.price /100:'--'
          }
        },
      ],
      detailsColumns: [
        {
          title: '衣物编号',
          dataIndex: 'idClothes',
          align: 'center',
          customRender: (c) => {
            return c?c:'--'
          }
        },
        {
          title: '衣物名称',
          dataIndex: 'name',
          align: 'center',
          customRender: (c) => {
            return c?c:'--'
          }
        },
        {
          title: '衣物状态',
          align: 'center',
          scopedSlots: { customRender: 'processStatus'},
        },
        {
          title: '衣物图片',
          align: 'center',
          scopedSlots: { customRender: 'imgs'},
        },
      ],
      orderDetails: {},
      modal1Visible: false,
      clothesListData: [],
      bigImgVisible: false,
      bigImgUrl: '',
      clothesList: ''
    }
  },
  created() {
    this.orderId = this.$route.query.id
    orderDetails(this.orderId)
      .then(res => {
        this.orderDetails = res
        this.orderInfos = res.detailsList
        this.clothesList = res.clothesNameList
      })
  },
  methods: {
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
    payType(type) {
      if (type == 1) {
        return '微信支付'
      } else if (type == 2) {
        return '账户支付'
      } else if (type == 3) {
        return '混合支付'
      }
    },
    showModal(data) {
      this.modal1Visible = true
      this.clothesListData = data.img.split(',')
      console.log(this.clothesListData )
    },
    imgOkHandle() {
      this.modal1Visible = false
    },
    showBigImg(data) {
      this.bigImgUrl = data
      this.bigImgVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.shops {
  margin-bottom: 20px;
  color: rgba(0, 0, 0, 0.85);
  font-weight: bold;
  font-size: 16px;
  line-height: 1.5;
  margin-top: 20px;
}
</style>