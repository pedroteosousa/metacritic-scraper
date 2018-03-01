var metacritic = require('./index')

metacritic.search('sausage party', {category: 'movie'}).on('end', (results) => {
	metacritic.getProduct(results[0]).on('end', (info) => {
		console.log(info.reviews.critic_reviews)
	})
})
