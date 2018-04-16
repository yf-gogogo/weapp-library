import { get, post, deleteReq } from './request.js'

module.exports = {
  addReviewByBookId: function (id, score, content) {
    return post(`/books/${id}/reviews`, { score, content })
  },
  getReviewsByBookId: function (id, start = 0) {
    return get(`/books/${id}/reviews?start=${start}`)
  },
  deleteReviewById: function (id) {
    return deleteReq(`/reviews/${id}`)
  }
}
