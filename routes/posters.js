const express = require("express");
const router = express.Router();

// #1 import in the Posters model
const {Poster, Media_Property, Tag} = require('../models')
//import in the forms
const { bootstrapField, createPosterForm, createSearchForm } = require('../forms')
const { checkIfAuthenticated } = require('../middlewares');
const dataLayer = require('../dal/posters')

router.get('/', async (req,res)=>{

    const allMediaProperties = await dataLayer.getAllMediaProperties()
    allMediaProperties.unshift([0, '--- Any Media Property ---'])

    const allTags = await dataLayer.getAllTags()

    //create Search Form
    let searchForm =  createSearchForm(allMediaProperties, allTags)
    let q = Poster.collection()

    searchForm.handle(req, {
        'empty': async(form)=>{
            let posters = await q.fetch({
                withRelated: ['media_property', 'tags']
            })
            res.render('posters/index', {
                'posters': posters.toJSON(),
                'form': form.toHTML(bootstrapField)
            })
        },
        'error': async (form)=>{
            let posters = await q.fetch({
                withRelated: ['media_property']
            })
            res.render('posters/index', {
                'posters': posters.toJSON(),
                'form': form.toHTML(bootstrapField)
            })
        },
        'success': async (form)=>{
            if (form.data.title) {
                q.where('title', 'like', '%' + form.data.title + '%')
            }
            if (form.data.media_property_id && form.data.media_property_id != "0") {
                 q.where('media_property_id', '=', form.data.media_property_id)
            }

            if (form.data.min_cost) {
                q.where('cost', '>=', form.data.min_cost)
            }
            if (form.data.max_cost) {
                q = q.where('cost', '<=', form.data.max_cost);
            }
             if (form.data.tags) {
                q.query('join', 'posters_tags', 'posters.id', 'poster_id')
                .where('tag_id', 'in', form.data.tags.split(','))
            }
            let posters = await q.fetch({
                withRelated: ['media_property', 'tags']
            })
            res.render('posters/index', {
                'posters': posters.toJSON(),
                'form': form.toHTML(bootstrapField)
            })
        }
    })


    // #2 - fetch all the posters (ie, SELECT * from posters)
    // let posters = await Poster.collection().fetch({
    //     withRelated: ['media_property', 'tags']
    // });
    // res.render('posters/index', {
    //     'posters': posters.toJSON() // #3 - convert collection to JSON
    // })
})

// router.get('/create', function(req,res){
//     res.send("Create product")
// })

// router.get('/', async function(req,res){
//     res.render('posters/index', {
//         'posters': posters.toJSON()
//     })
// })

router.get('/create', checkIfAuthenticated, async function(req,res){
    const allMediaProperties = await dataLayer.getAllMediaProperties()

    const allTags = await dataLayer.getAllTags()

    const posterForm = createPosterForm(allMediaProperties, allTags);
    res.render('posters/create',{
        'form': posterForm.toHTML(bootstrapField),
        cloudinaryName: process.env.CLOUDINARY_NAME,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
        cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
    })
})

