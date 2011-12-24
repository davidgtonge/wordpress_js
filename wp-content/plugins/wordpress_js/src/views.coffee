# Created by JetBrains PhpStorm.
# Author: David Tonge
# Author Email: dave (at) simplecreativity.co.uk
# Date: 23/12/11
# Time: 15:05

$ = jQuery

class BaseView extends Backbone.View
  initialize: ->
    @$el = $(@el)
    @model.bind "change", @render

    @init()

  get_data: => @$('form:first').serializeObject()

  save: =>
    @model.save @get_data(), {
      success: -> console.log "success", arguments
      error: -> console.log "error", arguments
    }
    false

  init: -> ""


class WJS.views.Test extends BaseView

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
    @$el.html out
    @



