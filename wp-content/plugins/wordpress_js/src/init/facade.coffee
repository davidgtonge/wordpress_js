$ = jQuery
WJS.facade =
  # Provides simple api for common operations
  ajax: (data = {}, callback) ->
    data.action = "wjs"
    $.post window.ajaxurl, data, callback, "json"