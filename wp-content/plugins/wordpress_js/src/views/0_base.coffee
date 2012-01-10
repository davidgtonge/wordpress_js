$ = jQuery

class WJS.views.BaseView extends Backbone.View
  initialize: ->
    @$el = $(@el)
    @model?.bind "change", @render
    @collection?.bind "change", @render
    if @name
      $template = $("#tmpl_#{@name}")
      if $template.length
        @template = _.template $template.html()

    @init()

  get_data: => @$('form:first').serializeObject()

  elem: =>
    @render()
    @el

  html: (content) => @$el.html content

  save: =>
    @model.save @get_data(), {
    success: -> console.log "success", arguments
    error: -> console.log "error", arguments
    }
    false

  init: -> ""