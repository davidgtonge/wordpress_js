WJS.parse =
  # Holds the methods to parse incoming data
  create_collections: (model_names = {}) ->
    # Set up collections for each model on the input object
    for model_name of model_names
      collection = WJS.collections[model_name + "s"] ? WJS.collections.posts
      WJS.store[model_name + "s"] = new collection

  add_to_store: (mixed_data = {}) ->
    # Group the posts according to post type and then add to their relevant collection in the store
    _(mixed_data).chain()
      .groupBy (post) ->
        post.post_type
      .each (posts, post_type) ->
        WJS.store[post_type + "s"].add posts

