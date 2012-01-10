class WJS.views.Table extends WJS.views.BaseView

  test: ->
    form =
      legend: 'test legend'
      class: 'form_stacked'
      id: 'test_form'
      fields: [
        {name:'testtext', value:'test value', type:'textInput', label:'test label'}
        {name:'testtextareAA', value:'test value', type:'textArea', label:'test label2'}
      ]
    @render_form form


  render_form: (form) =>
    # Expects form object with
    # legend, id, class, array of field objects
    """
    <form class="form-stacked">
      <fieldset>
        <legend>#{form.legend}</legend>
        #{_.render form.fields, @render_field}
        </fieldset>
    </form>
    """

  render_field: (field) =>
    # Expects object with
    # label, name, value, type
    """
    <div class="clearfix">
      <label for="#{field.name}">#{field.label}</label>
      <div class="input">
        #{@[field.type] field}
      </div>
    </div>
    """

  textInput: (field) ->
    """
    <input type="text" value="#{field.value}" name="#{field.name}" id="#{field.id}" />
    """

  select: (field) =>
    # Expects options property of field object with an array of option objects
    """
    <select name="#{field.name}" id="#{field.id}">
      #{_render field.options, @option}
    </select>
    """
  option: (option) ->
    """
    <option value="#{option.value}>#{option.label}</option>
    """

  textArea: (field) ->
    """
    <textarea name="#{field.name}" id="#{field.name}">
    #{field.value}
    </textarea>
    """
