# Created by JetBrains PhpStorm.
# Author: David Tonge
# Author Email: dave (at) simplecreativity.co.uk
# Date: 23/12/11
# Time: 13:39

$ = jQuery

class Singleton
  constructor: ->
    @o = $({})
    @init()

  init: -> ""

  on: (events, handler, data) -> @o.on events,null,data,handler
  off: (events, handler) -> @o.off events,null, handler
  trigger: (event, data) -> @o.trigger event, data

  @get: -> @instance ?= new @

class WJSSync extends Singleton
  #Public methods: sync, image_sync
  #Private methods: processQueue, ajax

  queue:  []
  running:  false
  success_count: 0
  failure_count: 0

  sync: (action, model, options) =>
    console.log arguments
    #Add the sync request to the queue
    @queue.push {action,model,options,cid:model.cid}

    #Call process queue unless its already running
    @processQueue() unless @running

  last_run: 0

  processQueue: =>

    if @running

      now = new Date().getTime()
      time_since_last_run = now - @last_run
      if time_since_last_run < 5000
        @trigger "log",
          type: "message"
          text: "Server syncs limited to every 5 seconds, the next sync will occur
                in #{(5000 - time_since_last_run) / 1000} seconds"
        setTimeout @processQueue, 5000 - time_since_last_run
      else
        @last_run = now


        # Run the queue
        # Set the active queue - limited to 10 at a time
        if @queue.length > 10
          activeQueue = @queue[0..9]
          @queue = @queue[10..@queue.length]
        else
          activeQueue = @queue[0..@queue.length]
          @queue = []

        data = {}
        # We use the cid as the key on an object to ensure that each model is only synced once per batch
        # We get the latest state of the model by calling its toJSON method
        for syncRequest in activeQueue
          data[syncRequest.cid] =
            values: syncRequest.model.toJSON()
            action: syncRequest.action

        @trigger "log",
          type: "message"
          text: "Synchronising #{activeQueue.length} operations to the server"

        # Now call the classes ajax method, we pass along the activeQueue, and expect to receive it back in the callback
        # The callback expects an array. It uses underscores detect method to find the right model and then triggers
        # A "synced" event, with the along with the relevant response.

        @ajax data, activeQueue, (resp, status, xhr, activeQueue) ->
          for cid, syncResponse of resp
            syncRequest = _(activeQueue).detect (a) ->
              a.cid is cid
            console.log syncRequest
            syncRequest.model.trigger "synced", syncResponse
            syncRequest.options.success resp, status, xhr
        , (resp, activeQueue) ->
          for syncRequest in activeQueue
            syncRequest.options.error resp



        # If there are still items in the queue then we set a timer to call the function again after 3 seconds
        # If not we set the running flag to false
        if @queue.length > 0
          setTimeout processQueue, 5000
        else
          @running = false

    else
      # The queue wasn't being processed, so set the running flag to true
      @running = true
      # Call processQueye again after 100ms to catch other sync events
      setTimeout @processQueue, 100


  ajax: (data, activeQueue, success_cb, failure_cb) =>
    console.log "ajax", arguments
    $.ajax
      url:ajaxurl
      data:
        action: "wjs"
        wjs_action:"bulk"
        content: JSON.stringify(data)
      type:'POST'
      dataType:'json'
      success: (resp, status, xhr) =>
        @trigger "log",
          type: "success"
          text: "Succesfully synced #{activeQueue.length} operations with the server"

        if _.isObject resp
          @success_count += activeQueue.length
          success_cb(resp, status, xhr, activeQueue)
      error: (response) =>
        @trigger "log",
          type: "error"
          text: "Failed to sync #{activeQueue.length} operations with the server. Error: #{response}"

        failure_cb response, activeQueue
        @failure_count += activeQueue.length
        # if there is a failure try again
        if @failure_count < 10
          @queue = @queue.concat activeQueue
          @processQueue() unless @running
        else
          throw "More than 10 sync failures, are you sure you're settings are correct"


  image_sync: (model) ->
    # have a method to upload images in the bg to the server


class WJSKlass extends Singleton
  init: =>
    @on "data_received", @parse_data
    @on "dom_ready", @get_init_data
    @on "data_parsed", @init_views
    Backbone.sync = @sync.sync

  ajax: (data = {}, callback) ->
    data.action = "wjs"
    $.post window.ajaxurl, data, callback, "json"

  get_init_data: => @ajax {wjs_action:"init"}, (@data) => @trigger "data_received"


  collections: {}
  models: {}
  views: {}
  store: {}
  sync: WJSSync.get()

  parse_data: =>

    # Set up collections for each of the post types
    for post_type of @data.post_types
      collection = @collections[post_type + "s"] ? @collections.posts
      @store[post_type + "s"] = new collection

    # Group the posts according to post type and then add to their relevant collection in the store
    _(@data.posts).chain()
      .groupBy (post) ->
        post.post_type
      .each (posts, post_type) =>
        @store[post_type + "s"].add posts

    # Clear the data ready for the next parse
    @trigger "data_parsed"
    @data = {}

  init_views: =>
    views = [
      new @views.Test model: @store.posts.at 0
      new @views.Logger
    ]
    $('#wjs_app').html (view.render().el for view in views)


window.WJS = WJSKlass.get()

$ ->
  WJS.trigger "dom_ready"




