const cartDataLayer = require('../dal/carts')

async function addToCart(userId, posterId, quantity) {
    //check if poster id is already in shopping cart
    const cartItem = await cartDataLayer.getCartItemByUserAndPoster(userId, posterId)
    if (!cartItem){
    //if not then create new
    await cartDataLayer.createCartItem(userId, posterId, quantity)
   
    }else {
    //if yes, increase qty of poster
       await cartDataLayer.updateQuantity(userId, posterId, cartItem.get('quantity') + 1)
    }
    return true;   
}

async function getCart(userId) {
    return cartDataLayer.getCart(userId);
}

async function updateQuantity(userId, posterId, newQuantity){
    //todo: ceck if the qty matches the biz rules
    return cartDataLayer.updateQuantity(userId, posterId, newQuantity);
}


async function remove (userId, posterId) {
    return cartDataLayer.removeCartItem(userId, posterId)
}

module.exports = {addToCart, getCart, updateQuantity, remove}