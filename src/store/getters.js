const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  user: state => state.user.user,
  avatar: state => state.user.avatar,
  userId: state => state.user.userId,
  name: state => state.user.name,
  roles: state => state.user.roles,
  permissions: state => state.user.permissions,
  permission_routes: state => state.permission.routes,
  sqlApi: state => state.api.sqlApi,
  swaggerApi: state => state.api.swaggerApi,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews
}
export default getters
