fs     = require 'fs'
stylus = require '/usr/local/lib/node_modules/stylus'
{exec} = require 'child_process'

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

task 'coffee', 'Simple make Coffee', ->

  exec 'coffee -c -o js/ src/', (err, stdout, stderr) ->
        throw err if err
        log stdout + stderr

task 'all', 'Coffee and Stylus', ->
  invoke 'stylus'
  invoke 'coffee'