<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" size="small" :inline="true" label-width="68px">
      <el-form-item label="菜单标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入菜单标题"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-permission="['test3:menu:add']"
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="el-icon-sort"
          size="mini"
          @click="toggleExpandAll"
        >展开/折叠</el-button>
      </el-col>
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>

    <el-table
      v-if="refreshTable"
      v-loading="loading"
      :data="menuList"
      row-key="id"
      :default-expand-all="isExpandAll"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column label="菜单标题" align="center" prop="title" />
      <el-table-column label="组件名称" align="center" prop="name" />
      <el-table-column label="组件" align="center" prop="component" />
      <el-table-column label="排序" align="center" prop="sort" />
      <el-table-column label="图标" align="center" prop="icon" />
      <el-table-column label="链接地址" align="center" prop="path" />
      <el-table-column label="是否外链" align="center" prop="iframe" />
      <el-table-column label="缓存" align="center" prop="cache" />
      <el-table-column label="隐藏" align="center" prop="hidden" />
      <el-table-column label="权限" align="center" prop="permission" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-permission="['test3:menu:edit']"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            v-permission="['test3:menu:add']"
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
          >新增</el-button>
          <el-button
            v-permission="['test3:menu:remove']"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改系统菜单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="上级菜单ID" prop="pid">
          <treeselect v-model="form.pid" :options="menuOptions" :normalizer="normalizer" placeholder="请选择上级菜单ID" />
        </el-form-item>
        <el-form-item label="菜单标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入菜单标题" />
        </el-form-item>
        <el-form-item label="组件名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入组件名称" />
        </el-form-item>
        <el-form-item label="组件" prop="component">
          <el-input v-model="form.component" placeholder="请输入组件" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入排序" />
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="form.icon" placeholder="请输入图标" />
        </el-form-item>
        <el-form-item label="链接地址" prop="path">
          <el-input v-model="form.path" placeholder="请输入链接地址" />
        </el-form-item>
        <el-form-item label="是否外链" prop="iframe">
          <el-input v-model="form.iframe" placeholder="请输入是否外链" />
        </el-form-item>
        <el-form-item label="缓存" prop="cache">
          <el-input v-model="form.cache" placeholder="请输入缓存" />
        </el-form-item>
        <el-form-item label="隐藏" prop="hidden">
          <el-input v-model="form.hidden" placeholder="请输入隐藏" />
        </el-form-item>
        <el-form-item label="权限" prop="permission">
          <el-input v-model="form.permission" placeholder="请输入权限" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listMenu, getMenu, delMenu, addMenu, updateMenu } from '@/api/test3/menu'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'Menu',
  components: {
    Treeselect
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 系统菜单表格数据
      menuList: [],
      // 系统菜单树选项
      menuOptions: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 是否展开，默认全部展开
      isExpandAll: true,
      // 重新渲染表格状态
      refreshTable: true,
      // 查询参数
      queryParams: {
        title: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        pid: [
          { required: true, message: '上级菜单ID不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '菜单类型不能为空', trigger: 'change' }
        ],
        isDeleted: [
          { required: true, message: '是否删除不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询系统菜单列表 */
    getList() {
      this.loading = true
      listMenu(this.queryParams).then(response => {
        this.menuList = this.handleTree(response.data, 'id', 'pid')
        this.loading = false
      })
    },
    /** 转换系统菜单数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.id,
        label: node.title,
        children: node.children
      }
    },
    /** 查询系统菜单下拉树结构 */
    getTreeselect() {
      listMenu().then(response => {
        this.menuOptions = []
        const data = { id: 0, title: '顶级节点', children: [] }
        data.children = this.handleTree(response.data, 'id', 'pid')
        this.menuOptions.push(data)
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        pid: null,
        type: null,
        title: null,
        name: null,
        component: null,
        sort: null,
        icon: null,
        path: null,
        iframe: null,
        cache: null,
        hidden: null,
        permission: null,
        createBy: null,
        updateBy: null,
        createTime: null,
        updateTime: null,
        isDeleted: null
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset()
      this.getTreeselect()
      if (row != null && row.id) {
        this.form.pid = row.id
      } else {
        this.form.pid = 0
      }
      this.open = true
      this.title = '添加系统菜单'
    },
    /** 展开/折叠操作 */
    toggleExpandAll() {
      this.refreshTable = false
      this.isExpandAll = !this.isExpandAll
      this.$nextTick(() => {
        this.refreshTable = true
      })
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      this.getTreeselect()
      if (row != null) {
        this.form.pid = row.id
      }
      getMenu(row.id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改系统菜单'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateMenu(this.form).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addMenu(this.form).then(response => {
              this.$modal.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$modal.confirm('是否确认删除系统菜单编号为"' + row.id + '"的数据项？').then(function() {
        return delMenu(row.id)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {})
    }
  }
}
</script>
