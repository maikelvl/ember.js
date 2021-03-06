import Ember from "ember-metal/core"; // Ember.lookup
import _MetamorphView from "ember-views/views/metamorph_view";
import EmberView from "ember-views/views/view";
import handlebarsGet from "ember-htmlbars/compat/handlebars-get";
import Container from "ember-runtime/system/container";
import { runAppend, runDestroy } from "ember-runtime/tests/utils";

import EmberHandlebars from "ember-htmlbars/compat";

var compile = EmberHandlebars.compile;

var originalLookup = Ember.lookup;
var TemplateTests, container, lookup, view;

QUnit.module("ember-htmlbars: Ember.Handlebars.get", {
  setup: function() {
    Ember.lookup = lookup = {};
    container = new Container();
    container.optionsForType('template', { instantiate: false });
    container.optionsForType('helper', { instantiate: false });
    container.register('view:default', _MetamorphView);
    container.register('view:toplevel', EmberView.extend());
  },

  teardown: function() {
    runDestroy(container);
    runDestroy(view);
    container = view = null;

    Ember.lookup = lookup = originalLookup;
    TemplateTests = null;
  }
});

test('it can lookup a path from the current context', function() {
  expect(1);

  container.register('helper:handlebars-get', function(path, options) {
    var context = options.contexts && options.contexts[0] || this;

    ignoreDeprecation(function() {
      equal(handlebarsGet(context, path, options), 'bar');
    });
  });

  view = EmberView.create({
    container: container,
    controller: {
      foo: 'bar'
    },
    template: compile('{{handlebars-get "foo"}}')
  });

  runAppend(view);
});

test('it can lookup a path from the current keywords', function() {
  expect(1);

  container.register('helper:handlebars-get', function(path, options) {
    var context = options.contexts && options.contexts[0] || this;

    ignoreDeprecation(function() {
      equal(handlebarsGet(context, path, options), 'bar');
    });
  });

  view = EmberView.create({
    container: container,
    controller: {
      foo: 'bar'
    },
    template: compile('{{#with foo as bar}}{{handlebars-get "bar"}}{{/with}}')
  });

  runAppend(view);
});

test('it can lookup a path from globals', function() {
  expect(1);

  lookup.Blammo = { foo: 'blah'};

  container.register('helper:handlebars-get', function(path, options) {
    var context = options.contexts && options.contexts[0] || this;

    ignoreDeprecation(function() {
      equal(handlebarsGet(context, path, options), lookup.Blammo.foo);
    });
  });

  view = EmberView.create({
    container: container,
    controller: { },
    template: compile('{{handlebars-get "Blammo.foo"}}')
  });

  runAppend(view);
});

test('it raises a deprecation warning on use', function() {
  expect(1);

  container.register('helper:handlebars-get', function(path, options) {
    var context = options.contexts && options.contexts[0] || this;

    expectDeprecation(function() {
      handlebarsGet(context, path, options);
    }, 'Usage of Ember.Handlebars.get is deprecated, use a Component or Ember.Handlebars.makeBoundHelper instead.');
  });

  view = EmberView.create({
    container: container,
    controller: {
      foo: 'bar'
    },
    template: compile('{{handlebars-get "foo"}}')
  });

  runAppend(view);
});
