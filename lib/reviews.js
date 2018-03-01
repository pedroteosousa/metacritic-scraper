const cheerio = require('cheerio')
const events = require('events')

const helper = require('./helper')

const criticReviewInfo = {
	score: {find: '.metascore_w'},
	source: {find: '.title .source'},
	author: {find: '.title .author'},
	date: {find: '.title .date'},
	summary: {find: '.summary .no_hover'},
	url: {find: '.summary .read_full', attr: 'href'}
}

const userReviewInfo = {
	score: {find: '.metascore_w'},
	author: {find: '.title .author'},
	date: {find: '.title .date'},
	summary: {find: '.summary .blurb_expanded'}
}

module.exports = {
	get: function (search) {
		var emitter = new events ()
		if (search === undefined || search.url === undefined) {
			emitter.emit('error', "invalid search object passed to function")
		}

		var missing = 2
		var results = {
			critic_reviews: [],
			user_reviews: []
		}
		reviewURL = helper.baseURL + search.url + '/{1}'
		helper.request(helper.format(reviewURL, ['critic-reviews'])).on('end', (data) => {
			const $ = cheerio.load(data)
			$('.review').filter((h) => {
				var data = $($('.review')[h])
		
				//remove ads
				if (data.find('.metascore_w').text() == '')
					return
		
				var review = helper.createObject($, criticReviewInfo, $('.review')[h])
				results.critic_reviews.push(review)
			})
			missing--
			if (missing == 0)
				emitter.emit('end', results)
		}).on('error', (error) => {
			emitter.emit('error', error)
		})
		helper.request(helper.format(reviewURL, ['user-reviews'])).on('end', (data) => {
			const $ = cheerio.load(data)
			$('.review').filter((h) => {
				var data = $($('.review')[h])
		
				//remove ads
				if (data.find('.metascore_w').text() == '')
					return
		
				var review = helper.createObject($, userReviewInfo, $('.review')[h])
				results.user_reviews.push(review)
			})
			missing--
			if (missing == 0)
				emitter.emit('end', results)
		}).on('error', (error) => {
			emitter.emit('error', error)
		})
		return emitter
	}
}
