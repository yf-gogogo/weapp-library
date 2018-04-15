import { get, post, deleteReq } from './request.js'

module.exports = {
  createBooklist: function (params) {
    return post('/booklists', params)
  },
  getRecommendedBooklistsByPhone: function (phone) {
    return get(`/booklists/recommend/${phone}`)
  },
  getBooklistById: function (id, start = 0) {
    return get(`/booklists/${id}?start=${start}`)
  },
  getBooksByBooklistId: function (id, start = 0) {
    return get(`/booklists/${id}/books?start=${start}`)
  },
  updateBooklistById: function (id, params) {
    return post(`/booklists/${id}`, params)
  },
  deleteBooklistById: function (id) {
    return deleteReq(`/booklists/${id}`)
  },
  favoriteBooklistById: function (id) {
    return post(`/booklists/${id}/favorite`)
  },
  getBooklistsByKeyword: function (keyword, start) {
    return get('/booklists', { keyword, start })
  },
  getBooklistsByPhone: function (phone, type = 'all') {
    return get(`/booklists/users/${phone}?type=${type}`)
  }
}
