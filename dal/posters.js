//import in the Poster model
const { Poster, Media_Property, Tag } = require('../models');

// async function getAllMediaProperties() {
//     return await Media_Property.fetchAll().map((media_property) => {
//         return [media_property.get('id'), media_property.get('name')]
//     })
// }

async function getAllMediaProperties() {
    const media_properties = await Media_Property.fetchAll().map(media_property => {
        return [media_property.get('id'), media_property.get('name')]
    });
    return media_properties;
}

// const getAllTags = async() => {
//     const allTags = await Tag.fetchAll().map(tag => [tag.get('id'), tag.get('name')]);
// }

async function getAllTags() {
    const tags = await Tag.fetchAll().map(tag => {
        return [tag.get('id'), tag.get('name')]
    });
    return tags;
}

async function getPosterById(posterId) {
    const poster = await Poster.where({
        'id': parseInt(posterId)
    }).fetch({
        require: true,
        withRelated: ['tags', 'media_property']
    })
    return poster;
}

module.exports = {
    getAllMediaProperties, getAllTags, getPosterById
}