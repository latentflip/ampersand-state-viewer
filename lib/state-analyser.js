var State = require('ampersand-state');
var Collection = require('ampersand-collection');
var _ = require('underscore');

//Reset indent on the code to minimum possible
function dedent (str) {
    var lines = str.split('\n');
    var indent = _.min(lines.map(function (line, i) {
        if (i === 0) { return Infinity; }
        return line.match(/^\s*/)[0].length;
    }));
    lines = lines.map(function (line, i) {
        if (i === 0) { return line.trim(); }
        return line.slice(indent);
    });
    return lines.join('\n');
}

var Prop = State.extend({
    idAttribute: 'name',
    props: {
        name: 'string',
        type: 'string',
        default: 'any',
        required: 'boolean'
    },
});

var Derived = Prop.extend({
    props: {
        deps: 'array',
        fn: 'string'
    }
});

var Props = Collection.extend({ model: Prop });
var SessionProps = Collection.extend({ model: Prop });
var DerivedProps = Collection.extend({ model: Derived });

var AnalysedState = State.extend({
    props: {
        name: 'string'
    },
    collections: {
        propProperties: Props,
        sessionProperties: SessionProps,
        derivedProperties: DerivedProps
    }
});

module.exports = function (constructor) {
    var proto = constructor.prototype;
    var props = [];
    var session = [];
    var derived = [];

    if (proto._definition) {
        Object.keys(proto._definition).forEach(function (propName) {
            var rawDef = proto._definition[propName];
            var def = {
                name: propName,
                type: rawDef.type,
                default: rawDef.default,
                required: rawDef.required || false
            };
            
            if (rawDef.session) {
                session.push(def);
            } else {
                props.push(def);
            }
        });
    }

    if (proto._derived) {
        Object.keys(proto._derived).forEach(function (propName) {
            var rawDef = proto._derived[propName];
            var def = {
                name: propName,
                deps: rawDef.depList,
                fn: dedent(rawDef.fn.toString())
            };
            derived.push(def);
        });
    }

    return new AnalysedState({
        name: proto.modelType,
        propProperties: props,
        sessionProperties: session,
        derivedProperties: derived
    });
};
