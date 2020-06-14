



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

#-----------------------------------------------------------------------------------------------------------
remove_notgiven = ( list ) ->
  return list.filter ( e ) -> e? ### mutating variant ###
  # return ( e for e in list when e? ) ### non-mutating variant ###

#-----------------------------------------------------------------------------------------------------------
@expand = ->
  @_expand @collector
  @collector = @collector.flat Infinity if @settings.flatten
  return @_unwrap @collector

#-----------------------------------------------------------------------------------------------------------
@_expand = ( list ) ->
  idx = -1
  loop
    idx++; break if idx > list.length - 1
    unless ( x = list[ idx ] )? then list.splice idx, 1; idx--; continue
    if ( type = type_of x ) is 'list'
      if ( x = remove_notgiven x ).length is 0 then list.splice idx, 1; idx--; continue
      @_expand list[ idx ] = x
    else if type is 'function'
      @target = []; x(); list[ idx .. idx ] = @target; idx--
    else if type is 'asyncfunction'
      throw new Error "^7767^ at index #{idx}: unable to synchronically expand async function"
    else if type is 'promise'
      throw new Error "^7767^ at index #{idx}: unable to synchronically expand promise"
  return null

#-----------------------------------------------------------------------------------------------------------
@_unwrap = ( x ) ->
  return x unless isa.list x
  # x = x.filter ( e ) -> e? and not ( ( isa.list e ) and ( e.length is 0 ) )
  return x unless x.length is 1
  return x unless isa.list x[ 0 ]
  return @_unwrap x[ 0 ]

#-----------------------------------------------------------------------------------------------------------
@cram = ( x... ) ->
  @target.push x
  return null

#-----------------------------------------------------------------------------------------------------------
MAIN = @
class Cupofjoe extends Multimix
  @include MAIN, { overwrite: false, }
  # @extend MAIN, { overwrite: false, }

  #---------------------------------------------------------------------------------------------------------
  constructor: ( settings = null) ->
    super()
    @settings   = { { flatten: false, }..., settings..., }
    @collector  = []
    @target     = @collector
    return @

#-----------------------------------------------------------------------------------------------------------
module.exports = { Cupofjoe, }


############################################################################################################
if module is require.main then do =>
  null

