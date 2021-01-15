<template>
  <div class="cash_ex">
    <a-card :loading="isDataLoading" :bordered="false">
      <header class="tab-header">
        <div class="header-left">
        </div>
        <div class="header-btn item">
          <a-button-group>
            <a-button type="primary" @click="showAddDrawer(1)" :loading="tableLoading"  v-if="$getRule('y1$x2$r3$t1')">添加人员</a-button>
            <a-button type="primary" icon="sync" @click="Refresh" :loading="tableLoading"></a-button>
          </a-button-group>
        </div>
      </header>
      <a-table :columns="columns" :dataSource="dataSource" bordered :pagination="false" size="middle" :loading="tableLoading" :rowKey="(record) => record.id">
        <template slot-scope="active" slot="active">
          <div class="tab-btns">
            <a-button type="primary" @click="showAddDrawer(2, active)" v-if="$getRule('y1$x2$r3$c2')">详情</a-button>
            <a-button type="primary" @click="showAddDrawer(3, active)" v-if="$getRule('y1$x2$r3$b3')">编辑</a-button>
            <a-button type="danger" @click="delData(active)" v-if="$getRule('y1$x2$r3$s4')">删除</a-button>
            <a-button type="primary" @click="resetPassword(active)" v-if="$getRule('y1$x2$r3$c5')">重置密码</a-button>
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
      :title="type === 1? '添加新角色':type === 2? '角色详情':type === 3?'修改角色':''"
      :visible="visible"
      centered
      @ok="upData"
      @cancel="onClose"
      :confirmLoading="confirmLoading"
      :bodyStyle="{
        'overflow-x': 'auto'
      }"
    >
    <div class="modal_item">
      <div class="list">
        <span class="name">
          姓名
        </span>：
        <a-input placeholder="请输入姓名" v-model="name" :readOnly="type === 2"></a-input>
      </div>
      <div class="list">
        <span class="name">
          性别
        </span>：
        <a-select style="flex:1;" v-model="userSex" :disabled="type === 2">
          <a-select-option :value="1">
            男
          </a-select-option>
          <a-select-option :value="2">
            女
          </a-select-option>
        </a-select>
      </div>
    </div>
    <div class="modal_item">
      <div class="list">
        <span class="name">
          角色
        </span>：
        <a-select style="flex:1;" v-model="userRole" :disabled="type === 2" @change="RoleSelect">
          <a-select-option :value="item.id" v-for="item in roleData" :key="item.id" :disabled="item.status == 2">
            {{item.roleName}}
          </a-select-option>
        </a-select>
      </div>
      <div class="list">
        <span class="name">
          账号
        </span>：
        <a-input placeholder="请输入账号" v-model="userName" :maxLength="16" :readOnly="type === 2"></a-input>
      </div>
    </div>
    <div class="modal_item">
      <div class="list">
        <span class="name">
          手机号码
        </span>：
        <a-input placeholder="请输入手机号" v-model="userMobile" :maxLength="11" :readOnly="type === 2"></a-input>
      </div>
      <div class="list">
        <span class="name">
          邮箱
        </span>：
        <a-input placeholder="请输入邮箱" v-model="userEmail" :maxLength="15" :readOnly="type === 2"></a-input>
      </div>
    </div>
    <div class="modal_item">
      <div class="list">
        <span class="name">
          用户状态
        </span>：
        <a-select style="flex:1;" v-model="userStatus" :disabled="type === 2">
          <a-select-option :value="1">
            启用
          </a-select-option>
          <a-select-option :value="2">
            禁用
          </a-select-option>
        </a-select>
      </div>
    </div>
    <div class="modal_item">
      <div class="list">
        <span class="name">
        备注
        </span>：
        <a-textarea placeholder="请输入备注"  v-model="userRemark" style="flex:1;" :maxLength="50" :readOnly="type === 2"/>
      </div>
    </div>
    </a-modal>
  </div>
