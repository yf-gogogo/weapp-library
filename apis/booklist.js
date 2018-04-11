import { get, post, deleteReq } from './request.js'

module.exports = {
  getRecommendedBooklistsByPhone: function (phone) {
    return get('/booklists/recommend/' + phone)
  },
  getBooklistById: function (id) {
    return get('/booklists/' + id)
  },
  updateBooklistById: function (id, params) {
    return post('/booklists/' + id, params)
  },
  deleteBooklistById: function (id) {
    return deleteReq('/booklists/' + id)
  },
  favoriteBooklistById: function (id) {
    return post('/booklists/' + id + '/favorite')
  },
  getBooklistsByKeyword: function (keyword, start) {
    return get('/booklists', {keyword, start})
  },
  getBooklistsByPhone: function (phone, type = 'all') {
    return get('/booklists/users/' + phone, { type })
  }
}
