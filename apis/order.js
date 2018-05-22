import { get, post, del } from './request.js'

module.exports = {
  createOrders: function (params) {
    return post('/orders', params)
  },
  getOrdersByUserId: function (uid, type, start = 0) {
    return get(`/orders/users/${uid}`, { type, start })
  },
  cancelOrderByOrderId: function (id) {
    return post(`/orders/${id}/cancel`)
  }
}
