(function() {
  var $,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  _.mixin({
    nice_date: function(date) {
      return (new XDate(date)).toString("D, M, Y");
    },
    iso_date: function(date) {
      return (new XDate(date)).toString("yy-mm-dd");
    },
    has_string: function(haystack, needle) {
      var result, text, _i, _len;
      if (!_(haystack).isString()) return false;
      if (_(needle).isString()) {
        if (haystack.indexOf(needle) === -1) {
          return true;
        } else {
          return false;
        }
      } else if (_(needle).isArray()) {
        result = false;
        for (_i = 0, _len = needle.length; _i < _len; _i++) {
          text = needle[_i];
          if (haystack.indexOf(text) === -1) result = true;
        }
        return result;
      }
    },
    alias: function(object, name) {
      var fn;
      fn = object ? object[name] : null;
      if (_(fn).isFunction()) {
        return name = function() {
          return fn.apply(object, arguments);
        };
      } else {
        return name = function() {};
      }
    },
    render: function(array, func) {
      var item;
      return ((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = array.length; _i < _len; _i++) {
          item = array[_i];
          _results.push(func(item));
        }
        return _results;
      })()).join('');
    }
  });

  _.templateSettings = {
    interpolate: /\#\{\=([\s\S]+?)\}/g,
    evaluate: /\#\{([\s\S]+?)\}/g
  };

  $ = jQuery;

  window.WJS = {
    collections: {},
    models: {},
    views: {},
    store: {},
    mediator: {},
    facade: {},
    classes: {},
    init: function() {
      var callback, event, method, model_methods, _i, _len, _ref;
      WJS.session = new Backbone.DeepModel;
      WJS.sync = WJS.classes.WJSSync.load();
      Backbone.sync = _.alias(WJS.sync, "sync");
      WJS.f = WJS.facade;
      model_methods = ['set', 'get', 'trigger', 'bind', 'unbind'];
      for (_i = 0, _len = model_methods.length; _i < _len; _i++) {
        method = model_methods[_i];
        WJS[method] = _.alias(WJS.session, method);
      }
      WJS.bind("all", function() {
        return console.log(arguments);
      });
      _ref = WJS.mediator;
      for (event in _ref) {
        callback = _ref[event];
        if (_(event).has_string("change_")) {
          event = event.replace("change_", "change:");
        }
        WJS.bind(event, callback);
      }
      return WJS.trigger("initialised");
    }
  };

  $(function() {
    WJS.init();
    return $('.collapse-menu span').click();
  });

  WJS.classes.Singleton = (function() {

    Singleton.name = 'Singleton';

    function Singleton() {
      this.init();
      _.extend(this, Backbone.Events);
    }

    Singleton.prototype.init = function() {
      return "";
    };

    Singleton.prototype.on = _.alias(Singleton, "bind");

    Singleton.prototype.off = _.alias(Singleton, "unbind");

    Singleton.load = function() {
      var _ref;
      return (_ref = this.instance) != null ? _ref : this.instance = new this;
    };

    return Singleton;

  })();

  $ = jQuery;

  WJS.facade = {
    ajax: function(data, callback) {
      if (data == null) data = {};
      data.action = "wjs";
      return $.post(window.ajaxurl, data, callback, "json");
    }
  };

  $ = jQuery;

  WJS.mediator = {
    initialised: function() {
      return WJS.f.ajax({
        wjs_action: "init"
      }, function(data) {
        WJS.set(data);
        return WJS.trigger("data_received");
      });
    },
    data_received: function() {
      WJS.parse.create_collections(WJS.get("post_types"));
      WJS.parse.add_to_store(WJS.get("posts"));
      return WJS.trigger("data_parsed");
    },
    data_parsed: function() {
      var view, views;
      views = [
        new WJS.views.Test({
          model: WJS.store.posts.at(0)
        }), new WJS.views.Logger, new WJS.views.PostList({
          collection: WJS.store.posts
        }), new WJS.views.List({
          collection: WJS.store.posts
        })
      ];
      return $('#wjs_app').html((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = views.length; _i < _len; _i++) {
          view = views[_i];
          _results.push(view.elem());
        }
        return _results;
      })());
    },
    change_post_sort: function() {}
  };

  WJS.parse = {
    create_collections: function(model_names) {
      var collection, model_name, _ref, _results;
      if (model_names == null) model_names = {};
      _results = [];
      for (model_name in model_names) {
        collection = (_ref = WJS.collections[model_name + "s"]) != null ? _ref : WJS.collections.posts;
        _results.push(WJS.store[model_name + "s"] = new collection);
      }
      return _results;
    },
    add_to_store: function(mixed_data) {
      if (mixed_data == null) mixed_data = {};
      return _(mixed_data).chain().groupBy(function(post) {
        return post.post_type;
      }).each(function(posts, post_type) {
        return WJS.store[post_type + "s"].add(posts);
      });
    }
  };

  WJS.classes.WJSSync = (function(_super) {

    __extends(WJSSync, _super);

    WJSSync.name = 'WJSSync';

    function WJSSync() {
      this.ajax = __bind(this.ajax, this);

      this.processQueue = __bind(this.processQueue, this);

      this.sync = __bind(this.sync, this);
      return WJSSync.__super__.constructor.apply(this, arguments);
    }

    WJSSync.prototype.queue = [];

    WJSSync.prototype.running = false;

    WJSSync.prototype.success_count = 0;

    WJSSync.prototype.failure_count = 0;

    WJSSync.prototype.sync = function(action, model, options) {
      console.log(arguments);
      this.queue.push({
        action: action,
        model: model,
        options: options,
        cid: model.cid
      });
      if (!this.running) return this.processQueue();
    };

    WJSSync.prototype.last_run = 0;

    WJSSync.prototype.processQueue = function() {
      var activeQueue, data, now, syncRequest, time_since_last_run, _i, _len, _results;
      if (this.running) {
        now = new Date().getTime();
        time_since_last_run = now - this.last_run;
        if (time_since_last_run < 5000) {
          this.trigger("log", {
            type: "message",
            text: "Server syncs limited to every 5 seconds, the next sync will occur                            in " + ((5000 - time_since_last_run) / 1000) + " seconds"
          });
          setTimeout(this.processQueue, 5000 - time_since_last_run);
        } else {
          this.last_run = now;
          if (this.queue.length > 10) {
            activeQueue = this.queue.slice(0, 10);
            this.queue = this.queue.slice(10, this.queue.length + 1 || 9e9);
          } else {
            activeQueue = this.queue.slice(0, this.queue.length + 1 || 9e9);
            this.queue = [];
          }
          data = {};
        }
        _results = [];
        for (_i = 0, _len = activeQueue.length; _i < _len; _i++) {
          syncRequest = activeQueue[_i];
          data[syncRequest.cid] = {
            values: syncRequest.model.toJSON(),
            action: syncRequest.action
          };
          this.trigger("log", {
            type: "message",
            text: "Synchronising " + activeQueue.length + " operations to the server"
          });
          this.ajax(data, activeQueue, function(resp, status, xhr, activeQueue) {
            var cid, syncResponse, _results2;
            _results2 = [];
            for (cid in resp) {
              syncResponse = resp[cid];
              syncRequest = _(activeQueue).detect(function(a) {
                return a.cid === cid;
              });
              console.log(syncRequest);
              syncRequest.model.trigger("synced", syncResponse);
              _results2.push(syncRequest.options.success(resp, status, xhr));
            }
            return _results2;
          }, function(resp, activeQueue) {
            var syncRequest, _j, _len2, _results2;
            _results2 = [];
            for (_j = 0, _len2 = activeQueue.length; _j < _len2; _j++) {
              syncRequest = activeQueue[_j];
              _results2.push(syncRequest.options.error(resp));
            }
            return _results2;
          });
          if (this.queue.length > 0) {
            _results.push(setTimeout(processQueue, 5000));
          } else {
            _results.push(this.running = false);
          }
        }
        return _results;
      } else {
        this.running = true;
        return setTimeout(this.processQueue, 100);
      }
    };

    WJSSync.prototype.ajax = function(data, activeQueue, success_cb, failure_cb) {
      var _this = this;
      return $.ajax({
        url: ajaxurl,
        data: {
          action: "wjs",
          wjs_action: "bulk",
          content: JSON.stringify(data)
        },
        type: 'POST',
        dataType: 'json',
        success: function(resp, status, xhr) {
          _this.trigger("log", {
            type: "success",
            text: "Succesfully synced " + activeQueue.length + " operations with the server"
          });
          if (_.isObject(resp)) {
            _this.success_count += activeQueue.length;
            return success_cb(resp, status, xhr, activeQueue);
          }
        },
        error: function(response) {
          _this.trigger("log", {
            type: "error",
            text: "Failed to sync " + activeQueue.length + " operations with the server. Error: " + response
          });
          failure_cb(response, activeQueue);
          _this.failure_count += activeQueue.length;
          if (_this.failure_count < 10) {
            _this.queue = _this.queue.concat(activeQueue);
            if (!_this.running) return _this.processQueue();
          } else {
            throw "More than 10 sync failures, are you sure you're settings are correct";
          }
        }
      });
    };

    WJSSync.prototype.image_sync = function(model) {};

    return WJSSync;

  })(WJS.classes.Singleton);

}).call(this);
