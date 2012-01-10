# Created by JetBrains PhpStorm.
# Author: David Tonge
# Author Email: dave (at) simplecreativity.co.uk
# Date: 23/12/11
# Time: 15:05


class WJS.views.Test extends WJS.views.BaseView

  events:
    "change input" : "save"
    "click .save" : "save"

  render: =>
    data = @model.toJSON()
    out = "<form>"
    for name, type of @model.fields
      switch type
        when "text_input"
          out += """
          <input name="#{name}" value="#{data[name]}" />
          """
        when "text_area"
          out += """
          <textarea name="#{name}">#{data[name]}</textarea>
          """
    out += """
    <button class="save">Save</button>
    </form>
    """
    @html out


class WJS.views.Logger extends WJS.views.BaseView

  init: ->
    WJS.sync.on "log", @render

  render: (event, log = {type:"message", text:"Interface Initialised"}) =>
    @html """
    <span class="#{log.type}">#{log.text}</span>
    """

class WJS.views.Posts extends WJS.views.BaseView

  #overwrite the delegate events to use JQ1.7 and to work with a mediator
  #write standard remove view routine



class WJS.views.PostList extends WJS.views.BaseView

  tagName: "ul"
  init: ->
    @subViews = (new PostListItem {model} for model in @collection.models)

  render: => @html (view.elem() for view in @subViews)

class PostListItem extends WJS.views.BaseView
  tagName: "li"
  className: "post_item"
  render: => @html @model.get "post_title"