# Created by JetBrains PhpStorm.
# Author: David Tonge
# Author Email: dave (at) simplecreativity.co.uk
# Date: 22/12/11
# Time: 17:07


require "underscore"
require "xdate"

_.mixin
  nice_date: (date) -> (new XDate date).toString "D, M, Y"
  iso_date: (date) -> (new XDate date).toString "yy-mm-dd"




class BaseModel extends Backbone.Model

  save: (data) ->
    post_data = {}
    meta_data = {}
    tax_data = {}
    for key, value in data
      switch key.substr(0,4)
        when "post" then post_data[key.substr 5] = value
        when "meta" then meta_data[key.substr 5] = value
        when "tax_" then tax_data[key.substr 4] = value






class BaseView extends Backbone.View
  init: ->
    @$el = $(@el)
    @model.bind "change", @render

class Page
  # This will contain all the child views
  # We will use event delegation so that this is the view that will communicate with the sync method
  # For posts, we must just use a naming convention so that meta data items are prefixed with meta
  # and taxonomy data is prefixed with taxonomy, then we can do one big save together


  views: [] # Array of child views

  get_data: -> (do view.get_data for view in @views)


class ChildPage

  get_data: -> do @$el.find('form').serializeObject







class Widget extends Backbone.View
  # Must be a jquery sortable widget
  # Main issue must be syncing to existing WP methods
  # We can recreate a similar look to the current interface
  # Except we can have





