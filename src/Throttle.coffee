
require "lotus-require"

{ Any } = require "type-utils"

Factory = require "factory"

module.exports = Factory "Throttle",

  kind: Function

  func: ->
    return if @_disabled
    if @_throttle? then @_pending = arguments
    else @_start arguments
    return

  optionTypes:
    call: Function.Kind
    bind: Any
    limit: Number

  initValues: (options) ->
    _call: options.call
    _bind: options.bind
    _limit: options.limit
    _throttle: null
    _pending: null
    _disabled: no
    _update: =>
      return unless @_pending?
      args = @_pending
      @_throttle = null
      @_pending = null
      @_start args

  call: ->
    return if @_disabled
    @_stop()
    @_start arguments
    return

  disable: ->
    return if @_disabled
    @_disabled = yes
    @_stop()
    @_bind = null
    return

  _start: (args) ->
    @_call.apply @_bind, args
    @_throttle = setTimeout @_update, @_limit

  _stop: ->
    clearTimeout @_throttle
    @_throttle = null
    @_pending = null
