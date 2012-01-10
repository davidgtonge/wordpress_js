class WJS.views.List extends WJS.views.BaseView
  name: "list"
  render: ->
    @html @template {post_types: "testing"}