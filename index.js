var search = require('./lib/search')
var product = require('./lib/product')

module.exports = {
	search: search.find,
	getProduct: product.getProduct
}
