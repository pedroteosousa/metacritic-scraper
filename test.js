var metacritic = require('./index')

metacritic.search('blade runner', {category: ['movie', 'game'], max: 4}).on('end', (results) => {
	console.log(results)
}).on('error', (error) => {
	console.log(error)
})