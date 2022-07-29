const forms = require('forms');
const router = require('../routes/posters');
const fields = forms.fields;
const widgets = forms.widgets;
const validators = forms.validators;

var bootstrapField = function (name, object) {
    if (!Array.isArray(object.widget.classes)) { object.widget.classes = []; }

    if (object.widget.classes.indexOf('form-control') === -1) {
        object.widget.classes.push('form-control');
    }

    var validationclass = object.value && !object.error ? 'is-valid' : '';
    validationclass = object.error ? 'is-invalid' : validationclass;
    if (validationclass) {
        object.widget.classes.push(validationclass);
    }

    var label = object.labelHTML(name);
    var error = object.error ? '<div class="invalid-feedback">' + object.error + '</div>' : '';

    var widget = object.widget.toHTML(name, object);
    return '<div class="form-group">' + label + widget + error + '</div>';
};


const createPosterForm = function(){
    return forms.create ({
        'title' : fields.string({
            require: true,
            errorAfterField: true,
            cssClasses:{
                label: ['form-label']
            }
        }),
        'cost': fields.string({
            required:  true,
            errorAfterField: true
        }),
        'description': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses:{label: ['form-label']},
            'validators':[validators.integer()]
        }),
        'description': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses:{
                label: ['form-label']
            }
        })
    })
}


module.exports = {createPosterForm, bootstrapField}