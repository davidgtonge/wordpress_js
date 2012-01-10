$ = jQuery

window.WJS =
  collections: {} # Collection classes
  models: {} # Model classes
  views: {} # View classes
  store: {} # Collections of data
  mediator: {} # Callbacks
  facade: {} # Unified API for some methods
  classes: {} # Misc classes, e.g. Sync class

  init: ->
    # Load modules
    WJS.session = new Backbone.DeepModel
    WJS.sync = WJS.classes.WJSSync.load()

    # Set up aliases
    Backbone.sync = _.alias WJS.sync, "sync"
    WJS.f = WJS.facade
    model_methods = ['set','get','trigger','bind','unbind']
    for method in model_methods
      WJS[method] = _.alias WJS.session, method

    WJS.bind "all", -> console.log arguments

    # Set up event handler for mediator
    for event, callback of WJS.mediator
      # To have consistent event names, without the need to put the mediator keys in quotes
      if _(event).has_string "change_" then event = event.replace "change_", "change:"
      WJS.bind event, callback

    WJS.reader = new FileReader()

    WJS.trigger "initialised"

$ ->
  WJS.init()
  $('.collapse-menu span').click()