class Image extends Backbone.Model

  initialize: ->
    @reader = new FileReader
    @reader.onload = @image_loaded

  read_local_image: (file) ->
    @reader.readAsDataURL file
    @

  image_loaded: (event) =>
    @thumb = event.target.result
    @trigger "thumbnail_read"



