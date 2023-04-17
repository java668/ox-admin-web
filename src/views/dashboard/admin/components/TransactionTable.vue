<template>
  <el-table :data="list" style="width: 100%;padding-top: 15px;">
    <el-table-column label="Order_No" min-width="200">
      <template slot-scope="scope">
        {{ scope.row.order_no | orderNoFilter }}
      </template>
    </el-table-column>
    <el-table-column label="Price" width="195" align="center">
      <template slot-scope="scope">
        ¥{{ scope.row.price | toThousandFilter }}
      </template>
    </el-table-column>
    <el-table-column label="Status" width="100" align="center">
      <template slot-scope="{row}">
        <el-tag :type="row.status | statusFilter">
          {{ row.status }}
        </el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        pending: 'danger'
      }
      return statusMap[status]
    },
    orderNoFilter(str) {
      return str.substring(0, 30)
    }
  },
  data() {
    return {
      list: null
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      const response = { 'code': 20000, 'data': { 'total': 20, 'items': [{ 'order_no': 'F6AcA7c7-7D9E-c8aC-82fb-55620b2722f9', 'timestamp': 778153993279, 'username': 'Kimberly Taylor', 'price': 2701.72, 'status': 'success' }, { 'order_no': '3e69CC81-7C1b-4349-CeeA-d1EfEd5CCAC8', 'timestamp': 778153993279, 'username': 'Ronald Perez', 'price': 6336.42, 'status': 'pending' }, { 'order_no': '1bEEB1e4-f4DC-e2A4-Feed-AD7af9392cbC', 'timestamp': 778153993279, 'username': 'Joseph Davis', 'price': 11177, 'status': 'success' }, { 'order_no': 'DaF4cFD5-bc2f-8DfF-636F-fe7B563BeffB', 'timestamp': 778153993279, 'username': 'Steven Johnson', 'price': 5166.93, 'status': 'pending' }, { 'order_no': '8a6833e6-7AFc-6C2b-e0C7-cA218D95F2af', 'timestamp': 778153993279, 'username': 'Helen Young', 'price': 14455.4, 'status': 'pending' }, { 'order_no': '80Bb7cd1-2CbE-3df8-51Df-0ee5B84Ee5cf', 'timestamp': 778153993279, 'username': 'Margaret Allen', 'price': 10622.7, 'status': 'success' }, { 'order_no': '5FC888fD-ffB6-bAeC-8E7F-08F6aAB6dC65', 'timestamp': 778153993279, 'username': 'Scott Martinez', 'price': 9542.4, 'status': 'success' }, { 'order_no': 'b4C5BAc6-F797-A4e6-E1B2-9B8c2F85D1e7', 'timestamp': 778153993279, 'username': 'Daniel White', 'price': 1647, 'status': 'pending' }, { 'order_no': 'B67dfb56-5AaF-1993-bAA9-EfB3b5E630C6', 'timestamp': 778153993279, 'username': 'Donna Jones', 'price': 11928.8, 'status': 'success' }, { 'order_no': 'Ea0E8CE7-6fc8-7c1e-0E5F-3617f12dbD39', 'timestamp': 778153993279, 'username': 'Elizabeth Johnson', 'price': 8085.44, 'status': 'pending' }, { 'order_no': 'A7c3a86d-cA00-deeb-9c1D-c24fAe21bdad', 'timestamp': 778153993279, 'username': 'Deborah Martin', 'price': 13978.2, 'status': 'pending' }, { 'order_no': 'a106DbB5-2FB6-74Fa-bB5A-15Ef28FdFD7d', 'timestamp': 778153993279, 'username': 'John Moore', 'price': 6128.6, 'status': 'success' }, { 'order_no': 'a7B1d440-2c1E-C5e6-eDBC-abBEf8b6cA5d', 'timestamp': 778153993279, 'username': 'Sandra Gonzalez', 'price': 14299, 'status': 'pending' }, { 'order_no': 'CdAfd8F2-B7fb-ADBd-9B8c-525959b69344', 'timestamp': 778153993279, 'username': 'David Lopez', 'price': 5457.54, 'status': 'success' }, { 'order_no': 'FdD3beF5-d98e-5EF8-EFEA-dAeE99A0614E', 'timestamp': 778153993279, 'username': 'Carol Clark', 'price': 2859.6, 'status': 'success' }, { 'order_no': 'f1E9f6ba-8DC5-48Ed-B57f-b5DDA24F6cfA', 'timestamp': 778153993279, 'username': 'William Martin', 'price': 9470.8, 'status': 'success' }, { 'order_no': 'a7d778A8-d36E-fc0c-de5d-bbcDDea38eB3', 'timestamp': 778153993279, 'username': 'Thomas Garcia', 'price': 8714.4, 'status': 'pending' }, { 'order_no': 'c1d3cC6E-f382-Fa1B-acA5-fe2eba6D698E', 'timestamp': 778153993279, 'username': 'Gary Clark', 'price': 8415.4, 'status': 'success' }, { 'order_no': 'cF02b9A4-B05D-C148-6C43-b4ECA25Ac9E8', 'timestamp': 778153993279, 'username': 'Lisa Thompson', 'price': 12090.86, 'status': 'success' }, { 'order_no': '1d1fBB1f-AbEc-895F-6F84-7fb467DDf6F3', 'timestamp': 778153993279, 'username': 'Christopher Perez', 'price': 14640.24, 'status': 'success' }] }}
      this.list = response.data.items.slice(0, 8)
    }
  }
}
</script>
