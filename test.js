var metacritic = require('./index')

metacritic.searchProduct('blade runner', {category: 'movie'}).on('end', (results) => {
	metacritic.getReviews(results[0]).on('end', (reviews) => {
		console.log(reviews)
	})
}).on('error', (error) => {
	console.log(error)
})