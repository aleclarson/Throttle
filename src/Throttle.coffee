
isNumber = require "isNumber"
Type = require "Type"

type = Type "Throttle"

type._kind = Function
type._createInstance = ->
  self = -> self._callEventually this, arguments

type.initArgs (args) ->
  if isNumber args[0]
    args[0] =
      ms: args[0]
      fn: args[1]
  return

type.defineOptions
  ms: Number.isRequired
  fn: Function.Kind.isRequired
  runEventually: Boolean.withDefault yes

type.defineValues (options) ->

  _ms: options.ms

  _fn: options.fn

  _context: options.context

  _runEventually: options.runEventually

  _pending: null

  _disabled: no

  _throttle: null

type.overrideMethods

  toString: ->
    @_callEventually.toString()

  call: ->
    return if @_disabled
    @_stop()
    @_callImmediately @_context or this, arguments
    return

type.defineMethods

  disable: ->
    return if @_disabled
    @_disabled = yes
    @_stop()
    @_context = null
    return

  _callEventually: (context, args) ->
    return if @_disabled
    if @_throttle? then @_setPending context, args
    else @_callImmediately context, args

  _setPending: (context, args) ->
    return unless @_runEventually
    @_pending = { context, args }

  _callImmediately: (context, args) ->
    @_fn.apply context, args
    @_throttle = setTimeout @_onThrottleEnd, @_ms

  _stop: ->
    clearTimeout @_throttle
    @_throttle = null
    @_pending = null

type.defineBoundMethods

  _onThrottleEnd: ->
    @_throttle = null
    return unless @_pending
    { context, args } = @_pending
    @_pending = null
    @_callImmediately context, args

module.exports = type.build()
