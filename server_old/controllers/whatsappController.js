const { Client, LocalAuth } = require('whatsapp-web.js')
const qrcode = require('qrcode')
const { createCanvas, loadImage } = require("canvas");
const Company = require('../models/companyModel')
const messageModel = require('../models/messageModel')
const fs = require('fs')
const url = require('url')
const http = require("http")
const { log } = require('console')

const setSession = function(session) {
	global.session.push(session)
}

const getSession = function(id) {
	const session = global.session.find(sess => sess.id == id)
}

const deleteSession = function(id) {
	const i = global.session.findIndex(sess => sess.id == id)
	global.session.splice(i, 1)
}

async function create(dataForQRcode, center_image, width, cwidth) {
	const canvas = createCanvas(width, width);
	qrcode.toCanvas(
	  canvas,
	  dataForQRcode,
	  {
		errorCorrectionLevel: "H",
		margin: 1,
		color: {
		  dark: "#000000",
		  light: "#ffffff",
		},
	  }
	);
  
	const ctx = canvas.getContext("2d");
	const img = await loadImage(center_image);
	const center = (width - cwidth) / 2;
	ctx.drawImage(img, center, center, cwidth, cwidth);
	return canvas.toDataURL("image/png");
}


 
const createConnection = async function(id) {
	const client = new Client({
		restartOnAuthFail: true,
		puppeteer: {
			headless: true,
			args: [ 
				'--no-sandbox', 
				'--disable-setuid-sandbox',
				'--disable-dev-shm-usage',
				'--disable-accelerated-2d-canvas',
				'--no-first-run',
				'--no-zygote',
				'--single-process', // <- this one doesn't works in Windows
				'--disable-gpu'
			],
		},
		authStrategy: new LocalAuth({
			clientId: id
		})
	})		

	client.initialize()
	
	const sendReq = (option, data) => {

		postData = JSON.stringify(data)
		console.log(data);
		console.log(option);
	
		const options = {
			hostname: option.hostname,
			port: option.port,
			path: option.path,
			method: option.method,
			headers: {
				'content-type': 'application/json',
				'accept': 'application/json',
			}
		}
		const req = http.request(options, (res) => {
			res.setEncoding('utf8')
			res.on('data', (chunk) => {
				console.log(`BODY: ${chunk}`)
			})
			res.on('end', () => {
				console.log('No more data in response.')
			})
		})
		req.on('error', (e) => {
			console.error(`problem with request: ${e.message}`)
		})
		req.write(postData)
		req.end()
	}
	
	client.on('message_ack', async (msg,status) => {
		let msgID = msg.id.id
		const messageDetail = await messageModel.findOne({'whatsappRefId': msgID})
		if(messageDetail){
			const companyDetail = await Company.find({'instances._id':messageDetail.instanceId})
			const referenceNumber = messageDetail.userRefId //we will fetch this from db
			const parseURL = url.parse(companyDetail[0].webhook, true) //we will fetch this from db
			const data = {
				id: msgID,
				referenceNumber: referenceNumber,
				status: msg.ack
			}
			const options = {
				hostname:parseURL.hostname,
				port:parseURL.port,
				path:parseURL.path,
				method : 'POST'
			}
			sendReq(options, data)
		}else{
			console.log('Something went wrong! Record not found...')
		}
	})

	client.on('qr', async (qr) => {
		const qr_code = await create(
			qr,
			"data:image/png;base64,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",
			300,
			50
		  );
		  global.io.emit('qr', { id: id, src: qr_code })
		  global.io.emit('message', { id: id, text: 'QR Code received, scan please!' })
		// qrcode.toDataURL(qr, (err, qr_code) => {
		// 	global.io.emit('qr', { id: id, src: qr_code })
		// 	global.io.emit('message', { id: id, text: 'QR Code received, scan please!' })
		// })
	})

	client.on('ready', async () => {
		console.log('ready ',id)
		setSession({id: id,	client: client})
		let name = client.info.pushname
		let number = client.info.wid.user
		const session = getSession(id)
		if (!session) { 
			await Company.findOneAndUpdate(
				{'instances._id': id}, 
				{'$set': {'instances.$.name': name, 'instances.$.phone': number, 'instances.$.status': true}},
				{upsert: true, new: true }
			)
			setSession({id: id,	client: client})
		}
		global.io.emit('ready', { id: id,status: true })
		global.io.emit('message', { id: id, name: name, phone: number, text: 'Whatsapp is ready!' })
	})

	client.on('authenticated', () => {
		global.io.emit('authenticated', { id: id })
		global.io.emit('message', { id: id, text: 'Whatsapp is authenticated!' })
	})

	client.on('auth_failure', function() {
		global.io.emit('message', { id: id, text: 'Auth failure, restarting...' })
	})

	client.on('disconnected', async (reason) => {
		console.log('disconnected', id)
		await Company.findOneAndUpdate({'instances._id': id}, {'$set': {'instances.$.status': false}})
		global.io.emit('message', { id: id, text: 'Whatsapp is disconnected!' })
		client.destroy()
		client.initialize()
		deleteSession({id: id})
		console.log('remove-session', id);
		io.emit('remove-session', id)
	});
}

const initConnection = async function(socket) {
	let token = null
	if (socket) {
		token = socket.handshake.query.token
		requestUrl = socket.handshake.headers.referer
		const savedconnections = await Company.findOne({'instances.token': token})
		if (savedconnections) {		
			if(requestUrl !== savedconnections.allowedUrl){
				global.io.emit('message', {text: 'Request is not Authorized!' })
			}else{
				savedconnections.instances.forEach(instance => {	
					if (socket && instance.token == token) {
						socket.emit('init', {id: instance._id, name: instance.name, phone: instance.phone, status: instance.status})
						createConnection(instance.id)
					}
					
				})
			}
		}else {
			global.io.emit('message', {text: 'Request is not Authorized!' })
		}
	} else {
		const companies = await Company.find()		

		companies.forEach(company => {	
			company.instances.forEach(instance => {
				if (instance.status) {
					console.log('createConnection ',instance.id)
					createConnection(instance.id)
				}
			})
		})	
	}	
}

module.exports = { initConnection } 