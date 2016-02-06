
Throttle = require ".."

global.func = Throttle
  limit: 1510
  bind: { n: 0 }
  call: (m) ->
    console.log "n = " + @n++
    console.log "m = " + m

start = ->
  m = 0
  setInterval ->
    func m++
  , 500

start()
