// 表单重置
export function resetForm(refName) {
  if (this.$refs[refName]) {
    this.$refs[refName].resetFields()
  }
}

// 验证是否为blob格式
export function blobValidate(data) {
  return data.type !== 'application/json'
}
