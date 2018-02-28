var metacritic = require('./index')

metacritic.search('shape water', {category: 'all'}).on('end', (results) => {
	metacritic.getMovie(results[0]).on('end', (reviews) => {
		console.log(reviews)
	})
	metacritic.getReviews(results[0]).on('end', (reviews) => {
		console.log(reviews)
	})
}).on('error', (error) => {
	console.log(error)
})
