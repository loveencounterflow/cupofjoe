(function() {
  'use strict';
  var CND, alert, badge, debug, help, info, jr, log, rpr, test, urge, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr.bind(CND);

  badge = 'CUPOFJOE/TESTS';

  log = CND.get_logger('plain', badge);

  info = CND.get_logger('info', badge);

  whisper = CND.get_logger('whisper', badge);

  alert = CND.get_logger('alert', badge);

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  help = CND.get_logger('help', badge);

  urge = CND.get_logger('urge', badge);

  //...........................................................................................................
  // # types                     = require '../types'
  // { isa
  //   validate
  //   type_of }               = ( new ( require 'intertype' ).Intertype() ).export()
  //...........................................................................................................
  // CUPOFJOE                 = require '../..'
  ({jr} = CND);

  test = require('guy-test');

  //-----------------------------------------------------------------------------------------------------------
  this["CUP demo 1"] = function(T, done) {
    var cram, cupofjoe, ds, expand;
    // debug ( k for k of ( require '../..' ) ); process.exit 1
    cupofjoe = new (require('../..')).Cupofjoe();
    ({cram, expand} = cupofjoe.export());
    //.........................................................................................................
    cram(null, function() {
      cram('pre');
      cram('one', function() {
        cram('two', 42);
        return cram('three', function() {
          return cram('four', function() {
            return cram('five', function() {
              return cram('six');
            });
          });
        });
      });
      return cram('post');
    });
    ds = expand();
    info(rpr(ds));
    // urge '^4443^', ds
    T.eq(ds, [['pre'], ['one', ['two', 42], ['three', ['four', ['five', ['six']]]]], ['post']]);
    if (done != null) {
      //.........................................................................................................
      return done();
    }
  };

  //-----------------------------------------------------------------------------------------------------------
  this["CUP demo 2"] = function(T, done) {
    var DATOM, cram, cupofjoe, ds, expand, h, lets, new_datom, select;
    cupofjoe = new (require('../..')).Cupofjoe();
    ({cram, expand} = cupofjoe.export());
    //.........................................................................................................
    DATOM = new (require('datom')).Datom({
      dirty: false
    });
    ({new_datom, lets, select} = DATOM.export());
    //.........................................................................................................
    h = function(tagname, ...content) {
      var d, d1, d2;
      if (content.length === 0) {
        d = new_datom(`^${tagname}`);
        return cram(d, ...content);
      }
      d1 = new_datom(`<${tagname}`);
      d2 = new_datom(`>${tagname}`);
      return cram(d1, ...content, d2);
    };
    //.........................................................................................................
    cram(null, function() {
      h('pre');
      h('one', function() {
        h('two', new_datom('^text', {
          text: '42'
        }));
        return h('three', function() {
          return h('four', function() {
            return h('five', function() {
              return h('six', function() {
                return cram(new_datom('^text', {
                  text: 'bottom'
                }));
              });
            });
          });
        });
      });
      return h('post');
    });
    urge(rpr(cupofjoe.collector));
    ds = expand();
    info(jr(ds));
    T.eq(ds, [
      [
        {
          '$key': '^pre'
        }
      ],
      [
        {
          '$key': '<one'
        },
        [
          {
            '$key': '<two'
          },
          {
            text: '42',
            '$key': '^text'
          },
          {
            '$key': '>two'
          }
        ],
        [
          {
            '$key': '<three'
          },
          [
            {
              '$key': '<four'
            },
            [
              {
                '$key': '<five'
              },
              [
                {
                  '$key': '<six'
                },
                [
                  {
                    text: 'bottom',
                    '$key': '^text'
                  }
                ],
                {
                  '$key': '>six'
                }
              ],
              {
                '$key': '>five'
              }
            ],
            {
              '$key': '>four'
            }
          ],
          {
            '$key': '>three'
          }
        ],
        {
          '$key': '>one'
        }
      ],
      [
        {
          '$key': '^post'
        }
      ]
    ]);
    if (done != null) {
      //.........................................................................................................
      return done();
    }
  };

  //-----------------------------------------------------------------------------------------------------------
  this["CUP demo 3"] = async function(T, done) {
    var cram, cupofjoe, ds, expand, expand_async, request, sleep;
    cupofjoe = new (require('../..')).Cupofjoe();
    ({cram, expand, expand_async} = cupofjoe.export());
    //.........................................................................................................
    sleep = function(dts) {
      return new Promise((done) => {
        return setTimeout(done, dts * 1000);
      });
    };
    request = async function() {
      await sleep(0);
      return 'request complete';
    };
    //.........................................................................................................
    cram(null, function() {
      cram('pre');
      return cram('one', async function() {
        return cram('two', (await request()));
      });
    });
    // urge rpr CUP.collector
    ds = (await expand_async());
    info(jr(ds));
    T.eq(ds, [['pre'], ['one', ['two', 'request complete']]]);
    if (done != null) {
      //.........................................................................................................
      return done();
    }
  };

  //-----------------------------------------------------------------------------------------------------------
  this["CUP configuration"] = async function(T, done) {
    var cram, cupofjoe, ds, expand, expand_async, request, sleep;
    cupofjoe = new (require('../..')).Cupofjoe();
    ({cram, expand, expand_async} = cupofjoe.export());
    //.........................................................................................................
    sleep = function(dts) {
      return new Promise((done) => {
        return setTimeout(done, dts * 1000);
      });
    };
    request = async function() {
      await sleep(0);
      return 'request complete';
    };
    //.........................................................................................................
    cram(null, function() {
      cram('pre');
      return cram('one', async function() {
        return cram('two', (await request()));
      });
    });
    // urge rpr CUP.collector
    ds = (await expand_async());
    info(jr(ds));
    T.eq(ds, [['pre'], ['one', ['two', 'request complete']]]);
    if (done != null) {
      //.........................................................................................................
      return done();
    }
  };

  // #-----------------------------------------------------------------------------------------------------------
  // @[ "expand()" ] = ( T, done ) ->
  //   cupofjoe = new ( require '../..' ).Cupofjoe()
  //   { cram
  //     expand
  //     expand_async } = cupofjoe.export()
  //   #.........................................................................................................
  //   probes_and_matchers = [
  //     [[],[]]
  //     [['a','b',['c']],['a','b',['c']]]
  //     ]
  //   for [ probe, matcher, error, ] in probes_and_matchers
  //     await T.perform probe, matcher, error, -> new Promise ( resolve ) ->
  //       resolve expand probe
  //   #.........................................................................................................
  //   done()
  //   return null

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      return test(this);
    })();
  }

  // @[ "CUP demo 2" ]()
// test @[ "expand()" ]
// test @[ "CUP configuration" ]
// test @[ "CUP demo 2" ]
// test @[ "CUP demo 3" ]

}).call(this);
