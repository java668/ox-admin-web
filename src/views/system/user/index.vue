<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <el-input
        v-model="listQuery.q"
        clearable
        size="small"
        placeholder="输入用户名或昵称或邮箱搜索"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="getList"
      />
      <date-range-picker
        v-model="createTime"
        class="date-item"
      />
      <el-select
        v-model="listQuery.enabled"
        clearable
        size="small"
        placeholder="用户状态"
        class="filter-item"
        style="width: 110px"
        @change="getList"
      >
        <el-option v-for="item in $dict.userStatus" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <span>
        <el-button
          v-permission="['user:list']"
          class="filter-item"
          size="mini"
          type="success"
          icon="el-icon-search"
          @click="getList"
        >
          搜索
        </el-button>
        <el-button
          v-permission="['user:list']"
          class="filter-item"
          size="mini"
          type="warning"
          icon="el-icon-refresh-left"
          @click="reset()"
        >
          重置
        </el-button>
      </span>
      <div class="crud-opts">
        <span class="crud-opts-left">
          <el-button
            v-permission="['user:add']"
            class="filter-item"
            size="mini"
            type="primary"
            icon="el-icon-plus"
            :loading="addLoading"
            @click="handleAdd"
          >
            新增
          </el-button>
          <el-button
            v-permission="['user:update']"
            class="filter-item"
            size="mini"
            type="success"
            icon="el-icon-edit"
            :loading="editLoading"
            :disabled="selections.length !== 1"
            @click="handleEdit(selections[0])"
          >
            修改
          </el-button>
          <el-button
            v-permission="['user:delete']"
            class="filter-item"
            type="danger"
            icon="el-icon-delete"
            size="mini"
            :disabled="selections.length === 0"
            :loading="delAllLoading"
            @click="handleBatchDelete(selections)"
          >
            删除
          </el-button>
        </span>
      </div>
    </div>
    <!--表格渲染-->
    <el-table
      ref="table"
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      style="width: 100%;"
      @selection-change="selectionChangeHandler"
      @sort-change="sortChangeHandler"
    >
      <el-table-column :selectable="checkboxT" type="selection" width="55" />
      <el-table-column :show-overflow-tooltip="true" prop="username" label="用户名" />
      <el-table-column :show-overflow-tooltip="true" prop="nickName" label="昵称" />
      <el-table-column prop="gender" label="性别" />
      <el-table-column :show-overflow-tooltip="true" prop="phone" width="100" label="电话" />
      <el-table-column :show-overflow-tooltip="true" width="135" prop="email" label="邮箱" />
      <el-table-column label="状态" align="center" prop="enabled">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enabled"
            :disabled="name === scope.row.username"
            :active-value="0"
            :inactive-value="1"
            active-color="#409EFF"
            inactive-color="#F56C6C"
            @change="changeEnabled(scope.row, scope.row.enabled)"
          />
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="createTime" width="135" label="创建日期" sortable="custom" />
      <el-table-column
        label="操作"
        width="200px"
        align="center"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            v-permission="['user:update']"
            type="primary"
            size="mini"
            icon="el-icon-edit"
            :loading="editLoading && scope.row.id == rowId"
            @click="handleEdit(scope.row)"
          />

          <Popover
            v-permission="['user:delete']"
            :row-data="scope.row"
            :delete-ids="deleteIds"
            :disabled-dle="name === scope.row.username"
            @handleDelete="handleDelete"
          />

        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :visible.sync="dialog.visible"
      :title="dialog.title"
      width="600px"
      @close="handleClose"
    >
      <el-form ref="userForm" :inline="true" :model="form" :rules="rules" size="small" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" :disabled="form.id" @keydown.native="keydown($event)" />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model.number="form.phone" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickName">
          <el-input v-model="form.nickName" @keydown.native="keydown($event)" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" />
        </el-form-item>
        <el-form-item v-if="operation" label="密码" prop="pass">
          <el-input v-model.number="form.pass" type="password" auto-complete="new-password" />
        </el-form-item>
        <el-form-item v-if="operation" label="确认密码" prop="checkPass">
          <el-input v-model.number="form.checkPass" type="password" />
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="form.gender" style="width: 178px">
            <el-radio label="男">男</el-radio>
            <el-radio label="女">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态">
          <!--          <el-radio-group v-model="form.enabled" :disabled="form.id === user.id">-->
          <el-radio-group v-model="form.enabled" :disabled="form.username === name">
            <el-radio
              v-for="item in $dict.userStatus"
              :key="item.id"
              :label="item.id"
            >{{ item.name }}
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item style="margin-bottom: 0;" label="角色" prop="roles">
          <el-select
            v-model="form.roles"
            style="width: 437px"
            multiple
            placeholder="请选择"
          >
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog.visible = false">取 消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="submitForm()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import { checkBtnPermission } from '@/utils/permission' // 权限判断函数
import {add, page, batchDelete, get as getUser, update, changeStatus} from '@/api/system/user'
import { list as roleList } from '@/api/system/role'
import { validPhone } from '@/utils/validate'
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import Popover from '@/components/Popover'
import DateRangePicker from '@/components/DateRangePicker'

