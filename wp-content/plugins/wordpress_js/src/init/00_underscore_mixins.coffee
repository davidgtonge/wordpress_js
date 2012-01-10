_.mixin
    nice_date: (date) -> (new XDate date).toString "D, M, Y"
    iso_date: (date) -> (new XDate date).toString "yy-mm-dd"
    has_string: (haystack, needle) ->
      return false unless _(needle).isString()

      if _(haystack).isString()
        return if haystack.indexOf(needle) is -1 then true else false

      else if _(haystack).isArray()
        return if _(haystack).indexOf(needle) is -1 then true else false

      else if _(haystack).isObject()
        return if _(haystack).chain().toArray().indexOf(needle).value() is -1 then true else false

    alias: (object, name) ->
      fn = if object then object[name] else null
      if _(fn).isFunction()
        name = -> fn.apply object, arguments
      else
        name = ->

    render : (array, func) ->
      (func item for item in array).join('')

    compact_map: (list, iterator) ->
      _.chain().map(list, iterator).compact().value()



_.templateSettings =
  interpolate: /\#\{\=([\s\S]+?)\}/g
  evaluate: /\#\{([\s\S]+?)\}/g
