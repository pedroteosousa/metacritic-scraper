const movie = require('./movie')
const reviews = require('./reviews')
const events = require('events')

var getProduct = function (object) {
	var emitter = new events ();
	if (object === undefined || object.type === undefined) {
		emitter.emit('error', "invalid search object passed to function")
	}
	else if (object.type === 'Movie') {
		movie.get(object).on('end', (info) => {
			reviews.get(object).on('end', (reviews) => {
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
