$ = jQuery

WJS.mediator =
  # Holds events and callbacks as keys, values
  initialised: ->
    WJS.f.ajax {wjs_action:"init"}, (data) ->
      WJS.set data
      WJS.trigger "data_received"

  data_received: ->
    WJS.parse.create_collections WJS.get("post_types")
    WJS.parse.add_to_store WJS.get("posts")
    WJS.trigger "data_parsed"

  data_parsed: ->
    # For dev purposes, later will initiate the router

    views = [
      new WJS.views.Test model: WJS.store.posts.at 0
      new WJS.views.Logger
      new WJS.views.PostList collection: WJS.store.posts
      new WJS.views.List collection: WJS.store.posts
    ]

    $('#wjs_app').html (view.elem() for view in views)

  change_post_sort: ->