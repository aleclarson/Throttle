
# Throttle 2.0.0 ![stable](https://img.shields.io/badge/stability-stable-4EBA0F.svg?style=flat)

```coffee
Throttle = require "Throttle"

func = Throttle
  ms: 1000
  bind: { now: null }
  fn: (id) ->
    now = Date.now()
    console.log "Tick #{id}: " + (if @now? then now - @now else 0)
    @now = now

func 1 # This will run immediately.

func.call 2 # This runs immediately and resets the throttle.

func 3 # This will be delayed 1000 ms.

func.disable() # Removes the bound object, stops pending calls, and prevents future calls.
```
