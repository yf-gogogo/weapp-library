import { get, post, deleteReq } from './request.js'

module.exports = {
  createOrders: function (params) {
    return post('/orders', params)
  },
  getOrdersByPhone: function (phone, type, start = 0) {
    return get(`/orders/users/${phone}`, { type, start })
  },
  cancelOrderByOrderId: function (id) {
    return post(`/orders/${id}/cancel`)
  }
}
