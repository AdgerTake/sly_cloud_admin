<template>
  <div class="cash_ex">
    <a-card :loading="isDataLoading" :bordered="false">
      <header class="tab-header">
        <div class="header-left">
        </div>
        <div class="header-btn item">
          <a-button-group>
            <a-button type="primary" @click="showAddDrawer(1)" :loading="tableLoading" v-if="$getRule('y1$x2$j1$t1')">添加角色</a-button>
            <a-button type="primary" icon="sync" @click="Refresh" :loading="tableLoading"></a-button>
          </a-button-group>
        </div>
      </header>
      <a-table :columns="columns" :dataSource="dataSource" bordered :pagination="false" size="middle" :loading="tableLoading" :rowKey="(record) => record.id">
        <template slot-scope="active" slot="active">
          <div class="tab-btns">
            <a-button type="primary" @click="showDetaileHandle(active)" v-if="$getRule('y1$x2$j1$c2')">详情</a-button>
            <a-button type="primary" @click="showAddDrawer(2, active)" v-if="$getRule('y1$x2$j1$b3')">编辑</a-button>
            <a-button type="danger" @click="delData(active)" v-if="$getRule('y1$x2$j1$s4')">删除</a-button>
            <a-button type="primary" @click="showAddDrawer(3, active)" v-if="$getRule('y1$x2$j1$s5')">设置权限</a-button>
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
        <span :class="dataSource.length === pageList? ['active btn']:'btn'" @click="goNext(dataSource.length === pageList)">
          <a-icon type="right" style="color: #fff;font-size: 18px;border: 2px solid #fff;border-radius: 50%;padding: 2px;" />
        </span>
      </footer>
    </a-card>
    <a-modal
      title="设置权限"
      :visible="powerVisible"
      centered
      @ok="upPowerData"
      @cancel="onPowerClose"
      :confirmLoading="confirmLoading"
      :bodyStyle="{
        'height': '500px',
        'overflow-x': 'auto'
      }"
    >
      <p>
        <span style="font-weight: bold;">角色名称：</span>
        {{roleDetails.roleName}}
      </p>
      <a-tree
        v-if="powerVisible"
        v-model="checkedKeys"
        checkable
        :expanded-keys="expandedKeys"
        :auto-expand-parent="autoExpandParent"
        :selected-keys="selectedKeys"
        :tree-data="treeData"
        @check="onCheck"
        @expand="onExpand"
        @select="onSelect"
      />
    </a-modal>
    <a-modal
      :title="roleType == 1?'添加角色':roleType== 2?'编辑角色':''"
      :visible="addRoleVisible"
      centered
      @ok="upAddRoleData"
      @cancel="onAddRoleClose"
      :confirmLoading="confirmLoading"
      width="350px"
    >
      <div class="add-role">
        <div class="name item">
          <span>角色名称：</span>
          <a-input v-model="addRoleName" placeholder="请输入角色名称" :disabled="roleType == 2"></a-input>
        </div>
        <div class="status item">
          <span>启用状态：</span>
          <a-select v-model="addRoleStatus">
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
      title="角色详情"
      :visible="roleVisible"
      centered
      @ok="onRoleDataClose"
      @cancel="onRoleDataClose"
      :confirmLoading="confirmLoading"
      width="350px"
    >
      <div class="role-details">
        <div class="details-name item">
          <span>角色名称：</span>
          <p>{{roleDetails.roleName}}</p>
        </div>
        <div class="details-status item">
          <span>启用状态：</span>
          <p>{{roleDetails.status?roleDetails.status == 1? '启用':'停用':'--'}}</p>
        </div>
        <div class="create-name item">
          <span>创建人员：</span>
          <p>{{roleDetails.createName}}</p>
        </div>
        <div class="create-time item">
          <span>创建时间：</span>
          <p>{{roleDetails.createTime}}</p>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { findAll, sysRoleSave, sysRoleUpdate, sysRoleDeleteById } from '@/https'
