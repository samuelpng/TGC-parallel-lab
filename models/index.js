//one Model Class represents one table

const bookshelf = require('../bookshelf')

const Poster = bookshelf.model('Poster', {
    tableName:'posters',
    media_property() {
        return this.belongsTo('Media_property')
    },
    tags() {
        return this.belongsToMany('Tag')
    }
});


const Media_Property = bookshelf.model('Media_property',{
    tableName:'media_properties',
    posters() {
        return this.hasMany('Poster')
    }
})

const Tag = bookshelf.model('Tag', {
    tableName: 'tags',
    posters() {
        return this.belongsToMany('Poster')
    }
})

const User = bookshelf.model('User', {
    tableName: 'users'
})

const CartItem = bookshelf.model('CartItem', {
    tableName: 'cart_items',
    poster() {
        return this.belongsTo('Poster')
    },
    user() {
        return this.belongsTo('User')
    }
})

module.exports = { Poster, Media_Property, Tag, User, CartItem };