router.post('/create', checkIfAuthenticated, async function(req,res){

    const allMediaProperties = await dataLayer.getAllMediaProperties()

    const allTags = await dataLayer.getAllTags()

    // const allTags = await (await Tag.fetchAll()).invokeMap(tag => {
    //     [tag.get('id'), tag.get('name')]
    // })

    const posterForm = createPosterForm(allMediaProperties, allTags)

    posterForm.handle(req, {
        'success': async (form) => {
            
            const poster = new Poster();

            poster.set('title', form.data.title);
            poster.set('cost', form.data.cost);
            poster.set('description', form.data.description);
            poster.set('date', form.data.date);
            poster.set('stock', form.data.stock);
            poster.set('height', form.data.height);
            poster.set('width', form.data.width);
            poster.set('media_property_id', form.data.media_property_id);
            poster.set('image_url', form.data.image_url);
            poster.set('thumbnail_url', form.data.thumbnail_url)
            
            await poster.save();
            if (form.data.tags){
                await poster.tags().attach(form.data.tags.split(','))
            }

            req.flash('success_messages', `New Poster ${poster.get('title')} has been created`)

            res.redirect('/posters')
        },
        'error': async (form) => {
            res.render('posters/create',{
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/:poster_id/update', async (req,res)=>{
    //retrieve the product

    const posterId = req.params.poster_id
    const poster = await dataLayer.getPosterById(posterId)

    const allTags = await Tag.fetchAll().map( tag => [tag.get('id'), tag.get('name')])

    const allMediaProperties = await Media_Property.fetchAll().map((media_property) => {
        return [media_property.get('id'), media_property.get('name')]
    })

    const posterForm = createPosterForm(allMediaProperties, allTags);

    //fill in the existing values
    posterForm.fields.title.value = poster.get('title')
    posterForm.fields.cost.value = poster.get('cost')
    posterForm.fields.description.value = poster.get('description'),
    posterForm.fields.date.value = poster.get('date'),
    posterForm.fields.stock.value = poster.get('stock'),
    posterForm.fields.height.value = poster.get('height'),
    posterForm.fields.width.value = poster.get('width'),
    posterForm.fields.media_property_id.value = poster.get('media_property_id'),
    posterForm.fields.image_url.value = poster.get('image_url')
    posterForm.fields.thumbnail_url.value = poster.get('thumbnail_url')


    let selectedTags = await poster.related('tags').pluck('id');
    posterForm.fields.tags.value = selectedTags


    res.render('posters/update', {
        'form': posterForm.toHTML(bootstrapField),
        'poster': poster.toJSON(),
        cloudinaryName: process.env.CLOUDINARY_NAME,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
        cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
    })
})

router.post('/:poster_id/update', async (req,res)=>{
    //fetch the poster that we want to update
    const poster = await Poster.where({
        'id': req.params.poster_id
    }).fetch({
        require: true,
        withRelated: ['tags']
    });

    //process the form
    const allMediaProperties = await Media_Property.fetchAll().map((media_property) => {
        return [media_property.get('id'), media_property.get('name')]
    })

    const allTags = await (await Tag.fetchAll()).map(tag => 
        [tag.get('id'), tag.get('name')]
    )

    const posterForm = createPosterForm(allMediaProperties, allTags);
    posterForm.handle(req,{
        'success': async (form) =>{
            // poster.set('thumbnail_url', form.data.thumbnail_url)
            let {tags, ...posterData} = form.data
            poster.set(posterData);
            
            poster.save();

            //update the tags
            let tagIds = tags.split(',');
            let existingTagIds = await poster.related('tags').pluck('id');

            //remove all the tags that aren't selected anymore
            let toRemove = existingTagIds.filter( id => tagIds.includes(id) === false);
            await poster.tags().detach(toRemove);

            //add in all the tags selected in the form
            await poster.tags().attach(tagIds)

            res.redirect('/posters')
        },
        'error': async (form) => {
            res.render('posters/update', {
                'form': form.toHTML(bootstrapField),
                'poster': poster.toJSON()
            })
        },
        'empty': async function(form) {
            res.render('products/update', {
                'poster': poster.toJSON(),
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/:poster_id/delete', async(req,res)=>{
    //fetch the product that we want to delete
    const poster = await Poster.where({
        'id': req.params.poster_id
    }).fetch({
        require: true
    });
    res.render('posters/delete',{
        'poster': poster.toJSON()
    })
})

router.post('/:poster_id/delete', async(req,res)=>{
    const poster = await Poster.where({
        'id': req.params.poster_id
    }).fetch({
        require: true
    })
    await poster.destroy();
    res.redirect('/posters')
})

// router.get('/register', (req,res)=>{
//     //display the registration form
//     const registrationForm = createRegistrationForm();
//     res.render('users/register', {
//         'form': registrationForm.toHTML(bootstrapField)
//     })
// })

module.exports = router;