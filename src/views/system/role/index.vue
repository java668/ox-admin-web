<template>
  <div class="app-container">
    <div class="head-container">
      <!--工具栏-->
      <div class="head-container">
        <el-input
          v-model="listQuery.q"
          clearable
          size="small"
          placeholder="请输入角色名称或描述搜索"
          style="width: 200px;"
          class="filter-item"
          @keyup.enter.native="getList"
        />
        <date-range-picker
          v-model="createTime"
          class="date-item"
        />
        <span>
          <el-button
            v-permission="['role:list']"
            class="filter-item"
            size="mini"
            type="success"
            icon="el-icon-search"
            @click="getList"
          >
            搜索
          </el-button>
          <el-button
            v-permission="['role:list']"
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
              v-permission="['role:add']"
              class="filter-item"
              size="mini"
              type="primary"
              icon="el-icon-plus"
              @click="handleAdd"
            >
              新增
            </el-button>
            <el-button
              v-permission="['role:update']"
              class="filter-item"
              size="mini"
              type="success"
              icon="el-icon-edit"
              :disabled="selections.length !== 1"
              @click="handleEdit(selections[0])"
            >
              修改
            </el-button>
            <el-button
              v-permission="['role:delete']"
              class="filter-item"
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="selections.length === 0"
              :loading="delAllLoading"
              @click="handleDelete(selections)"
            >
              删除
            </el-button>
          </span>
        </div>
      </div>
    </div>

    <el-row :gutter="15">
      <!--角色管理-->
      <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17" style="margin-bottom: 10px">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span class="role-span">角色列表</span>
          </div>
          <el-table
            v-loading="loading"
            highlight-current-row
            style="width: 100%;"
            :data="list"
            @selection-change="selectionChangeHandler"
            @current-change="handleCurrentChange"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column prop="name" label="名称" />
            <el-table-column prop="code" label="角色编码" />
            <el-table-column :show-overflow-tooltip="true" prop="description" label="描述" />
            <el-table-column :show-overflow-tooltip="true" width="135px" prop="createTime" label="创建日期" />
            <el-table-column label="操作" width="130px" align="center" fixed="right">
              <template slot-scope="scope">
                <div>
                  <el-button
                    v-permission="['role:update']"
                    :loading="false"
                    :disabled="false"
                    size="mini"
                    type="primary"
                    icon="el-icon-edit"
                    @click="handleEdit(scope.row)"
                  />
                  <Popover
                    v-permission="['role:delete']"
                    :row-data="scope.row"
                    :delete-ids="deleteIds"
                    @handleDelete="handleDelete"
                  />
                </div>
              </template>
            </el-table-column>
          </el-table>
          <!--分页组件-->
          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="listQuery.page"
            :limit.sync="listQuery.limit"
            @pagination="getList"
          />
        </el-card>
      </el-col>

      <!-- 菜单授权 -->
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="7">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <el-tooltip class="item" effect="dark" content="选择指定角色分配菜单" placement="top">
              <span class="role-span">菜单分配</span>
            </el-tooltip>
            <el-button
              v-permission="['role:saveMenu']"
              :disabled="!showButton"
              :loading="menuLoading"
              icon="el-icon-check"
              size="mini"
              style="float: right; padding: 6px 9px"
              type="primary"
              @click="saveMenu"
            >保存
            </el-button>
          </div>
          <el-tree
            ref="menu"
            :data="menuTree"
            :default-checked-keys="menuIds"
            :props="defaultProps"
            default-expand-all
            show-checkbox
            node-key="id"
          />
        </el-card>
      </el-col>
    </el-row>

    <!-- 表单渲染 -->
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :visible.sync="dialog.visible"
      :title="dialog.title"
      width="520px"
      @close="handleClose"
    >
      <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="80px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" style="width: 380px;" />
        </el-form-item>
        <el-form-item label="角色编码" prop="code">
          <el-input v-model="form.code" style="width: 380px;" />
        </el-form-item>
        <el-form-item label="描述信息" prop="description">
          <el-input v-model="form.description" style="width: 380px;" rows="5" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="dialog.visible = false">取 消</el-button>
        <el-button type="primary" :loading="editLoading" @click.native="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { add, batchDelete, update, getRole, page, saveMenu } from '@/api/system/role'
import Pagination from '@/components/Pagination'
import Popover from '@/components/Popover'
import DateRangePicker from '@/components/DateRangePicker'
import { treeList } from '@/api/system/menu'

