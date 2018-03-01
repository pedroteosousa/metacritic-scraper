var metacritic = require('./index')

metacritic.search('shape water', {category: 'all'}).on('end', (results) => {
	metacritic.getProduct(results[0]).on('end', (info) => {
		console.log(info.reviews.critic_reviews)
	})
})
