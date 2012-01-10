class WJS.classes.Singleton
  constructor: ->
    _.extend(@, Backbone.Events)
    @init()


  init: -> ""

  on: _.alias @, "bind"
  off: _.alias @, "unbind"

  @load: -> @instance ?= new @