</template>
<script>
import { findAll, sysUserFindAll, sysUserSave, sysUserUpdate, sysUserDeleteById, findByUserName } from '@/https'
import { mapState } from 'vuex'
  export default {
    data() {
      return {
        isDataLoading: true,
        tableLoading: true,
        columns: [
          {
            title: '姓名',
            dataIndex: 'name',
            align: 'center',
            customRender: (c) => {
              return c?c:'--'
            }
          },
          {
            title: '性别',
            dataIndex: 'sex',
            align: 'center',
            customRender: (c) => {
              return  c?c == 1? '男':'女':'--'
            }
          },
          {
            title: '所属角色',
            dataIndex: 'roleName',
            align: 'center',
            customRender: (c) => {
              return c?c:'--'
            }
          },
          {
            title: '账号',
            dataIndex: 'username',
            width: '',
            align: 'center',
            customRender: (c) => {
              return c?c:'--'
            }
          },
          {
            title: '状态',
            dataIndex: 'status',
            width: '',
            align: 'center',
            customRender: (c) => {
              return  c?c == 1? '启用':'停用':'--'
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
        dataSource: [],
        pageNum: 1,
        pageList: 20,
        visible: false,
        type: 1,
        confirmLoading: false,
        name: '',
        userSex: 1,
        userMobile: '',
        userRole: '--请选择--',
        userRoleId: '',
        userName:'',
        userEmail: '',
        userStatus: 1,
        userRemark: '',
        userId: '',
        roleData: [],
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
        findAll()
          .then(res => {
            this.roleData = res
          })
        sysUserFindAll(this.pageNum, this.pageList)
          .then(res => {
            this.dataSource = res
            this.isDataLoading = false
            this.tableLoading = false
          })
      },
      Refresh() {
        this.tableLoading = true
        this.onClose()
        this.init()
      },
      showAddDrawer(n, data) {
        this.type = n
        if (n == 2 || n == 3) {
          this.name = data.name
          this.userSex = data.sex
          this.userRole = data.roleName
          this.userRoleId = data.roleId
          this.userName = data.username
          this.userEmail = data.email
          this.userMobile = data.mobile
          this.userRemark = data.remark
          this.userStatus = data.status
          this.userId = data.id
          this.visible = true
        } else if (n === 1) {
          this.visible = true
        }
      },
      onClose() {
        this.name = ''
        this.userSex = 1
        this.userRole = '--请选择--'
        this.userName = ''
        this.userEmail = ''
        this.userMobile = ''
        this.userRemark = ''
        this.userStatus = 1
        this.visible = false
        this.confirmLoading = false
      },
      upData() {
        if (this.type == 2) {
          this.onClose()
        } else {
          if (!this.name) {
            this.$message.warning('请填写姓名')
          } else if (this.userRole == '--请选择--') {
            this.$message.warning('请选择所属角色')
          } else if (!this.userName) {
            this.$message.warning('请填写账号')
          } else if (!/^[a-zA-Z]\w{3,15}$/ig.test(this.userName)) {
            this.$message.warning('账号为4到16位字母开头,不包含特殊字符')
          } else if (this.userMobile && this.userMobile.length != 11) {
            this.$message.warning('请填写正确的手机号')
          } else if (this.userEmail && !/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/.test(this.userEmail)) {
            this.$message.warning('邮箱格式不正确')
          } else {
            this.confirmLoading = true
            findByUserName(this.userName)
              .then(res => {
                let searchId = res[0] && res[0].id
                if (this.type == 1) {
                  if (searchId) {
                    this.$message.warning('该账号已存在')
                    this.confirmLoading = false
                  } else {
                    let userRoleName = this.roleData.filter(item => item.id === this.userRoleId)[0].roleName
                    sysUserSave(this.name, this.userSex, userRoleName, this.userRoleId, this.userName, this.userEmail, this.userMobile, this.userRemark)
                      .then(res => {
                        this.$message.success(res.msg)
                        this.Refresh()
                      })
                  }
                } else if (this.type == 3) {
                  if (searchId && searchId != this.userId) {
                    this.$message.warning('该账号已存在')
                    this.confirmLoading = false
                  } else {
                    let userRoleName = this.roleData.filter(item => item.id === this.userRoleId)[0]?this.roleData.filter(item => item.id === this.userRoleId)[0].roleName : this.userRole
                    sysUserUpdate(this.userId, undefined, this.name, this.userSex, userRoleName, this.userRoleId, this.userName, this.userStatus, this.userEmail, this.userMobile, this.userRemark)
                      .then(res => {
                        this.$message.success(res.msg)
                        this.Refresh()
                      })
                  }
                }
              })
          }
        }
      },
      delData(data) {
        let _this = this
        this.$confirm({
          title: '确定要删除此人员吗?',
          content: '删除数据后不能恢复,请谨慎操作!',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk() {
            console.log(data.id)
            sysUserDeleteById(data.id)
              .then(res => {
                _this.$message.success(res.msg)
                _this.Refresh()
              })
          }
        })
      },
      resetPassword(data) {
        sysUserUpdate(data.id, '123456')
          .then(res => {
            this.$message.success(res.msg)
            this.Refresh()
          })
      },
      RoleSelect() {
        this.userRoleId = this.userRole
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
.modal_item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  .list {
    align-items: center;
    display: flex;
    position: relative;
    flex: 1;
    .name {
      width: 60px;
      text-align-last: justify;
    }
    .maxname {
      width: auto;
      text-align-last: unset;
    }
    input {
      flex: 1;
    }
    .tips {
      position: absolute;
      bottom: -16px;
      color: #f00;
      font-size: 10px;
      transform: scale(.9);
      left: -2px;
    }
  }
  .list:nth-child(2) {
    margin-left: 20px;
  }
  .check_btn {
    display: flex;
    align-items: center;
    .tips_check {
      margin-left: 50px;
    }
  }
}
</style>