import { mapState } from 'vuex';
// *$*$*  星号1 代表第一级 星号2 代表第二级 星号3 代表第三级 以此类推
// h$o1$101
var zNodes =[
        /*后台权限*/
        { id:'y1', pId:0, name:"云店后台"},
          // { id:'y1$s1', pId:'y1', name:"首页"},
          //   { id:'y1$s1$c1', pId:'y1$s1', name:"查看"},
          //   { id:'y1$s1$g2', pId:'y1$s1', name:"个人中心"},
          //   { id:'y1$s1$x3', pId:'y1$s1', name:"修改密码"},
          { id:'y1$x2', pId:'y1', name:"系统管理"},
            { id:'y1$x2$j1', pId:'y1$x2', name:"角色管理"},
              { id:'y1$x2$j1$t1', pId:'y1$x2$j1', name:"添加"},
              { id:'y1$x2$j1$c2', pId:'y1$x2$j1', name:"查看"},
              { id:'y1$x2$j1$b3', pId:'y1$x2$j1', name:"编辑"},
              { id:'y1$x2$j1$s4', pId:'y1$x2$j1', name:"删除"},
              { id:'y1$x2$j1$s5', pId:'y1$x2$j1', name:"设置权限"},
            { id:'y1$x2$b2', pId:'y1$x2', name:"部门管理"},
              { id:'y1$x2$b2$t1', pId:'y1$x2$b2', name:"添加"},
              { id:'y1$x2$b2$c2', pId:'y1$x2$b2', name:"查看"},
              { id:'y1$x2$b2$b3', pId:'y1$x2$b2', name:"编辑"},
              { id:'y1$x2$b2$s4', pId:'y1$x2$b2', name:"删除"},
            { id:'y1$x2$r3', pId:'y1$x2', name:"人员管理"},
              { id:'y1$x2$r3$t1', pId:'y1$x2$r3', name:"添加"},
              { id:'y1$x2$r3$c2', pId:'y1$x2$r3', name:"查看"},
              { id:'y1$x2$r3$b3', pId:'y1$x2$r3', name:"编辑"},
              { id:'y1$x2$r3$s4', pId:'y1$x2$r3', name:"删除"},
              { id:'y1$x2$r3$c5', pId:'y1$x2$r3', name:"重置密码"},
          { id:'y1$p3', pId:'y1', name:"配置管理"},
            { id:'y1$p3$b1', pId:'y1$p3', name:"banner管理"},
              { id:'y1$p3$b1$t1', pId:'y1$p3$b1', name:"添加"},
              { id:'y1$p3$b1$c2', pId:'y1$p3$b1', name:"查看"},
              { id:'y1$p3$b1$b3', pId:'y1$p3$b1', name:"编辑"},
              { id:'y1$p3$b1$s4', pId:'y1$p3$b1', name:"删除"},
            // { id:'y1$p3$b2', pId:'y1$p3', name:"标签管理"},
            //   { id:'y1$p3$b2$t1', pId:'y1$p3$b2', name:"添加"},
            //   { id:'y1$p3$b2$c2', pId:'y1$p3$b2', name:"查看"},
            //   { id:'y1$p3$b2$b3', pId:'y1$p3$b2', name:"编辑"},
            //   { id:'y1$p3$b2$s4', pId:'y1$p3$b2', name:"删除"},
            // { id:'y1$p3$s3', pId:'y1$p3', name:"筛选条件设置"},
            //   { id:'y1$p3$s3$t1', pId:'y1$p3$s3', name:"添加"},
            //   { id:'y1$p3$s3$c2', pId:'y1$p3$s3', name:"查看"},
            //   { id:'y1$p3$s3$b3', pId:'y1$p3$s3', name:"编辑"},
            //   { id:'y1$p3$s3$s4', pId:'y1$p3$s3', name:"删除"},
            // { id:'y1$p3$w4', pId:'y1$p3', name:"文案设置"},
            //   { id:'y1$p3$w4$t1', pId:'y1$p3$w4', name:"添加"},
            //   { id:'y1$p3$w4$c2', pId:'y1$p3$w4', name:"查看"},
            //   { id:'y1$p3$w4$b3', pId:'y1$p3$w4', name:"编辑"},
            //   { id:'y1$p3$w4$s4', pId:'y1$p3$w4', name:"删除"},
          // { id:'y1$h4', pId:'y1', name:"会员管理"},
          //   { id:'y1$h4$c1', pId:'y1$h4', name:"查看"},
          //   { id:'y1$h4$t2', pId:'y1$h4', name:"添加备注"},
          //   { id:'y1$h4$j3', pId:'y1$h4', name:"加入黑名单"},
          //   { id:'y1$h4$y4', pId:'y1$h4', name:"移出黑名单"},
          //   { id:'y1$h4$d5', pId:'y1$h4', name:"导出EXCEL"},
          { id:'y1$s5', pId:'y1', name:"商品管理"},
            { id:'y1$s5$s1', pId:'y1$s5', name:"商品类型"},
              { id:'y1$s5$s1$t1', pId:'y1$s5$s1', name:"添加"},
              { id:'y1$s5$s1$c2', pId:'y1$s5$s1', name:"查看"},
              { id:'y1$s5$s1$b3', pId:'y1$s5$s1', name:"编辑"},
              { id:'y1$s5$s1$s4', pId:'y1$s5$s1', name:"删除"},
            { id:'y1$s5$s2', pId:'y1$s5', name:"商品列表"},
              { id:'y1$s5$s2$t1', pId:'y1$s5$s2', name:"添加"},
              { id:'y1$s5$s2$c2', pId:'y1$s5$s2', name:"查看"},
              { id:'y1$s5$s2$b3', pId:'y1$s5$s2', name:"编辑"},
              // { id:'y1$s5$s2$s4', pId:'y1$s5$s2', name:"删除"},
              { id:'y1$s5$s2$s5', pId:'y1$s5$s2', name:"上架"},
              { id:'y1$s5$s2$x6', pId:'y1$s5$s2', name:"下架"},
              { id:'y1$s5$s2$d7', pId:'y1$s5$s2', name:"导出数据"},
            { id:'y1$s5$f3', pId:'y1$s5', name:"附加服务"},
              { id:'y1$s5$f3$t1', pId:'y1$s5$f3', name:"添加"},
              { id:'y1$s5$f3$c2', pId:'y1$s5$f3', name:"查看"},
              { id:'y1$s5$f3$b3', pId:'y1$s5$f3', name:"编辑"},
              { id:'y1$s5$f3$s4', pId:'y1$s5$f3', name:"删除"},
          { id:'y1$d6', pId:'y1', name:"订单管理"},
            { id:'y1$s5$d1', pId:'y1$d6', name:"订单列表"},
              { id:'y1$s5$d1$c1', pId:'y1$s5$d1', name:"查看"},
              // { id:'y1$s5$d1$t2', pId:'y1$s5$d1', name:"退款"},
              { id:'y1$s5$d1$q3', pId:'y1$s5$d1', name:"签收"},
              { id:'y1$s5$d1$d4', pId:'y1$s5$d1', name:"导出EXCEL"},
              { id:'y1$s5$d1$f5', pId:'y1$s5$d1', name:"发货"},
          // { id:'y1$f7', pId:'y1', name:"分享记录"},
          //   { id:'y1$f7$c1', pId:'y1$f7', name:"查看"},
          //   { id:'y1$f7$s2', pId:'y1$f7', name:"删除"},
          //   { id:'y1$f7$s3', pId:'y1$f7', name:"搜索"},
          //   { id:'y1$f7$d4', pId:'y1$f7', name:"导出EXCEL"},
          // { id:'y1$r8', pId:'y1', name:"日志管理"},
          //   { id:'y1$r8$c1', pId:'y1$r8', name:"查看"},
          //   { id:'y1$r8$s2', pId:'y1$r8', name:"删除"},
          //   { id:'y1$r8$s3', pId:'y1$r8', name:"搜索"},
          // { id:'y1$x9', pId:'y1', name:"线上录单"},
            // { id:'y1$x9$l1', pId:'y1$x9', name:"录单"},
            // { id:'y1$x9$l2', pId:'y1$x9', name:"录入图片"},
          //   { id:'y1$x9$d3', pId:'y1$x9', name:"打印衣物码"},
          //   { id:'y1$x9$w4', pId:'y1$x9', name:"完成录单"},
          // { id:'y1$c10', pId:'y1', name:"仓库衣物"},
          //   { id:'y1$c10$c1', pId:'y1$c10', name:"查看"},
          //   { id:'y1$c10$d2', pId:'y1$c10', name:"打印衣物码"},
          //   { id:'y1$c10$s3', pId:'y1$c10', name:"生成批次并通知工厂"},
          // { id:'y1$p11', pId:'y1', name:"批次列表"},
          //   { id:'y1$p11$c1', pId:'y1$p11', name:"查看"},
          //   { id:'y1$p11$d2', pId:'y1$p11', name:"打印批次号"},
          //   { id:'y1$p11$d3', pId:'y1$p11', name:"打印衣物码"},
          //   { id:'y1$p11$d4', pId:'y1$p11', name:"导出EXCEL"},
    ];
  export default {
    data() {
      return {
        isDataLoading: true,
        tableLoading: true,
        columns: [
          {
            title: '角色名称',
            dataIndex: 'roleName',
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
            width: '',
            align: 'center',
            customRender: (c) => {
              return c?c.slice(0, 19):'--'
            }
          },
          {
            title: '创建人',
            dataIndex: 'createName',
            width: '',
            align: 'center',
            customRender: (c) => {
              return c?c:'--'
            }
          },
          {
            title: '操作',
            align: 'center',
            scopedSlots: { customRender: 'active' }
          },
        ],
        addRoleVisible: false,
        addRoleStatus: 1,
        addRoleName: '',
        dataSource: [],
        roleVisible: false,
        roleDetails: {},
        powerVisible: false,
        roleType: 1,
        confirmLoading: false,
        treeData: [],
        selectedKeys: [],
        autoExpandParent: true,
        expandedKeys: [],
        checkedKeys: [],
        zNode:[],
        firstCheck: false,
        pageNum: 1,
        pageList: 20
      }
    },
    created() {
      this.init()
    },
    computed: {
      ...mapState(['userInfo'])
    },
    methods: {
      init() {
        this.treeData = this.structureTree(0)
        this.setExpandedKeys()
        findAll(this.pageNum, this.pageList)
          .then(res => {
            this.dataSource = res
            this.tableLoading = false
            this.isDataLoading = false
          })
      },
      setExpandedKeys() {
        this.expandedKeys = []
        this.treeData.map(item => {
          if (item.pId == 0) {
            this.expandedKeys.push(item.id)
          }
        })
      },
      structureTree(n) {
        let treeData = []
        zNodes.map(item=> {
          if (item.pId === n) {
            let children = this.structureTree(item.id)
            treeData.push({
              title: item.name,
              key: item.id,
              id: item.id,
              children,
              pId: item.pId,
              isNode: children.length
            })
          }
        })
        return treeData
      },
      Refresh() {
        this.tableLoading = true
        this.checkedKeys = []
        this.firstCheck = false
        this.confirmLoading = false
        this.init()
      },
      showAddDrawer(n, data) {
        this.roleType = n
        if (n === 1) {
          this.addRoleVisible = true
        } else if (n === 2) {
          this.addRoleVisible = true
          this.addRoleName = data.roleName
          this.addRoleStatus = data.status
          this.roleId = data.id
        } else if (n === 3) {
          this.powerVisible = true
          this.roleDetails = data
          let powersArr = data.permissions && data.permissions.split('@')[1]?data.permissions.split('@')[1].split('#').filter(item => item):[]
          console.log(powersArr)
          this.checkedKeys = powersArr
        }
      },
      onPowerClose() {
        this.powerVisible = false
        this.Refresh()
      },
      upAddRoleData() {
        if (!this.addRoleName) {
          this.$message.warning('请填写角色名称')
        } else if (this.roleType == 1) {
          this.confirmLoading = true
          sysRoleSave(this.addRoleName, this.addRoleStatus)
            .then(res => {
              console.log(res)
              this.$message.success(res.msg)
              this.onAddRoleClose()
            })
        } else if (this.roleType == 2) {
          this.confirmLoading = true
          sysRoleUpdate(this.roleId, this.addRoleName, this.addRoleStatus)
            .then(res => {
              this.$message.success(res.msg)
              this.onAddRoleClose()
            })
        }
      },
      onAddRoleClose() {
        this.addRoleVisible = false
        this.addRoleStatus = 1
        this.addRoleName = ''
        this.Refresh()
      },
      showDetaileHandle(data) {
        this.roleDetails = data
        this.roleVisible = true
      },
      onRoleDataClose() {
        this.roleVisible = false
      },
      delData(data) {
        let _this = this
        this.$confirm({
          title: '确定要删除此角色吗?',
          content: '删除数据后不能恢复,请谨慎操作!',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk() {
            sysRoleDeleteById(data.id)
              .then(res => {
                _this.$message.success(res.msg)
                _this.Refresh()
              })
          }
        })
      },
      upPowerData() {
        console.log(this.zNode, this.checkedKeys);
        let checkedKeysBjstr2 = this.checkedKeys.map(item => {
          item = this.checkedKeys.some(citem => citem.indexOf(item) >= 0 && citem.split('$').length > item.split('$').length)?[item]:item
          return item
        })
        let zNodeBjstr2 = checkedKeysBjstr2.filter(item => {
          return typeof(item) =='object'
        }).map(item => item[0])
        let bjstr1 = [...this.zNode, ...zNodeBjstr2].map(item => {
          item = item + '#'
          return item
        })
        let bjstr2 = checkedKeysBjstr2.filter(item => {
          return typeof(item) == 'string'
        }).map(item => item + '#')
        let z = '#' + bjstr1.join('')
        let c = '#' + bjstr2.join('')
        let power = this.firstCheck? z +'@' + c :this.roleDetails.permissions
        console.log(power)
        this.confirmLoading = true
        sysRoleUpdate(this.roleDetails.id, this.roleDetails.roleName, this.roleDetails.status, power)
          .then(res => {
            this.$message.success(res.msg)
            this.onPowerClose()
          })
      },
      onExpand(expandedKeys) {
        console.log('onExpand', expandedKeys);
        this.expandedKeys = expandedKeys;
        this.autoExpandParent = false;
      },
      onCheck(checkedKeys, Node) {
        console.log('onCheck', Node.halfCheckedKeys, checkedKeys)
        this.zNode = Node.halfCheckedKeys
        this.firstCheck = true // 记录第一次修改 若点击修改按钮未动权限 则不动权限值
      },
      onSelect(selectedKeys, info) {
        console.log('onSelect', info);
        this.selectedKeys = selectedKeys;
      },
      handleChange(value) {
        this.tableLoading = true
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
    }
  }
</script>

<style lang="scss" scoped>
.add-role, .role-details {
  display: flex;
  flex-direction: column;
  .name {
    align-items: center;
    input {
      width: 150px;
    }
  }
  .status {
    margin-top: 20px;
    align-items: center;
  }
  .item {
    display: flex;
    span {
      font-weight: bold;
    }
  }
}
</style>