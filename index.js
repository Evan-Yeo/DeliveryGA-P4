//======= require all dependencies
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const auth = require('./middleware/auth');
const cookieParser = require('cookie-parser');
//=== add all middlewares
require('./config/db');

app.use(express.json());
app.use(cookieParser());
app.use(auth);
app.use(
	cors({
		origin: 'http://localhost:3000',
		credentials: true,
	})
); //allows all requests from outside servers or apps
//=== setup my routes
app.use('/api/auth', require('./routes/auth.route'));
app.use('/api/orders', require('./routes/orders.route'));
app.use('/api/drivers', require('./routes/drivers.route'));
app.get('/', (req, res) => {
	res.status(200).json({ message: 'SUCCESS', code: 'COOL' });
});
//=== 404 errors
app.get('*', (req, res) => {
	res.status(404).json({ message: 'ERROR', code: 'EB404' });
});
//=== setup the server port
app.listen(process.env.PORT, () =>
	console.log(`running on ${process.env.PORT}`)
);
