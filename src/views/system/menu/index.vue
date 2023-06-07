<template>
  <div class="app-container">
    <div class="head-container">
      <!--工具栏-->
      <div class="head-container">
        <div class="crud-opts">
          <span class="crud-opts-left">
            <el-button
              v-permission="['menu:add']"
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
              type="info"
              class="filter-item"
              plain
              icon="el-icon-sort"
              size="mini"
              @click="toggleExpandAll"
            >展开/折叠</el-button>
          </span>
        </div>
      </div>
    </div>
    <el-table
      v-if="refreshTable"
      ref="menuTable"
      v-loading="listLoading"
      :data="tableData"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      :default-expand-all="isExpandAll"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      :row-class-name="rowClassNameFun"
      :header-row-class-name="headerRowClassName"
      @select="selectFun"
      @select-all="selectAllFun"
      @selection-change="selectionChangeHandler"
    >
      <!--      <el-table-column type="selection" width="55" />-->
      <el-table-column :show-overflow-tooltip="true" label="菜单标题" width="125px" prop="title" />
      <el-table-column prop="icon" label="图标" align="center" width="60px">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon ? scope.row.icon : ''" />
        </template>
      </el-table-column>
      <el-table-column prop="sort" align="center" label="排序">
        <template slot-scope="scope">
          {{ scope.row.sort }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="permission" label="权限标识" />
      <el-table-column :show-overflow-tooltip="true" prop="component" label="组件路径" />
      <el-table-column prop="iframe" label="外链" width="75px">
        <template slot-scope="scope">
          <span v-if="scope.row.iframe">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column prop="cache" label="缓存" width="75px">
        <template slot-scope="scope">
          <span v-if="scope.row.cache">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column prop="hidden" label="可见" width="75px">
        <template slot-scope="scope">
          <span v-if="scope.row.hidden">否</span>
          <span v-else>是</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建日期" width="135px" />
      <el-table-column label="操作" width="130px" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button
            v-permission="['menu:update']"
            type="primary"
            size="mini"
            icon="el-icon-edit"
            :loading="editLoading && scope.row.id == rowId"
            @click="handleEdit(scope.row)"
          />

          <Popover
            v-permission="['menu:delete']"
            :row-data="scope.row"
            msg="确定删除吗，此操作不能撤销！"
            :delete-ids="deleteIds"
            @handleDelete="handleDelete"
          />
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :visible.sync="dialog.visible"
      :title="dialog.title"
      width="600px"
      @close="handleClose"
    >

      <el-form ref="menuForm" :inline="true" :model="form" :rules="rules" size="small" label-width="80px">
        <el-form-item label="菜单类型" prop="type">
          <el-radio-group v-model="form.type" size="mini" style="width: 178px" @change="typeChangeHandle">
            <el-radio-button label="0">目录</el-radio-button>
            <el-radio-button label="1">菜单</el-radio-button>
            <el-radio-button label="2">按钮</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.type.toString() !== '2'" label="菜单图标" prop="icon">
          <el-popover
            placement="bottom-start"
            width="450"
            trigger="click"
            @show="$refs['iconSelect'].reset()"
          >
            <IconSelect ref="iconSelect" @selected="selected" />
            <el-input slot="reference" v-model="form.icon" style="width: 450px;" placeholder="点击选择图标" readonly>
              <svg-icon
                v-if="form.icon"
                slot="prefix"
                :icon-class="form.icon"
                class="el-input__icon"
                style="height: 32px;width: 16px;"
              />
              <i v-else slot="prefix" class="el-icon-search el-input__icon" />
            </el-input>
          </el-popover>
        </el-form-item>
        <el-form-item v-if="form.type.toString() !== '2'" label="外链菜单" prop="iframe">
          <el-radio-group v-model="form.iframe" size="mini">
            <el-radio-button label="true">是</el-radio-button>
            <el-radio-button label="false">否</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.type.toString() === '1'" label="菜单缓存" prop="cache">
          <el-radio-group v-model="form.cache" size="mini">
            <el-radio-button label="true">是</el-radio-button>
            <el-radio-button label="false">否</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.type.toString() !== '2'" label="菜单可见" prop="hidden">
          <el-radio-group v-model="form.hidden" size="mini">
            <el-radio-button label="false">是</el-radio-button>
            <el-radio-button label="true">否</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.type.toString() !== '2'" label="菜单标题" prop="title">
          <el-input
            v-model="form.title"
            :style=" form.type.toString() === '0' ? 'width: 450px' : 'width: 178px'"
            placeholder="菜单标题"
          />
        </el-form-item>
        <el-form-item v-if="form.type.toString() === '2'" label="按钮名称" prop="title">
          <el-input v-model="form.title" placeholder="按钮名称" style="width: 178px;" />
        </el-form-item>
        <el-form-item v-if="form.type.toString() !== '0'" label="权限标识" prop="permission">
          <el-input
            v-model="form.permission"
            :disabled="form.iframe.toString() === 'true'"
            placeholder="权限标识"
            style="width: 178px;"
          />
        </el-form-item>
        <el-form-item v-if="form.type.toString() !== '2'" label="路由地址" prop="path">
          <el-input v-model="form.path" placeholder="路由地址" style="width: 178px;" />
        </el-form-item>
        <el-form-item label="菜单排序" prop="sort">
          <el-input-number
            v-model.number="form.sort"
            :step="10"
            :min="0"
            :max="1000"
            controls-position="right"
            style="width: 178px;"
          />
        </el-form-item>
        <el-form-item
          v-if="form.iframe.toString() !== 'true' && form.type.toString() !== '2'"
          label="组件名称"
          prop="name"
        >
          <el-input v-model="form.name" :style=" form.type.toString() === '0' ? 'width: 450px' : 'width: 178px'" placeholder="匹配组件内Name字段" />
        </el-form-item>
        <el-form-item
          v-if="form.iframe.toString() !== 'true' && form.type.toString() === '1'"
          label="组件路径"
          prop="component"
        >
          <el-input v-model="form.component" style="width: 178px;" placeholder="组件路径" />
        </el-form-item>
        <el-form-item label="上级节点" prop="pid">
          <treeselect
            v-model="form.pid"
            :options="menus"
            :default-expand-level="10"
            :flat="true"
            style="width: 450px;"
            placeholder="选择上级"
            no-children-text="暂无下级节点"
          />
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
import Popover from '@/components/Popover'
import IconSelect from '@/components/IconSelect'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import { addMenu, deleteMenu, updateMenu, getMenu, treeList, lazy } from '@/api/system/menu'

export default {
  name: 'Menu',
  components: { Popover, IconSelect, Treeselect },
  data() {
    return {
      listLoading: true,
      editLoading: false,
      rowId: undefined,
      deleteIds: [],
      form: {
        id: null,
        title: null,
        name: null,
        sort: 1000,
        path: null,
        component: null,
        componentName: null,
        iframe: false,
        pid: 0,
        icon: null,
        cache: false,
        hidden: false,
        type: 0,
        permission: null
      },
      menus: [],
      dialog: {
        visible: false,
        title: '新增'
      },
      selections: [],
      submitLoading: false,
      addLoading: false,
      rules: {
        icon: [
          { required: true, message: '请输入菜单图标', trigger: 'change' }
        ],
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入组件名称', trigger: 'blur' }
        ],
        component: [
          { required: true, message: '请输入组件路径', trigger: 'blur' }
        ]
      },
      tableData: [],
      isExpandAll: true,
      // 重新渲染表格状态
      refreshTable: true
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      treeList().then(response => {
        this.tableData = response.data
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 50)
      })
    },
    selectionChangeHandler(data) {
      // selection 参数是选中的复选框的数据数组
      this.selections = data
    },
    // 显示新增界面
    handleAdd: function() {
      this.addLoading = true
      this.getSupMenus()
      this.addLoading = false
      this.dialog.visible = true
      this.dialog.title = '新增'
    },
    // 显示编辑界面
    handleEdit: async function(params) {
      this.editLoading = true
      this.rowId = params.id
      const menuData = await getMenu(params.id)
      this.getSupMenus()
      this.form = menuData.data
      this.editLoading = false
      this.dialog.visible = true
      this.dialog.title = '修改'
    },
    getSupMenus() {
      const children = this.tableData
      this.filterMenuTree(children)
      this.menus = [{ id: 0, label: '顶级节点', children: children }]
    },
    filterMenuTree(menu) {
      menu.filter(menu => {
        const menuId = menu.id
        if (menuId === this.rowId) {
          menu.isDisabled = true
        } else {
          menu.isDisabled = false
        }
        if (menu.children) {
          this.filterMenuTree(menu.children)
        }
        return true
      })
    },
    loadMenus({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        lazy(parentNode.id).then(res => {
          parentNode.children = res.data.map(function(obj) {
            obj.children = null
            return obj
          })
          setTimeout(() => {
            callback()
          }, 100)
        })
      }
    },
    // 提交表单
    submitForm() {
      this.$refs.menuForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.submitLoading = true
            const data = Object.assign({}, this.form)
            if (!data.id) {
              addMenu(data).then((res) => {
                this.submitLoading = false
                this.$message({ message: '操作成功', type: 'success' })
                this.dialog.visible = false
                this.getList()
              }).catch(err => {
                this.submitLoading = false
              })
            } else {
              updateMenu(data).then((res) => {
                this.submitLoading = false
                this.$message({ message: '操作成功', type: 'success' })
                this.dialog.visible = false
                this.getList()
              }).catch(err => {
                this.submitLoading = false
              })
            }
          })
        }
      })
    },
    handleClose() {
      this.$refs.menuForm.resetFields()
      this.form = this.$options.data().form
      this.dialog.visible = false
    },
    // 显示删除弹出框
    handleDelete: function(params) {
      const ids = params.id
      this.doDelete(ids)
    },
    doDelete(ids) {
      this.delAllLoading = true
      this.deleteIds = ids.split(',')
      deleteMenu({ ids }).then((res) => {
        this.delAllLoading = false
        this.deleteIds = []
        this.$message({ message: '操作成功', type: 'success' })
        this.getList()
      }).catch(err => {
        console.info(err)
        this.delAllLoading = false
        this.deleteIds = []
      })
    },
    // 选中图标
    selected(name) {
      this.form.icon = name
    },
    typeChangeHandle() {
      const type = this.form.type
      this.$refs.menuForm.resetFields()
      const formData = this.$options.data().form
      formData.type = type
      this.form = formData
    },
    /** 展开/折叠操作 */
    toggleExpandAll() {
      this.refreshTable = false
      this.isExpandAll = !this.isExpandAll
      this.$nextTick(() => {
        this.refreshTable = true
      })
    },
    /**
     * Element Table 表格树形结构多选框选中父级时会选中子级（递归多级）
     * https://juejin.cn/post/6947971644564602893
     * @param selection
     * @param row
     */
    selectFun(selection, row) {
      this.setRowIsSelect(row)
    },
    setRowIsSelect(row) {
      // 当点击父级点复选框时，当前的状态可能为未知状态，所以当前行状态设为false并选中，即可实现子级点全选效果
      if (row.isSelect === '') {
        row.isSelect = false
        this.$refs.menuTable.toggleRowSelection(row, true)
      }
      row.isSelect = !row.isSelect
      const that = this

      function selectAllChildrens(data) {
        data.forEach((item) => {
          item.isSelect = row.isSelect
          that.$refs.menuTable.toggleRowSelection(item, row.isSelect)
          if (item.children && item.children.length) {
            selectAllChildrens(item.children)
          }
        })
      }

      function getSelectStatus(selectStatuaArr, data) {
        data.forEach((childrenItem) => {
          selectStatuaArr.push(childrenItem.isSelect)
          if (childrenItem.children && childrenItem.children.length) {
            getSelectStatus(selectStatuaArr, childrenItem.children)
          }
        })
        return selectStatuaArr
      }

      function getLevelStatus(row) {
        // 如果当前节点的parantId =0 并且有子节点，则为1
        // 如果当前节点的parantId !=0 并且子节点没有子节点 则为3
        if (row.pid === 0) {
          if (row.children && row.children.length) {
            return 1
          } else {
            return 4
          }
        } else {
          if (!row.children || !row.children.length) {
            return 3
          } else {
            return 2
          }
        }
      }

      let result = {}

      // 获取明确的节点
      function getExplicitNode(data, pid) {
        data.forEach((item) => {
          if (item.id === pid) {
            result = item
          }
          if (item.children && item.children.length) {
            getExplicitNode(item.children, pid)
          }
        })
        return result
      }

      function operateLastLeve(row) {
        // 操作的是子节点  1、获取父节点  2、判断子节点选中个数，如果全部选中则父节点设为选中状态，如果都不选中，则为不选中状态，如果部分选择，则设为不明确状态
        let selectStatuaArr = []
        const item = getExplicitNode(that.tableData, row.pid)
        selectStatuaArr = getSelectStatus(selectStatuaArr, item.children)
        if (
          selectStatuaArr.every((selectItem) => {
            return selectItem === true
          })
        ) {
          item.isSelect = true
          that.$refs.menuTable.toggleRowSelection(item, true)
        } else if (
          selectStatuaArr.every((selectItem) => {
            return selectItem === false
          })
        ) {
          item.isSelect = false
          that.$refs.menuTable.toggleRowSelection(item, false)
        } else {
          item.isSelect = ''
        }
        // 则还有父级
        if (item.pid !== 0) {
          operateLastLeve(item)
        }
      }

      // 判断操作的是子级点复选框还是父级点复选框，如果是父级点，则控制子级点的全选和不全选

      // 1、只是父级 2、既是子集，又是父级 3、只是子级
      const levelStatus = getLevelStatus(row)
      if (levelStatus === 1) {
        selectAllChildrens(row.children)
      } else if (levelStatus === 2) {
        selectAllChildrens(row.children)
        operateLastLeve(row)
      } else if (levelStatus === 3) {
        operateLastLeve(row)
      }
    },
    checkIsAllSelect() {
      this.oneProductIsSelect = []
      this.tableData.forEach((item) => {
        this.oneProductIsSelect.push(item.isSelect)
      })
      // 判断一级产品是否是全选.如果一级产品全为true，则设置为取消全选，否则全选
      const isAllSelect = this.oneProductIsSelect.every((selectStatusItem) => {
        return selectStatusItem === true
      })
      return isAllSelect
    },
    selectAllFun(selection) {
      const isAllSelect = this.checkIsAllSelect()
      this.tableData.forEach((item) => {
        item.isSelect = isAllSelect
        this.$refs.menuTable.toggleRowSelection(item, !isAllSelect)
        this.selectFun(selection, item)
      })
    },
    rowClassNameFun({ row }) {
      if (row.isSelect === '') {
        return 'indeterminate'
      }
    },
    headerRowClassName({ row }) {
      const oneProductIsSelect = []
      this.tableData.forEach((item) => {
        oneProductIsSelect.push(item.isSelect)
      })
      if (oneProductIsSelect.includes('')) {
        return 'indeterminate'
      }
      return ''
    }
  }
}
</script>

<style>
.indeterminate .el-checkbox__input .el-checkbox__inner {
  background-color: #409eff !important;
  border-color: #409eff !important;
  color: #fff !important;
}

.indeterminate .el-checkbox__input.is-checked .el-checkbox__inner::after {
  transform: scale(0.5);
}

.indeterminate .el-checkbox__input .el-checkbox__inner {
  background-color: #f2f6fc;
  border-color: #dcdfe6;
}

.indeterminate .el-checkbox__input .el-checkbox__inner::after {
  border-color: #c0c4cc !important;
  background-color: #c0c4cc;
}

.product-show th .el-checkbox__inner {
  display: none !important;
}

.indeterminate .el-checkbox__input .el-checkbox__inner::after {
  content: "";
  position: absolute;
  display: block;
  background-color: #fff;
  height: 2px;
  transform: scale(0.5);
  left: 0;
  right: 0;
  top: 5px;
  width: auto !important;
}

.product-show .el-checkbox__inner {
  display: block !important;
}

.product-show .el-checkbox {
  display: block !important;
}
</style>
