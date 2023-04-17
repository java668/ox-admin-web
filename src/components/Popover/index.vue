<template>
  <span style="margin-left: 3px;">
    <el-popover
      v-model="visible"
      placement="top"
      width="180"
    >
      <p>{{ msg }}</p>
      <div style="text-align: right; margin: 0">
        <el-button size="mini" type="text" @click="visible = false">取消</el-button>
        <el-button type="primary" size="mini" @click="handleDelete">确定</el-button>
      </div>
      <el-button slot="reference" :loading="dleLoading" :disabled="disabledDle" type="danger" icon="el-icon-delete" size="mini" />
    </el-popover>
  </span>
</template>

<script>
export default {
  name: 'Popover',
  props: {
    rowData: {
      type: Object,
      required: true
    },
    deleteIds: {
      type: Array,
      required: true,
      default: []
    },
    disabledDle: {
      type: Boolean,
      default: false
    },
    msg: {
      type: String,
      default: '确定删除本条数据吗？'
    }
  },
  data() {
    return {
      visible: false

    }
  },
  computed: {
    dleLoading() {
      return this.deleteIds.includes(this.rowData.id)
    }
  },
  methods: {
    handleDelete() {
      this.$emit('handleDelete', this.rowData)
      this.visible = false
    }
  }
}
</script>

<style scoped>

</style>
