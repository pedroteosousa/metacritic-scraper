var product = require('./lib/search')
var reviews = require('./lib/reviews')
var movie = require('./lib/movie')

module.exports = {
	search: product.search,
	getReviews: reviews.getReviews,
	getMovie: movie.getMovie
}
