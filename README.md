
# throttle v1.0.0 [![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

```coffee
Throttle = require "throttle"

func = Throttle
  limit: 1000
  bind: { now: null }
  call: (id) ->
    now = Date.now()
    console.log "Tick #{id}: " + (if @now? then now - @now else 0)
    @now = now

func 1 # This will run immediately.

func.call 2 # This ignores the throttle.

func 3 # This will be delayed 1000 ms.

func.disable() # Removes the bound object, stops pending calls, and prevents future calls.
```
