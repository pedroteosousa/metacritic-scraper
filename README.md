# Metacritic Scraper
[![npm version](https://badge.fury.io/js/metacritic-scraper.svg)](https://badge.fury.io/js/metacritic-scraper)

A node package for getting information from the [Metacritic](http://www.metacritic.com/) website

## A bit of information
Note that this package is very much a scraper, and therefore, *may stop working as aspected on any design change of the Metacritic website*. If this happens, feel free to leave an issue on this repository so I can do something about it, or even better, leave a pull request with a fix.

Also note that this package does **not**, by any means, exhaust the full list of Metacritic features, for now, it only supports getting information from movies. That being said, I do intend to complete this list eventually, even if it might take a while.

## Installing
Run `npm install metacritic-scraper` to install this package. 

## Usage
This package mainly works by using the `search` function and feeding it's results to the other functions. For example, getting critic reviews for the movie *Sausage Party* works like this:
```js
const metacritic = require('metacritic-scraper')

metacritic.search('sausage party', {category: 'movie'}).on('end', (results) => {
	// this assumes that the movie will be the first result
	metacritic.getProduct(results[0]).on('end', (info) => {
		console.log(info.reviews.critic_reviews)
	})
})
```
You can handle errors with `.on('error')`.

## Reference

* [search(text, options)](#search) 
* [getProduct(search_object)](#getProduct)

<a name="search"></a>
#### search(text, options)

Search the Metacrtic website and return the results

|  **Param**  |  **Type**  |  **Default**  |  **Description**  |
| --- | --- | --- | --- |
|  text  |  `String`  |    |  Text sent to the search query  |
|  options  |  `Object`  |    |    |
|  options.category  |  `String`  |  `'all'`  |  Category from which to get results. (Can be `all`, `movie`, `game`, `album`, `tv`, `person`, `video` or `company`)  |
|  options.page  |  `Number`  |  0  |  Page from which to get results   |

<a name="getProduct"></a>
#### getProduct(search_object)

Get additional information about a product. (*Currently only supports movies*)

|  **Param**  |  **Type**  |  **Description**  |
| --- | --- | --- |
|  object  |  `Object`  |  A result returned from the [search](#search) function  |