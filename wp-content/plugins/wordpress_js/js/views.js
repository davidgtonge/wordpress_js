(function() {
  var $, PostListItem,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  $ = jQuery;

  WJS.views.BaseView = (function(_super) {

    __extends(BaseView, _super);

    BaseView.name = 'BaseView';

    function BaseView() {
      this.save = __bind(this.save, this);

      this.html = __bind(this.html, this);

      this.elem = __bind(this.elem, this);

      this.get_data = __bind(this.get_data, this);
      return BaseView.__super__.constructor.apply(this, arguments);
    }

    BaseView.prototype.initialize = function() {
      var $template, _ref, _ref2;
      this.$el = $(this.el);
      if ((_ref = this.model) != null) _ref.bind("change", this.render);
      if ((_ref2 = this.collection) != null) _ref2.bind("change", this.render);
      if (this.name) {
        $template = $("#tmpl_" + this.name);
        if ($template.length) this.template = _.template($template.html());
      }
      return this.init();
    };

    BaseView.prototype.get_data = function() {
      return this.$('form:first').serializeObject();
    };

    BaseView.prototype.elem = function() {
      this.render();
      return this.el;
    };

    BaseView.prototype.html = function(content) {
      return this.$el.html(content);
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

  })(Backbone.View);

  WJS.views.List = (function(_super) {

    __extends(List, _super);

    List.name = 'List';

    function List() {
      return List.__super__.constructor.apply(this, arguments);
    }

    List.prototype.name = "list";

    List.prototype.render = function() {
      return this.html(this.template({
        post_types: "testing"
      }));
    };

    return List;

  })(WJS.views.BaseView);

  WJS.views.Table = (function(_super) {

    __extends(Table, _super);

    Table.name = 'Table';

    function Table() {
      this.select = __bind(this.select, this);

      this.render_field = __bind(this.render_field, this);

      this.render_form = __bind(this.render_form, this);
      return Table.__super__.constructor.apply(this, arguments);
    }

    Table.prototype.test = function() {
      var form;
      form = {
        legend: 'test legend',
        "class": 'form_stacked',
        id: 'test_form',
        fields: [
          {
            name: 'testtext',
            value: 'test value',
            type: 'textInput',
            label: 'test label'
          }, {
            name: 'testtextareAA',
            value: 'test value',
            type: 'textArea',
            label: 'test label2'
          }
        ]
      };
      return this.render_form(form);
    };

    Table.prototype.render_form = function(form) {
      return "<form class=\"form-stacked\">\n  <fieldset>\n    <legend>" + form.legend + "</legend>\n    " + (_.render(form.fields, this.render_field)) + "\n    </fieldset>\n</form>";
    };

    Table.prototype.render_field = function(field) {
      return "<div class=\"clearfix\">\n  <label for=\"" + field.name + "\">" + field.label + "</label>\n  <div class=\"input\">\n    " + (this[field.type](field)) + "\n  </div>\n</div>";
    };

    Table.prototype.textInput = function(field) {
      return "<input type=\"text\" value=\"" + field.value + "\" name=\"" + field.name + "\" id=\"" + field.id + "\" />";
    };

    Table.prototype.select = function(field) {
      return "<select name=\"" + field.name + "\" id=\"" + field.id + "\">\n  " + (_render(field.options, this.option)) + "\n</select>";
    };

    Table.prototype.option = function(option) {
      return "<option value=\"" + option.value + ">" + option.label + "</option>";
    };

    Table.prototype.textArea = function(field) {
      return "<textarea name=\"" + field.name + "\" id=\"" + field.name + "\">\n" + field.value + "\n</textarea>";
    };

    return Table;

  })(WJS.views.BaseView);

  WJS.views.Test = (function(_super) {

    __extends(Test, _super);

    Test.name = 'Test';

    function Test() {
      this.render = __bind(this.render, this);
      return Test.__super__.constructor.apply(this, arguments);
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
      return this.html(out);
    };

    return Test;

  })(WJS.views.BaseView);

  WJS.views.Logger = (function(_super) {

    __extends(Logger, _super);

    Logger.name = 'Logger';

    function Logger() {
      this.render = __bind(this.render, this);
      return Logger.__super__.constructor.apply(this, arguments);
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
      return this.html("<span class=\"" + log.type + "\">" + log.text + "</span>");
    };

    return Logger;

  })(WJS.views.BaseView);

  WJS.views.Posts = (function(_super) {

    __extends(Posts, _super);

    Posts.name = 'Posts';

    function Posts() {
      return Posts.__super__.constructor.apply(this, arguments);
    }

    return Posts;

  })(WJS.views.BaseView);

  WJS.views.PostList = (function(_super) {

    __extends(PostList, _super);

    PostList.name = 'PostList';

    function PostList() {
      this.render = __bind(this.render, this);
      return PostList.__super__.constructor.apply(this, arguments);
    }

    PostList.prototype.tagName = "ul";

    PostList.prototype.init = function() {
      var model;
      return this.subViews = (function() {
        var _i, _len, _ref, _results;
        _ref = this.collection.models;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          model = _ref[_i];
          _results.push(new PostListItem({
            model: model
          }));
        }
        return _results;
      }).call(this);
    };

    PostList.prototype.render = function() {
      var view;
      return this.html((function() {
        var _i, _len, _ref, _results;
        _ref = this.subViews;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          view = _ref[_i];
          _results.push(view.elem());
        }
        return _results;
      }).call(this));
    };

    return PostList;

  })(WJS.views.BaseView);

  PostListItem = (function(_super) {

    __extends(PostListItem, _super);

    PostListItem.name = 'PostListItem';

    function PostListItem() {
      this.render = __bind(this.render, this);
      return PostListItem.__super__.constructor.apply(this, arguments);
    }

    PostListItem.prototype.tagName = "li";

    PostListItem.prototype.className = "post_item";

    PostListItem.prototype.render = function() {
      return this.html(this.model.get("post_title"));
    };

    return PostListItem;

  })(WJS.views.BaseView);

}).call(this);
