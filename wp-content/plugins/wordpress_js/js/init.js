(function() {
  var $, Singleton, WJSKlass, WJSSync;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  $ = jQuery;
  Singleton = (function() {
    function Singleton() {
      this.o = $({});
      this.init();
    }
    Singleton.prototype.init = function() {
      return "";
    };
    Singleton.prototype.on = function(events, handler, data) {
      return this.o.on(events, null, data, handler);
    };
    Singleton.prototype.off = function(events, handler) {
      return this.o.off(events, null, handler);
    };
    Singleton.prototype.trigger = function(event, data) {
      return this.o.trigger(event, data);
    };
    Singleton.get = function() {
      var _ref;
      return (_ref = this.instance) != null ? _ref : this.instance = new this;
    };
    return Singleton;
  })();
  WJSSync = (function() {
    __extends(WJSSync, Singleton);
    function WJSSync() {
      this.ajax = __bind(this.ajax, this);
      this.processQueue = __bind(this.processQueue, this);
      this.sync = __bind(this.sync, this);
      WJSSync.__super__.constructor.apply(this, arguments);
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
      if (!this.running) {
        return this.processQueue();
      }
    };
    WJSSync.prototype.last_run = 0;
    WJSSync.prototype.processQueue = function() {
      var activeQueue, data, now, syncRequest, time_since_last_run, _i, _len;
      if (this.running) {
        now = new Date().getTime();
        time_since_last_run = now - this.last_run;
        if (time_since_last_run < 5000) {
          this.trigger("log", {
            type: "message",
            text: "Server syncs limited to every 5 seconds, the next sync will occur                in " + ((5000 - time_since_last_run) / 1000) + " seconds"
          });
          return setTimeout(this.processQueue, 5000 - time_since_last_run);
        } else {
          this.last_run = now;
          if (this.queue.length > 10) {
            activeQueue = this.queue.slice(0, 10);
            this.queue = this.queue.slice(10, (this.queue.length + 1) || 9e9);
          } else {
            activeQueue = this.queue.slice(0, (this.queue.length + 1) || 9e9);
            this.queue = [];
          }
          data = {};
          for (_i = 0, _len = activeQueue.length; _i < _len; _i++) {
            syncRequest = activeQueue[_i];
            data[syncRequest.cid] = {
              values: syncRequest.model.toJSON(),
              action: syncRequest.action
            };
          }
          this.trigger("log", {
            type: "message",
            text: "Synchronising " + activeQueue.length + " operations to the server"
          });
          this.ajax(data, activeQueue, function(resp, status, xhr, activeQueue) {
            var cid, syncResponse, _results;
            _results = [];
            for (cid in resp) {
              syncResponse = resp[cid];
              syncRequest = _(activeQueue).detect(function(a) {
                return a.cid === cid;
              });
              console.log(syncRequest);
              syncRequest.model.trigger("synced", syncResponse);
              _results.push(syncRequest.options.success(resp, status, xhr));
            }
            return _results;
          }, function(resp, activeQueue) {
            var syncRequest, _j, _len2, _results;
            _results = [];
            for (_j = 0, _len2 = activeQueue.length; _j < _len2; _j++) {
              syncRequest = activeQueue[_j];
              _results.push(syncRequest.options.error(resp));
            }
            return _results;
          });
          if (this.queue.length > 0) {
            return setTimeout(processQueue, 5000);
          } else {
            return this.running = false;
          }
        }
      } else {
        this.running = true;
        return setTimeout(this.processQueue, 100);
      }
    };
    WJSSync.prototype.ajax = function(data, activeQueue, success_cb, failure_cb) {
      console.log("ajax", arguments);
      return $.ajax({
        url: ajaxurl,
        data: {
          action: "wjs",
          wjs_action: "bulk",
          content: JSON.stringify(data)
        },
        type: 'POST',
        dataType: 'json',
        success: __bind(function(resp, status, xhr) {
          this.trigger("log", {
            type: "success",
            text: "Succesfully synced " + activeQueue.length + " operations with the server"
          });
          if (_.isObject(resp)) {
            this.success_count += activeQueue.length;
            return success_cb(resp, status, xhr, activeQueue);
          }
        }, this),
        error: __bind(function(response) {
          this.trigger("log", {
            type: "error",
            text: Failed(to(sync))
          });
          failure_cb(response, activeQueue);
          this.failure_count += activeQueue.length;
          if (this.failure_count < 10) {
            this.queue = this.queue.concat(activeQueue);
            if (!this.running) {
              return this.processQueue();
            }
          } else {
            throw "More than 10 sync failures, are you sure you're settings are correct";
          }
        }, this)
      });
    };
    WJSSync.prototype.image_sync = function(model) {};
    return WJSSync;
  })();
  WJSKlass = (function() {
    __extends(WJSKlass, Singleton);
    function WJSKlass() {
      this.init_views = __bind(this.init_views, this);
      this.parse_data = __bind(this.parse_data, this);
      this.get_init_data = __bind(this.get_init_data, this);
      this.init = __bind(this.init, this);
      WJSKlass.__super__.constructor.apply(this, arguments);
    }
    WJSKlass.prototype.init = function() {
      this.on("data_received", this.parse_data);
      this.on("dom_ready", this.get_init_data);
      this.on("data_parsed", this.init_views);
      return Backbone.sync = this.sync.sync;
    };
    WJSKlass.prototype.ajax = function(data, callback) {
      if (data == null) {
        data = {};
      }
      data.action = "wjs";
      return $.post(window.ajaxurl, data, callback, "json");
    };
    WJSKlass.prototype.get_init_data = function() {
      return this.ajax({
        wjs_action: "init"
      }, __bind(function(data) {
        this.data = data;
        return this.trigger("data_received");
      }, this));
    };
    WJSKlass.prototype.collections = {};
    WJSKlass.prototype.models = {};
    WJSKlass.prototype.views = {};
    WJSKlass.prototype.store = {};
    WJSKlass.prototype.sync = WJSSync.get();
    WJSKlass.prototype.parse_data = function() {
      var collection, post_type, _ref;
      for (post_type in this.data.post_types) {
        collection = (_ref = this.collections[post_type + "s"]) != null ? _ref : this.collections.posts;
        this.store[post_type + "s"] = new collection;
      }
      _(this.data.posts).chain().groupBy(function(post) {
        return post.post_type;
      }).each(__bind(function(posts, post_type) {
        return this.store[post_type + "s"].add(posts);
      }, this));
      this.trigger("data_parsed");
      return this.data = {};
    };
    WJSKlass.prototype.init_views = function() {
      var view, views;
      views = [
        new this.views.Test({
          model: this.store.posts.at(0)
        }), new this.views.Logger
      ];
      return $('#wjs_app').html((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = views.length; _i < _len; _i++) {
          view = views[_i];
          _results.push(view.render().el);
        }
        return _results;
      })());
    };
    return WJSKlass;
  })();
  window.WJS = WJSKlass.get();
  $(function() {
    return WJS.trigger("dom_ready");
  });
}).call(this);
