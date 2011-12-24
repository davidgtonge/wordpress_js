# Created by JetBrains PhpStorm.
# Author: David Tonge
# Author Email: dave (at) simplecreativity.co.uk
# Date: 23/12/11
# Time: 14:13

class BaseModel extends Backbone.Model
  initialize: ->
    @id = @get "ID"
    @bind "synced", @parse_sync

  parse_sync: (sync_response) =>
    console.log "syncing", @, sync_response
    @set sync_response




class BasePost extends BaseModel

class WJS.models.post extends BasePost
  dbName: "post"
  fields:
    post_content: "text_area"
    post_title: "text_input"


class WJS.models.attachment extends BasePost
  dbName: "attachment"

class WJS.models.page extends BasePost
  dbName: "page"

class WJS.models.nav_menu_item extends BasePost
  dbName: "nav_menu_item"


class BaseCollection extends Backbone.Collection

class BasePosts extends BaseCollection

class WJS.collections.posts extends BasePosts
  model: WJS.models.post

class WJS.collections.attachments extends BasePosts
  model: WJS.models.attachment

class WJS.collections.pages extends BasePosts
  model: WJS.models.page

class WJS.collections.nav_menu_items extends BasePosts
  model: WJS.models.nav_menu_item





