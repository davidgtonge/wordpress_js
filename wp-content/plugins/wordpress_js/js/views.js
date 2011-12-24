(function() {
  var $, BaseView;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  $ = jQuery;
  BaseView = (function() {
    __extends(BaseView, Backbone.View);
    function BaseView() {
      this.save = __bind(this.save, this);
      this.get_data = __bind(this.get_data, this);
      BaseView.__super__.constructor.apply(this, arguments);
    }
    BaseView.prototype.initialize = function() {
      this.$el = $(this.el);
      if (this.model) {
        this.model.bind("change", this.render);
      }
      return this.init();
    };
    BaseView.prototype.get_data = function() {
      return this.$('form:first').serializeObject();
    };
    BaseView.prototype.save = function() {
      this.model.save(this.get_data(), {
        success: function() {
          return console.log("success", arguments);
        },
        error: function() {
          return console.log("error", arguments);
        }
      });
      return false;
    };
    BaseView.prototype.init = function() {
      return "";
    };
    return BaseView;
  })();
  WJS.views.Test = (function() {
    __extends(Test, BaseView);
    function Test() {
      this.render = __bind(this.render, this);
      Test.__super__.constructor.apply(this, arguments);
    }
    Test.prototype.events = {
      "change input": "save",
      "click .save": "save"
    };
    Test.prototype.render = function() {
      var data, name, out, type, _ref;
      data = this.model.toJSON();
      out = "<form>";
      _ref = this.model.fields;
      for (name in _ref) {
        type = _ref[name];
        switch (type) {
          case "text_input":
            out += "<input name=\"" + name + "\" value=\"" + data[name] + "\" />";
            break;
          case "text_area":
            out += "<textarea name=\"" + name + "\">" + data[name] + "</textarea>";
        }
      }
      out += "<button class=\"save\">Save</button>\n</form>";
      this.$el.html(out);
      return this;
    };
    return Test;
  })();
  WJS.views.Logger = (function() {
    __extends(Logger, BaseView);
    function Logger() {
      this.render = __bind(this.render, this);
      Logger.__super__.constructor.apply(this, arguments);
    }
    Logger.prototype.init = function() {
      return WJS.sync.on("log", this.render);
    };
    Logger.prototype.render = function(event, log) {
      if (log == null) {
        log = {
          type: "message",
          text: "Interface Initialised"
        };
      }
      console.log(arguments);
      this.$el.html("<span class=\"" + log.type + "\">" + log.text + "</span>");
      return this;
    };
    return Logger;
  })();
}).call(this);
