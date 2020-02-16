



'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr.bind CND
badge                     = 'CUPOFJOE/TESTS'
log                       = CND.get_logger 'plain',     badge
info                      = CND.get_logger 'info',      badge
whisper                   = CND.get_logger 'whisper',   badge
alert                     = CND.get_logger 'alert',     badge
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
help                      = CND.get_logger 'help',      badge
urge                      = CND.get_logger 'urge',      badge
#...........................................................................................................
# # types                     = require '../types'
# { isa
#   validate
#   type_of }               = ( new ( require 'intertype' ).Intertype() ).export()
#...........................................................................................................
# CUPOFJOE                 = require '../..'
{ jr }                    = CND
test                      = require 'guy-test'


#-----------------------------------------------------------------------------------------------------------
@[ "CUP demo 1" ] = ( T, done ) ->
  # debug ( k for k of ( require '../..' ) ); process.exit 1
  cupofjoe = new ( require '../..' ).Cupofjoe()
  { cram
    expand }  = cupofjoe.export()
  #.........................................................................................................
  cram null, ->
    cram 'pre'
    cram 'one', ->
      cram 'two', 42
      cram 'three', ->
        cram 'four', ->
          cram 'five', ->
            cram 'six'
    cram 'post'
  ds = expand()
  info rpr ds
  # urge '^4443^', ds
  T.eq ds, [
    [ 'pre' ],
    [ 'one',
      [ 'two', 42 ],
      [ 'three',
        [ 'four', [ 'five', [ 'six' ] ] ] ] ],
    [ 'post' ] ]
  #.........................................................................................................
  done() if done?

#-----------------------------------------------------------------------------------------------------------
@[ "CUP demo 2" ] = ( T, done ) ->
  cupofjoe = new ( require '../..' ).Cupofjoe()
  { cram
    expand }  = cupofjoe.export()
  #.........................................................................................................
  DATOM                     = new ( require 'datom' ).Datom { dirty: false, }
  { new_datom
    lets
    select }                = DATOM.export()
  #.........................................................................................................
  h = ( tagname, content... ) ->
    if content.length is 0
      d = new_datom "^#{tagname}"
      return cram d, content...
    d1 = new_datom "<#{tagname}"
    d2 = new_datom ">#{tagname}"
    return cram d1, content..., d2
  #.........................................................................................................
  cram null, ->
    h 'pre'
    h 'one', ->
      h 'two', ( new_datom '^text', text: '42' )
      h 'three', ->
        h 'four', ->
          h 'five', ->
            h 'six', ->
              cram ( new_datom '^text', text: 'bottom' )
    h 'post'
  urge rpr cupofjoe.collector
  ds = expand()
  info jr ds
  T.eq ds, [
    [ { '$key': '^pre' } ],
    [ { '$key': '<one' },
      [ { '$key': '<two' },
        { text: '42', '$key': '^text' },
        { '$key': '>two' } ],
      [ { '$key': '<three' },
        [ { '$key': '<four' },
          [ { '$key': '<five' },
            [ { '$key': '<six' },
              [ { text: 'bottom', '$key': '^text' } ],
              { '$key': '>six' } ],
            { '$key': '>five' } ],
          { '$key': '>four' } ],
        { '$key': '>three' } ],
      { '$key': '>one' } ],
    [ { '$key': '^post' } ] ]
  #.........................................................................................................
  done() if done?

#-----------------------------------------------------------------------------------------------------------
@[ "CUP demo 3" ] = ( T, done ) ->
  cupofjoe = new ( require '../..' ).Cupofjoe()
  { cram
    expand
    expand_async } = cupofjoe.export()
  #.........................................................................................................
  sleep   = ( dts ) -> new Promise ( done ) => setTimeout done, dts * 1000
  request = -> await sleep 0; return 'request complete'
  #.........................................................................................................
  cram null, ->
    cram 'pre'
    cram 'one', ->
      cram 'two', await request()
  # urge rpr CUP.collector
  ds = await expand_async()
  info jr ds
  T.eq ds, [ [ 'pre' ], [ 'one', [ 'two', 'request complete' ] ] ]
  #.........................................................................................................
  done() if done?

#-----------------------------------------------------------------------------------------------------------
@[ "CUP configuration" ] = ( T, done ) ->
  cupofjoe = new ( require '../..' ).Cupofjoe()
  { cram
    expand
    expand_async } = cupofjoe.export()
  #.........................................................................................................
  sleep   = ( dts ) -> new Promise ( done ) => setTimeout done, dts * 1000
  request = -> await sleep 0; return 'request complete'
  #.........................................................................................................
  cram null, ->
    cram 'pre'
    cram 'one', ->
      cram 'two', await request()
  # urge rpr CUP.collector
  ds = await expand_async()
  info jr ds
  T.eq ds, [ [ 'pre' ], [ 'one', [ 'two', 'request complete' ] ] ]
  #.........................................................................................................
  done() if done?

# #-----------------------------------------------------------------------------------------------------------
# @[ "expand()" ] = ( T, done ) ->
#   cupofjoe = new ( require '../..' ).Cupofjoe()
#   { cram
#     expand
#     expand_async } = cupofjoe.export()
#   #.........................................................................................................
#   probes_and_matchers = [
#     [[],[]]
#     [['a','b',['c']],['a','b',['c']]]
#     ]
#   for [ probe, matcher, error, ] in probes_and_matchers
#     await T.perform probe, matcher, error, -> new Promise ( resolve ) ->
#       resolve expand probe
#   #.........................................................................................................
#   done()
#   return null



############################################################################################################
if module is require.main then do =>
  test @
  # @[ "CUP demo 2" ]()
  # test @[ "expand()" ]
  # test @[ "CUP configuration" ]
  # test @[ "CUP demo 2" ]
  # test @[ "CUP demo 3" ]


