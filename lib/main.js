(function() {
  'use strict';
  var CND, Cupofjoe, MAIN, Multimix, alert, badge, debug, help, info, isa, jr, log, rpr, type_of, urge, validate, warn, whisper,
    splice = [].splice;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr.bind(CND);

  badge = 'CUPOFJOE';

  log = CND.get_logger('plain', badge);

  info = CND.get_logger('info', badge);

  whisper = CND.get_logger('whisper', badge);

  alert = CND.get_logger('alert', badge);

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  help = CND.get_logger('help', badge);

  urge = CND.get_logger('urge', badge);

  //...........................................................................................................
  this.types = new (require('intertype')).Intertype();

  ({isa, validate, type_of} = this.types.export());

  //...........................................................................................................
  ({jr} = CND);

  Multimix = require('multimix');

  // #-----------------------------------------------------------------------------------------------------------
  // get_nesting_level = ( list ) ->
  //   validate.list list
  //   return _get_nesting_level list, -1, -1
  // _get_nesting_level = ( list, level, max_nesting_level ) ->
  //   level            += 1
  //   max_nesting_level = Math.max max_nesting_level, level
  //   for x in list
  //     continue unless isa.list x
  //     max_nesting_level = Math.max max_nesting_level, _get_nesting_level x, level, max_nesting_level
  //   return max_nesting_level
  // urge '^897^', get_nesting_level []
  // urge '^897^', get_nesting_level [ 1, ]
  // urge '^897^', get_nesting_level [[]]
  // urge '^897^', get_nesting_level [ [ 4, ], ]
  // urge '^897^', get_nesting_level [[[]]]
  // urge '^897^', get_nesting_level [ 1, [ 2, 4, [ 5, ], [ 6, ], ], ]

  //-----------------------------------------------------------------------------------------------------------
  this.expand = function() {
    this._expand(this.collector);
    return this._unwrap(this.collector);
  };

  this.expand_async = async function() {
    await this._expand_async(this.collector);
    return this._unwrap(this.collector);
  };

  //-----------------------------------------------------------------------------------------------------------
  this._expand = function(list) {
    var idx, ref, type, x;
    idx = -1;
    while (true) {
      idx++;
      if (idx > list.length - 1) {
        break;
      }
      if ((x = list[idx]) == null) {
        list.splice(idx, 1);
        idx--;
        continue;
      }
      if ((type = type_of(x)) === 'list') {
        this._expand(x);
      } else if (type === 'function') {
        this.target = [];
        x();
        splice.apply(list, [idx, idx - idx + 1].concat(ref = this.target)), ref;
        idx--;
      } else if (type === 'asyncfunction') {
        throw new Error("^7767^ unable to synchronically expand async function");
      }
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this._expand_async = async function(list) {
    var idx, ref, ref1, type, x;
    idx = -1;
    while (true) {
      idx++;
      if (idx > list.length - 1) {
        break;
      }
      if ((x = list[idx]) == null) {
        list.splice(idx, 1);
        idx--;
        continue;
      }
      if ((type = type_of(x)) === 'list') {
        await this._expand_async(x);
      } else if (type === 'function') {
        this.target = [];
        x();
        splice.apply(list, [idx, idx - idx + 1].concat(ref = this.target)), ref;
        idx--;
      } else if (type === 'asyncfunction') {
        this.target = [];
        await x();
        splice.apply(list, [idx, idx - idx + 1].concat(ref1 = this.target)), ref1;
        idx--;
      }
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this._unwrap = function(x) {
    if (!isa.list(x)) {
      return x;
    }
    if (x.length !== 1) {
      return x;
    }
    if (!isa.list(x[0])) {
      return x;
    }
    return this._unwrap(x[0]);
  };

  //-----------------------------------------------------------------------------------------------------------
  this.cram = function(...x) {
    this.target.push(x);
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  MAIN = this;

  Cupofjoe = (function() {
    class Cupofjoe extends Multimix {
      // @extend MAIN, { overwrite: false, }

        //---------------------------------------------------------------------------------------------------------
      constructor() {
        super();
        // @export @target if @target?
        this.collector = [];
        this.target = this.collector;
        return this;
      }

    };

    Cupofjoe.include(MAIN, {
      overwrite: false
    });

    return Cupofjoe;

  }).call(this);

  //-----------------------------------------------------------------------------------------------------------
  module.exports = {Cupofjoe};

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      return null;
    })();
  }

}).call(this);
