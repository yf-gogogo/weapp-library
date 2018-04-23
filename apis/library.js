import { get, post, deleteReq } from './request.js'

module.exports = {
  getLibraryById: function (id) {
    return get(`/libraries/${id}`)
  }
}
