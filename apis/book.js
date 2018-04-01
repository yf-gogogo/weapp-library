import { get } from "./request.js";

module.exports = {
  getRankingBooks: function() {
    return get("/books/ranking")
  },
  getRecommendedBooksByPhone: function(phone) {
    return get("/books/recommend/" + phone)
  }
}