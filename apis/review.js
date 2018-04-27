import { get, post, del } from './request.js'

module.exports = {
  addReviewByBookId: function (id, score, content) {
    return post(`/books/${id}/reviews`, { score, content })
  },
  getReviewsByBookId: function (id, start = 0) {
    return get(`/books/${id}/reviews?start=${start}`)
  },
  getReviewsByPhone: function (phone, start = 0) {
    return get(`/users/${phone}/reviews?start=${start}`)
  },
  deleteReviewById: function (id) {
    return del(`/reviews/${id}`)
  }
}
