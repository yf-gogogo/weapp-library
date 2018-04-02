import { get } from "./request.js";

module.exports = {
  getBookById: function(id) {
    return get("/books/" + id)
  },
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