
isType = require "isType"
Type = require "Type"

type = Type "Throttle"

type.inherits Function

type.createInstance ->
  self = -> self._callEventually this, arguments

type.createArgs (args) ->
  if isType args[0], Number
    args[0] =
      ms: args[0]
      fn: args[1]
  return args

type.defineArgs ->

  required: yes

  types:
    ms: Number
    fn: Function.Kind
    runEventually: Boolean

  defaults:
    runEventually: yes

type.defineValues (options) ->

  _ms: options.ms

  _fn: options.fn

  _runEventually: options.runEventually

  _pending: null

  _disabled: no

  _throttle: null

type.overrideMethods

  toString: ->
    @_callEventually.toString()

type.defineMethods

  disable: ->
    unless @_disabled
      @_disabled = yes
      @_stop()
      return

  _callEventually: (context, args) ->
    unless @_disabled
      if @_throttle?
      then @_setPending context, args
      else @_callImmediately context, args
      return

  _setPending: (context, args) ->
    if @_runEventually
      @_pending = {context, args}
      return

  _callImmediately: (context, args) ->
    @_fn.apply context, args
    @_throttle = setTimeout @_onThrottleEnd, @_ms
    return

  _stop: ->
    clearTimeout @_throttle
    @_throttle = null
    @_pending = null
    return

type.defineBoundMethods

  _onThrottleEnd: ->
    @_throttle = null
    if @_pending
      {context, args} = @_pending
      @_pending = null
      @_callImmediately context, args
      return

module.exports = type.build()
