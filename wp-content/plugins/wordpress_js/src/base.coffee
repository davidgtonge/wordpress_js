# Created by JetBrains PhpStorm.
# Author: David Tonge
# Author Email: dave (at) simplecreativity.co.uk
# Date: 06/12/11
# Time: 00:02

#Using simple private / public system
# vars, functions with = are private
# functions with : are public
# - this will only work with a singleton, as the private properties will be the same accross all instances

# can extend our singleton class
# which can use jq events

# style - private start with _
# public - @
# local none

class sync
  #Public methods: sync, image_sync
  #Private methods: processQueue, ajax

  _queue =  []
  _running =  false
  _success_count = 0
  _failure_count = 0

  sync: (action, model) ->
    #Add the sync request to the queue
    _queue.push {action,model,cid:model.cid}

    #Call process queue unless its already running
    _processQueue() unless _running

  _processQueue = =>

    if _running
      # Run the queue
      # Set the active queue - limited to 10 at a time
      if _queue.length > 10
        activeQueue = _queue[0..9]
        _queue = _queue[10.._queue.length]
      else
        activeQueue = _queue[0.._queue.length]
        _queue = []

      data = {}
      # We use the cid as the key on an object to ensure that each model is only synced once per batch
      # We get the latest state of the model by calling its toJSON method
      for syncRequest in activeQueue
        data[syncRequest.cid] =
          values: syncRequest.model.toJSON()
          action: syncRequest.action

      # Now call the classes ajax method, we pass along the activeQueue, and expect to receive it back in the callback
      # The callback expects an array. It uses underscores detect method to find the right model and then triggers
      # A "synced" event, with the along with the relevant response.

      _ajax data, activeQueue, (response, activeQueue) ->
        for syncResponse in response
          syncRequest = _(activeQueue).detect (a) ->
            a.cid is syncResponse.cid
          do (syncRequest) -> syncRequest.model.trigger "synced", syncResponse

      # If there are still items in the queue then we set a timer to call the function again after 3 seconds
      # If not we set the running flag to false
      if _queue.length > 0
        setTimeout processQueue, 3000
      else
        _running = false

    else
      # The queue wasn't being processed, so set the running flag to true
      _running = true
      # Call processQueye again after 100ms to catch other sync events
      setTimeout _processQueue, 100


    _ajax = (data, activeQueue, success_cb) =>
      $.ajax
        url:@globals.ajax
        data: JSON.stringify(data)
        type:'POST'
        success: (response) =>
          _success_count += activeQueue.length
          success_cb(response, activeQueue)
        failure: (response) =>
          _failure_count += activeQueue.length
          # if there is a failure try again
          _queue = _queue.concat activeQueue
          _processQueue() unless _running


  image_sync: (model) ->
    # have a method to upload images in the bg to the server


class baseCollection extends Backbone.Collection

  #sorting,
  #limiting,
  #filtering
  # look at my hotel app for these implementations