export default {
  name: 'Index',
  components: { DateRangePicker, Popover, Pagination },
  data() {
    // 自定义验证
    const isValidRoleCode = (rule, value, callback) => {
      const reg = /[A-Z_]+/
      if (!value) {
        callback(new Error('请输入角色编码'))
      } else if (!reg.test(value)) {
        callback(new Error('角色编码必须大写字母或_组成'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      delAllLoading: false,
      editLoading: false,
      createTime: undefined,
      total: 0,
      list: [],
      menuTree: [],
      defaultProps: { children: 'children', label: 'label' },
      menuIds: [],
      selections: [],
      deleteIds: [],
      listQuery: {
        page: 1,
        limit: 10,
        q: undefined,
        startTime: undefined,
        endTime: undefined,
        orders: [{ column: 'createTime', order: 'descending' }]
      },
      form: {
        id: undefined,
        name: undefined,
        code: undefined,
        description: undefined
      },
      dialog: {
        visible: false,
        title: '新增'
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 4, max: 20, message: '长度在 4 到 20 个字符', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入编码', trigger: 'blur' },
          { min: 4, max: 20, message: '长度在 4 到 20 个字符', trigger: 'blur' },
          { validator: isValidRoleCode, trigger: 'blur' }
        ]
      },
      currentId: undefined,
      showButton: false,
      menuLoading: false
    }
  },
  created() {
    this.getList()
    this.getMenusTree()
  },
  methods: {
    getList() {
      this.loading = true
      if (this.createTime) {
        this.listQuery.startTime = this.createTime[0]
        this.listQuery.endTime = this.createTime[1]
      }
      page(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        // Just to simulate the time of the request
        setTimeout(() => {
          this.loading = false
        }, 50)
      })
    },
    getMenusTree() {
      treeList().then(response => {
        this.menuTree = response.data
        // Just to simulate the time of the request
        // setTimeout(() => {
        //   this.listLoading = false;
        // }, 50);
      })
    },
    reset() {
      this.listQuery.q = undefined
      this.createTime = undefined
      this.listQuery.startTime = undefined
      this.listQuery.endTime = undefined
      this.getList()
    },
    handleAdd() {
      this.dialog.visible = true
      this.dialog.title = '新增'
    },
    handleEdit(row) {
      this.dialog.visible = true
      this.dialog.title = '编辑'
      this.form = Object.assign({}, row)
    },
    handleClose() {
      this.$refs.form.resetFields()
      this.form = this.$options.data().form
      this.dialog.visible = false
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.editLoading = true
            const data = Object.assign({}, this.form)
            if (!data.id) {
              add(data).then((res) => {
                this.editLoading = false
                this.$message({ message: '操作成功', type: 'success' })
                this.dialog.visible = false
                this.getList()
              }).catch((err) => {
                console.error('role add error:', err)
                this.editLoading = false
              })
            } else {
              update(data).then((res) => {
                this.editLoading = false
                this.$message({ message: '操作成功', type: 'success' })
                this.dialog.visible = false
                this.getList()
              }).catch((err) => {
                console.error('role update error:', err)
                this.editLoading = false
              })
            }
          })
        }
      })
    },
    handleDelete(data) {
      let ids
      if (data instanceof Array) {
        ids = this.selections.map(item => item.id).toString()
        this.$confirm(`确认删除选中的${data.length}条数据?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delAllLoading = true
          batchDelete({ ids }).then((res) => {
            this.delAllLoading = false
            this.$message({ message: '操作成功', type: 'success' })
            this.getList()
          }).catch((err) => {
            console.error('role batchDelete error:', err)
            this.delAllLoading = false
          })
          // eslint-disable-next-line handle-callback-err
        }).catch((err) => {
        })
      } else {
        ids = data.id
        this.delAllLoading = true
        batchDelete({ ids }).then((res) => {
          this.delAllLoading = false
          this.$message({ message: '操作成功', type: 'success' })
          this.getList()
        }).catch((err) => {
          console.error('role delete error:', err)
          this.delAllLoading = false
        })
      }
    },
    selectionChangeHandler(data) {
      this.selections = data
    },
    /**
     * https://blog.csdn.net/a4561614/article/details/124859265?spm=1001.2101.3001.6661.1&utm_medium=distribute.pc_relevant_t0.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-1-124859265-blog-127199584.235%5Ev28%5Epc_relevant_t0_download&depth_1-utm_source=distribute.pc_relevant_t0.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-1-124859265-blog-127199584.235%5Ev28%5Epc_relevant_t0_download&utm_relevant_index=1
     * @param val
     * @returns {Promise<void>}
     */
    handleCurrentChange: async function(val) {
      if (val) {
        // eslint-disable-next-line no-unused-vars
        const _this = this
        // 清空菜单的选中
        this.$refs.menu.setCheckedKeys([])
        // 保存当前的角色id
        this.currentId = val.id
        const role = await getRole(val.id)
        // 初始化默认选中的key
        // this.menuIds = role.data.menuList;
        const resData = role.data
        resData.menuList.forEach((item) => {
          this.$nextTick(() => {
            const node = this.$refs.menu.getNode(item)
            if (node.isLeaf) {
              // 判断是否是子节点
              this.$refs.menu.setChecked(node, true)
            }
          })
        })
        this.showButton = true
      }
    },
    saveMenu: async function() {
      this.menuLoading = true
      const roleId = this.currentId
      const menuIds = [
        ...this.$refs.menu.getHalfCheckedKeys(),
        ...this.$refs.menu.getCheckedKeys()
      ]
      if (menuIds.length) {
        await saveMenu(roleId, menuIds)
        this.$message({ message: '操作成功', type: 'success' })
      } else {
        this.$message({ message: '请选择菜单', type: 'warning' })
      }
      this.menuLoading = false
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  .role-span {
    font-weight: bold;
    color: #303133;
    font-size: 15px;
  }
</style>

