(function() {
  'use strict';
  var CND, Cupofjoe, MAIN, Multimix, alert, badge, debug, help, info, isa, jr, log, remove_nulls_etc, rpr, type_of, urge, validate, warn, whisper,
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

  //-----------------------------------------------------------------------------------------------------------
  remove_nulls_etc = function(list) {
    return list.filter(function(e) {
      return e != null;
    });
  };

  // return ( e for e in list when e? ) ### non-mutating variant ###

  //-----------------------------------------------------------------------------------------------------------
  this./* mutating variant */expand = function() {
    this._expand(this.collector);
    if (this.settings.flatten) {
      this.collector = this.collector.flat(2e308);
    }
    return this._unwrap(this.collector);
  };

  //-----------------------------------------------------------------------------------------------------------
  this.expand_async = async function() {
    await this._expand_async(this.collector);
    if (this.settings.flatten) {
      this.collector = this.collector.flat(2e308);
    }
    return this._unwrap(this.collector);
  };

  //-----------------------------------------------------------------------------------------------------------
  this._expand = function(list) {
    /* remove nulls and undefined elements, skip empty lists */
    var idx, ref, type, value;
    idx = -1;
    while (true) {
      idx++;
      if (idx > list.length - 1) {
        break;
      }
      value = list[idx];
      //.......................................................................................................
      switch (type = type_of(value)) {
        //.....................................................................................................
        case 'list':
          value = remove_nulls_etc(value);
          if (value.length === 0) {
            list.splice(idx, 1);
            idx--;
            continue;
          }
          this._expand(list[idx] = value);
          break;
        //.....................................................................................................
        case 'function':
          this.target = [];
          value();
          splice.apply(list, [idx, idx - idx + 1].concat(ref = this.target)), ref;
          idx--;
          continue;
        //.....................................................................................................
        case 'asyncfunction':
          throw new Error("^coj/_expand@7767^ unable to use `expand` for async function; use `expand_async()` instead");
      }
      //.......................................................................................................
      if (value == null) {
        list.splice(idx, 1);
        idx--;
        continue;
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
        if ((x = x.filter(function(e) {
          return e != null;
        })).length === 0) {
          list.splice(idx, 1);
          idx--;
          continue;
        }
        await this._expand_async(list[idx] = x);
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
      // x = x.filter ( e ) -> e? and not ( ( isa.list e ) and ( e.length is 0 ) )
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
      constructor(settings = null) {
        super();
        this.settings = {...{
            flatten: false
          }, ...settings};
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

//# sourceMappingURL=main.js.map