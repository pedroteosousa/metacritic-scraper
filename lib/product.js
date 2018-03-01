const movie = require('./movie')
const reviews = require('./reviews')
const events = require('events')

var getProduct = function (search) {
	var emitter = new events ();
	if (search === undefined || search.type === undefined) {
		emitter.emit('error', "invalid search object passed to function")
	}
	else if (search.type === 'Movie') {
		movie.get(search).on('end', (info) => {
			reviews.get(search).on('end', (reviews) => {
				info.reviews = reviews
				emitter.emit('end', info)
			}).on('error', (error) => {
				emitter.emit('end', info)
			})
		}).on('error', (error) => {
			emitter.emit('error', error)
		})
	} else {
		emitter.emit('error', "This function is not yet supported")
	}
	return emitter;
}

module.exports = {
	getProduct: getProduct
}
