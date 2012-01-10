(function() {
  var BaseCollection, BaseModel, BasePost, BasePosts,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  BaseModel = (function(_super) {

    __extends(BaseModel, _super);

    BaseModel.name = 'BaseModel';

    function BaseModel() {
      this.parse_sync = __bind(this.parse_sync, this);
      return BaseModel.__super__.constructor.apply(this, arguments);
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

  })(Backbone.Model);

  BasePost = (function(_super) {

    __extends(BasePost, _super);

    BasePost.name = 'BasePost';

    function BasePost() {
      return BasePost.__super__.constructor.apply(this, arguments);
    }

    return BasePost;

  })(BaseModel);

  WJS.models.post = (function(_super) {

    __extends(post, _super);

    post.name = 'post';

    function post() {
      return post.__super__.constructor.apply(this, arguments);
    }

    post.prototype.dbName = "post";

    post.prototype.fields = {
      post_content: "text_area",
      post_title: "text_input"
    };

    return post;

  })(BasePost);

  WJS.models.attachment = (function(_super) {

    __extends(attachment, _super);

    attachment.name = 'attachment';

    function attachment() {
      return attachment.__super__.constructor.apply(this, arguments);
    }

    attachment.prototype.dbName = "attachment";

    return attachment;

  })(BasePost);

  WJS.models.page = (function(_super) {

    __extends(page, _super);

    page.name = 'page';

    function page() {
      return page.__super__.constructor.apply(this, arguments);
    }

    page.prototype.dbName = "page";

    return page;

  })(BasePost);

  WJS.models.nav_menu_item = (function(_super) {

    __extends(nav_menu_item, _super);

    nav_menu_item.name = 'nav_menu_item';

    function nav_menu_item() {
      return nav_menu_item.__super__.constructor.apply(this, arguments);
    }

    nav_menu_item.prototype.dbName = "nav_menu_item";

    return nav_menu_item;

  })(BasePost);

  BaseCollection = (function(_super) {

    __extends(BaseCollection, _super);

    BaseCollection.name = 'BaseCollection';

    function BaseCollection() {
      return BaseCollection.__super__.constructor.apply(this, arguments);
    }

    return BaseCollection;

  })(Backbone.Collection);

  BasePosts = (function(_super) {

    __extends(BasePosts, _super);

    BasePosts.name = 'BasePosts';

    function BasePosts() {
      return BasePosts.__super__.constructor.apply(this, arguments);
    }

    return BasePosts;

  })(BaseCollection);

  WJS.collections.posts = (function(_super) {

    __extends(posts, _super);

    posts.name = 'posts';

    function posts() {
      return posts.__super__.constructor.apply(this, arguments);
    }

    posts.prototype.model = WJS.models.post;

    return posts;

  })(BasePosts);

  WJS.collections.attachments = (function(_super) {

    __extends(attachments, _super);

    attachments.name = 'attachments';

    function attachments() {
      return attachments.__super__.constructor.apply(this, arguments);
    }

    attachments.prototype.model = WJS.models.attachment;

    return attachments;

  })(BasePosts);

  WJS.collections.pages = (function(_super) {

    __extends(pages, _super);

    pages.name = 'pages';

    function pages() {
      return pages.__super__.constructor.apply(this, arguments);
    }

    pages.prototype.model = WJS.models.page;

    return pages;

  })(BasePosts);

  WJS.collections.nav_menu_items = (function(_super) {

    __extends(nav_menu_items, _super);

    nav_menu_items.name = 'nav_menu_items';

    function nav_menu_items() {
      return nav_menu_items.__super__.constructor.apply(this, arguments);
    }

    nav_menu_items.prototype.model = WJS.models.nav_menu_item;

    return nav_menu_items;

  })(BasePosts);

}).call(this);
