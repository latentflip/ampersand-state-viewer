var StateViewerView = require('./ampersand-state-viewer');
var analyser = require('./lib/state-analyser');

var PersonState = require('ampersand-state').extend({
    modelType: 'Person',
    props: {
        id: 'number',
        name: 'string',
        age: 'number',
    },
    session: {
        isLoggedIn: ['boolean', true, false]
    },
    derived: {
        infoString: {
            deps: ['name', 'age'],
            fn: function() {
                return name + ' is ' + age + 'years old';
            }
        }
    }
});

var view = new StateViewerView({ stateConstructor: PersonState });
view.render();
window.v = view;

document.addEventListener('DOMContentLoaded', function () {
    document.body.appendChild(view.el);
});
