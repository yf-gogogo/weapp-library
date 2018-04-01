import { get } from "./request.js";

module.exports = {
  getRecommendedBooklistsByPhone: function(phone) {
    return get("/booklists/recommend/" + phone)
  }
}