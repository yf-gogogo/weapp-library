import { get, post } from './request.js'

module.exports = {
  addReviewByBookId: function (id, score, content) {
    return post(`/books/${id}/reviews`, { score, content })
  },
  getReviewsByBookId: function (id, start = 0) {
    return get(`/books/${id}/reviews?start=${start}`)
  }
}
