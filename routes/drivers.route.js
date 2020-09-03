const router = require('express').Router();
const User = require('../model/user.model');
const Fleetbase = require('../services/fleetbase');

router.post('/new', async (req, res) => {

    // get params 
    const { name, email, phone_number, password } = req.body;

    // initialize fleetbase
    const fleetbase = new Fleetbase();

    // get the authenticated user
    const user = await User.findById(req.user.id, '-password');
    
    if(!user) {
        return res.status(422).json({
            error: 'Not authorized',
        });
    }

    // get drivers employed by this vendor
    const driver = await fleetbase.fetch.post('drivers', {
        vendor: user.vendor_id,
        name,
        email,
        password,
        phone_number,
        phone_country_code: 65,
        country: 'SG'
    });

    // if error from fleetbase
    if(driver.error) {
        return res.status(500).json({
            error: driver.error.message,
        });
    }

    // return driver in response
    return res.status(200).json({
        driver,
    });

});

router.get('/list', async (req, res) => {

    // initialize fleetbase
    const fleetbase = new Fleetbase();

    // get the authenticated user
    const user = await User.findById(req.user.id, '-password');
    
    if(!user) {
        return res.status(422).json({
            error: 'Not authorized',
        });
    }

    // get drivers employed by this vendor
    const drivers = await fleetbase.fetch.get('drivers', {
        vendor: user.vendor_id
    });

    // if error from fleetbase
    if(!drivers.data) {
        return res.status(500).json({
            error: drivers.error.message || 'Failed to load drivers.',
        });
    }

    // return drivers in response
    return res.status(200).json({
        drivers: drivers.data,
    });

});

module.exports = router;