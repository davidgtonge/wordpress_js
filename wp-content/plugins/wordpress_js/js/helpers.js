(function() {
  var BaseModel, BaseView, ChildPage, Page, Widget;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  require("underscore");
  require("xdate");
  _.mixin({
    nice_date: function(date) {
      return (new XDate(date)).toString("D, M, Y");
    },
    iso_date: function(date) {
      return (new XDate(date)).toString("yy-mm-dd");
    }
  });
  BaseModel = (function() {
    __extends(BaseModel, Backbone.Model);
    function BaseModel() {
      BaseModel.__super__.constructor.apply(this, arguments);
    }
    BaseModel.prototype.save = function(data) {
      var key, meta_data, post_data, tax_data, value, _len, _results;
      post_data = {};
      meta_data = {};
      tax_data = {};
      _results = [];
      for (value = 0, _len = data.length; value < _len; value++) {
        key = data[value];
        _results.push((function() {
          switch (key.substr(0, 4)) {
            case "post":
              return post_data[key.substr(5)] = value;
            case "meta":
              return meta_data[key.substr(5)] = value;
            case "tax_":
              return tax_data[key.substr(4)] = value;
          }
        })());
      }
      return _results;
    };
    return BaseModel;
  })();
  BaseView = (function() {
    __extends(BaseView, Backbone.View);
    function BaseView() {
      BaseView.__super__.constructor.apply(this, arguments);
    }
    BaseView.prototype.init = function() {
      this.$el = $(this.el);
      return this.model.bind("change", this.render);
    };
    return BaseView;
  })();
  Page = (function() {
    function Page() {}
    Page.prototype.views = [];
    Page.prototype.get_data = function() {
      var view, _i, _len, _ref, _results;
      _ref = this.views;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        view = _ref[_i];
        _results.push(view.get_data());
      }
      return _results;
    };
    return Page;
  })();
  ChildPage = (function() {
    function ChildPage() {}
    ChildPage.prototype.get_data = function() {
      return this.$el.find('form').serializeObject();
    };
    return ChildPage;
  })();
  Widget = (function() {
    __extends(Widget, Backbone.View);
    function Widget() {
      Widget.__super__.constructor.apply(this, arguments);
    }
    return Widget;
  })();
}).call(this);
