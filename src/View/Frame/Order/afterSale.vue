<template>
  <div class="cash_ex">
    <a-card :loading="isDataLoading" :bordered="false">
      <header class="tab-header">
        <div class="header-left">
          <div class="header-time item">
            <span class="text-time">商品编号:</span>
            <a-input style="width: 180px" v-model="shopNumber" placeholder="请输入商品编号进行搜索" :maxLength='11'/>
          </div>
          <div class="header-time item">
            <span class="text-time">商品名称:</span>
            <a-input style="width: 180px" v-model="shopName" placeholder="请输入商品名称进行搜索" :maxLength='11'/>
          </div>
          <div class="header-time item">
            <span class="text-time">商品状态:</span>
            <a-select style="width: 120px;" v-model="shopStatus">
              <a-select-option :value="1">
                上架
              </a-select-option>
              <a-select-option :value="2">
                下架
              </a-select-option>
            </a-select>
          </div>
          <!-- <div class="header-time item">
            <span class="text-time">日期选择:</span>
            <a-range-picker v-model="dateArrAll"/>
          </div> -->
          <a-button type="primary" style="margin-left: 20px" @click="queryData" :loading="tableLoading">查询</a-button>
        </div>
        <div class="header-btn item">
          <a-button-group>
            <a-button type="primary" @click="showModal(1)" :loading="tableLoading" v-if="$getRule('y1$s5$s2$t1')">新增</a-button>
            <a-button
              type="primary"
              @click="ToDoExcel()"
              :loading="tableLoading"
              v-if="$getRule('y1$s5$s2$d7')"
            >导出文件</a-button>
            <a-button type="primary" icon="sync" @click="Refresh" :loading="tableLoading"></a-button>
          </a-button-group>
        </div>
      </header>
      <a-table :columns="columns" :dataSource="dataSource" bordered :pagination="false" size="middle" :loading="tableLoading" :rowKey="(record) => record.id">
        <template slot-scope="active" slot="bgGoodsSpecs">
          <span v-for="(item, index) in active" :key="item.id" v-show="active.length">{{index > 0 ?'，':''}}{{item.specs}}{{item.price / 100}}</span>
          <span v-show="!active.length">/</span>
        </template>
        <template slot-scope="active" slot="mainImg">
          <img :src="active" alt="" width="100px">
          <span v-show="!active">/</span>
        </template>
        <template slot-scope="active" slot="active">
          <div class="tab-btns">
            <a-button type="primary" @click="showModal(2, active)" v-if="$getRule('y1$s5$s2$c2')">详情</a-button>
            <a-button type="primary" @click="showModal(3, active)" v-if="$getRule('y1$s5$s2$b3')">编辑</a-button>
            <a-button type="danger" @click="delData(active)" v-if="$getRule('y1$s5$s2$s4')">删除</a-button>
            <a-button type="primary" v-if="$getRule('y1$s5$s2$s5')">上架</a-button>
            <a-button type="primary" v-if="$getRule('y1$s5$s2$x6')">下架</a-button>
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
      width="950px"
      :confirm-loading="confirmLoading"
      @ok="modalOkHandle"
      @cancel="handleCancel"
    >
      <div class="modal-content">
        <div class="content-t">
          <div class="item">
            <span class="name">
              商品名称：
            </span>
            <a-input v-model="shopEditName" placeholder="请输入商品类型名称" :readOnly="type == 2" :maxLength="15"></a-input>
          </div>
          <div class="item">
            <span class="name">
              商品类型：
            </span>
            <a-select style="width: 120px;" v-model="shopEditType" :disabled="type == 2">
              <a-select-option v-for="item in shopTypeData" :key="item.id">
                {{item.name}}
              </a-select-option>
            </a-select>
          </div>
          <div class="item">
            <span class="name">
              商品主图：
            </span>
            <div class="updata-img" @click="imgClick(1)">
              <a-icon type="vertical-align-top" class="vertical-align-top" v-if="shopEditImgUrl && type != 2"/>
              <a-icon type="plus" v-show="!shopEditImgUrl" />
              <span v-show="!shopEditImgUrl">上传图片</span>
              <CliImg :widthRate="750" :heightRate="1166" :disabled="type == 2"></CliImg>
              <img :src="shopEditImgUrl" alt="" v-show="shopEditImgUrl" @click="showBigImg(type == 2, shopEditImgUrl)" :class="[type == 2?'up':'']">
              <a-icon type="zoom-in" class="zoom-in" v-if="shopEditImgUrl && type == 2" @click="showBigImg(type == 2, shopEditImgUrl)"/>
              <a-icon type="delete" @click="delImg(1)" class="up delete" v-if="shopEditImgUrl && type != 2"/>
            </div>
          </div>
          <div class="item">
            <span class="name">
              商品banner图：
            </span>
            <div class="updata-img" @click="imgClick(2)">
              <a-icon type="vertical-align-top" class="vertical-align-top" v-if="shopEditBannerUrl && type != 2"/>
              <a-icon type="plus" v-show="!shopEditBannerUrl" />
              <span v-show="!shopEditBannerUrl">上传图片</span>
              <CliImg :widthRate="750" :heightRate="1166" :disabled="type == 2"></CliImg>
              <img :src="shopEditBannerUrl" alt="" v-show="shopEditBannerUrl" @click="showBigImg(type == 2, shopEditBannerUrl)" :class="[type == 2?'up':'']">
              <a-icon type="zoom-in" class="zoom-in" v-if="shopEditBannerUrl && type == 2" @click="showBigImg(type == 2, shopEditBannerUrl)"/>
              <a-icon type="delete" @click="delImg(2)" class="up delete" v-if="shopEditBannerUrl && type != 2"/>
            </div>
          </div>
        </div>
        <div class="content-r">
          <div class="item">
            <span class="name">
              商品详情图：
            </span>
            <div class="content" style="flex: 1;display: flex; flex-wrap: wrap;">
              <div class="updata-img" style="margin-top: 2px;margin-bottom:2px;" v-for="(item, index) in shopEditDetailsUrlArr" :key="item+index" @click="imgClick(3, index)">
                <a-icon type="vertical-align-top" class="vertical-align-top" v-if="type != 2"/>
                <a-icon type="plus" v-show="!item" />
                <span v-show="!item">上传图片</span>
                <CliImg :widthRate="750" :heightRate="1166" :disabled="type == 2"></CliImg>
                <img :src="item" alt="" v-show="item" @click="showBigImg(type == 2, item)" :class="[type == 2?'up':'']">
                <a-icon type="zoom-in" class="zoom-in" v-if="type == 2" @click="showBigImg(type == 2, item)"/>
                <a-icon type="delete" @click="delImg(3, index)" class="up delete" v-if="type != 2"/>
              </div>
              <div class="updata-img" style="margin-top: 2px;margin-bottom:2px;" @click="imgClick(3, 'add')" v-if="type != 2">
                <a-icon type="plus"/>
                <span >上传图片</span>
                <CliImg :widthRate="0" :heightRate="0" :disabled="type == 2"></CliImg>
              </div>
            </div>
          </div>
          <div class="item" style="align-items: flex-start;">
            <span class="name" style="margin-top:5px;" >
              商品规格：
            </span>
            <div class="centent" style="flex: 1;">
              <a-button type="primary" @click="addSpec" :disabled="type == 2">添加规格</a-button>
              <a-table bordered :data-source="specSource" size="small" style="width:100%;margin-top:10px;" :pagination="{size: 'small', showQuickJumper: true, defaultPageSize: 5}" :columns="specColumns" :rowKey="(record) => record.id">
                <template slot-scope="active" slot="specName">
                  <a-input :value="active.specName" @change="specInputChange($event, 'specName', active.id)" style="width: 110px;" placeholder="输入规格名称" :readOnly="type == 2" :maxLength="15"></a-input>
                </template>
                <template slot-scope="active" slot="oPrice">
                  <a-input :value="active.oPrice" @change="specInputChange($event, 'oPrice', active.id)" style="width: 110px;" placeholder="输入商品原价" :readOnly="type == 2" suffix="￥" :maxLength="8"></a-input>
                </template>
                <template slot-scope="active" slot="isSave">
                  <a-checkbox :checked="active.isSave == 1" @change="isSaveCheck(active)" disabled></a-checkbox>
                </template>
                <template slot-scope="active" slot="saveProp">
                  <a-input-number :value="active.saveProp" @change="specInputChange($event, 'saveProp', active.id)" :min="1" :max="100" style="width: 110px;" v-if="active.isSave == 1" placeholder="输入保价比例" :disabled="type == 2"></a-input-number>
                  <span v-else>/</span>
                </template>
                <template slot-scope="active" slot="isSpecial">
                  <a-checkbox :checked="active.isSpecial == 1" @change="isSpecialCheck(active)" :disabled="type == 2"></a-checkbox>
                </template>
                <template slot-scope="active" slot="specialPrice">
                  <a-input :value="active.specialPrice" @change="specInputChange($event, 'specialPrice', active.id)" style="width: 110px;" v-if="active.isSpecial == 1" placeholder="输入商品特价" :readOnly="type == 2" suffix="￥" :maxLength="8"></a-input>
                  <span v-else>/</span>
                </template>
                <template slot-scope="active" slot="active">
                  <div class="tab-btns">
                    <a-button type="danger" @click="delSpec(active)" :disabled="type == 2" v-if="$getRule('y1$s5$s2$s4')">删除</a-button>
                  </div>
                </template>
              </a-table>
            </div>
          </div>
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
import CliImg from '@/components/CliImg'
import { bgGoodsTypeSearch, bgGoodsFindAll, bgGoodsSave, bgGoodsUpdate, bgGoodsDeleteById } from '@/https'
import { mapState, mapMutations } from 'vuex'
  export default {
    data() {
      return {
        isDataLoading: true,
        tableLoading: true,
        columns: [
          {
            title: '商品编号',
            dataIndex: 'code',
            width: '',
            align: 'center',
            customRender: (c) => {
              return c?c:'--'
            }
          },
          {
            title: '商品名称',
            dataIndex: 'name',
            width: '',
            align: 'center',
            customRender: (c) => {
              return c?c:'--'
            }
          },
          {
            title: '商品类型',
            dataIndex: 'type',
            width: '',
            align: 'center',
            customRender: (c) => {
              return c?c:'--'
            }
          },
          {
            title: '商品规格及价格',
            dataIndex: 'bgGoodsSpecs',
            align: 'center',
            scopedSlots: { customRender: 'bgGoodsSpecs'},
          },
          {
            title: '商品主图',
            dataIndex: 'mainImg',
            align: 'center',
            scopedSlots: { customRender: 'mainImg'},
          },
          {
            title: '商品状态',
            dataIndex: 'status',
            align: 'center',
            customRender: (c) => {
              return c?c == 1? '上架':'下架':'--'
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
            dataIndex: 'createName',
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
        specColumns: [
          {
            title: '规格名称',
            width: '',
            align: 'center',
            scopedSlots: { customRender: 'specName'},
          },
          {
            title: '商品原价',
            width: '',
            align: 'center',
            scopedSlots: { customRender: 'oPrice'},
          },
          {
            title: '是否参与保价',
            width: '60px',
            align: 'center',
            scopedSlots: { customRender: 'isSave'},
          },
          {
            title: '商品保价比例(%)',
            align: 'center',
            scopedSlots: { customRender: 'saveProp'},
          },
          {
            title: '是否为特价商品',
            width: '80px',
            align: 'center',
            scopedSlots: { customRender: 'isSpecial'},
          },
          {
            title: '商品特价',
            align: 'center',
            scopedSlots: { customRender: 'specialPrice'},
          },
          {
            title: '操作',
            align: 'center',
            scopedSlots: { customRender: 'active'},
          },
        ],
        specSource: [],
        dataSource: [],
        dateArrAll: [],
        dateArr: [],
        pageNum: 1,
        pageList: 20,
        visible: false,
        type: 1,
        shopNumber: '',
        shopName: '',
        shopStatus: 1,
        shopEditName: '',
        shopEditStatus: 1,
        shopEditType: '--请选择--',
        shopEditImgUrl: '',
        shopEditBannerUrl: '',
        shopEditDetailsUrlArr: [],
        imgClickType: '',
        imgDetailsIndex: 0,
        confirmLoading: false,
        shopEditId: '',
        bigImgVisible: false,
        bigImgUrl: '',
        shopTypeData: []
      }
    },
    computed: {
      ...mapState(['imgUrl']),
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
        bgGoodsTypeSearch()
          .then(res => {
            this.shopTypeData = res.children
          })
        bgGoodsFindAll(this.pageNum, this.pageList, this.shopName, this.shopNumber, this.shopStatus)
          .then(res => {
            this.dataSource = res.children
            this.isDataLoading = false
            this.tableLoading = false
          })
      },
      modalOkHandle() {
        console.log(this.shopEditId,
          this.shopEditName,
          this.shopEditStatus ,
          this.shopEditImgUrl,
          this.shopEditBannerUrl,
          this.shopEditDetailsUrlArr,
          this.specSource)
        if (this.type == 2) {
          this.handleCancel()
        } else if (!this.shopEditName) {
          this.$message.warning('请输入商品名称')
        } else if (this.shopEditType == '--请选择--') {
          this.$message.warning('请选择商品类型')
        } else if (!this.shopEditImgUrl) {
          this.$message.warning('请上传商品主图')
        } else if (!this.shopEditBannerUrl) {
          this.$message.warning('请上传商品banner图')
        } else if (!this.shopEditDetailsUrlArr.length) {
          this.$message.warning('请上传商品详情图')
        } else if (!this.specSource.length) {
          this.$message.warning('请添加商品规格')
        } else if (this.specSource.length && this.specSource.some(item => !item.specName)) {
          this.$message.warning('请填写完整商品规格名称')
        } else if (this.specSource.length && this.specSource.some(item => !item.oPrice)) {
          this.$message.warning('请填写完整商品规格原价')
        } else if (this.specSource.length && !this.specSource.some(item => item.isSave == 1 && item.saveProp || item.isSave == 2)) {
          this.$message.warning('请填写完整商品保价比例')
        } else if (this.specSource.length && !this.specSource.some(item => item.isSpecial == 1 && item.specialPrice || item.isSpecial == 2)) {
          this.$message.warning('请填写完整商品特价')
        } else if (this.type == 1) {
          let bgGoodsSpecs = this.specSource.map(item => {
            return {
              specs: item.specName,
              isInsured: item.isSave,
              insuredProportion: item.saveProp,
              isSpecial: item.isSpecial,
              price: item.oPrice * 100,
              specialPrice: item.specialPrice * 100,
            }
          })
          this.confirmLoading = true
          bgGoodsSave(this.shopEditName, this.shopEditType, this.shopEditImgUrl, this.shopEditBannerUrl, this.shopEditDetailsUrlArr.join(','), 1, bgGoodsSpecs)
            .then(res => {
              this.handleCancel()
              this.Refresh()
              this.$message.success(res.msg)
            })
        } else if (this.type == 3) {
          let bgGoodsSpecs = this.specSource.map(item => {
            return {
              id: item.specId,
              specs: item.specName,
              isInsured: item.isSave,
              insuredProportion: item.saveProp,
              isSpecial: item.isSpecial,
              price: item.oPrice * 100,
              specialPrice: item.specialPrice * 100,
            }
          })
          this.confirmLoading = true
          bgGoodsUpdate(this.shopEditId, this.shopEditName, this.shopEditType, this.shopEditImgUrl, this.shopEditBannerUrl, this.shopEditDetailsUrlArr.join(','), 1, bgGoodsSpecs)
            .then(res => {
              this.Refresh()
              this.handleCancel()
              this.$message.success(res.msg)
            })
        }
      },
      delData(data) {
        let _this = this
        this.$confirm({
          title: '确定要删除此商品吗?',
          content: '删除数据后不能恢复,请谨慎操作!',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk() {
            console.log(data.id)
            bgGoodsDeleteById(data.id)
              .then(res => {
                _this.$message.success(res.msg)
                _this.Refresh()
              })
          }
        })
      },
      delSpec(data) {
        this.specSource = this.specSource.filter(item => item.id != data.id)
      },
      handleCancel() {
        this.visible = false
        this.shopEditId = ''
        this.shopEditName = ''
        this.shopEditStatus = 1
        this.shopEditType = '--请选择--'
        this.shopEditImgUrl = ''
        this.shopEditBannerUrl = ''
        this.shopEditDetailsUrlArr = []
        this.specSource = []
        this.confirmLoading = false
      },
      showModal(n, data) {
        this.type = n
        this.visible = true
        if (n == 2 || n == 3) {
          console.log(data)
          this.shopEditId = data.id
          this.shopEditName = data.name
          this.shopEditStatus = data.status
          this.shopEditType = data.type
          this.shopEditImgUrl = data.mainImg
          this.shopEditBannerUrl = data.bannerImg
          this.shopEditDetailsUrlArr = data.detail.split(',').filter(item => item)
          this.specSource = data.bgGoodsSpecs.map((item, index) => {
            return item = {
              id: index + 1,
              specId: item.id,
              specName: item.specs,
              oPrice: item.price / 100,
              isSave: item.isInsured,
              saveProp: item.insuredProportion,
              isSpecial: item.isSpecial,
              specialPrice: item.specialPrice / 100,
            }
          })
        }
      },
      isSaveCheck(e) {
        console.log(e.id)
        this.specSource = this.specSource.map(item => {
          if (item.id == e.id) {
            item.isSave = item.isSave == 1?2:1
            item.isSave == 2?item.saveProp = '':''
          }
          return item
        })
        console.log(this.specSource)
      },
      isSpecialCheck(e) {
        console.log(e.id)
        this.specSource = this.specSource.map(item => {
          if (item.id == e.id) {
            item.isSpecial = item.isSpecial == 1?2:1
            item.isSpecial == 2?item.specialPrice = '':''
          }
          return item
        })
      },
      imgClick(type, n) {
        this.imgClickType = type
        this.imgDetailsIndex = n || 0
      },
      delImg(n, index) {
        console.log(n)
        if (n == 1) {
          this.shopEditImgUrl = ''
        } else if (n == 2) {
          this.shopEditBannerUrl = ''
        } else if (n == 3) {
          console.log(index)
          console.log(this.shopEditDetailsUrlArr)
          this.shopEditDetailsUrlArr = this.shopEditDetailsUrlArr.filter((item, cindex) => cindex != index)
        }
      },
      addSpec() {
        this.specSource.push(
          {
            id: this.specSource.reduce((a, b) => a = b.id > a?b.id:a, 0) + 1,
            specName: '',
            oPrice: '',
            isSave: 2,
            saveProp: '',
            isSpecial: 2,
            specialPrice: '',
          })
        console.log(this.specSource)
      },
      showBigImg(bol, url) {
        this.bigImgVisible = bol
        this.bigImgUrl = url
      },
      ToDoExcel() {
        bgGoodsFindAll(this.pageNum, this.pageList, this.shopName, this.shopNumber, this.shopStatus)
          .then(res => {
            let arr = []
            res.children.map(item => {
              arr.push([
                item.code,
                item.name,
                item.type,
                item.bgGoodsSpecs.map(item => item.specs + item.price / 100).join(','),
                item.mainImg,
                item.status == 1?'上架':'下架',
                item.createTime,
                item.createName
              ])
            })
            this.$ToDoExcel(`商品列表`, this.titleArr, arr)
          })
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
        this.tableLoading = true
        this.init()
      },
      queryData () {
        this.tableLoading = true
        this.init()
      },
      specInputChange(e, name, id) {
        console.log(e)
        console.log(name)
        console.log(id)
        this.specSource = this.specSource.map(item => {
          if (item.id == id) {
            if (name == 'saveProp') {
              item[name] = e
            } else {
              item[name] = e.target.value
            }
          }
          return item
        })
      }
    },
    components: {
      CliImg
    },
    watch: {
      imgUrl(newValue) {
        if (newValue && this.imgClickType == 1) {
          this.shopEditImgUrl = newValue
          this.imgClickTyp = ''
          this.setImgUrl('')
        } else if (newValue && this.imgClickType == 2) {
          this.shopEditBannerUrl = newValue
          this.imgClickTyp = ''
          this.setImgUrl('')
        } else if (newValue && this.imgClickType == 3) {
          if (this.type == 1 || this.type == 3) {
            if (this.imgDetailsIndex == 'add') {
              this.shopEditDetailsUrlArr.push(newValue)
            } else {
              this.shopEditDetailsUrlArr = this.shopEditDetailsUrlArr.map((item, index) => index == this.imgDetailsIndex?item = newValue:item)
            }
          }
          this.imgClickTyp = ''
          this.setImgUrl('')
        }
      }
    }
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
