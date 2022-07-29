//one Model Class represents one table

const bookshelf = require('../bookshelf')

const Poster = bookshelf.model('Posters', {
    tableName:'posters'
});

const Category = bookshelf.model('Category',{
    tableName: 'categories'
})

module.exports = { Poster, Category };