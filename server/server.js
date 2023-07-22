require('dotenv').config()
const express = require('express')
const socketIO = require('socket.io')
const http = require('http')
const cors = require("cors")
const mongoose = require('mongoose')
const packageRoutes = require('./routes/package')
const companyRoutes = require('./routes/company')
const userRoutes = require('./routes/user')
const messageRoutes = require('./routes/message')
const groupRoutes = require('./routes/group')
const { initConnection } = require('./controllers/whatsappController')
const { initScheduledJobs } = require('./cron_jobs/message-cron-job')

const path = require ('node:path');
const { fileURLToPath } = require ('url');
const { dirname } = require ('path');

const session =  []
global.session = session

// express app
const app = express()
app.use(cors())

//middleware
app.use(express.json());
//app.use(express.urlencoded());


app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

// //routes
app.use('/api/packages', packageRoutes)
app.use('/api/companies', companyRoutes)
app.use('/api/user', userRoutes)
app.use('/api/message', messageRoutes)
app.use('/api/groups', groupRoutes)

//socket io
const server = http.createServer(app)

const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
}); 

global.io = io

io.on('connection', function(socket) {
	console.log('connection');
	initConnection(socket);
});

initConnection()
initScheduledJobs()
//connect to DB

const start = async () => {
	await mongoose.connect(process.env.NONGO_URL) 
	.then(() => {
		//listen for requests
		server.listen(process.env.PORT, () => {
			console.log('Connected to the DB and listening on port no ', process.env.PORT)
		}) 
	})
	.catch((err) => {
		console.log(err.message)
	}) 
}
start()

//#region HOME ROUTE AND INVALID ROUTE DECLARATION

app.use(express.static(path.join(__dirname, 'client')));

// For Admin Panel UI
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname,'./client', 'index.html'));
});
//#endregion
