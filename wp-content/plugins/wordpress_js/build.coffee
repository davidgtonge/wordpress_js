fs     = require 'fs'
stylus = require "C:\\Users\\Dave\\AppData\\Roaming\\npm\\node_modules\\stylus"
{exec} = require 'child_process'
_ = require "C:\\Users\\Dave\\AppData\\Roaming\\npm\\node_modules\\underscore"

log = console.log

task 'watch', 'Watch prod source files and build changes', ->

  files = fs.readdirSync "stylus"

  for file in files then do (file) ->
        fs.watchFile "stylus/#{file}", (curr, prev) ->
            if +curr.mtime isnt +prev.mtime
                log "Saw change in #{file}"
                invoke 'stylus'



task 'stylus', 'Build CSS', ->

  files = fs.readdirSync "stylus"
  log files
  contents = (fs.readFileSync "stylus/#{file}", 'utf8' for file in files).join('\n')
  #content = fs.readFileSync "style.sass", 'utf8'

  stylus.render contents, {filename:'twr.css'}, (err, css) ->
    throw err if err
    fs.writeFile "css/twr.css", css, 'utf8', (err) ->
      throw err if err
      log "CSS Parsed"


task 'buildCoffee', 'Build single application file from source files', ->

  appDirs = fs.readdirSync "src"
  htmlFiles = []

  process = (contents, dir) ->
    fs.writeFile "temp/#{dir}.coffee", contents.join('\n\n'), 'utf8', (err) ->
      throw err if err
      exec "coffee -c -o js temp/#{dir}.coffee", (err, stdout, stderr) ->
        throw err if err
        console.log "Joined and Compiled #{dir} CoffeeScripts"



  for dir in appDirs
    allFiles = []

    parse_file = (file, name) ->
      if file.indexOf("coffee") isnt -1
        allFiles.push file
      else if file.indexOf("html") isnt -1
        htmlFiles.push {name, file}
      else
        files = fs.readdirSync file
        for subFile in files
          parse_file "#{file}/#{subFile}", subFile

    parse_file "src/#{dir}", dir


    log allFiles
    contents = (fs.readFileSync file, 'utf8' for file in allFiles)
    process(contents, dir)

  log htmlFiles
  html = ""

  for file in htmlFiles
    contents = fs.readFileSync file.file, 'utf8'
    name = file.name.substr 0, (file.name.length - 5)
    html += "<script type='template' id='tmpl_#{name}'>#{contents}</script>"
  fs.writeFile "templates.html", html, 'utf8', (err) ->
    throw err if err
    console.log "Written Template file"


task 'simple', 'Simple make Coffee', ->

  exec 'coffee -c -o js/ src/', (err, stdout, stderr) ->
        throw err if err
        log stdout + stderr

task 'all', 'Coffee and Stylus', ->
  invoke 'stylus'
  invoke 'coffee'