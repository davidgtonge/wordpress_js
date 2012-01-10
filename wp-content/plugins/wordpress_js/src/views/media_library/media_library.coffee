class WJS.views.MediaLibrary extends WJS.views.BaseView

  process_images: (files) ->
    for file in files
      model = new WJS.models.Image
      model.read



