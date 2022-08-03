
const cartServices = require('../services/carts')
const express = require('express')
const { checkIfAuthenticated } = require('../middlewares');
// const { Router } = require('express')

const router = express.Router()

router.get('/', async function(req,res) {
    const cartItems = await cartServices.getCart(req.session.user.id)
    res.render('cart/index', {
        'cartItems': cartItems.toJSON()
    })
})

router.get('/:poster_id/add', async function(req,res) {
    const userId = req.session.user.id;
    const posterId = req.params.poster_id
    await cartServices.addToCart(userId, posterId, 1)
    req.flash('success_messages', 'Product added to cart successfully')
    res.redirect('/cart/')
})

router.post('/:poster_id/update', async function(req,res){
    const userId = req.session.user.id;
    const posterId = req.params.poster_id
    if (req.body.newQuantity > 0){
        await cartServices.updateQuantity(userId, posterId, req.body.newQuantity);
        req.flash('success_messages', 'Quantity has been updated')
        res.redirect('/cart')
    } else {
        req.flash('error_messages', 'Quantity must be greater than 0')
        res.redirect('/cart');
    }
})

router.get('/:poster_id/delete', async function (req,res) {
    await cartServices.remove(req.session.user.id, req.params.poster_id)
    req.flash('success_messages', 'product has been removed fro the shopping cart')
    res.redirect('/cart')
})

module.exports = router