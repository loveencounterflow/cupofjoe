



'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr.bind CND
badge                     = 'CUPOFJOE'
log                       = CND.get_logger 'plain',     badge
info                      = CND.get_logger 'info',      badge
whisper                   = CND.get_logger 'whisper',   badge
alert                     = CND.get_logger 'alert',     badge
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
help                      = CND.get_logger 'help',      badge
urge                      = CND.get_logger 'urge',      badge
#...........................................................................................................
@types                    = new ( require 'intertype' ).Intertype()
{ isa
  validate
  type_of }               = @types.export()
#...........................................................................................................
{ jr }                    = CND
Multimix                  = require 'multimix'


# #-----------------------------------------------------------------------------------------------------------
# get_nesting_level = ( list ) ->
#   validate.list list
#   return _get_nesting_level list, -1, -1
# _get_nesting_level = ( list, level, max_nesting_level ) ->
#   level            += 1
#   max_nesting_level = Math.max max_nesting_level, level
#   for x in list
#     continue unless isa.list x
#     max_nesting_level = Math.max max_nesting_level, _get_nesting_level x, level, max_nesting_level
#   return max_nesting_level
# urge '^897^', get_nesting_level []
# urge '^897^', get_nesting_level [ 1, ]
# urge '^897^', get_nesting_level [[]]
# urge '^897^', get_nesting_level [ [ 4, ], ]
# urge '^897^', get_nesting_level [[[]]]
# urge '^897^', get_nesting_level [ 1, [ 2, 4, [ 5, ], [ 6, ], ], ]


#-----------------------------------------------------------------------------------------------------------
@expand       = ->        @_expand        @collector; return @_unwrap @collector
@expand_async = -> await  @_expand_async  @collector; return @_unwrap @collector

#-----------------------------------------------------------------------------------------------------------
@_expand = ( list ) ->
  idx = -1
  loop
    idx++; break if idx > list.length - 1
    unless ( x = list[ idx ] )? then list.splice idx, 1; idx--; continue
    if ( type = type_of x ) is 'list' then @_expand x
    else if type is 'function'        then @target = []; x(); list[ idx .. idx ] = @target; idx--
    else if type is 'asyncfunction'
      throw new Error "^7767^ unable to synchronically expand async function"
  return null

#-----------------------------------------------------------------------------------------------------------
@_expand_async = ( list ) ->
  idx = -1
  loop
    idx++; break if idx > list.length - 1
    unless ( x = list[ idx ] )? then list.splice idx, 1; idx--; continue
    if ( type = type_of x ) is 'list' then await @_expand_async x
    else if type is 'function'        then @target = [];        x(); list[ idx .. idx ] = @target; idx--
    else if type is 'asyncfunction'   then @target = []; await  x(); list[ idx .. idx ] = @target; idx--
  return null

#-----------------------------------------------------------------------------------------------------------
@_unwrap = ( x ) ->
  return x unless isa.list x
  return x unless x.length is 1
  return x unless isa.list x[ 0 ]
  return @_unwrap x[ 0 ]

#-----------------------------------------------------------------------------------------------------------
@cram = ( x... ) -> @target.push x; return null

#-----------------------------------------------------------------------------------------------------------
MAIN = @
class Cupofjoe extends Multimix
  @include MAIN, { overwrite: false, }
  # @extend MAIN, { overwrite: false, }

  #---------------------------------------------------------------------------------------------------------
  constructor: ->
    super()
    # @export @target if @target?
    @collector = []
    @target    = @collector
    return @

#-----------------------------------------------------------------------------------------------------------
module.exports = { Cupofjoe, }


############################################################################################################
if module is require.main then do =>
  null

