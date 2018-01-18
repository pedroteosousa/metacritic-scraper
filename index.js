var product = require('./lib/product')
var reviews = require('./lib/reviews')

module.exports = {
	searchProduct: product.searchProduct,
	getReviews: reviews.getReviews
}