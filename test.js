var metacritic = require('./index')

metacritic.search('blade runner', {category: 'movie'}).on('end', (results) => {
	metacritic.getMovie(results[0]).on('end', (reviews) => {
		console.log(reviews)
	})
}).on('error', (error) => {
	console.log(error)
})
