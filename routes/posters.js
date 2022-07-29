const express = require("express");
const router = express.Router();

// #1 import in the Posters model
const {Poster} = require('../models')
//import in the forms
const { bootstrapField, createPosterForm } = require('../forms')

router.get('/', async (req,res)=>{
    // #2 - fetch all the posters (ie, SELECT * from posters)
    let posters = await Poster.collection().fetch();
    res.render('posters/index', {
        'posters': posters.toJSON() // #3 - convert collection to JSON
    })
})

// router.get('/create', function(req,res){
//     res.send("Create product")
// })

// router.get('/', async function(req,res){
//     res.render('posters/index', {
//         'posters': posters.toJSON()
//     })
// })

router.get('/create', function(req,res){
    const posterForm = createPosterForm();
    res.render('posters/create',{
        'form': posterForm.toHTML(bootstrapField)
    })
})

router.post('/create', async function(req,res){
    const posterForm = createPosterForm()
    posterForm.handle(req, {
        'success': async (form) => {
            const poster = new Poster();
            poster.set('title', form.data.title);
            poster.set('cost', form.data.cost);
            poster.set('description', form.data.description);
            await poster.save();
            res.redirect('/posters')
        }
    })
})

router.get('/:poster_id/update', async (req,res)=>{
    //retrieve the product
    const posterId = req.params.poster_id
    const poster = await Poster.where({
        'id': posterId
    }).fetch({
        require: true
    })

    const posterForm = createPosterForm();

    //fill in the existing values
    posterForm.fields.title.value = poster.get('title')
    posterForm.fields.cost.value = poster.get('cost')
    posterForm.fields.description.value = poster.get('description')

    res.render('posters/update', {
        'form': posterForm.toHTML(bootstrapField),
        'poster': poster.toJSON()
    })
})

router.post('/:poster_id/update', async (req,res)=>{
    //fetch the poster that we want to update
    const poster = await Poster.where({
        'id': req.params.poster_id
    }).fetch({
        require: true
    });

    //process the form
    const posterForm = createPosterForm();
    posterForm.handle(req,{
        'success': async (form) =>{
            poster.set(form.data);
            poster.save();
            res.redirect('/posters')
        },
        'error': async (form) => {
            res.render('posters/update', {
                'form': form.toHTML(bootstrapField),
                'poster': poster.toJSON()
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
        'poster': poster.toJSON
    })
})

module.exports = router;