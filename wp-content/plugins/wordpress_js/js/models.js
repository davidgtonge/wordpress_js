(function() {
  var BaseCollection, BaseModel, BasePost, BasePosts;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  BaseModel = (function() {
    __extends(BaseModel, Backbone.Model);
    function BaseModel() {
      this.parse_sync = __bind(this.parse_sync, this);
      BaseModel.__super__.constructor.apply(this, arguments);
    }
    BaseModel.prototype.initialize = function() {
      this.id = this.get("ID");
      return this.bind("synced", this.parse_sync);
    };
    BaseModel.prototype.parse_sync = function(sync_response) {
      console.log("syncing", this, sync_response);
      return this.set(sync_response);
    };
    return BaseModel;
  })();
  BasePost = (function() {
    __extends(BasePost, BaseModel);
    function BasePost() {
      BasePost.__super__.constructor.apply(this, arguments);
    }
    return BasePost;
  })();
  WJS.models.post = (function() {
    __extends(post, BasePost);
    function post() {
      post.__super__.constructor.apply(this, arguments);
    }
    post.prototype.dbName = "post";
    post.prototype.fields = {
      post_content: "text_area",
      post_title: "text_input"
    };
    return post;
  })();
  WJS.models.attachment = (function() {
    __extends(attachment, BasePost);
    function attachment() {
      attachment.__super__.constructor.apply(this, arguments);
    }
    attachment.prototype.dbName = "attachment";
    return attachment;
  })();
  WJS.models.page = (function() {
    __extends(page, BasePost);
    function page() {
      page.__super__.constructor.apply(this, arguments);
    }
    page.prototype.dbName = "page";
    return page;
  })();
  WJS.models.nav_menu_item = (function() {
    __extends(nav_menu_item, BasePost);
    function nav_menu_item() {
      nav_menu_item.__super__.constructor.apply(this, arguments);
    }
    nav_menu_item.prototype.dbName = "nav_menu_item";
    return nav_menu_item;
  })();
  BaseCollection = (function() {
    __extends(BaseCollection, Backbone.Collection);
    function BaseCollection() {
      BaseCollection.__super__.constructor.apply(this, arguments);
    }
    return BaseCollection;
  })();
  BasePosts = (function() {
    __extends(BasePosts, BaseCollection);
    function BasePosts() {
      BasePosts.__super__.constructor.apply(this, arguments);
    }
    return BasePosts;
  })();
  WJS.collections.posts = (function() {
    __extends(posts, BasePosts);
    function posts() {
      posts.__super__.constructor.apply(this, arguments);
    }
    posts.prototype.model = WJS.models.post;
    return posts;
  })();
  WJS.collections.attachments = (function() {
    __extends(attachments, BasePosts);
    function attachments() {
      attachments.__super__.constructor.apply(this, arguments);
    }
    attachments.prototype.model = WJS.models.attachment;
    return attachments;
  })();
  WJS.collections.pages = (function() {
    __extends(pages, BasePosts);
    function pages() {
      pages.__super__.constructor.apply(this, arguments);
    }
    pages.prototype.model = WJS.models.page;
    return pages;
  })();
  WJS.collections.nav_menu_items = (function() {
    __extends(nav_menu_items, BasePosts);
    function nav_menu_items() {
      nav_menu_items.__super__.constructor.apply(this, arguments);
    }
    nav_menu_items.prototype.model = WJS.models.nav_menu_item;
    return nav_menu_items;
  })();
}).call(this);
