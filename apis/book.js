import { get } from "./request.js";

module.exports = {
  getBookByISBN: function(isbn) {
    return get("/books/isbn/" + isbn)
  },
  getRankingBooks: function() {
    return get("/books/ranking")
  },
  getRecommendedBooksByPhone: function(phone) {
    return get("/books/recommend/" + phone)
  }
}