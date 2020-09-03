const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
	const except = ['auth/login', 'auth/register', 'auth/session'];

	const uri = req.originalUrl;

	// if request shuld be excluded from auth check
	if (except.some((path) => uri.includes(path))) {
		console.log('request excluded from auth middleware');
		return next();
	}

	// if options request conitnue
	if (req.method === 'OPTIONS') {
		return next();
	}

	const token = req.header('x-auth-token') || req.cookies.token;

	console.log('auth token', token);

	if (!token) {
		return res.status(401).json({
			message: 'No user authenticated.',
		});
	}

	try {
		const decoded = jwt.verify(token, 'seifewdaystogo');

		req.user = decoded.user;
		next();
	} catch (err) {
		return res.status(401).json({
			message: 'Invalid auth token provided.',
		});
	}
};
