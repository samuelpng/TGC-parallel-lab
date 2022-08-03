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


const createPosterForm = function(media_properties, tags){
    return forms.create ({
        'title' : fields.string({
            required: true,
            errorAfterField: true,
        }),
        'cost': fields.string({
            required:  true,
            errorAfterField: true,
            'validators':[validators.integer()]
        }),
        'description': fields.string({
            required: true,
            errorAfterField: true
        }),
        'date': fields.string({
            required: true,
            errorAfterField: true,
            widget: widgets.date()
        }),
        'stock': fields.string({
            required:  true,
            errorAfterField: true,
            'validators':[validators.integer()]
        }),
        'height': fields.string({
            required:  true,
            errorAfterField: true,
            'validators':[validators.integer()]
        }),
        'width': fields.string({
            required:  true,
            errorAfterField: true,
            'validators':[validators.integer()]
        }),
        'media_property_id': fields.string({
            label:"Media_property",
            required: true,
            errorAfterField: true,
            widget: widgets.select(),
            choices: media_properties
        }),
        'tags': fields.string({
            required: true,
            errorAfterField: true,
            widget: widgets.multipleSelect(),
            choices: tags
        }),
        'image_url': fields.string({
            widget: widgets.hidden()
        }),
        'thumbnail_url': fields.string({
            widget: widgets.hidden()
        })
    })
}

const createRegistrationForm = () => {
    return forms.create({
        'username': fields.string({
            required: true,
            errorAfterField: true
        }),
        'email': fields.string({
            required: true,
            errorAfterField: true
        }),
        'password': fields.password({
            required: true,
            errorAfterField: true
        }),
        'confirm_password': fields.password({
            required: true,
            errorAfterField: true,
            validators: [validators.matchField('password')]
        })
    })
}

const createLoginForm = () => {
    return forms.create({
        'email': fields.string({
            required: true,
            errorAfterField: true
        }),
        'password': fields.password({
            required: true,
            errorAfterField: true
        })
    })
}

const createSearchForm = function(media_properties, tags) {
    return forms.create({
        'title': fields.string({
            required: false,
            errorAfterField: true
        }),
        'min_cost': fields.string({
            required: false,
            errorAfterField: true,
            'validators': [validators.integer()]
        }),
        'max_cost': fields.string({
            required: false,
            errorAfterField: true
        }),
        'media_property_id': fields.string({
            label: 'media_property',
            required: false,
            errorAfterField: true,
            widget: widgets.select(),
            choices: media_properties
        }),
        'tags': fields.string({
            required: false,
            errorAfterField: true,
            widget: widgets.multipleSelect(),
            choices: tags
        })
    })
}

module.exports = {createPosterForm, createSearchForm, createRegistrationForm, createLoginForm, bootstrapField}