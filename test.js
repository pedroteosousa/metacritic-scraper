var metacritic = require('./index')

metacritic.search('blade runner').on('end', (results) => {
	metacritic.getReviews(results[0]).on('end', (reviews) => {
		console.log(reviews)
	})
}).on('error', (error) => {
	console.log(error)
})