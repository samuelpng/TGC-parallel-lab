const {cartItem, CartItem} = require('../models')

const getCart = async (userId) => {
    return await CartItem.collection()
    .where({
        'user_id': userId
    }).fetch({
        require: false,
        withRelated: ['poster', 'poster.media_property']
    })
}

const getCartItemByUserAndPoster = async (userId, posterId) => {
    return await CartItem.where({
        'user_id': userId,
        'poster_id': posterId
    }).fetch({
        require: false
    })
}

async function createCartItem(userId, posterId, quantity) {
    let cartItem = new CartItem({
        'user_id': userId,
        'poster_id': posterId,
        'quantity': quantity
    })
    await cartItem.save();
    return cartItem;
}

async function removeCartItem(userId, posterId) {
    //always have a try catch
    let cartItem = await getCartItemByUserAndPoster(userId, posterId);
    // await cartItem.destroy()
    if (cartItem) {
        await cartItem.destroy();
        return true;
    } else {
        return false
    }
}

async function updateQuantity(userId, posterId, newQuantity) {
    let cartItem = await getCartItemByUserAndPoster(userId, posterId);
    if (cartItem) {
        cartItem.set('quantity', newQuantity);
        cartItem.save();
        return true;
    } else {
        return false;
    }

}

module.exports = { getCart, getCartItemByUserAndPoster, createCartItem, removeCartItem, updateQuantity }