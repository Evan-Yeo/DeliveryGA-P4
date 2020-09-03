const router = require('express').Router();
const User = require('../model/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkToken = require('../config/auth');
const Fleetbase = require('../services/fleetbase');
/* 
    @route POST api/auth/register
    @desc register user
    @access public
*/
router.post('/register', async (req, res) => {
	let { name, company, email, password } = req.body;
	// console.log('incoming registration', name, company, email, password);
	try {
		let user = new User({ name, company, email, password });
		// console.log(user);

		//hash password before save
		let hashPassword = await bcrypt.hash(password, 10);
		user.password = hashPassword;

		// initialize fleetbase api
		const fleetbase = new Fleetbase();

		// console.log(fleetbase);

		// create vendor in fleetbase
		let vendor = await fleetbase.fetch.post('vendors', {
			name: user.company,
			type: 'admin',
		});

		// set the vendor to user
		user.vendor_id = vendor.id;

		//save user
		await user.save();

		//201 - success and new data was added
		// res.status(201).json({ message: "user registered successfully!" });
		const payload = {
			user: {
				id: user._id,
			},
		};
		//gives you a token on login
		jwt.sign(
			payload,
			'seifewdaystogo',
			{ expiresIn: 360000000 },
			(err, token) => {
				if (err) throw err; //if error go to catch
				res.cookie('token', token, { maxAge: 900000 });
				res.status(200).json({ token, message: 'New user registered.' });
			}
		);
	} catch (error) {
		console.log(error);
		res.status(400).json({ error: 'Unable to register user.' });
	}
});
/* 
    @route POST api/auth/login
    @desc login user
    @access public
*/
router.post('/login', async (req, res) => {
	let { email, password } = req.body;

	try {
		//search db for user with email
		let user = await User.findOne({ email });

		if (!user) {
			return res
				.status(422)
				.json({ error: 'No user found with email provided.' });
		}

		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch) {
			return res.status(422).json({ error: 'Invalid passord provided.' });
		}

		const payload = {
			user: {
				id: user._id,
			},
		};
		//gives you a token on login
		jwt.sign(
			payload,
			'seifewdaystogo',
			{ expiresIn: 360000000 },
			(err, token) => {
				if (err) throw err; //if error go to catch
				res.cookie('token', token, { maxAge: 900000 });
				res.status(200).json({ token });
			}
		);
	} catch (error) {
		console.log(error);
		res.status(422).json({ error: 'Authentication failed.' });
	}
});

router.post('/logout', async (req, res) => {
	// forget token
	res.clearCookie('token');

	res.status(200).json({
		error: 'Session ended',
	});
});

router.get('/session', async (req, res) => {
	// get token
	const token = req.cookies.token;

	if (token) {
		res.status(200).json({
			token,
		});
	}

	res.status(400).json({
		error: 'Session ended',
	});
});

router.get('/me', async (req, res) => {
	try {
		let user = await User.findById(req.user.id, '-password');

		res.status(200).json({
			user,
		});
	} catch (error) {
		res.status(400).json({
			error: 'Session ended',
		});
	}
});

module.exports = router;
