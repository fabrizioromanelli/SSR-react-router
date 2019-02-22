//
// This module is the server to be called from within the lambda
//
import fs from 'fs';
import path from 'path'
import express from 'express'
import React from 'react'
import ReactDOMServer, { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { matchRoutes } from 'react-router-config'
import App from '../src/App'
import { routes } from '../src/routes'

require('dotenv').config();

const server = express()
const viewPath = process.env.DEVELOPMENT ? 'views' : 'build'

// Set view engine & serve static assets
server.set('view engine', 'ejs')
server.set('views', path.join(__dirname, '..', viewPath))
server.use(express.static(path.join(__dirname, '..', 'build')))

// Always return the main index.html, so react-router render the route in the client
server.get('*', (req, res) => {
	const branch = matchRoutes(routes, req.url)
	const promises = []

	branch.forEach( ({route, match}) => {
		if (route.loadData) // fetching data
			promises.push(route.loadData(match))
	})

	Promise.all(promises).then(data => {
		// data will be an array[] of datas returned by each promises.
		// console.log(data)

		const context = data.reduce( (context, data) => {
			return Object.assign(context, data)
		}, {})

		const content = renderToString(
			<StaticRouter location={req.url} context={context} >
				<App/>
			</StaticRouter>
		)

		if(context.url) {
			res.writeHead(301, {Location: context.url})
			res.end()
		}
		return res.render('index', {content})
	})
})

module.exports = server;
