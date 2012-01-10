class WJS.classes.WJSSync extends WJS.classes.Singleton
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

  checkInterval: =>
    # Ensures that there is a 3 sec gap between ajax calls
    now = new Date().getTime()
    time_since_last_run = now - @last_run
    if time_since_last_run < 3000
      @trigger "log",
        type: "message"
        text: "Server syncs limited to every 5 seconds, the next sync will occur
                                      in #{(3000 - time_since_last_run) / 1000} seconds"
      @running = false
      setTimeout @processQueue, 3000 - time_since_last_run
      false
    else
      @last_run = now
      true

  splitQueue: =>
    # Takes the first 10 items from the queue and returns them as the active queue
    if @queue.length > 10
      activeQueue = @queue[0..9]
      @queue = @queue[10..@queue.length]
    else
      activeQueue = @queue[0..@queue.length]
      @queue = []
    activeQueue

  makeAjaxData: (activeQueue) ->
    # Transforms the active queue in to the data required by the server
    # We use the cid as the key on an object to ensure that each model is only synced once per batch
    # We get the latest state of the model by calling its toJSON method
    data = {}
    for syncRequest in activeQueue
      data[syncRequest.cid] =
        values: syncRequest.model.toJSON()
        action: syncRequest.action
    data

  ajaxSuccess: (resp, status, xhr, activeQueue) ->
    # The main success callback
    # Iterates through the response and triggers events on the model from the original active queue
    for cid, syncResponse of resp
      syncRequest = _(activeQueue).detect (a) ->
        a.cid is cid
      console.log syncRequest
      syncRequest.model.trigger "synced", syncResponse
      syncRequest.options.success resp, status, xhr

  ajaxError: (resp, activeQueue) ->
    # The main error callback
    # Iterates through the response and triggers error callbacks on each model
    for syncRequest in activeQueue
      syncRequest.options.error resp


  processQueue: =>
    if @running and @checkInterval()
      # Run the queue
      # Set the active queue - limited to 10 at a time
      activeQueue = @splitQueue()
      # Get the data for the Ajax call
      ajaxData = @makeAjaxData activeQueue
      # Make the ajax call using the classes ajax method
      @ajax ajaxData, activeQueue, @ajaxSuccess, @ajaxError
      # If there are still items in the queue then we set a timer to call the function again after 3 seconds
      # If not we set the running flag to false
      if @queue.length > 0 then setTimeout @processQueue, 3000 else @running = false

    else
      # The queue wasn't being processed, so set the running flag to true
      @running = true
      # Call processQueue again after 100ms to catch other sync events
      setTimeout @processQueue, 100


  ajax: (data, activeQueue, success_cb, failure_cb) =>
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
