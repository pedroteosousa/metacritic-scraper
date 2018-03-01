#Metacritic Scraper
A node package for getting information from the [metacritic](http://www.metacritic.com/) website

## A bit of information
Note that this package is very much a scraper, and therefore, *may stop working as aspected on any design change of the Metacritic website*. If this happens, feel free to leave an issue on this repository so I can do something about it, or even better, leave a pull request with a fix.

Also note that this package does **not**, by any means, exhaust the full list of Metacritic features, for now, it only supports getting information from movies. That being said, I do intend to complete this list eventually, even if it might take a while.

## Installing
This package has a few dependencies. To install them, run `npm install`

## Usage
This package mainly works by using the `search` function and feeding it's results to the other functions. For example, getting critic reviews for the movie *The Shape of Water* works like this:
```js
const metacritic = require('metacritic-scraper')

metacritic.search('shape water', {category: 'movie'}).on('end', (results) => {
	// this assumes that the movie will be the first result
	metacritic.getProduct(results[0]).on('end', (info) => {
		console.log(info.reviews.critic_reviews)
	})
})
```
You can handle errors with `.on('error')`.