export default {
  name: 'User',
  components: { Pagination, Popover, DateRangePicker },
  filters: {},
  data() {
    // 自定义验证
    const isValidPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入电话号码'))
      } else if (!validPhone(value)) {
        callback(new Error('请输入正确的11位手机号码'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/
        if (!reg.test(value)) {
          callback(new Error('密码必须是由6-20位字母+数字组合'))
        }
        if (this.form.checkPass !== '') {
          this.$refs.userForm.validateField('checkPass')
        }
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true,
      createTime: undefined,
      selections: [],
      delAllLoading: false,
      addLoading: false,
      editLoading: false,
      rowId: undefined,
      submitLoading: false,
      operation: false, // true:新增, false:编辑
      deleteIds: [], // true:新增, false:编辑
      listQuery: {
        page: 1,
        limit: 10,
        q: undefined,
        startTime: undefined,
        endTime: undefined,
        enabled: undefined,
        orders: [{ column: 'createTime', order: 'descending' }]
      },
      roleList: [],
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 4, max: 20, message: '长度在 4 到 20 个字符', trigger: 'blur' }
        ],
        nickName: [
          { required: true, message: '请输入用户昵称', trigger: 'blur' },
          { min: 4, max: 20, message: '长度在 4 到 20 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        phone: [
          { required: true, trigger: 'blur', validator: isValidPhone }
        ],
        pass: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' }
        ],
        roles: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ]
      },
      form: {
        id: undefined,
        username: undefined,
        phone: undefined,
        nickName: undefined,
        email: undefined,
        pass: undefined,
        checkPass: undefined,
        gender: '男',
        enabled: 0,
        roles: []

      },
      dialog: {
        visible: false,
        title: '新增'
      }
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    this.getList()
  },
  methods: {
    // 禁止输入空格
    keydown(e) {
      if (e.keyCode === 32) {
        e.returnValue = false
      }
    },
    getList() {
      this.listLoading = true
      if (this.createTime) {
        this.listQuery.startTime = this.createTime[0]
        this.listQuery.endTime = this.createTime[1]
      }
      page(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 50)
      })
    },
    reset() {
      this.listQuery.q = undefined
      this.createTime = undefined
      this.listQuery.startTime = undefined
      this.listQuery.endTime = undefined
      this.listQuery.enabled = undefined
      this.getList()
    },
    handleClose() {
      this.$refs.userForm.resetFields()
      this.form = this.$options.data().form
      this.dialog.visible = false
    },
    // 显示新增界面
    handleAdd: async function() {
      this.addLoading = true
      const res = await roleList()
      this.roleList = res.data
      this.addLoading = false
      this.dialog.visible = true
      this.dialog.title = '新增'
      this.operation = true
    },
    // 显示编辑界面
    handleEdit: async function(params) {
      this.editLoading = true
      this.rowId = params.id
      const roleRes = await roleList()
      const userRes = await getUser(params.id)
      this.roleList = roleRes.data
      this.form = userRes.data
      this.editLoading = false
      this.dialog.visible = true
      this.dialog.title = '修改'
    },
    // 提交表单
    submitForm() {
      this.$refs.userForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.submitLoading = true
            const data = Object.assign({}, this.form)
            if (this.operation) {
              add(data).then((res) => {
                this.submitLoading = false
                this.$message({ message: '操作成功', type: 'success' })
                this.dialog.visible = false
                this.getList()
              }).catch((err) => {
                console.error('user add error:', err)
                this.submitLoading = false
              })
            } else {
              update(data).then((res) => {
                this.submitLoading = false
                this.$message({ message: '操作成功', type: 'success' })
                this.dialog.visible = false
                this.getList()
              }).catch((err) => {
                console.error('user update error:', err)
                this.submitLoading = false
              })
            }
          })
        }
      })
    },
    // 改变状态
    changeEnabled(data, val) {
      this.$confirm('此操作将 "' + this.$dict.label.userStatus[val] + '" ' + data.username + ', 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        changeStatus(data.id, data.enabled).then(res => {
          const message = this.$dict.label.userStatus[val] + '成功'
          this.$message({ message, type: 'success' })
          this.getList()
        }).catch(() => {
          data.enabled = data.enabled === 1 ? 0 : 1
        })
      }).catch(() => {
        data.enabled = data.enabled === 1 ? 0 : 1
      })
    },
    // 显示删除弹出框
    handleDelete: function(params) {
      const ids = params.id
      this.doDelete(ids)
    },
    handleBatchDelete(data) {
      this.$confirm(`确认删除选中的${data.length}条数据?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = this.selections.map(item => item.id).toString()
        this.doDelete(ids)
      }).catch(() => {
      })
    },
    doDelete(ids) {
      this.delAllLoading = true
      this.deleteIds = ids.split(',')
      batchDelete({ ids }).then((res) => {
        this.delAllLoading = false
        this.deleteIds = []
        this.$message({ message: '操作成功', type: 'success' })
        this.getList()
      }).catch(err => {
        this.delAllLoading = false
        this.deleteIds = []
      })
    },
    selectionChangeHandler(data) {
      this.selections = data
    },
    checkboxT(row, rowIndex) {
      return row.name !== this.name
    },
    sortChangeHandler({ prop, order }) {
      const orderItem = { column: prop, order }
      const orders = this.listQuery.orders
      const filterOrders = orders.filter(item => item.column !== prop)
      filterOrders.push(orderItem)
      this.listQuery.orders = filterOrders
      this.getList()
    }
  }
}
</script>
