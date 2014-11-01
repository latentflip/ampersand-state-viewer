var AmpersandView = require('ampersand-view');
var analyser = require('./lib/state-analyser');

var PropView = AmpersandView.extend({
    template: require('./prop-template.dom'),
});

var DerivedPropView = AmpersandView.extend({
    template: require('./derived-prop-template.dom'),
});


module.exports = AmpersandView.extend({
    template: require('./template.dom'),

    props: {
        stateConstructor: 'any',
        state: 'state'
    },

    initialize: function (attrs) {
        this.state = analyser(this.stateConstructor);
    },

    render: function () {
        this.renderWithTemplate();
        this.renderCollection(this.state.propProperties, PropView, this.queryByHook('props'));
        this.renderCollection(this.state.sessionProperties, PropView, this.queryByHook('session'));
        this.renderCollection(this.state.derivedProperties, DerivedPropView, this.queryByHook('derived'));
    }
});
