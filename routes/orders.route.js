const router = require('express').Router();
const User = require('../model/user.model');
const Fleetbase = require('../services/fleetbase');

router.put('/cancel/:id', async (req, res) => {

    const { id } = req.params;

    // initialize fleetbase
    const fleetbase = new Fleetbase();

    // get the authenticated user
    const user = await User.findById(req.user.id, '-password');
    
    if(!user) {
        return res.status(422).json({
            error: 'Not authorized',
        });
    }

    // update order status
    const order = await fleetbase.fetch.put(`orders/${id}`, {
        status: 'canceled'
    });

    // if error from fleetbase
    if(order.error) {
        return res.status(400).json({
            error: order.error.message || 'Failed to update order status',
        });
    }

    // return order in response
    return res.status(200).json({
        order,
    });

});

router.put('/update-activity/:id', async (req, res) => {

    const { id } = req.params;

    const statuses = [
        {
            status: 'Container picked up',
            details: 'Driver has picked up the container.',
            code: 'DRIVER_STARTED',
        },
        {
            status: 'Container dropped off',
            details: 'Driver has delivered the container.',
            code: 'CONTAINER_SENT',
        }
    ];

    // initialize fleetbase
    const fleetbase = new Fleetbase();

    // get the authenticated user
    const user = await User.findById(req.user.id, '-password');
    
    if(!user) {
        return res.status(422).json({
            error: 'Not authorized',
        });
    }

    // get the order
    let order = await fleetbase.fetch.get(`orders/${id}`);

    // if error from fleetbase
    if(order.error) {
        return res.status(400).json({
            error: order.error.message || 'Failed to update order activity.',
        });
    }

    // get order status
    const { status } = order;

    // if error from fleetbase
    if(!['assigned', 'in_progress'].includes(status)) {
        return res.status(400).json({
            error: `This order is ${status}.`,
        });
    }

    // if order last status code was CONTAINER_SENT complete the job
    if(order.tracking_number.status_code && order.tracking_number.status_code === 'CONTAINER_SENT') {
        // create completed tracking status
        const trackingStatus = await fleetbase.fetch.post('tracking-statuses', {
            tracking_number: order.tracking_number.id,
            status: 'Order completed.',
            details: 'All containers delivered. Order completed.',
            code: 'COMPLETED'
        });

        // if error from fleetbase
        if(trackingStatus.error) {
            return res.status(400).json({
                error: trackingStatus.error.message || 'Failed to update order activity.',
            });
        }
        
        // set order to completed
        order = await fleetbase.fetch.put(`orders/${order.id}`, {
            status: 'completed'
        });

        // return order in response
        return res.status(200).json({
            order,
        });
    }

    // if order status is assigned update the status
    const nextStatus = status === 'assigned' ? statuses[0] : statuses[1];

    // create tracking status
    const trackingStatus = await fleetbase.fetch.post('tracking-statuses', {
        tracking_number: order.tracking_number.id,
        ...nextStatus
    });

    // if error from fleetbase
    if(trackingStatus.error) {
        return res.status(400).json({
            error: trackingStatus.error.message || 'Failed to update order activity.',
        });
    }

    // if order is assigned move to in_progress
    order = await fleetbase.fetch.put(`orders/${order.id}`, {
        status: 'in_progress'
    });

    // return order in response
    return res.status(200).json({
        order,
    });
});

router.get('/activity/:id', async (req, res) => {

    const { id } = req.params;

    // initialize fleetbase
    const fleetbase = new Fleetbase();

    // get the authenticated user
    const user = await User.findById(req.user.id, '-password');
    
    if(!user) {
        return res.status(422).json({
            error: 'Not authorized',
        });
    }

    // get the order
    let statuses = await fleetbase.fetch.get(`tracking-statuses`, {
        order: id
    });

    // if error from fleetbase
    if(statuses.error) {
        return res.status(400).json({
            error: statuses.error.message || 'Failed to fetch order activity.',
        });
    }

    // return statuses in response
    return res.status(200).json({
        statuses: statuses.data,
    });
});

router.post('/new', async (req, res) => {

    // get params 
    const { 
        pickup,
        dropoff,
        driver,
        containers 
    } = req.body;

    // default coordinates
    const coords = {
        latitude: '1.3521',
        longitude: '103.8198'
    };

    // initialize fleetbase
    const fleetbase = new Fleetbase();

    // get the authenticated user
    const user = await User.findById(req.user.id, '-password');
    
    if(!user) {
        return res.status(422).json({
            error: 'Not authorized',
        });
    }

    // save pickup & dropoff
    const pickupRecord = await fleetbase.fetch.post('places', {
        name: pickup,
        ...coords
    });

    const dropoffRecord = await fleetbase.fetch.post('places', {
        name: dropoff,
        ...coords
    });

    // create payload on fleetbase
    const payload = await fleetbase.fetch.post('payloads', {
        pickup: pickupRecord.id,
        dropoff: dropoffRecord.id,
        type: 'haul',
        entities: containers
    });

    // create order in fleetbase
    const order = await fleetbase.fetch.post('orders', {
        facilitator: user.vendor_id,
        payload: payload.id,
        dispatch: false,
        driver
    });

    // if error from fleetbase
    if(order.error) {
        return res.status(400).json({
            error: order.error.message || 'Failed to create order',
        });
    }

    // return order in response
    return res.status(200).json({
        order,
    });

});

router.get('/find/:id', async (req, res) => {

    // get id for order 
    const { id } = req.params;

    // initialize fleetbase
    const fleetbase = new Fleetbase();

    // get the authenticated user
    const user = await User.findById(req.user.id, '-password');
    
    if(!user) {
        return res.status(500).json({
            error: 'Not authorized',
        });
    }

    // get orders facilitated by this vendor
    const order = await fleetbase.fetch.get(`orders/${id}`);

    // if error from fleetbase
    if(order.error) {
        return res.status(400).json({
            error: order.error.message || 'Failed to load order',
        });
    }

    // return order in response
    return res.status(200).json({
        order,
    });

});

router.get('/list', async (req, res) => {

    // initialize fleetbase
    const fleetbase = new Fleetbase();

    // get the authenticated user
    const user = await User.findById(req.user.id, '-password');
    
    if(!user) {
        return res.status(500).json({
            error: 'Not authorized',
        });
    }

    // get orders facilitated by this vendor
    const orders = await fleetbase.fetch.get('orders', {
        facilitator: user.vendor_id
    });

    // if error from fleetbase
    if(!orders.data) {
        return res.status(400).json({
            error: orders.error.message || 'Failed to load orders',
        });
    }

    // return orders in response
    return res.status(200).json({
        orders: orders.data,
    });

});

module.exports = router;