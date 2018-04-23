import { get, post, deleteReq } from './request.js'

module.exports = {
  createOrders: function (params) {
    return post('/orders', params)
  }
}
