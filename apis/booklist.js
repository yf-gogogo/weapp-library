import { get, post, del } from './request.js'

module.exports = {
  createBooklist: function (params) {
    return post('/booklists', params)
  },
  getRecommendedBooklistsByUserId: function (id) {
    return get(`/booklists/recommend/${id}`)
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
    return del(`/booklists/${id}`)
  },
  favoriteBooklistById: function (id) {
    return post(`/booklists/${id}/favorite`)
  },
  getBooklistsByKeyword: function (keyword, start = 0) {
    return get('/booklists/search', { keyword, start })
  },
  getBooklistsById: function (id, type = 'all') {
    return get(`/booklists/users/${id}?type=${type}`)
  }
}
