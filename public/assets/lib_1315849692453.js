// Helpers
// -------
// These prototype helpers affect ALL your client-side and shared code. They also exist server-side, so you can use them anywhere.
// It is possible these helpers may conflict with an external third party library. Feel free to edit or delete this file if you don't want to use them.
// You will always be able to obtain the latest version of this file by coping/merging it in from a new project.
// Thanks to Addy Osmani for writing these and providing tests at https://github.com/addyosmani/socketstream-helpers

/**
	.bind() support
**/

if ( !Function.prototype.bind ) {
  Function.prototype.bind = function( obj ) {
    var slice = [].slice,
        args = slice.call(arguments, 1), 
        self = this, 
        nop = function () {}, 
        bound = function () {
          return self.apply( this instanceof nop ? this : ( obj || {} ), 
                              args.concat( slice.call(arguments) ) );    
        };

    nop.prototype = self.prototype;
    bound.prototype = new nop();

    return bound;
  };
}

/**
	Removes any duplicate entries from the current array
**/
if ( !String.prototype.unique ) {
	String.prototype.unique = function(b){
		 var a = "", i, l = this.length,q="";
		 for( i=0; i<l; i++ ) {
		  if( a.indexOf( this[i], 0, b ) < 0 ) { 
			a += this[i];
			}
		 }
		return a;
	};
}

/**
	Removes any duplicate entries from the current string
**/
if ( !Array.prototype.unique ) {
	Array.prototype.unique = function( b ) {
		 var a = [], i, l = this.length;
		 for( i=0; i<l; i++ ) {
		  if( a.indexOf( this[i], 0, b ) < 0 ) { a.push( this[i] ); }
		 }
		return a;
	};
}

/**
	Returns the last character in the current string
**/
if ( !String.prototype.last ) {
	String.prototype.last = function(){
		return this[this.length-1];
	};
}

/**
	Returns the last element in the current array
**/
if ( !Array.prototype.last ) {
	Array.prototype.last = function(){
		return this[this.length-1];
	};
}

/**
	Truncates the current string to the supplied length
**/
if ( !String.prototype.truncate ) {
	String.prototype.truncate = function(length){	
		if (this.length > length) {
		    return this.slice(0, length - 3) + "...";
		}else {
			return this;
		}
	};
}

/**
	Truncates the current array to the supplied length
**/
if ( !Array.prototype.truncate ) {
	Array.prototype.truncate = function(length){
		return this.slice(0, length);
	}
}

/**
	Returns a random character from the current string
**/
if ( !String.prototype.random ) {
	String.prototype.random = function( r ) {
		 var i = 0, l = this.length;
		 if( !r ) { r = this.length; }
		 else if( r > 0 ) { r = r % l; }
		 else { i = r; r = l + r % l; }
		 return this[ Math.floor( r * Math.random() - i ) ];
	};
}

/**
	Returns a random element from the current array
**/
if ( !Array.prototype.random ) {
	Array.prototype.random = function( r ) {
		 var i = 0, l = this.length;
		 if( !r ) { r = this.length; }
		 else if( r > 0 ) { r = r % l; }
		 else { i = r; r = l + r % l; }
		 return this[ Math.floor( r * Math.random() - i ) ];
	};
}

/**
	Boolean check to find out if a supplied character is in the current string
**/

if ( !String.prototype.include ) {
	String.prototype.include = function(value) {
	    var i = this.length;
	    while (i--) {
	        if (this[i] === value) return true;
	    }
	    return false;
	};
}

/**
	Boolean check to find out if a supplied element/string is in the current array
**/
if ( !Array.prototype.include ) {
	Array.prototype.include = function(value) {
	    var i = this.length;
	    while (i--) {
	        if (this[i] === value) return true;
	    }
	    return false;
	};
}

/**
	Boolean check to find out if a supplied character is in the current string
**/

if ( !String.prototype.contains ) {
	String.prototype.contains = String.prototype.include;
}

/**
	Boolean check to find out if a supplied character is in the current array
**/

if ( !Array.prototype.contains ) {
	Array.prototype.contains = Array.prototype.include;
}

/**
	Boolean check to find out if an array contains any elements
**/
if ( !Array.prototype.any ) {
	Array.prototype.any = function(){
		return !(this && this.constructor==Array && this.length==0);
	};
}

/**
	Sanitize content containing URLs or mailto/email references
**/
if ( !String.prototype.sanitize ) {
	String.prototype.sanitize = function(){
		return this.replace(/(([fh]+t+p+s?\:\/)+([^"'\s]+))/gi,"<a href=\"$1\" target=\"_blank\">$1<\/a>").
		  replace(/([a-z0-9\-\.]+\@[a-z0-9\-]+([^"'\s]+))/gi,"<a href=\"mailto:$1\" target=\"_blank\">$1<\/a>");
	};
};
//     Zepto.js
//     (c) 2010, 2011 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

var Zepto = (function() {
  var undefined, key, $$, classList,
    emptyArray = [], slice = emptyArray.slice,
    document = window.document,
    elementDisplay = {}, classCache = {},
    getComputedStyle = document.defaultView.getComputedStyle,
    cssNumber = { 'column-count': 1, 'columns': 1, 'font-weight': 1, 'line-height': 1,'opacity': 1, 'z-index': 1, 'zoom': 1 },
    fragmentRE = /^\s*<(\w+)[^>]*>/,
    elementTypes = [1, 9, 11],
    adjacencyOperators = ['prepend', 'after', 'before', 'append'],
    reverseAdjacencyOperators = ['append', 'prepend'],
    containers = {
      'th': document.createElement('tr'),
      'td': document.createElement('tr'),
      '*': document.createElement('div')
    };

  function isF(value) { return ({}).toString.call(value) == "[object Function]" }
  function isO(value) { return value instanceof Object }
  function isA(value) { return value instanceof Array }

  function compact(array) { return array.filter(function(item){ return item !== undefined && item !== null }) }
  function flatten(array) { return [].concat.apply([], array) }
  function camelize(str)  { return str.replace(/-+(.)?/g, function(match, chr){ return chr ? chr.toUpperCase() : '' }) }
  function dasherize(str){
    return str.replace(/::/g, '/')
           .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
           .replace(/([a-z\d])([A-Z])/g, '$1_$2')
           .replace(/_/g, '-')
           .toLowerCase();
  }
  function uniq(array)    { return array.filter(function(item,index,array){ return array.indexOf(item) == index }) }

  function classRE(name){
    return name in classCache ?
      classCache[name] : (classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)'));
  }

  function maybeAddPx(name, value) { return (typeof value == "number" && !cssNumber[dasherize(name)]) ? value + "px" : value; }

  function defaultDisplay(nodeName) {
    var element, display;
    if (!elementDisplay[nodeName]) {
      element = document.createElement(nodeName);
      document.body.appendChild(element);
      display = getComputedStyle(element, '').getPropertyValue("display");
      element.parentNode.removeChild(element);
      display == "none" && (display = "block");
      elementDisplay[nodeName] = display;
    }
    return elementDisplay[nodeName];
  }

  function fragment(html, name) {
    if (name === undefined) fragmentRE.test(html) && RegExp.$1;
    if (!(name in containers)) name = '*';
    var container = containers[name];
    container.innerHTML = '' + html;
    return slice.call(container.childNodes);
  }

  function Z(dom, selector){
    dom = dom || emptyArray;
    dom.__proto__ = Z.prototype;
    dom.selector = selector || '';
    return dom;
  }

  function $(selector, context){
    if (!selector) return Z();
    if (context !== undefined) return $(context).find(selector);
    else if (isF(selector)) return $(document).ready(selector);
    else if (selector instanceof Z) return selector;
    else {
      var dom;
      if (isA(selector)) dom = compact(selector);
      else if (elementTypes.indexOf(selector.nodeType) >= 0 || selector === window)
        dom = [selector], selector = null;
      else if (fragmentRE.test(selector))
        dom = fragment(selector, RegExp.$1), selector = null;
      else if (selector.nodeType && selector.nodeType == 3) dom = [selector];
      else dom = $$(document, selector);
      return Z(dom, selector);
    }
  }

  $.extend = function(target){
    slice.call(arguments, 1).forEach(function(source) {
      for (key in source) target[key] = source[key];
    })
    return target;
  }
  $.qsa = $$ = function(element, selector){ return slice.call(element.querySelectorAll(selector)) }

  function filtered(nodes, selector){
    return selector === undefined ? $(nodes) : $(nodes).filter(selector);
  }

  function funcArg(context, arg, idx, payload){
   return isF(arg) ? arg.call(context, idx, payload) : arg;
  }

  $.isFunction = isF;
  $.isObject = isO;
  $.isArray = isA;

  $.fn = {
    forEach: emptyArray.forEach,
    map: emptyArray.map,
    reduce: emptyArray.reduce,
    push: emptyArray.push,
    indexOf: emptyArray.indexOf,
    concat: emptyArray.concat,
    slice: function(){
      return $(slice.apply(this, arguments));
    },
    ready: function(callback){
      if (document.readyState == 'complete' || document.readyState == 'loaded') callback();
      document.addEventListener('DOMContentLoaded', callback, false);
      return this;
    },
    get: function(idx){ return idx === undefined ? this : this[idx] },
    size: function(){ return this.length },
    remove: function () {
      return this.each(function () {
        if (this.parentNode != null) {
          this.parentNode.removeChild(this);
        }
      });
    },
    each: function(callback){
      this.forEach(function(el, idx){ callback.call(el, idx, el) });
      return this;
    },
    filter: function(selector){
      return $([].filter.call(this, function(element){
        return $$(element.parentNode, selector).indexOf(element) >= 0;
      }));
    },
    end: function(){
      return this.prevObject || $();
    },
    add:function(selector,context){
      return $(uniq(this.concat($(selector,context))));
    },
    is: function(selector){
      return this.length > 0 && $(this[0]).filter(selector).length > 0;
    },
    not: function(selector){
      var nodes=[];
      if (isF(selector) && selector.call !== undefined)
        this.each(function(idx){
          if (!selector.call(this,idx)) nodes.push(this);
        });
      else {
        var excludes = typeof selector == 'string' ? this.filter(selector) :
          ('length' in selector && isF(selector.item)) ? slice.call(selector) : $(selector);
        this.forEach(function(el){
          if (excludes.indexOf(el) < 0) nodes.push(el);
        });
      }
      return $(nodes);
    },
    eq: function(idx){
      return idx === -1 ? this.slice(idx) : this.slice(idx, + idx + 1);
    },
    first: function(){ return $(this[0]) },
    last: function(){ return $(this[this.length - 1]) },
    find: function(selector){
      var result;
      if (this.length == 1) result = $$(this[0], selector);
      else result = flatten(this.map(function(el){ return $$(el, selector) }));
      return $(result);
    },
    closest: function(selector, context){
      var node = this[0], nodes = $$(context !== undefined ? context : document, selector);
      if (nodes.length === 0) node = null;
      while(node && node !== document && nodes.indexOf(node) < 0) node = node.parentNode;
      return $(node !== document && node);
    },
    parents: function(selector){
      var ancestors = [], nodes = this;
      while (nodes.length > 0)
        nodes = compact(nodes.map(function(node){
          if ((node = node.parentNode) && node !== document && ancestors.indexOf(node) < 0) {
            ancestors.push(node);
            return node;
          }
        }));
      return filtered(ancestors, selector);
    },
    parent: function(selector){
      return filtered(uniq(compact(this.pluck('parentNode'))), selector);
    },
    children: function(selector){
      return filtered(flatten(this.map(function(el){ return slice.call(el.children) })), selector);
    },
    siblings: function(selector){
      return filtered(flatten(this.map(function(el){
        return slice.call(el.parentNode.children).filter(function(child){ return child!==el });
      })), selector);
    },
    empty: function(){ return this.each(function(){ this.innerHTML = '' }) },
    pluck: function(property){ return this.map(function(element){ return element[property] }) },
    show: function(){
      return this.each(function() {
        this.style.display == "none" && (this.style.display = null);
        if (getComputedStyle(this, '').getPropertyValue("display") == "none") {
          this.style.display = defaultDisplay(this.nodeName)
        }
      })
    },
    replaceWith: function(newContent) {
      return this.each(function() {
        var par=this.parentNode,next=this.nextSibling;
        $(this).remove();
        next ? $(next).before(newContent) : $(par).append(newContent);
      });
    },
    wrap: function(newContent) {
      return this.each(function() {
        $(this).wrapAll($(newContent)[0].cloneNode(false));
      });
    },
    wrapAll: function(newContent) {
      if (this[0]) {
        $(this[0]).before(newContent = $(newContent));
        newContent.append(this);
      }
      return this;
    },
    unwrap: function(){
      this.parent().each(function(){
        $(this).replaceWith($(this).children());
      });
      return this;
    },
    hide: function(){
      return this.css("display", "none")
    },
    toggle: function(setting){
      return (setting === undefined ? this.css("display") == "none" : setting) ? this.show() : this.hide();
    },
    prev: function(){ return $(this.pluck('previousElementSibling')) },
    next: function(){ return $(this.pluck('nextElementSibling')) },
    html: function(html){
      return html === undefined ?
        (this.length > 0 ? this[0].innerHTML : null) :
        this.each(function(idx){ this.innerHTML = funcArg(this, html, idx, this.innerHTML) });
    },
    text: function(text){
      return text === undefined ?
        (this.length > 0 ? this[0].textContent : null) :
        this.each(function(){ this.textContent = text });
    },
    attr: function(name, value){
      return (typeof name == 'string' && value === undefined) ?
        (this.length > 0 && this[0].nodeName == 'INPUT' && this[0].type == 'text' && name == 'value') ? (this.val()) :
        (this.length > 0 ? this[0].getAttribute(name) || (name in this[0] ? this[0][name] : undefined) : undefined) :
        this.each(function(idx){
          if (isO(name)) for (key in name) this.setAttribute(key, name[key])
          else this.setAttribute(name, funcArg(this, value, idx, this.getAttribute(name)));
        });
    },
    removeAttr: function(name) {
      return this.each(function() { this.removeAttribute(name); });
    },
    data: function(name, value){
      return this.attr('data-' + name, value);
    },
    val: function(value){
      return (value === undefined) ?
        (this.length > 0 ? this[0].value : null) :
        this.each(function(){
          this.value = value;
        });
    },
    offset: function(){
      if(this.length==0) return null;
      var obj = this[0].getBoundingClientRect();
      return {
        left: obj.left + document.body.scrollLeft,
        top: obj.top + document.body.scrollTop,
        width: obj.width,
        height: obj.height
      };
    },
    css: function(property, value){
      if (value === undefined && typeof property == 'string')
        return this[0].style[camelize(property)] || getComputedStyle(this[0], '').getPropertyValue(property);
      var css = '';
      for (key in property) css += dasherize(key) + ':' + maybeAddPx(key, property[key]) + ';';
      if (typeof property == 'string') css = dasherize(property) + ":" + maybeAddPx(property, value);
      return this.each(function() { this.style.cssText += ';' + css });
    },
    index: function(element){
      return element ? this.indexOf($(element)[0]) : this.parent().children().indexOf(this[0]);
    },
    hasClass: function(name){
      if (this.length < 1) return false;
      else return classRE(name).test(this[0].className);
    },
    addClass: function(name){
      return this.each(function(idx) {
        classList = [];
        var cls = this.className, newName = funcArg(this, name, idx, cls);
        newName.split(/\s+/g).forEach(function(klass) {
          if (!$(this).hasClass(klass)) {
            classList.push(klass)
          }
        }, this);
        classList.length && (this.className += (cls ? " " : "") + classList.join(" "))
      });
    },
    removeClass: function(name){
      return this.each(function(idx) {
        if(name === undefined)
          return this.className = '';
        classList = this.className;
        funcArg(this, name, idx, classList).split(/\s+/g).forEach(function(klass) {
          classList = classList.replace(classRE(klass), " ")
        });
        this.className = classList.trim()
      });
    },
    toggleClass: function(name, when){
      return this.each(function(idx){
       var cls = this.className, newName = funcArg(this, name, idx, cls);
       ((when !== undefined && !when) || $(this).hasClass(newName)) ?
         $(this).removeClass(newName) : $(this).addClass(newName)
      });
    },
    submit: function () {
      return this.each(function () {
        try {
          // Submit first form element
          this.submit();
          return;
        } catch(e) {};
      });
    }
  };

  'filter,add,not,eq,first,last,find,closest,parents,parent,children,siblings'.split(',').forEach(function(property){
    var fn = $.fn[property];
    $.fn[property] = function() {
      var ret = fn.apply(this, arguments);
      ret.prevObject = this;
      return ret;
    }
  });

  ['width', 'height'].forEach(function(property){
    $.fn[property] = function(){ var offset = this.offset(); return offset ? offset[property] : null }
  });

  function insert(operator, target, node) {
    var parent = (!operator || operator == 3) ? target : target.parentNode;
    parent.insertBefore(node,
      !operator ? parent.firstChild :         // prepend
      operator == 1 ? target.nextSibling :    // after
      operator == 2 ? target :                // before
      null);                                  // append
  }

  adjacencyOperators.forEach(function(key, operator) {
    $.fn[key] = function(html){
      var nodes = typeof(html) == 'object' ? html : fragment(html);
      if (!('length' in nodes)) nodes = [nodes];
      if (nodes.length < 1) return this;
      var size = this.length, copyByClone = size > 1, inReverse = operator < 2;

      return this.each(function(index, target){
        for (var i = 0; i < nodes.length; i++) {
          var node = nodes[inReverse ? nodes.length-i-1 : i];
          if (copyByClone && index < size - 1) node = node.cloneNode(true);
          insert(operator, target, node);
        }
      });
    };
  });

  reverseAdjacencyOperators.forEach(function(key) {
    $.fn[key+'To'] = function(html){
      if (typeof(html) != 'object') html = $(html);
      html[key](this);
      return this;
    };
  });

  Z.prototype = $.fn;

  return $;
})();

'$' in window || (window.$ = Zepto);
;
//     Underscore.js 1.1.6
//     (c) 2011 Jeremy Ashkenas, DocumentCloud Inc.
//     Underscore is freely distributable under the MIT license.
//     Portions of Underscore are inspired or borrowed from Prototype,
//     Oliver Steele's Functional, and John Resig's Micro-Templating.
//     For all details and documentation:
//     http://documentcloud.github.com/underscore

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var slice            = ArrayProto.slice,
      unshift          = ArrayProto.unshift,
      toString         = ObjProto.toString,
      hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) { return new wrapper(obj); };

  // Export the Underscore object for **CommonJS**, with backwards-compatibility
  // for the old `require()` API. If we're not in CommonJS, add `_` to the
  // global object.
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = _;
    _._ = _;
  } else {
    // Exported as a string, for Closure Compiler "advanced" mode.
    root['_'] = _;
  }

  // Current version.
  _.VERSION = '1.1.6';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects implementing `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (_.isNumber(obj.length)) {
      for (var i = 0, l = obj.length; i < l; i++) {
        if (i in obj && iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) {
          if (iterator.call(context, obj[key], key, obj) === breaker) return;
        }
      }
    }
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results[results.length] = iterator.call(context, value, index, list);
    });
    return results;
  };

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = memo !== void 0;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial && index === 0) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError("Reduce of empty array with no initial value");
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return memo !== void 0 ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var reversed = (_.isArray(obj) ? obj.slice() : _.toArray(obj)).reverse();
    return _.reduce(reversed, iterator, memo, context);
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, iterator, context) {
    var result;
    any(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
    each(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) results[results.length] = value;
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    each(obj, function(value, index, list) {
      if (!iterator.call(context, value, index, list)) results[results.length] = value;
    });
    return results;
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, iterator, context) {
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
    each(obj, function(value, index, list) {
      if (!(result = result && iterator.call(context, value, index, list))) return breaker;
    });
    return result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
    each(obj, function(value, index, list) {
      if (result = iterator.call(context, value, index, list)) return breaker;
    });
    return result;
  };

  // Determine if a given value is included in the array or object using `===`.
  // Aliased as `contains`.
  _.include = _.contains = function(obj, target) {
    var found = false;
    if (obj == null) return found;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    any(obj, function(value) {
      if (found = value === target) return true;
    });
    return found;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    return _.map(obj, function(value) {
      return (method.call ? method || value : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, function(value){ return value[key]; });
  };

  // Return the maximum element or (element-based computation).
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj)) return Math.max.apply(Math, obj);
    var result = {computed : -Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed >= result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj)) return Math.min.apply(Math, obj);
    var result = {computed : Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed < result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, iterator, context) {
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value : value,
        criteria : iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria, b = right.criteria;
      return a < b ? -1 : a > b ? 1 : 0;
    }), 'value');
  };

  // Groups the object's values by a criterion produced by an iterator
  _.groupBy = function(obj, iterator) {
    var result = {};
    each(obj, function(value, index) {
      var key = iterator(value, index);
      (result[key] || (result[key] = [])).push(value);
    });
    return result;
  };

  // Use a comparator function to figure out at what index an object should
  // be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator) {
    iterator || (iterator = _.identity);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >> 1;
      iterator(array[mid]) < iterator(obj) ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely convert anything iterable into a real, live array.
  _.toArray = function(iterable) {
    if (!iterable)                return [];
    if (iterable.toArray)         return iterable.toArray();
    if (_.isArray(iterable))      return slice.call(iterable);
    if (_.isArguments(iterable))  return slice.call(iterable);
    return _.values(iterable);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    return _.toArray(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head`. The **guard** check allows it to work
  // with `_.map`.
  _.first = _.head = function(array, n, guard) {
    return (n != null) && !guard ? slice.call(array, 0, n) : array[0];
  };

  // Returns everything but the first entry of the array. Aliased as `tail`.
  // Especially useful on the arguments object. Passing an **index** will return
  // the rest of the values in the array from that index onward. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = function(array, index, guard) {
    return slice.call(array, (index == null) || guard ? 1 : index);
  };

  // Get the last element of an array.
  _.last = function(array) {
    return array[array.length - 1];
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, function(value){ return !!value; });
  };

  // Return a completely flattened version of an array.
  _.flatten = function(array) {
    return _.reduce(array, function(memo, value) {
      if (_.isArray(value)) return memo.concat(_.flatten(value));
      memo[memo.length] = value;
      return memo;
    }, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    var values = slice.call(arguments, 1);
    return _.filter(array, function(value){ return !_.include(values, value); });
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted) {
    return _.reduce(array, function(memo, el, i) {
      if (0 == i || (isSorted === true ? _.last(memo) != el : !_.include(memo, el))) memo[memo.length] = el;
      return memo;
    }, []);
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersect = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.indexOf(other, item) >= 0;
      });
    });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var args = slice.call(arguments);
    var length = _.max(_.pluck(args, 'length'));
    var results = new Array(length);
    for (var i = 0; i < length; i++) results[i] = _.pluck(args, "" + i);
    return results;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i, l;
    if (isSorted) {
      i = _.sortedIndex(array, item);
      return array[i] === item ? i : -1;
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item);
    for (i = 0, l = array.length; i < l; i++) if (array[i] === item) return i;
    return -1;
  };


  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item) {
    if (array == null) return -1;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) return array.lastIndexOf(item);
    var i = array.length;
    while (i--) if (array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var len = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(len);

    while(idx < len) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Binding with arguments is also known as `curry`.
  // Delegates to **ECMAScript 5**'s native `Function.bind` if available.
  // We check for `func.bind` first, to fail fast when `func` is undefined.
  _.bind = function(func, obj) {
    if (func.bind === nativeBind && nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    var args = slice.call(arguments, 2);
    return function() {
      return func.apply(obj, args.concat(slice.call(arguments)));
    };
  };

  // Bind all of an object's methods to that object. Useful for ensuring that
  // all callbacks defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length == 0) funcs = _.functions(obj);
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return hasOwnProperty.call(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(func, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Internal function used to implement `_.throttle` and `_.debounce`.
  var limit = function(func, wait, debounce) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var throttler = function() {
        timeout = null;
        func.apply(context, args);
      };
      if (debounce) clearTimeout(timeout);
      if (debounce || !timeout) timeout = setTimeout(throttler, wait);
    };
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time.
  _.throttle = function(func, wait) {
    return limit(func, wait, false);
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds.
  _.debounce = function(func, wait) {
    return limit(func, wait, true);
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      return memo = func.apply(this, arguments);
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return function() {
      var args = [func].concat(slice.call(arguments));
      return wrapper.apply(this, args);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = slice.call(arguments);
    return function() {
      var args = slice.call(arguments);
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) { return func.apply(this, arguments); }
    };
  };


  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = nativeKeys || function(obj) {
    if (obj !== Object(obj)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in obj) if (hasOwnProperty.call(obj, key)) keys[keys.length] = key;
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    return _.map(obj, _.identity);
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    return _.filter(_.keys(obj), function(key){ return _.isFunction(obj[key]); }).sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      for (var prop in source) {
        if (source[prop] !== void 0) obj[prop] = source[prop];
      }
    });
    return obj;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      for (var prop in source) {
        if (obj[prop] == null) obj[prop] = source[prop];
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    // Check object identity.
    if (a === b) return true;
    // Different types?
    var atype = typeof(a), btype = typeof(b);
    if (atype != btype) return false;
    // Basic equality test (watch out for coercions).
    if (a == b) return true;
    // One is falsy and the other truthy.
    if ((!a && b) || (a && !b)) return false;
    // Unwrap any wrapped objects.
    if (a._chain) a = a._wrapped;
    if (b._chain) b = b._wrapped;
    // One of them implements an isEqual()?
    if (a.isEqual) return a.isEqual(b);
    if (b.isEqual) return b.isEqual(a);
    // Check dates' integer values.
    if (_.isDate(a) && _.isDate(b)) return a.getTime() === b.getTime();
    // Both are NaN?
    if (_.isNaN(a) && _.isNaN(b)) return false;
    // Compare regular expressions.
    if (_.isRegExp(a) && _.isRegExp(b))
      return a.source     === b.source &&
             a.global     === b.global &&
             a.ignoreCase === b.ignoreCase &&
             a.multiline  === b.multiline;
    // If a is not an object by this point, we can't handle it.
    if (atype !== 'object') return false;
    // Check for different array lengths before comparing contents.
    if (a.length && (a.length !== b.length)) return false;
    // Nothing else worked, deep compare the contents.
    var aKeys = _.keys(a), bKeys = _.keys(b);
    // Different object sizes?
    if (aKeys.length != bKeys.length) return false;
    // Recursive comparison of contents.
    for (var key in a) if (!(key in b) || !_.isEqual(a[key], b[key])) return false;
    return true;
  };

  // Is a given array or object empty?
  _.isEmpty = function(obj) {
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (hasOwnProperty.call(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType == 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Is a given variable an arguments object?
  _.isArguments = function(obj) {
    return !!(obj && hasOwnProperty.call(obj, 'callee'));
  };

  // Is a given value a function?
  _.isFunction = function(obj) {
    return !!(obj && obj.constructor && obj.call && obj.apply);
  };

  // Is a given value a string?
  _.isString = function(obj) {
    return !!(obj === '' || (obj && obj.charCodeAt && obj.substr));
  };

  // Is a given value a number?
  _.isNumber = function(obj) {
    return !!(obj === 0 || (obj && obj.toExponential && obj.toFixed));
  };

  // Is the given value `NaN`? `NaN` happens to be the only value in JavaScript
  // that does not equal itself.
  _.isNaN = function(obj) {
    return obj !== obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false;
  };

  // Is a given value a date?
  _.isDate = function(obj) {
    return !!(obj && obj.getTimezoneOffset && obj.setUTCFullYear);
  };

  // Is the given value a regular expression?
  _.isRegExp = function(obj) {
    return !!(obj && obj.test && obj.exec && (obj.ignoreCase || obj.ignoreCase === false));
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  // Run a function **n** times.
  _.times = function (n, iterator, context) {
    for (var i = 0; i < n; i++) iterator.call(context, i);
  };

  // Add your own custom functions to the Underscore object, ensuring that
  // they're correctly added to the OOP wrapper as well.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name){
      addToWrapper(name, _[name] = obj[name]);
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = idCounter++;
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(str, data) {
    var c  = _.templateSettings;
    var tmpl = 'var __p=[],print=function(){__p.push.apply(__p,arguments);};' +
      'with(obj||{}){__p.push(\'' +
      str.replace(/\\/g, '\\\\')
         .replace(/'/g, "\\'")
         .replace(c.interpolate, function(match, code) {
           return "'," + code.replace(/\\'/g, "'") + ",'";
         })
         .replace(c.evaluate || null, function(match, code) {
           return "');" + code.replace(/\\'/g, "'")
                              .replace(/[\r\n\t]/g, ' ') + "__p.push('";
         })
         .replace(/\r/g, '\\r')
         .replace(/\n/g, '\\n')
         .replace(/\t/g, '\\t')
         + "');}return __p.join('');";
    var func = new Function('obj', tmpl);
    return data ? func(data) : func;
  };

  // The OOP Wrapper
  // ---------------

  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.
  var wrapper = function(obj) { this._wrapped = obj; };

  // Expose `wrapper.prototype` as `_.prototype`
  _.prototype = wrapper.prototype;

  // Helper function to continue chaining intermediate results.
  var result = function(obj, chain) {
    return chain ? _(obj).chain() : obj;
  };

  // A method to easily add functions to the OOP wrapper.
  var addToWrapper = function(name, func) {
    wrapper.prototype[name] = function() {
      var args = slice.call(arguments);
      unshift.call(args, this._wrapped);
      return result(func.apply(_, args), this._chain);
    };
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    wrapper.prototype[name] = function() {
      method.apply(this._wrapped, arguments);
      return result(this._wrapped, this._chain);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    wrapper.prototype[name] = function() {
      return result(method.apply(this._wrapped, arguments), this._chain);
    };
  });

  // Start chaining a wrapped Underscore object.
  wrapper.prototype.chain = function() {
    this._chain = true;
    return this;
  };

  // Extracts the result from a wrapped and chained object.
  wrapper.prototype.value = function() {
    return this._wrapped;
  };

})();
;
//     Backbone.js 0.5.1
//     (c) 2010 Jeremy Ashkenas, DocumentCloud Inc.
//     Backbone may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://documentcloud.github.com/backbone

(function(){

  // Initial Setup
  // -------------

  // Save a reference to the global object.
  var root = this;

  // Save the previous value of the `Backbone` variable.
  var previousBackbone = root.Backbone;

  // The top-level namespace. All public Backbone classes and modules will
  // be attached to this. Exported for both CommonJS and the browser.
  var Backbone;
  if (typeof exports !== 'undefined') {
    Backbone = exports;
  } else {
    Backbone = root.Backbone = {};
  }

  // Current version of the library. Keep in sync with `package.json`.
  Backbone.VERSION = '0.5.1';

  // Require Underscore, if we're on the server, and it's not already present.
  var _ = root._;
  if (!_ && (typeof require !== 'undefined')) _ = require('underscore')._;

  // For Backbone's purposes, jQuery or Zepto owns the `$` variable.
  var $ = root.jQuery || root.Zepto;

  // Runs Backbone.js in *noConflict* mode, returning the `Backbone` variable
  // to its previous owner. Returns a reference to this Backbone object.
  Backbone.noConflict = function() {
    root.Backbone = previousBackbone;
    return this;
  };

  // Turn on `emulateHTTP` to use support legacy HTTP servers. Setting this option will
  // fake `"PUT"` and `"DELETE"` requests via the `_method` parameter and set a
  // `X-Http-Method-Override` header.
  Backbone.emulateHTTP = false;

  // Turn on `emulateJSON` to support legacy servers that can't deal with direct
  // `application/json` requests ... will encode the body as
  // `application/x-www-form-urlencoded` instead and will send the model in a
  // form param named `model`.
  Backbone.emulateJSON = false;

  // Backbone.Events
  // -----------------

  // A module that can be mixed in to *any object* in order to provide it with
  // custom events. You may `bind` or `unbind` a callback function to an event;
  // `trigger`-ing an event fires all callbacks in succession.
  //
  //     var object = {};
  //     _.extend(object, Backbone.Events);
  //     object.bind('expand', function(){ alert('expanded'); });
  //     object.trigger('expand');
  //
  Backbone.Events = {

    // Bind an event, specified by a string name, `ev`, to a `callback` function.
    // Passing `"all"` will bind the callback to all events fired.
    bind : function(ev, callback) {
      var calls = this._callbacks || (this._callbacks = {});
      var list  = calls[ev] || (calls[ev] = []);
      list.push(callback);
      return this;
    },

    // Remove one or many callbacks. If `callback` is null, removes all
    // callbacks for the event. If `ev` is null, removes all bound callbacks
    // for all events.
    unbind : function(ev, callback) {
      var calls;
      if (!ev) {
        this._callbacks = {};
      } else if (calls = this._callbacks) {
        if (!callback) {
          calls[ev] = [];
        } else {
          var list = calls[ev];
          if (!list) return this;
          for (var i = 0, l = list.length; i < l; i++) {
            if (callback === list[i]) {
              list[i] = null;
              break;
            }
          }
        }
      }
      return this;
    },

    // Trigger an event, firing all bound callbacks. Callbacks are passed the
    // same arguments as `trigger` is, apart from the event name.
    // Listening for `"all"` passes the true event name as the first argument.
    trigger : function(eventName) {
      var list, calls, ev, callback, args;
      var both = 2;
      if (!(calls = this._callbacks)) return this;
      while (both--) {
        ev = both ? eventName : 'all';
        if (list = calls[ev]) {
          for (var i = 0, l = list.length; i < l; i++) {
            if (!(callback = list[i])) {
              list.splice(i, 1); i--; l--;
            } else {
              args = both ? Array.prototype.slice.call(arguments, 1) : arguments;
              callback.apply(this, args);
            }
          }
        }
      }
      return this;
    }

  };

  // Backbone.Model
  // --------------

  // Create a new model, with defined attributes. A client id (`cid`)
  // is automatically generated and assigned for you.
  Backbone.Model = function(attributes, options) {
    var defaults;
    attributes || (attributes = {});
    if (defaults = this.defaults) {
      if (_.isFunction(defaults)) defaults = defaults();
      attributes = _.extend({}, defaults, attributes);
    }
    this.attributes = {};
    this._escapedAttributes = {};
    this.cid = _.uniqueId('c');
    this.set(attributes, {silent : true});
    this._changed = false;
    this._previousAttributes = _.clone(this.attributes);
    if (options && options.collection) this.collection = options.collection;
    this.initialize(attributes, options);
  };

  // Attach all inheritable methods to the Model prototype.
  _.extend(Backbone.Model.prototype, Backbone.Events, {

    // A snapshot of the model's previous attributes, taken immediately
    // after the last `"change"` event was fired.
    _previousAttributes : null,

    // Has the item been changed since the last `"change"` event?
    _changed : false,

    // The default name for the JSON `id` attribute is `"id"`. MongoDB and
    // CouchDB users may want to set this to `"_id"`.
    idAttribute : 'id',

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize : function(){},

    // Return a copy of the model's `attributes` object.
    toJSON : function() {
      return _.clone(this.attributes);
    },

    // Get the value of an attribute.
    get : function(attr) {
      return this.attributes[attr];
    },

    // Get the HTML-escaped value of an attribute.
    escape : function(attr) {
      var html;
      if (html = this._escapedAttributes[attr]) return html;
      var val = this.attributes[attr];
      return this._escapedAttributes[attr] = escapeHTML(val == null ? '' : '' + val);
    },

    // Returns `true` if the attribute contains a value that is not null
    // or undefined.
    has : function(attr) {
      return this.attributes[attr] != null;
    },

    // Set a hash of model attributes on the object, firing `"change"` unless you
    // choose to silence it.
    set : function(attrs, options) {

      // Extract attributes and options.
      options || (options = {});
      if (!attrs) return this;
      if (attrs.attributes) attrs = attrs.attributes;
      var now = this.attributes, escaped = this._escapedAttributes;

      // Run validation.
      if (!options.silent && this.validate && !this._performValidation(attrs, options)) return false;

      // Check for changes of `id`.
      if (this.idAttribute in attrs) this.id = attrs[this.idAttribute];

      // We're about to start triggering change events.
      var alreadyChanging = this._changing;
      this._changing = true;

      // Update attributes.
      for (var attr in attrs) {
        var val = attrs[attr];
        if (!_.isEqual(now[attr], val)) {
          now[attr] = val;
          delete escaped[attr];
          this._changed = true;
          if (!options.silent) this.trigger('change:' + attr, this, val, options);
        }
      }

      // Fire the `"change"` event, if the model has been changed.
      if (!alreadyChanging && !options.silent && this._changed) this.change(options);
      this._changing = false;
      return this;
    },

    // Remove an attribute from the model, firing `"change"` unless you choose
    // to silence it. `unset` is a noop if the attribute doesn't exist.
    unset : function(attr, options) {
      if (!(attr in this.attributes)) return this;
      options || (options = {});
      var value = this.attributes[attr];

      // Run validation.
      var validObj = {};
      validObj[attr] = void 0;
      if (!options.silent && this.validate && !this._performValidation(validObj, options)) return false;

      // Remove the attribute.
      delete this.attributes[attr];
      delete this._escapedAttributes[attr];
      if (attr == this.idAttribute) delete this.id;
      this._changed = true;
      if (!options.silent) {
        this.trigger('change:' + attr, this, void 0, options);
        this.change(options);
      }
      return this;
    },

    // Clear all attributes on the model, firing `"change"` unless you choose
    // to silence it.
    clear : function(options) {
      options || (options = {});
      var attr;
      var old = this.attributes;

      // Run validation.
      var validObj = {};
      for (attr in old) validObj[attr] = void 0;
      if (!options.silent && this.validate && !this._performValidation(validObj, options)) return false;

      this.attributes = {};
      this._escapedAttributes = {};
      this._changed = true;
      if (!options.silent) {
        for (attr in old) {
          this.trigger('change:' + attr, this, void 0, options);
        }
        this.change(options);
      }
      return this;
    },

    // Fetch the model from the server. If the server's representation of the
    // model differs from its current attributes, they will be overriden,
    // triggering a `"change"` event.
    fetch : function(options) {
      options || (options = {});
      var model = this;
      var success = options.success;
      options.success = function(resp, status, xhr) {
        if (!model.set(model.parse(resp, xhr), options)) return false;
        if (success) success(model, resp);
      };
      options.error = wrapError(options.error, model, options);
      return (this.sync || Backbone.sync).call(this, 'read', this, options);
    },

    // Set a hash of model attributes, and sync the model to the server.
    // If the server returns an attributes hash that differs, the model's
    // state will be `set` again.
    save : function(attrs, options) {
      options || (options = {});
      if (attrs && !this.set(attrs, options)) return false;
      var model = this;
      var success = options.success;
      options.success = function(resp, status, xhr) {
        if (!model.set(model.parse(resp, xhr), options)) return false;
        if (success) success(model, resp, xhr);
      };
      options.error = wrapError(options.error, model, options);
      var method = this.isNew() ? 'create' : 'update';
      return (this.sync || Backbone.sync).call(this, method, this, options);
    },

    // Destroy this model on the server if it was already persisted. Upon success, the model is removed
    // from its collection, if it has one.
    destroy : function(options) {
      options || (options = {});
      if (this.isNew()) return this.trigger('destroy', this, this.collection, options);
      var model = this;
      var success = options.success;
      options.success = function(resp) {
        model.trigger('destroy', model, model.collection, options);
        if (success) success(model, resp);
      };
      options.error = wrapError(options.error, model, options);
      return (this.sync || Backbone.sync).call(this, 'delete', this, options);
    },

    // Default URL for the model's representation on the server -- if you're
    // using Backbone's restful methods, override this to change the endpoint
    // that will be called.
    url : function() {
      var base = getUrl(this.collection) || this.urlRoot || urlError();
      if (this.isNew()) return base;
      return base + (base.charAt(base.length - 1) == '/' ? '' : '/') + encodeURIComponent(this.id);
    },

    // **parse** converts a response into the hash of attributes to be `set` on
    // the model. The default implementation is just to pass the response along.
    parse : function(resp, xhr) {
      return resp;
    },

    // Create a new model with identical attributes to this one.
    clone : function() {
      return new this.constructor(this);
    },

    // A model is new if it has never been saved to the server, and lacks an id.
    isNew : function() {
      return this.id == null;
    },

    // Call this method to manually fire a `change` event for this model.
    // Calling this will cause all objects observing the model to update.
    change : function(options) {
      this.trigger('change', this, options);
      this._previousAttributes = _.clone(this.attributes);
      this._changed = false;
    },

    // Determine if the model has changed since the last `"change"` event.
    // If you specify an attribute name, determine if that attribute has changed.
    hasChanged : function(attr) {
      if (attr) return this._previousAttributes[attr] != this.attributes[attr];
      return this._changed;
    },

    // Return an object containing all the attributes that have changed, or false
    // if there are no changed attributes. Useful for determining what parts of a
    // view need to be updated and/or what attributes need to be persisted to
    // the server.
    changedAttributes : function(now) {
      now || (now = this.attributes);
      var old = this._previousAttributes;
      var changed = false;
      for (var attr in now) {
        if (!_.isEqual(old[attr], now[attr])) {
          changed = changed || {};
          changed[attr] = now[attr];
        }
      }
      return changed;
    },

    // Get the previous value of an attribute, recorded at the time the last
    // `"change"` event was fired.
    previous : function(attr) {
      if (!attr || !this._previousAttributes) return null;
      return this._previousAttributes[attr];
    },

    // Get all of the attributes of the model at the time of the previous
    // `"change"` event.
    previousAttributes : function() {
      return _.clone(this._previousAttributes);
    },

    // Run validation against a set of incoming attributes, returning `true`
    // if all is well. If a specific `error` callback has been passed,
    // call that instead of firing the general `"error"` event.
    _performValidation : function(attrs, options) {
      var error = this.validate(attrs);
      if (error) {
        if (options.error) {
          options.error(this, error, options);
        } else {
          this.trigger('error', this, error, options);
        }
        return false;
      }
      return true;
    }

  });

  // Backbone.Collection
  // -------------------

  // Provides a standard collection class for our sets of models, ordered
  // or unordered. If a `comparator` is specified, the Collection will maintain
  // its models in sort order, as they're added and removed.
  Backbone.Collection = function(models, options) {
    options || (options = {});
    if (options.comparator) this.comparator = options.comparator;
    _.bindAll(this, '_onModelEvent', '_removeReference');
    this._reset();
    if (models) this.reset(models, {silent: true});
    this.initialize.apply(this, arguments);
  };

  // Define the Collection's inheritable methods.
  _.extend(Backbone.Collection.prototype, Backbone.Events, {

    // The default model for a collection is just a **Backbone.Model**.
    // This should be overridden in most cases.
    model : Backbone.Model,

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize : function(){},

    // The JSON representation of a Collection is an array of the
    // models' attributes.
    toJSON : function() {
      return this.map(function(model){ return model.toJSON(); });
    },

    // Add a model, or list of models to the set. Pass **silent** to avoid
    // firing the `added` event for every new model.
    add : function(models, options) {
      if (_.isArray(models)) {
        for (var i = 0, l = models.length; i < l; i++) {
          this._add(models[i], options);
        }
      } else {
        this._add(models, options);
      }
      return this;
    },

    // Remove a model, or a list of models from the set. Pass silent to avoid
    // firing the `removed` event for every model removed.
    remove : function(models, options) {
      if (_.isArray(models)) {
        for (var i = 0, l = models.length; i < l; i++) {
          this._remove(models[i], options);
        }
      } else {
        this._remove(models, options);
      }
      return this;
    },

    // Get a model from the set by id.
    get : function(id) {
      if (id == null) return null;
      return this._byId[id.id != null ? id.id : id];
    },

    // Get a model from the set by client id.
    getByCid : function(cid) {
      return cid && this._byCid[cid.cid || cid];
    },

    // Get the model at the given index.
    at: function(index) {
      return this.models[index];
    },

    // Force the collection to re-sort itself. You don't need to call this under normal
    // circumstances, as the set will maintain sort order as each item is added.
    sort : function(options) {
      options || (options = {});
      if (!this.comparator) throw new Error('Cannot sort a set without a comparator');
      this.models = this.sortBy(this.comparator);
      if (!options.silent) this.trigger('reset', this, options);
      return this;
    },

    // Pluck an attribute from each model in the collection.
    pluck : function(attr) {
      return _.map(this.models, function(model){ return model.get(attr); });
    },

    // When you have more items than you want to add or remove individually,
    // you can reset the entire set with a new list of models, without firing
    // any `added` or `removed` events. Fires `reset` when finished.
    reset : function(models, options) {
      models  || (models = []);
      options || (options = {});
      this.each(this._removeReference);
      this._reset();
      this.add(models, {silent: true});
      if (!options.silent) this.trigger('reset', this, options);
      return this;
    },

    // Fetch the default set of models for this collection, resetting the
    // collection when they arrive. If `add: true` is passed, appends the
    // models to the collection instead of resetting.
    fetch : function(options) {
      options || (options = {});
      var collection = this;
      var success = options.success;
      options.success = function(resp, status, xhr) {
        collection[options.add ? 'add' : 'reset'](collection.parse(resp, xhr), options);
        if (success) success(collection, resp);
      };
      options.error = wrapError(options.error, collection, options);
      return (this.sync || Backbone.sync).call(this, 'read', this, options);
    },

    // Create a new instance of a model in this collection. After the model
    // has been created on the server, it will be added to the collection.
    // Returns the model, or 'false' if validation on a new model fails.
    create : function(model, options) {
      var coll = this;
      options || (options = {});
      model = this._prepareModel(model, options);
      if (!model) return false;
      var success = options.success;
      options.success = function(nextModel, resp, xhr) {
        coll.add(nextModel, options);
        if (success) success(nextModel, resp, xhr);
      };
      model.save(null, options);
      return model;
    },

    // **parse** converts a response into a list of models to be added to the
    // collection. The default implementation is just to pass it through.
    parse : function(resp, xhr) {
      return resp;
    },

    // Proxy to _'s chain. Can't be proxied the same way the rest of the
    // underscore methods are proxied because it relies on the underscore
    // constructor.
    chain: function () {
      return _(this.models).chain();
    },

    // Reset all internal state. Called when the collection is reset.
    _reset : function(options) {
      this.length = 0;
      this.models = [];
      this._byId  = {};
      this._byCid = {};
    },

    // Prepare a model to be added to this collection
    _prepareModel: function(model, options) {
      if (!(model instanceof Backbone.Model)) {
        var attrs = model;
        model = new this.model(attrs, {collection: this});
        if (model.validate && !model._performValidation(attrs, options)) model = false;
      } else if (!model.collection) {
        model.collection = this;
      }
      return model;
    },

    // Internal implementation of adding a single model to the set, updating
    // hash indexes for `id` and `cid` lookups.
    // Returns the model, or 'false' if validation on a new model fails.
    _add : function(model, options) {
      options || (options = {});
      model = this._prepareModel(model, options);
      if (!model) return false;
      var already = this.getByCid(model);
      if (already) throw new Error(["Can't add the same model to a set twice", already.id]);
      this._byId[model.id] = model;
      this._byCid[model.cid] = model;
      var index = options.at != null ? options.at :
                  this.comparator ? this.sortedIndex(model, this.comparator) :
                  this.length;
      this.models.splice(index, 0, model);
      model.bind('all', this._onModelEvent);
      this.length++;
      if (!options.silent) model.trigger('add', model, this, options);
      return model;
    },

    // Internal implementation of removing a single model from the set, updating
    // hash indexes for `id` and `cid` lookups.
    _remove : function(model, options) {
      options || (options = {});
      model = this.getByCid(model) || this.get(model);
      if (!model) return null;
      delete this._byId[model.id];
      delete this._byCid[model.cid];
      this.models.splice(this.indexOf(model), 1);
      this.length--;
      if (!options.silent) model.trigger('remove', model, this, options);
      this._removeReference(model);
      return model;
    },

    // Internal method to remove a model's ties to a collection.
    _removeReference : function(model) {
      if (this == model.collection) {
        delete model.collection;
      }
      model.unbind('all', this._onModelEvent);
    },

    // Internal method called every time a model in the set fires an event.
    // Sets need to update their indexes when models change ids. All other
    // events simply proxy through. "add" and "remove" events that originate
    // in other collections are ignored.
    _onModelEvent : function(ev, model, collection, options) {
      if ((ev == 'add' || ev == 'remove') && collection != this) return;
      if (ev == 'destroy') {
        this._remove(model, options);
      }
      if (model && ev === 'change:' + model.idAttribute) {
        delete this._byId[model.previous(model.idAttribute)];
        this._byId[model.id] = model;
      }
      this.trigger.apply(this, arguments);
    }

  });

  // Underscore methods that we want to implement on the Collection.
  var methods = ['forEach', 'each', 'map', 'reduce', 'reduceRight', 'find', 'detect',
    'filter', 'select', 'reject', 'every', 'all', 'some', 'any', 'include',
    'contains', 'invoke', 'max', 'min', 'sortBy', 'sortedIndex', 'toArray', 'size',
    'first', 'rest', 'last', 'without', 'indexOf', 'lastIndexOf', 'isEmpty'];

  // Mix in each Underscore method as a proxy to `Collection#models`.
  _.each(methods, function(method) {
    Backbone.Collection.prototype[method] = function() {
      return _[method].apply(_, [this.models].concat(_.toArray(arguments)));
    };
  });

  // Backbone.Router
  // -------------------

  // Routers map faux-URLs to actions, and fire events when routes are
  // matched. Creating a new one sets its `routes` hash, if not set statically.
  Backbone.Router = function(options) {
    options || (options = {});
    if (options.routes) this.routes = options.routes;
    this._bindRoutes();
    this.initialize.apply(this, arguments);
  };

  // Cached regular expressions for matching named param parts and splatted
  // parts of route strings.
  var namedParam    = /:([\w\d]+)/g;
  var splatParam    = /\*([\w\d]+)/g;
  var escapeRegExp  = /[-[\]{}()+?.,\\^$|#\s]/g;

  // Set up all inheritable **Backbone.Router** properties and methods.
  _.extend(Backbone.Router.prototype, Backbone.Events, {

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize : function(){},

    // Manually bind a single named route to a callback. For example:
    //
    //     this.route('search/:query/p:num', 'search', function(query, num) {
    //       ...
    //     });
    //
    route : function(route, name, callback) {
      Backbone.history || (Backbone.history = new Backbone.History);
      if (!_.isRegExp(route)) route = this._routeToRegExp(route);
      Backbone.history.route(route, _.bind(function(fragment) {
        var args = this._extractParameters(route, fragment);
        callback.apply(this, args);
        this.trigger.apply(this, ['route:' + name].concat(args));
      }, this));
    },

    // Simple proxy to `Backbone.history` to save a fragment into the history.
    navigate : function(fragment, triggerRoute) {
      Backbone.history.navigate(fragment, triggerRoute);
    },

    // Bind all defined routes to `Backbone.history`. We have to reverse the
    // order of the routes here to support behavior where the most general
    // routes can be defined at the bottom of the route map.
    _bindRoutes : function() {
      if (!this.routes) return;
      var routes = [];
      for (var route in this.routes) {
        routes.unshift([route, this.routes[route]]);
      }
      for (var i = 0, l = routes.length; i < l; i++) {
        this.route(routes[i][0], routes[i][1], this[routes[i][1]]);
      }
    },

    // Convert a route string into a regular expression, suitable for matching
    // against the current location hash.
    _routeToRegExp : function(route) {
      route = route.replace(escapeRegExp, "\\$&")
                   .replace(namedParam, "([^\/]*)")
                   .replace(splatParam, "(.*?)");
      return new RegExp('^' + route + '$');
    },

    // Given a route, and a URL fragment that it matches, return the array of
    // extracted parameters.
    _extractParameters : function(route, fragment) {
      return route.exec(fragment).slice(1);
    }

  });

  // Backbone.History
  // ----------------

  // Handles cross-browser history management, based on URL fragments. If the
  // browser does not support `onhashchange`, falls back to polling.
  Backbone.History = function() {
    this.handlers = [];
    _.bindAll(this, 'checkUrl');
  };

  // Cached regex for cleaning hashes.
  var hashStrip = /^#*/;

  // Cached regex for detecting MSIE.
  var isExplorer = /msie [\w.]+/;

  // Has the history handling already been started?
  var historyStarted = false;

  // Set up all inheritable **Backbone.History** properties and methods.
  _.extend(Backbone.History.prototype, {

    // The default interval to poll for hash changes, if necessary, is
    // twenty times a second.
    interval: 50,

    // Get the cross-browser normalized URL fragment, either from the URL,
    // the hash, or the override.
    getFragment : function(fragment, forcePushState) {
      if (fragment == null) {
        if (this._hasPushState || forcePushState) {
          fragment = window.location.pathname;
          var search = window.location.search;
          if (search) fragment += search;
          if (fragment.indexOf(this.options.root) == 0) fragment = fragment.substr(this.options.root.length);
        } else {
          fragment = window.location.hash;
        }
      }
      return fragment.replace(hashStrip, '');
    },

    // Start the hash change handling, returning `true` if the current URL matches
    // an existing route, and `false` otherwise.
    start : function(options) {

      // Figure out the initial configuration. Do we need an iframe?
      // Is pushState desired ... is it available?
      if (historyStarted) throw new Error("Backbone.history has already been started");
      this.options          = _.extend({}, {root: '/'}, this.options, options);
      this._wantsPushState  = !!this.options.pushState;
      this._hasPushState    = !!(this.options.pushState && window.history && window.history.pushState);
      var fragment          = this.getFragment();
      var docMode           = document.documentMode;
      var oldIE             = (isExplorer.exec(navigator.userAgent.toLowerCase()) && (!docMode || docMode <= 7));
      if (oldIE) {
        this.iframe = $('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo('body')[0].contentWindow;
        this.navigate(fragment);
      }

      // Depending on whether we're using pushState or hashes, and whether
      // 'onhashchange' is supported, determine how we check the URL state.
      if (this._hasPushState) {
        $(window).bind('popstate', this.checkUrl);
      } else if ('onhashchange' in window && !oldIE) {
        $(window).bind('hashchange', this.checkUrl);
      } else {
        setInterval(this.checkUrl, this.interval);
      }

      // Determine if we need to change the base url, for a pushState link
      // opened by a non-pushState browser.
      this.fragment = fragment;
      historyStarted = true;
      var loc = window.location;
      var atRoot  = loc.pathname == this.options.root;
      if (this._wantsPushState && !this._hasPushState && !atRoot) {
        this.fragment = this.getFragment(null, true);
        window.location.replace(this.options.root + '#' + this.fragment);
      } else if (this._wantsPushState && this._hasPushState && atRoot && loc.hash) {
        this.fragment = loc.hash.replace(hashStrip, '');
        window.history.replaceState({}, document.title, loc.protocol + '//' + loc.host + this.options.root + this.fragment);
      }
      return this.loadUrl();
    },

    // Add a route to be tested when the fragment changes. Routes added later may
    // override previous routes.
    route : function(route, callback) {
      this.handlers.unshift({route : route, callback : callback});
    },

    // Checks the current URL to see if it has changed, and if it has,
    // calls `loadUrl`, normalizing across the hidden iframe.
    checkUrl : function(e) {
      var current = this.getFragment();
      if (current == this.fragment && this.iframe) current = this.getFragment(this.iframe.location.hash);
      if (current == this.fragment || current == decodeURIComponent(this.fragment)) return false;
      if (this.iframe) this.navigate(current);
      this.loadUrl() || this.loadUrl(window.location.hash);
    },

    // Attempt to load the current URL fragment. If a route succeeds with a
    // match, returns `true`. If no defined routes matches the fragment,
    // returns `false`.
    loadUrl : function(fragmentOverride) {
      var fragment = this.fragment = this.getFragment(fragmentOverride);
      var matched = _.any(this.handlers, function(handler) {
        if (handler.route.test(fragment)) {
          handler.callback(fragment);
          return true;
        }
      });
      return matched;
    },

    // Save a fragment into the hash history. You are responsible for properly
    // URL-encoding the fragment in advance. This does not trigger
    // a `hashchange` event.
    navigate : function(fragment, triggerRoute) {
      var frag = (fragment || '').replace(hashStrip, '');
      if (this.fragment == frag || this.fragment == decodeURIComponent(frag)) return;
      if (this._hasPushState) {
        var loc = window.location;
        if (frag.indexOf(this.options.root) != 0) frag = this.options.root + frag;
        this.fragment = frag;
        window.history.pushState({}, document.title, loc.protocol + '//' + loc.host + frag);
      } else {
        window.location.hash = this.fragment = frag;
        if (this.iframe && (frag != this.getFragment(this.iframe.location.hash))) {
          this.iframe.document.open().close();
          this.iframe.location.hash = frag;
        }
      }
      if (triggerRoute) this.loadUrl(fragment);
    }

  });

  // Backbone.View
  // -------------

  // Creating a Backbone.View creates its initial element outside of the DOM,
  // if an existing element is not provided...
  Backbone.View = function(options) {
    this.cid = _.uniqueId('view');
    this._configure(options || {});
    this._ensureElement();
    this.delegateEvents();
    this.initialize.apply(this, arguments);
  };

  // Element lookup, scoped to DOM elements within the current view.
  // This should be prefered to global lookups, if you're dealing with
  // a specific view.
  var selectorDelegate = function(selector) {
    return $(selector, this.el);
  };

  // Cached regex to split keys for `delegate`.
  var eventSplitter = /^(\S+)\s*(.*)$/;

  // List of view options to be merged as properties.
  var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName'];

  // Set up all inheritable **Backbone.View** properties and methods.
  _.extend(Backbone.View.prototype, Backbone.Events, {

    // The default `tagName` of a View's element is `"div"`.
    tagName : 'div',

    // Attach the `selectorDelegate` function as the `$` property.
    $       : selectorDelegate,

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize : function(){},

    // **render** is the core function that your view should override, in order
    // to populate its element (`this.el`), with the appropriate HTML. The
    // convention is for **render** to always return `this`.
    render : function() {
      return this;
    },

    // Remove this view from the DOM. Note that the view isn't present in the
    // DOM by default, so calling this method may be a no-op.
    remove : function() {
      $(this.el).remove();
      return this;
    },

    // For small amounts of DOM Elements, where a full-blown template isn't
    // needed, use **make** to manufacture elements, one at a time.
    //
    //     var el = this.make('li', {'class': 'row'}, this.model.escape('title'));
    //
    make : function(tagName, attributes, content) {
      var el = document.createElement(tagName);
      if (attributes) $(el).attr(attributes);
      if (content) $(el).html(content);
      return el;
    },

    // Set callbacks, where `this.callbacks` is a hash of
    //
    // *{"event selector": "callback"}*
    //
    //     {
    //       'mousedown .title':  'edit',
    //       'click .button':     'save'
    //     }
    //
    // pairs. Callbacks will be bound to the view, with `this` set properly.
    // Uses event delegation for efficiency.
    // Omitting the selector binds the event to `this.el`.
    // This only works for delegate-able events: not `focus`, `blur`, and
    // not `change`, `submit`, and `reset` in Internet Explorer.
    delegateEvents : function(events) {
      if (!(events || (events = this.events))) return;
      $(this.el).unbind('.delegateEvents' + this.cid);
      for (var key in events) {
        var method = this[events[key]];
        if (!method) throw new Error('Event "' + events[key] + '" does not exist');
        var match = key.match(eventSplitter);
        var eventName = match[1], selector = match[2];
        method = _.bind(method, this);
        eventName += '.delegateEvents' + this.cid;
        if (selector === '') {
          $(this.el).bind(eventName, method);
        } else {
          $(this.el).delegate(selector, eventName, method);
        }
      }
    },

    // Performs the initial configuration of a View with a set of options.
    // Keys with special meaning *(model, collection, id, className)*, are
    // attached directly to the view.
    _configure : function(options) {
      if (this.options) options = _.extend({}, this.options, options);
      for (var i = 0, l = viewOptions.length; i < l; i++) {
        var attr = viewOptions[i];
        if (options[attr]) this[attr] = options[attr];
      }
      this.options = options;
    },

    // Ensure that the View has a DOM element to render into.
    // If `this.el` is a string, pass it through `$()`, take the first
    // matching element, and re-assign it to `el`. Otherwise, create
    // an element from the `id`, `className` and `tagName` proeprties.
    _ensureElement : function() {
      if (!this.el) {
        var attrs = this.attributes || {};
        if (this.id) attrs.id = this.id;
        if (this.className) attrs['class'] = this.className;
        this.el = this.make(this.tagName, attrs);
      } else if (_.isString(this.el)) {
        this.el = $(this.el).get(0);
      }
    }

  });

  // The self-propagating extend function that Backbone classes use.
  var extend = function (protoProps, classProps) {
    var child = inherits(this, protoProps, classProps);
    child.extend = this.extend;
    return child;
  };

  // Set up inheritance for the model, collection, and view.
  Backbone.Model.extend = Backbone.Collection.extend =
    Backbone.Router.extend = Backbone.View.extend = extend;

  // Map from CRUD to HTTP for our default `Backbone.sync` implementation.
  var methodMap = {
    'create': 'POST',
    'update': 'PUT',
    'delete': 'DELETE',
    'read'  : 'GET'
  };

  // Backbone.sync
  // -------------

  // Override this function to change the manner in which Backbone persists
  // models to the server. You will be passed the type of request, and the
  // model in question. By default, uses makes a RESTful Ajax request
  // to the model's `url()`. Some possible customizations could be:
  //
  // * Use `setTimeout` to batch rapid-fire updates into a single request.
  // * Send up the models as XML instead of JSON.
  // * Persist models via WebSockets instead of Ajax.
  //
  // Turn on `Backbone.emulateHTTP` in order to send `PUT` and `DELETE` requests
  // as `POST`, with a `_method` parameter containing the true HTTP method,
  // as well as all requests with the body as `application/x-www-form-urlencoded` instead of
  // `application/json` with the model in a param named `model`.
  // Useful when interfacing with server-side languages like **PHP** that make
  // it difficult to read the body of `PUT` requests.
  Backbone.sync = function(method, model, options) {
    var type = methodMap[method];

    // Default JSON-request options.
    var params = _.extend({
      type:         type,
      dataType:     'json',
      processData:  false
    }, options);

    // Ensure that we have a URL.
    if (!params.url) {
      params.url = getUrl(model) || urlError();
    }

    // Ensure that we have the appropriate request data.
    if (!params.data && model && (method == 'create' || method == 'update')) {
      params.contentType = 'application/json';
      params.data = JSON.stringify(model.toJSON());
    }

    // For older servers, emulate JSON by encoding the request into an HTML-form.
    if (Backbone.emulateJSON) {
      params.contentType = 'application/x-www-form-urlencoded';
      params.processData = true;
      params.data        = params.data ? {model : params.data} : {};
    }

    // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
    // And an `X-HTTP-Method-Override` header.
    if (Backbone.emulateHTTP) {
      if (type === 'PUT' || type === 'DELETE') {
        if (Backbone.emulateJSON) params.data._method = type;
        params.type = 'POST';
        params.beforeSend = function(xhr) {
          xhr.setRequestHeader('X-HTTP-Method-Override', type);
        };
      }
    }

    // Make the request.
    return $.ajax(params);
  };

  // Helpers
  // -------

  // Shared empty constructor function to aid in prototype-chain creation.
  var ctor = function(){};

  // Helper function to correctly set up the prototype chain, for subclasses.
  // Similar to `goog.inherits`, but uses a hash of prototype properties and
  // class properties to be extended.
  var inherits = function(parent, protoProps, staticProps) {
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call `super()`.
    if (protoProps && protoProps.hasOwnProperty('constructor')) {
      child = protoProps.constructor;
    } else {
      child = function(){ return parent.apply(this, arguments); };
    }

    // Inherit class (static) properties from parent.
    _.extend(child, parent);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();

    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) _.extend(child.prototype, protoProps);

    // Add static properties to the constructor function, if supplied.
    if (staticProps) _.extend(child, staticProps);

    // Correctly set child's `prototype.constructor`.
    child.prototype.constructor = child;

    // Set a convenience property in case the parent's prototype is needed later.
    child.__super__ = parent.prototype;

    return child;
  };

  // Helper function to get a URL from a Model or Collection as a property
  // or as a function.
  var getUrl = function(object) {
    if (!(object && object.url)) return null;
    return _.isFunction(object.url) ? object.url() : object.url;
  };

  // Throw an error when a URL is needed, and none is supplied.
  var urlError = function() {
    throw new Error('A "url" property or function must be specified');
  };

  // Wrap an optional error callback with a fallback error event.
  var wrapError = function(onError, model, options) {
    return function(resp) {
      if (onError) {
        onError(model, resp, options);
      } else {
        model.trigger('error', model, resp, options);
      }
    };
  };

  // Helper function to escape a string for HTML rendering.
  var escapeHTML = function(string) {
    return string.replace(/&(?!\w+;|#\d+;|#x[\da-f]+;)/gi, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;');
  };

}).call(this);
;
//     Zepto.js
//     (c) 2010, 2011 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

(function($){
  var jsonpID = 0,
      isObject = $.isObject,
      key;

  // Empty function, used as default callback
  function empty() {}

  // ### $.ajaxJSONP
  //
  // Load JSON from a server in a different domain (JSONP)
  //
  // *Arguments:*
  //
  //     options — object that configure the request,
  //               see avaliable options below
  //
  // *Avaliable options:*
  //
  //     url     — url to which the request is sent
  //     success — callback that is executed if the request succeeds
  //
  // *Example:*
  //
  //     $.ajaxJSONP({
  //        url:     'http://example.com/projects?callback=?',
  //        success: function (data) {
  //            projects.push(json);
  //        }
  //     });
  //
  $.ajaxJSONP = function(options){
    var jsonpString = 'jsonp' + ++jsonpID,
        script = document.createElement('script');
    window[jsonpString] = function(data){
      options.success(data);
      delete window[jsonpString];
    };
    script.src = options.url.replace(/=\?/, '=' + jsonpString);
    $('head').append(script);
  };

  // ### $.ajaxSettings
  //
  // AJAX settings
  //
  $.ajaxSettings = {
    // Default type of request
    type: 'GET',
    // Callback that is executed before request
    beforeSend: empty,
    // Callback that is executed if the request succeeds
    success: empty,
    // Callback that is executed the the server drops error
    error: empty,
    // Callback that is executed on request complete (both: error and success)
    complete: empty,
    // MIME types mapping
    accepts: {
      script: 'text/javascript, application/javascript',
      json:   'application/json',
      xml:    'application/xml, text/xml',
      html:   'text/html',
      text:   'text/plain'
    }
  };

  // ### $.ajax
  //
  // Perform AJAX request
  //
  // *Arguments:*
  //
  //     options — object that configure the request,
  //               see avaliable options below
  //
  // *Avaliable options:*
  //
  //     type ('GET')          — type of request GET / POST
  //     url (window.location) — url to which the request is sent
  //     data                  — data to send to server,
  //                             can be string or object
  //     dataType ('json')     — what response type you accept from
  //                             the server:
  //                             'json', 'xml', 'html', or 'text'
  //     success               — callback that is executed if
  //                             the request succeeds
  //     error                 — callback that is executed if
  //                             the server drops error
  //
  // *Example:*
  //
  //     $.ajax({
  //        type:     'POST',
  //        url:      '/projects',
  //        data:     { name: 'Zepto.js' },
  //        dataType: 'html',
  //        success:  function (data) {
  //            $('body').append(data);
  //        },
  //        error:    function (xhr, type) {
  //            alert('Error!');
  //        }
  //     });
  //
  $.ajax = function(options){
    options = options || {};
    var settings = $.extend({}, options);
    for (key in $.ajaxSettings) if (!settings[key]) settings[key] = $.ajaxSettings[key];

    if (/=\?/.test(settings.url)) return $.ajaxJSONP(settings);

    if (!settings.url) settings.url = window.location.toString();
    if (settings.data && !settings.contentType) settings.contentType = 'application/x-www-form-urlencoded';
    if (isObject(settings.data)) settings.data = $.param(settings.data);

    if (settings.type.match(/get/i) && settings.data) {
      var queryString = settings.data;
      if (settings.url.match(/\?.*=/)) {
        queryString = '&' + queryString;
      } else if (queryString[0] != '?') {
        queryString = '?' + queryString;
      }
      settings.url += queryString;
    }

    var mime = settings.accepts[settings.dataType],
        xhr = new XMLHttpRequest();

    settings.headers = $.extend({'X-Requested-With': 'XMLHttpRequest'}, settings.headers || {});
    if (mime) settings.headers['Accept'] = mime;

    xhr.onreadystatechange = function(){
      if (xhr.readyState == 4) {
        var result, error = false;
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 0) {
          if (mime == 'application/json' && !(xhr.responseText == '')) {
            try { result = JSON.parse(xhr.responseText); }
            catch (e) { error = e; }
          }
          else result = xhr.responseText;
          if (error) settings.error(xhr, 'parsererror', error);
          else settings.success(result, 'success', xhr);
        } else {
          error = true;
          settings.error(xhr, 'error');
        }
        settings.complete(xhr, error ? 'error' : 'success');
      }
    };

    xhr.open(settings.type, settings.url, true);
    if (settings.beforeSend(xhr, settings) === false) {
      xhr.abort();
      return false;
    }

    if (settings.contentType) settings.headers['Content-Type'] = settings.contentType;
    for (name in settings.headers) xhr.setRequestHeader(name, settings.headers[name]);
    xhr.send(settings.data);

    return xhr;
  };

  // ### $.get
  //
  // Load data from the server using a GET request
  //
  // *Arguments:*
  //
  //     url     — url to which the request is sent
  //     success — callback that is executed if the request succeeds
  //
  // *Example:*
  //
  //     $.get(
  //        '/projects/42',
  //        function (data) {
  //            $('body').append(data);
  //        }
  //     );
  //
  $.get = function(url, success){ $.ajax({ url: url, success: success }) };

  // ### $.post
  //
  // Load data from the server using POST request
  //
  // *Arguments:*
  //
  //     url        — url to which the request is sent
  //     [data]     — data to send to server, can be string or object
  //     [success]  — callback that is executed if the request succeeds
  //     [dataType] — type of expected response
  //                  'json', 'xml', 'html', or 'text'
  //
  // *Example:*
  //
  //     $.post(
  //        '/projects',
  //        { name: 'Zepto.js' },
  //        function (data) {
  //            $('body').append(data);
  //        },
  //        'html'
  //     );
  //
  $.post = function(url, data, success, dataType){
    if ($.isFunction(data)) dataType = dataType || success, success = data, data = null;
    $.ajax({ type: 'POST', url: url, data: data, success: success, dataType: dataType });
  };

  // ### $.getJSON
  //
  // Load JSON from the server using GET request
  //
  // *Arguments:*
  //
  //     url     — url to which the request is sent
  //     success — callback that is executed if the request succeeds
  //
  // *Example:*
  //
  //     $.getJSON(
  //        '/projects/42',
  //        function (json) {
  //            projects.push(json);
  //        }
  //     );
  //
  $.getJSON = function(url, success){ $.ajax({ url: url, success: success, dataType: 'json' }) };

  // ### $.fn.load
  //
  // Load data from the server into an element
  //
  // *Arguments:*
  //
  //     url     — url to which the request is sent
  //     [success] — callback that is executed if the request succeeds
  //
  // *Examples:*
  //
  //     $('#project_container').get(
  //        '/projects/42',
  //        function () {
  //            alert('Project was successfully loaded');
  //        }
  //     );
  //
  //     $('#project_comments').get(
  //        '/projects/42 #comments',
  //        function () {
  //            alert('Comments was successfully loaded');
  //        }
  //     );
  //
  $.fn.load = function(url, success){
    if (!this.length) return this;
    var self = this, parts = url.split(/\s/), selector;
    if (parts.length > 1) url = parts[0], selector = parts[1];
    $.get(url, function(response){
      self.html(selector ?
        $(document.createElement('div')).html(response).find(selector).html()
        : response);
      success && success();
    });
    return this;
  };

  // ### $.param
  //
  // Encode object as a string for submission
  //
  // *Arguments:*
  //
  //     obj — object to serialize
  //     [v] — root node
  //
  // *Example:*
  //
  //     $.param( { name: 'Zepto.js', version: '0.6' } );
  //
  $.param = function(obj, v){
    var result = [], add = function(key, value){
      result.push(encodeURIComponent(v ? v + '[' + key + ']' : key)
        + '=' + encodeURIComponent(value));
      },
      isObjArray = $.isArray(obj);

    for(key in obj)
      if(isObject(obj[key]))
        result.push($.param(obj[key], (v ? v + '[' + key + ']' : key)));
      else
        add(isObjArray ? '' : key, obj[key]);

    return result.join('&').replace('%20', '+');
  };
})(Zepto);
;
//     Zepto.js
//     (c) 2010, 2011 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

(function($){
  var cache = [], timeout;

  // ### $.fn.remove
  //
  // Remove element from DOM
  //
  // *Example:*
  //
  //     $('#projects, .comments').remove();
  //
  $.fn.remove = function(){
    return this.each(function(){
      if(this.tagName == 'IMG'){
        cache.push(this);
        this.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(function(){ cache = [] }, 60000);
      }
      this.parentNode.removeChild(this);
    });
  }
})(Zepto);
;
//     Zepto.js
//     (c) 2010, 2011 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

(function($){
  function detect(ua){
    var ua = ua, os = {},
      android = ua.match(/(Android)\s+([\d.]+)/),
      ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
      iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
      webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
      touchpad = webos && ua.match(/TouchPad/),
      blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/);
    if (android) os.android = true, os.version = android[2];
    if (iphone) os.ios = true, os.version = iphone[2].replace(/_/g, '.'), os.iphone = true;
    if (ipad) os.ios = true, os.version = ipad[2].replace(/_/g, '.'), os.ipad = true;
    if (webos) os.webos = true, os.version = webos[2];
    if (touchpad) os.touchpad = true;
    if (blackberry) os.blackberry = true, os.version = blackberry[2];
    return os;
  }

  // ### $.os
  //
  // Object contains information about running environmental
  //
  // *Example:*
  //
  //     $.os.ios      // => true if running on Apple iOS
  //     $.os.android  // => true if running on Android
  //     $.os.webos    // => true if running on HP/Palm WebOS
  //     $.os.touchpad // => true if running on a HP TouchPad
  //     $.os.version  // => string with version number,
  //                         "4.0", "3.1.1", "2.1", etc.
  //     $.os.iphone   // => true if running on iPhone
  //     $.os.ipad     // => true if running on iPad
  //     $.os.blackberry // => true if running on BlackBerry
  //
  $.os = detect(navigator.userAgent);
  $.__detect = detect;

  var v = navigator.userAgent.match(/WebKit\/([\d.]+)/);
  $.browser = v ? { webkit: true, version: v[1] } : { webkit: false };

})(Zepto);
;
//     Zepto.js
//     (c) 2010, 2011 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

(function($){
  var $$ = $.qsa, handlers = {}, _zid = 1;
  function zid(element) {
    return element._zid || (element._zid = _zid++);
  }
  function findHandlers(element, event, fn, selector) {
    event = parse(event);
    if (event.ns) var matcher = matcherFor(event.ns);
    return (handlers[zid(element)] || []).filter(function(handler) {
      return handler
        && (!event.e  || handler.e == event.e)
        && (!event.ns || matcher.test(handler.ns))
        && (!fn       || handler.fn == fn)
        && (!selector || handler.sel == selector);
    });
  }
  function parse(event) {
    var parts = ('' + event).split('.');
    return {e: parts[0], ns: parts.slice(1).sort().join(' ')};
  }
  function matcherFor(ns) {
    return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)');
  }

  function add(element, events, fn, selector, delegate){
    var id = zid(element), set = (handlers[id] || (handlers[id] = []));
    events.split(/\s/).forEach(function(event){
      var callback = delegate || fn;
      var proxyfn = function(event) { return callback.call(element, event, event.data) };
      var handler = $.extend(parse(event), {fn: fn, proxy: proxyfn, sel: selector, del: delegate, i: set.length});
      set.push(handler);
      element.addEventListener(handler.e, proxyfn, false);
    });
  }
  function remove(element, events, fn, selector){
    var id = zid(element);
    (events || '').split(/\s/).forEach(function(event){
      findHandlers(element, event, fn, selector).forEach(function(handler){
        delete handlers[id][handler.i];
        element.removeEventListener(handler.e, handler.proxy, false);
      });
    });
  }

  $.event = { add: add, remove: remove }

  $.fn.bind = function(event, callback){
    return this.each(function(){
      add(this, event, callback);
    });
  };
  $.fn.unbind = function(event, callback){
    return this.each(function(){
      remove(this, event, callback);
    });
  };
  $.fn.one = function(event, callback){
    return this.each(function(){
      var self = this;
      add(this, event, function wrapper(evt){
        callback.call(self, evt);
        remove(self, event, arguments.callee);
      });
    });
  };

  var eventMethods = ['preventDefault', 'stopImmediatePropagation', 'stopPropagation'];
  function createProxy(event) {
    var proxy = $.extend({originalEvent: event}, event);
    eventMethods.forEach(function(key) {
      proxy[key] = function() {return event[key].apply(event, arguments)};
    });
    return proxy;
  }

  $.fn.delegate = function(selector, event, callback){
    return this.each(function(i, element){
      add(element, event, callback, selector, function(e, data){
        var target = e.target, nodes = $$(element, selector);
        while (target && nodes.indexOf(target) < 0) target = target.parentNode;
        if (target && !(target === element) && !(target === document)) {
          callback.call(target, $.extend(createProxy(e), {
            currentTarget: target, liveFired: element
          }), data);
        }
      });
    });
  };
  $.fn.undelegate = function(selector, event, callback){
    return this.each(function(){
      remove(this, event, callback, selector);
    });
  }

  $.fn.live = function(event, callback){
    $(document.body).delegate(this.selector, event, callback);
    return this;
  };
  $.fn.die = function(event, callback){
    $(document.body).undelegate(this.selector, event, callback);
    return this;
  };

  $.fn.trigger = function(event, data){
    var type = event.type || event;
    if(typeof event !== "object"){
      event = document.createEvent('Events');
      event.initEvent(type, true, true)
    }
    event.data = data;
    return this.each(function(){
      this.dispatchEvent(event);
    });
  };

  $.Event = function(src, props) {
    var event = document.createEvent('Events');
    if (props) $.extend(event, props);
    event.initEvent(src, true, true);
    return event;
  };

})(Zepto);
;
//     Zepto.js
//     (c) 2010, 2011 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

(function($, undefined){
  var supportedTransforms = [
    'scale scaleX scaleY',
    'translate', 'translateX', 'translateY', 'translate3d',
    'skew',      'skewX',      'skewY',
    'rotate',    'rotateX',    'rotateY',    'rotateZ',
    'matrix'
  ];

  $.fn.anim = function(properties, duration, ease, callback){
    var transforms = [], cssProperties = {}, key, that = this, wrappedCallback;

    for (key in properties)
      if (supportedTransforms.indexOf(key)>0)
        transforms.push(key + '(' + properties[key] + ')');
      else
        cssProperties[key] = properties[key];

    wrappedCallback = function(){
      that.css({'-webkit-transition':'none'});
      callback && callback();
    }

    if (duration > 0)
      this.one('webkitTransitionEnd', wrappedCallback);
    else
      setTimeout(wrappedCallback, 0);

    return this.css(
      $.extend({
        '-webkit-transition': 'all ' + (duration !== undefined ? duration : 0.5) + 's ' + (ease || ''),
        '-webkit-transform': transforms.join(' ')
      }, cssProperties)
    );
  }
})(Zepto);
;
//     Zepto.js
//     (c) 2010, 2011 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

(function($){
  if ($.os.ios) {
    var gesture = {}, gestureTimeout;

    function parentIfText(node){
      return 'tagName' in node ? node : node.parentNode;
    }

    $(document).ready(function(){
      $(document.body).bind('gesturestart', function(e){
        var now = Date.now(), delta = now - (gesture.last || now);
        gesture.target = parentIfText(e.target);
        gestureTimeout && clearTimeout(gestureTimeout);
        gesture.e1 = e.scale;
        gesture.last = now;
      }).bind('gesturechange', function(e){
        gesture.e2 = e.scale;
      }).bind('gestureend', function(e){
        if (gesture.e2 > 0) {
          Math.abs(gesture.e1 - gesture.e2) != 0 && $(gesture.target).trigger('pinch') &&
            $(gesture.target).trigger('pinch' + (gesture.e1 - gesture.e2 > 0 ? 'In' : 'Out'));
          gesture.e1 = gesture.e2 = gesture.last = 0;
        } else if ('last' in gesture) {
          gesture = {};
        }
      });
    });

    ['pinch', 'pinchIn', 'pinchOut'].forEach(function(m){
      $.fn[m] = function(callback){ return this.bind(m, callback) }
    });
  }
})(Zepto);
;
//     Zepto.js
//     (c) 2010, 2011 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

(function(undefined){
  if (String.prototype.trim === undefined) // fix for iOS 3.2
    String.prototype.trim = function(){ return this.replace(/^\s+/, '').replace(/\s+$/, '') };

  // For iOS 3.x
  // from https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/reduce
  if (Array.prototype.reduce === undefined)
    Array.prototype.reduce = function(fun){
      if(this === void 0 || this === null) throw new TypeError();
      var t = Object(this), len = t.length >>> 0, k = 0, accumulator;
      if(typeof fun != 'function') throw new TypeError();
      if(len == 0 && arguments.length == 1) throw new TypeError();

      if(arguments.length >= 2)
       accumulator = arguments[1];
      else
        do{
          if(k in t){
            accumulator = t[k++];
            break;
          }
          if(++k >= len) throw new TypeError();
        } while (true);

      while (k < len){
        if(k in t) accumulator = fun.call(undefined, accumulator, t[k], k, t);
        k++;
      }
      return accumulator;
    };

})();
;
//     Zepto.js
//     (c) 2010, 2011 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

(function($){
  var touch = {}, touchTimeout;

  function parentIfText(node){
    return 'tagName' in node ? node : node.parentNode;
  }

  function swipeDirection(x1, x2, y1, y2){
    var xDelta = Math.abs(x1 - x2), yDelta = Math.abs(y1 - y2);
    if (xDelta >= yDelta) {
      return (x1 - x2 > 0 ? 'Left' : 'Right');
    } else {
      return (y1 - y2 > 0 ? 'Up' : 'Down');
    }
  }

  $(document).ready(function(){
    $(document.body).bind('touchstart', function(e){
      var now = Date.now(), delta = now - (touch.last || now);
      touch.target = parentIfText(e.touches[0].target);
      touchTimeout && clearTimeout(touchTimeout);
      touch.x1 = e.touches[0].pageX;
      touch.y1 = e.touches[0].pageY;
      if (delta > 0 && delta <= 250) touch.isDoubleTap = true;
      touch.last = now;
    }).bind('touchmove', function(e){
      touch.x2 = e.touches[0].pageX;
      touch.y2 = e.touches[0].pageY;
    }).bind('touchend', function(e){
      if (touch.isDoubleTap) {
        $(touch.target).trigger('doubleTap');
        touch = {};
      } else if (touch.x2 > 0 || touch.y2 > 0) {
        (Math.abs(touch.x1 - touch.x2) > 30 || Math.abs(touch.y1 - touch.y2) > 30)  &&
          $(touch.target).trigger('swipe') &&
          $(touch.target).trigger('swipe' + (swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)));
        touch.x1 = touch.x2 = touch.y1 = touch.y2 = touch.last = 0;
      } else if ('last' in touch) {
        touchTimeout = setTimeout(function(){
          touchTimeout = null;
          $(touch.target).trigger('tap')
          touch = {};
        }, 250);
      }
    }).bind('touchcancel', function(){ touch = {} });
  });

  ['swipe', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown', 'doubleTap', 'tap'].forEach(function(m){
    $.fn[m] = function(callback){ return this.bind(m, callback) }
  });
})(Zepto);
;/** Socket.IO 0.6.3 - Built with build.js */
/**
 * socket.io-node-client
 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

/**
 * @namespace
 */
var io = this.io = {
  
  /**
   * Library version.
   */
  version: '0.6.3',
  
  /**
   * Updates the location of the WebSocketMain.swf file that is required for the Flashsocket transport.
   * This should only be needed if you want to load in the WebSocketMainInsecure.swf or if you want to
   * host the .swf file on a other server.
   *
   * @static
   * @deprecated Set the variable `WEB_SOCKET_SWF_LOCATION` pointing to WebSocketMain.swf
   * @param {String} path The path of the .swf file
   * @api public
   */
  setPath: function(path){
    if (window.console && console.error) console.error('io.setPath will be removed. Please set the variable WEB_SOCKET_SWF_LOCATION pointing to WebSocketMain.swf');
    this.path = /\/$/.test(path) ? path : path + '/';
    WEB_SOCKET_SWF_LOCATION = path + 'lib/vendor/web-socket-js/WebSocketMain.swf';
  }
};

/**
 * Expose Socket.IO in $
 */
$.io = this.io;

/**
 * Default path to the .swf file.
 */
if (typeof window != 'undefined'){
  // WEB_SOCKET_SWF_LOCATION = (document.location.protocol == 'https:' ? 'https:' : 'http:') + '//cdn.socket.io/' + this.io.version + '/WebSocketMain.swf';
  if (typeof WEB_SOCKET_SWF_LOCATION === 'undefined')
    WEB_SOCKET_SWF_LOCATION = '/socket.io/lib/vendor/web-socket-js/WebSocketMain.swf';
}

/**
 * socket.io-node-client
 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

(function(){
  var io = this.io,
  
  /**
   * Set when the `onload` event is executed on the page. This variable is used by
   * `io.util.load` to detect if we need to execute the function immediately or add
   * it to a onload listener.
   *
   * @type {Boolean}
   * @api private
   */
  pageLoaded = false;
  
  /**
   * @namespace
   */
  io.util = {
    /**
     * Executes the given function when the page is loaded.
     *
     * Example:
     *
     *     io.util.load(function(){ console.log('page loaded') });
     *
     * @param {Function} fn
     * @api public
     */
    load: function(fn){
      if (/loaded|complete/.test(document.readyState) || pageLoaded) return fn();
      if ('attachEvent' in window){
        window.attachEvent('onload', fn);
      } else {
        window.addEventListener('load', fn, false);
      }
    },
    
    /**
     * Defers the function untill it's the function can be executed without
     * blocking the load process. This is especially needed for WebKit based
     * browsers. If a long running connection is made before the onload event
     * a loading indicator spinner will be present at all times untill a
     * reconnect has been made.
     *
     * @param {Function} fn
     * @api public
     */
    defer: function(fn){
      if (!io.util.webkit) return fn();
      io.util.load(function(){
        setTimeout(fn,100);
      });
    },
    
    /**
     * Inherit the prototype methods from one constructor into another.
     *
     * Example:
     *
     *     function foo(){};
     *     foo.prototype.hello = function(){ console.log( this.words )};
     *     
     *     function bar(){
     *       this.words = "Hello world";
     *     };
     *     
     *     io.util.inherit(bar,foo);
     *     var person = new bar();
     *     person.hello();
     *     // => "Hello World"
     *
     * @param {Constructor} ctor The constructor that needs to inherit the methods.
     * @param {Constructor} superCtor The constructor to inherit from.
     * @api public
     */
    inherit: function(ctor, superCtor){
      // no support for `instanceof` for now
      for (var i in superCtor.prototype){
        ctor.prototype[i] = superCtor.prototype[i];
      }
    },
    
    /**
     * Finds the index of item in a given Array.
     *
     * Example:
     *
     *     var data = ['socket',2,3,4,'socket',5,6,7,'io'];
     *     io.util.indexOf(data,'socket',1);
     *     // => 4
     *
     * @param {Array} arr The array
     * @param item The item that we need to find
     * @param {Integer} from Starting point
     * @api public
     */
    indexOf: function(arr, item, from){
      for (var l = arr.length, i = (from < 0) ? Math.max(0, l + from) : from || 0; i < l; i++){
        if (arr[i] === item) return i;
      }
      return -1;
    },
    
    /**
     * Checks if the given object is an Array.
     *
     * Example:
     *
     *     io.util.isArray([]);
     *     // => true
     *     io.util.isArray({});
     *    // => false
     *
     * @param obj
     * @api public
     */
    isArray: function(obj){
      return Object.prototype.toString.call(obj) === '[object Array]';
    },
    
    /**
     * Merges the properties of two objects.
     *
     * Example:
     *
     *     var a = {foo:'bar'}
     *       , b = {bar:'baz'};
     *     
     *     io.util.merge(a,b);
     *     // => {foo:'bar',bar:'baz'}
     *
     * @param {Object} target The object that receives the keys
     * @param {Object} additional The object that supplies the keys
     * @api public
     */
    merge: function(target, additional){
      for (var i in additional)
        if (additional.hasOwnProperty(i))
          target[i] = additional[i];
    }
  };
  
  /**
   * Detect the Webkit platform based on the userAgent string.
   * This includes Mobile Webkit.
   *
   * @type {Boolean}
   * @api public
   */
  io.util.webkit = /webkit/i.test(navigator.userAgent);
  
  io.util.load(function(){
    pageLoaded = true;
  });

})();
/**
 * socket.io-node-client
 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

(function(){
  var io = this.io,
  
  /**
   * Message frame for encoding and decoding responses from the Socket.IO server.
   *
   * @const
   * @type {String}
   */
  frame = '~m~',
  
  /**
   * Transforms the message to a string. If the message is an {Object} we will convert it to
   * a string and prefix it with the `~j~` flag to indicate that message is JSON encoded.
   *
   * Example:
   *
   *     stringify({foo:"bar"});
   *     // => "~j~{"foo":"bar"}"
   *
   * @param {String|Array|Object} message The messages that needs to be transformed to a string.
   * @throws {Error} When the JSON.stringify implementation is missing in the browser.
   * @returns {String} Message.
   * @api private
   */
  stringify = function(message){
    if (Object.prototype.toString.call(message) == '[object Object]'){
      if (!('JSON' in window)){
        var error = 'Socket.IO Error: Trying to encode as JSON, but JSON.stringify is missing.';
        if ('console' in window && console.error){
          console.error(error);
        } else {
          throw new Error(error);
        }
        return '{ "$error": "'+ error +'" }';
      }
      return '~j~' + JSON.stringify(message);
    } else {
      return String(message);
    }
  },
  
  /**
   * This is the transport template for all supported transport methods. It provides the
   * basic functionality to create a working transport for Socket.IO.
   *
   * Options:
   *   - `timeout`  Transport shutdown timeout in milliseconds, based on the heartbeat interval.
   *
   * Example:
   *
   *     var transport = io.Transport.mytransport = function(){
   *       io.Transport.apply(this, arguments);
   *     };
   *     io.util.inherit(transport, io.Transport);
   *     
   *     ... // more code here
   *     
   *     // connect with your new transport
   *     var socket = new io.Socket(null,{transports:['mytransport']});
   *
   * @constructor
   * @param {Object} base The reference to io.Socket.
   * @param {Object} options The transport options.
   * @property {io.Socket|Object} base The reference to io.Socket.
   * @property {Object} options The transport options, these are used to overwrite the default options
   * @property {String} sessionid The sessionid of the established connection, this is only available a connection is established
   * @property {Boolean} connected The connection has been established.
   * @property {Boolean} connecting We are still connecting to the server.
   * @api public
   */
  Transport = io.Transport = function(base, options){
    this.base = base;
    this.options = {
      timeout: 15000 // based on heartbeat interval default
    };
    io.util.merge(this.options, options);
  };

  /**
   * Send the message to the connected Socket.IO server.
   *
   * @throws {Error} When the io.Transport is inherited, it should override this method.
   * @api public
   */
  Transport.prototype.send = function(){
    throw new Error('Missing send() implementation');
  };
  
  /**
   * Establish a connection with the Socket.IO server..
   *
   * @throws {Error} When the io.Transport is inherited, it should override this method.
   * @api public
   */
  Transport.prototype.connect = function(){
    throw new Error('Missing connect() implementation');
  };

  /**
   * Disconnect the established connection.
   *
   * @throws {Error} When the io.Transport is inherited, it should override this method.
   * @api private
   */
  Transport.prototype.disconnect = function(){
    throw new Error('Missing disconnect() implementation');
  };
  
  /**
   * Encode the message by adding the `frame` to each message. This allows
   * the client so send multiple messages with only one request.
   *
   * @param {String|Array} messages Messages that need to be encoded.
   * @returns {String} Encoded message.
   * @api private
   */
  Transport.prototype.encode = function(messages){
    var ret = '', message;
    messages = io.util.isArray(messages) ? messages : [messages];
    for (var i = 0, l = messages.length; i < l; i++){
      message = messages[i] === null || messages[i] === undefined ? '' : stringify(messages[i]);
      ret += frame + message.length + frame + message;
    }
    return ret;
  };
  
  /**
   * Decoded the response from the Socket.IO server, as the server could send multiple
   * messages in one response.
   *
   * @param (String} data The response from the server that requires decoding
   * @returns {Array} Decoded messages.
   * @api private
   */
  Transport.prototype.decode = function(data){
    var messages = [], number, n;
    do {
      if (data.substr(0, 3) !== frame) return messages;
      data = data.substr(3);
      number = '', n = '';
      for (var i = 0, l = data.length; i < l; i++){
        n = Number(data.substr(i, 1));
        if (data.substr(i, 1) == n){
          number += n;
        } else {
          data = data.substr(number.length + frame.length);
          number = Number(number);
          break;
        }
      }
      messages.push(data.substr(0, number)); // here
      data = data.substr(number);
    } while(data !== '');
    return messages;
  };
  
  /**
   * Handles the response from the server. When a new response is received
   * it will automatically update the timeout, decode the message and
   * forwards the response to the onMessage function for further processing.
   *
   * @param {String} data Response from the server.
   * @api private
   */
  Transport.prototype.onData = function(data){
    this.setTimeout();
    var msgs = this.decode(data);
    if (msgs && msgs.length){
      for (var i = 0, l = msgs.length; i < l; i++){
        this.onMessage(msgs[i]);
      }
    }
  };
  
  /**
   * All the transports have a dedicated timeout to detect if
   * the connection is still alive. We clear the existing timer
   * and set new one each time this function is called. When the
   * timeout does occur it will call the `onTimeout` method.
   *
   * @api private
   */
  Transport.prototype.setTimeout = function(){
    var self = this;
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(function(){
      self.onTimeout();
    }, this.options.timeout);
  };
  
  /**
   * Disconnect from the Socket.IO server when a timeout occurs.
   * 
   * @api private
   */
  Transport.prototype.onTimeout = function(){
    this.onDisconnect();
  };
  
  /**
   * After the response from the server has been parsed to individual
   * messages we need to decode them using the the Socket.IO message
   * protocol: <https://github.com/learnboost/socket.io-node/>.
   *
   * When a message is received we check if a session id has been set,
   * if the session id is missing we can assume that the received message
   * contains the sessionid of the connection.
   
   * When a message is prefixed with `~h~` we dispatch it our heartbeat
   * processing method `onHeartbeat` with the content of the heartbeat.
   *
   * When the message is prefixed with `~j~` we can assume that the contents
   * of the message is JSON encoded, so we parse the message and notify
   * the base of the new message.
   *
   * If none of the above, we consider it just a plain text message and
   * notify the base of the new message.
   *
   * @param {String} message A decoded message from the server.
   * @api private
   */
  Transport.prototype.onMessage = function(message){
    if (!this.sessionid){
      this.sessionid = message;
      this.onConnect();
    } else if (message.substr(0, 3) == '~h~'){
      this.onHeartbeat(message.substr(3));
    } else if (message.substr(0, 3) == '~j~'){
      this.base.onMessage(JSON.parse(message.substr(3)));
    } else {
      this.base.onMessage(message);
    }
  },
  
  /**
   * Send the received heartbeat message back to server. So the server
   * knows we are still connected.
   *
   * @param {String} heartbeat Heartbeat response from the server.
   * @api private
   */
  Transport.prototype.onHeartbeat = function(heartbeat){
    this.send('~h~' + heartbeat); // echo
  };
  
  /**
   * Notifies the base when a connection to the Socket.IO server has
   * been established. And it starts the connection `timeout` timer.
   *
   * @api private
   */
  Transport.prototype.onConnect = function(){
    this.connected = true;
    this.connecting = false;
    this.base.onConnect();
    this.setTimeout();
  };
  
  /**
   * Notifies the base when the connection with the Socket.IO server
   * has been disconnected.
   *
   * @api private
   */
  Transport.prototype.onDisconnect = function(){
    this.connecting = false;
    this.connected = false;
    this.sessionid = null;
    this.base.onDisconnect();
  };
  
  /**
   * Generates a connection url based on the Socket.IO URL Protocol.
   * See <https://github.com/learnboost/socket.io-node/> for more details.
   *
   * @returns {String} Connection url
   * @api private
   */
  Transport.prototype.prepareUrl = function(){
    return (this.base.options.secure ? 'https' : 'http') 
      + '://' + this.base.host 
      + ':' + this.base.options.port
      + '/' + this.base.options.resource
      + '/' + this.type
      + (this.sessionid ? ('/' + this.sessionid) : '/');
  };

})();
/**
 * socket.io-node-client
 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

(function(){
  var io = this.io,
  
  /**
   * A small stub function that will be used to reduce memory leaks.
   *
   * @type {Function}
   * @api private
   */
  empty = new Function,
  
  /**
   * We preform a small feature detection to see if `Cross Origin Resource Sharing`
   * is supported in the `XMLHttpRequest` object, so we can use it for cross domain requests.
   *
   * @type {Boolean}
   * @api private
   */ 
  XMLHttpRequestCORS = (function(){
    if (!('XMLHttpRequest' in window)) return false;
    // CORS feature detection
    var a = new XMLHttpRequest();
    return a.withCredentials != undefined;
  })(),
  
  /**
   * Generates the correct `XMLHttpRequest` for regular and cross domain requests.
   *
   * @param {Boolean} [xdomain] Create a request that can be used cross domain.
   * @returns {XMLHttpRequest|false} If we can create a XMLHttpRequest we will return that.
   * @api private
   */
  request = function(xdomain){
    if ('XDomainRequest' in window && xdomain) return new XDomainRequest();
    if ('XMLHttpRequest' in window && (!xdomain || XMLHttpRequestCORS)) return new XMLHttpRequest();
    if (!xdomain){
      try {
        var a = new ActiveXObject('MSXML2.XMLHTTP');
        return a;
      } catch(e){}
    
      try {
        var b = new ActiveXObject('Microsoft.XMLHTTP');
        return b;
      } catch(e){}
    }
    return false;
  },
  
  /**
   * This is the base for XHR based transports, the `XHR-Polling` and the `XHR-multipart` 
   * transports will extend this class.
   *
   * @constructor
   * @extends {io.Transport}
   * @property {Array} sendBuffer Used to queue up messages so they can be send as one request.
   * @api public
   */
  XHR = io.Transport.XHR = function(){
    io.Transport.apply(this, arguments);
    this.sendBuffer = [];
  };
  
  io.util.inherit(XHR, io.Transport);
  
  /**
   * Establish a connection
   *
   * @returns {Transport}
   * @api public
   */
  XHR.prototype.connect = function(){
    this.get();
    return this;
  };
  
  /**
   * Check if we need to send data to the Socket.IO server, if we have data in our buffer
   * we encode it and forward it to the sendIORequest method.
   *
   * @api private
   */
  XHR.prototype.checkSend = function(){
    if (!this.posting && this.sendBuffer.length){
      var encoded = this.encode(this.sendBuffer);
      this.sendBuffer = [];
      this.sendIORequest(encoded);
    }
  };
  
  /**
   * Send data to the Socket.IO server.
   *
   * @param data The message
   * @returns {Transport}
   * @api public
   */
  XHR.prototype.send = function(data){
    if (io.util.isArray(data)){
      this.sendBuffer.push.apply(this.sendBuffer, data);
    } else {
      this.sendBuffer.push(data);
    }
    this.checkSend();
    return this;
  };
  
  /**
   * Posts a encoded message to the Socket.IO server.
   *
   * @param {String} data A encoded message.
   * @api private
   */
  XHR.prototype.sendIORequest = function(data){
    var self = this;
    this.posting = true;
    this.sendXHR = this.request('send', 'POST');
    this.sendXHR.onreadystatechange = function(){
      var status;
      if (self.sendXHR.readyState == 4){
        self.sendXHR.onreadystatechange = empty;
        try { status = self.sendXHR.status; } catch(e){}
        self.posting = false;
        if (status == 200){
          self.checkSend();
        } else {
          self.onDisconnect();
        }
      }
    };
    this.sendXHR.send('data=' + encodeURIComponent(data));
  };
  
  /**
   * Disconnect the established connection.
   *
   * @returns {Transport}.
   * @api public
   */
  XHR.prototype.disconnect = function(){
    // send disconnection signal
    this.onDisconnect();
    return this;
  };
  
  /**
   * Handle the disconnect request.
   *
   * @api private
   */
  XHR.prototype.onDisconnect = function(){
    if (this.xhr){
      this.xhr.onreadystatechange = empty;
      try {
        this.xhr.abort();
      } catch(e){}
      this.xhr = null;
    }
    if (this.sendXHR){
      this.sendXHR.onreadystatechange = empty;
      try {
        this.sendXHR.abort();
      } catch(e){}
      this.sendXHR = null;
    }
    this.sendBuffer = [];
    io.Transport.prototype.onDisconnect.call(this);
  };
  
  /**
   * Generates a configured XHR request
   *
   * @param {String} url The url that needs to be requested.
   * @param {String} method The method the request should use.
   * @param {Boolean} multipart Do a multipart XHR request
   * @returns {XMLHttpRequest}
   * @api private
   */
  XHR.prototype.request = function(url, method, multipart){
    var req = request(this.base.isXDomain());
    if (multipart) req.multipart = true;
    req.open(method || 'GET', this.prepareUrl() + (url ? '/' + url : ''));
    if (method == 'POST' && 'setRequestHeader' in req){
      req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=utf-8');
    }
    return req;
  };
  
  /**
   * Check if the XHR transports are supported
   *
   * @param {Boolean} xdomain Check if we support cross domain requests.
   * @returns {Boolean}
   * @api public
   */
  XHR.check = function(xdomain){
    try {
      if (request(xdomain)) return true;
    } catch(e){}
    return false;
  };
  
  /**
   * Check if the XHR transport supports corss domain requests.
   * 
   * @returns {Boolean}
   * @api public
   */
  XHR.xdomainCheck = function(){
    return XHR.check(true);
  };
  
  XHR.request = request;
  
})();

/**
 * socket.io-node-client
 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

(function(){
  var io = this.io,
  
  /**
   * The WebSocket transport uses the HTML5 WebSocket API to establish an persistent
   * connection with the Socket.IO server. This transport will also be inherited by the
   * FlashSocket fallback as it provides a API compatible polyfill for the WebSockets.
   *
   * @constructor
   * @extends {io.Transport}
   * @api public
   */
  WS = io.Transport.websocket = function(){
    io.Transport.apply(this, arguments);
  };
  
  io.util.inherit(WS, io.Transport);
  
  /**
   * The transport type, you use this to identify which transport was chosen.
   *
   * @type {String}
   * @api public
   */
  WS.prototype.type = 'websocket';
  
  /**
   * Initializes a new `WebSocket` connection with the Socket.IO server. We attach
   * all the appropriate listeners to handle the responses from the server.
   *
   * @returns {Transport}
   * @api public
   */
  WS.prototype.connect = function(){
    var self = this;
    this.socket = new WebSocket(this.prepareUrl());
    this.socket.onmessage = function(ev){ self.onData(ev.data); };
    this.socket.onclose = function(ev){ self.onDisconnect(); };
    this.socket.onerror = function(e){ self.onError(e); };
    return this;
  };
  
  /**
   * Send a message to the Socket.IO server. The message will automatically be encoded
   * in the correct message format.
   *
   * @returns {Transport}
   * @api public
   */
  WS.prototype.send = function(data){
    if (this.socket) this.socket.send(this.encode(data));
    return this;
  };
  
  /**
   * Disconnect the established `WebSocket` connection.
   *
   * @returns {Transport}
   * @api public
   */
  WS.prototype.disconnect = function(){
    if (this.socket) this.socket.close();
    return this;
  };
  
  /**
   * Handle the errors that `WebSocket` might be giving when we
   * are attempting to connect or send messages.
   *
   * @param {Error} e The error.
   * @api private
   */
  WS.prototype.onError = function(e){
    this.base.emit('error', [e]);
  };
  
  /**
   * Generate a `WebSocket` compatible URL based on the options
   * the user supplied in our Socket.IO base.
   *
   * @returns {String} Connection url
   * @api private
   */
  WS.prototype.prepareUrl = function(){
    return (this.base.options.secure ? 'wss' : 'ws') 
    + '://' + this.base.host 
    + ':' + this.base.options.port
    + '/' + this.base.options.resource
    + '/' + this.type
    + (this.sessionid ? ('/' + this.sessionid) : '');
  };
  
  /**
   * Checks if the browser has support for native `WebSockets` and that
   * it's not the polyfill created for the FlashSocket transport.
   *
   * @return {Boolean}
   * @api public
   */
  WS.check = function(){
    // we make sure WebSocket is not confounded with a previously loaded flash WebSocket
    return 'WebSocket' in window && WebSocket.prototype && ( WebSocket.prototype.send && !!WebSocket.prototype.send.toString().match(/native/i)) && typeof WebSocket !== "undefined";
  };
  
  /**
   * Check if the `WebSocket` transport support cross domain communications.
   *
   * @returns {Boolean}
   * @api public
   */
  WS.xdomainCheck = function(){
    return true;
  };
  
})();

/**
 * socket.io-node-client
 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

(function(){
  var io = this.io,
  
  /**
   * The Flashsocket transport. This is a API wrapper for the HTML5 WebSocket specification.
   * It uses a .swf file to communicate with the server. If you want to serve the .swf file
   * from a other server than where the Socket.IO script is coming from you need to use the
   * insecure version of the .swf. More information about this can be found on the github page.
   *
   * @constructor
   * @extends {io.Transport.websocket}
   * @api public
   */
  Flashsocket = io.Transport.flashsocket = function(){
    io.Transport.websocket.apply(this, arguments);
  };
  
  io.util.inherit(Flashsocket, io.Transport.websocket);
  
  /**
   * The transport type, you use this to identify which transport was chosen.
   *
   * @type {String}
   * @api public
   */
  Flashsocket.prototype.type = 'flashsocket';
  
  /**
   * Disconnect the established `Flashsocket` connection. This is done by adding a new
   * task to the Flashsocket. The rest will be handled off by the `WebSocket` transport.
   *
   * @returns {Transport}
   * @api public
   */
  Flashsocket.prototype.connect = function(){
    var self = this, args = arguments;
    WebSocket.__addTask(function(){
      io.Transport.websocket.prototype.connect.apply(self, args);
    });
    return this;
  };
  
  /**
   * Sends a message to the Socket.IO server. This is done by adding a new
   * task to the Flashsocket. The rest will be handled off by the `WebSocket` transport.
   *
   * @returns {Transport}
   * @api public
   */
  Flashsocket.prototype.send = function(){
    var self = this, args = arguments;
    WebSocket.__addTask(function(){
      io.Transport.websocket.prototype.send.apply(self, args);
    });
    return this;
  };
  
  /**
   * Check if the Flashsocket transport is supported as it requires that the Adobe Flash Player
   * plugin version `10.0.0` or greater is installed. And also check if the polyfill is correctly
   * loaded.
   *
   * @returns {Boolean}
   * @api public
   */
  Flashsocket.check = function(){
    if (typeof WebSocket == 'undefined' || !('__addTask' in WebSocket) || !swfobject) return false;
    return swfobject.hasFlashPlayerVersion("10.0.0");
  };
  
  /**
   * Check if the Flashsocket transport can be used as cross domain / cross origin transport.
   * Because we can't see which type (secure or insecure) of .swf is used we will just return true.
   *
   * @returns {Boolean}
   * @api public
   */
  Flashsocket.xdomainCheck = function(){
    return true;
  };
  
})();
/**
 * socket.io-node-client
 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

(function(){
  var io = this.io,
  
  /**
   * The HTMLFile transport creates a `forever iframe` based transport
   * for Internet Explorer. Regular forever iframe implementations will 
   * continuously trigger the browsers buzy indicators. If the forever iframe
   * is created inside a `htmlfile` these indicators will not be trigged.
   *
   * @constructor
   * @extends {io.Transport.XHR}
   * @api public
   */
  HTMLFile = io.Transport.htmlfile = function(){
    io.Transport.XHR.apply(this, arguments);
  };
  
  io.util.inherit(HTMLFile, io.Transport.XHR);
  
  /**
   * The transport type, you use this to identify which transport was chosen.
   *
   * @type {String}
   * @api public
   */
  HTMLFile.prototype.type = 'htmlfile';
  
  /**
   * Starts the HTMLFile data stream for incoming messages. And registers a
   * onunload event listener so the HTMLFile will be destroyed.
   *
   * @api private
   */
  HTMLFile.prototype.get = function(){
    var self = this;
    this.open();
    window.attachEvent('onunload', function(){ self.destroy(); });
  };
  
  /**
   * Creates a new ActiveX `htmlfile` with a forever loading iframe
   * that can be used to listen to messages. Inside the generated
   * `htmlfile` a reference will be made to the HTMLFile transport.
   *
   * @api private
   */
  HTMLFile.prototype.open = function(){
    this.doc = new ActiveXObject('htmlfile');
    this.doc.open();
    this.doc.write('<html></html>');
    this.doc.parentWindow.s = this;
    this.doc.close();
    
    var iframeC = this.doc.createElement('div');
    this.doc.body.appendChild(iframeC);
    this.iframe = this.doc.createElement('iframe');
    iframeC.appendChild(this.iframe);
    this.iframe.src = this.prepareUrl() + '/' + (+ new Date);
  };
  
  /**
   * The Socket.IO server will write script tags inside the forever
   * iframe, this function will be used as callback for the incoming
   * information.
   *
   * @param {String} data The message
   * @param {document} doc Reference to the context
   * @api private
   */
  HTMLFile.prototype._ = function(data, doc){
    this.onData(data);
    var script = doc.getElementsByTagName('script')[0];
    script.parentNode.removeChild(script);
  };
  
  /**
   * Destroy the established connection, iframe and `htmlfile`.
   * And calls the `CollectGarbage` function of Internet Explorer
   * to release the memory.
   *
   * @api private
   */
  HTMLFile.prototype.destroy = function(){
    if (this.iframe){
      try {
        this.iframe.src = 'about:blank';
      } catch(e){}
      this.doc = null;
      CollectGarbage();
    }
  };
  
  /**
   * Disconnects the established connection.
   *
   * @returns {Transport} Chaining.
   * @api public
   */
  HTMLFile.prototype.disconnect = function(){
    this.destroy();
    return io.Transport.XHR.prototype.disconnect.call(this);
  };
  
  /**
   * Checks if the browser supports this transport. The browser
   * must have an `ActiveXObject` implementation.
   *
   * @return {Boolean}
   * @api public
   */
  HTMLFile.check = function(){
    if ('ActiveXObject' in window){
      try {
        var a = new ActiveXObject('htmlfile');
        return a && io.Transport.XHR.check();
      } catch(e){}
    }
    return false;
  };
  
  /**
   * Check if cross domain requests are supported.
   *
   * @returns {Boolean}
   * @api public
   */
  HTMLFile.xdomainCheck = function(){
    // we can probably do handling for sub-domains, we should test that it's cross domain but a subdomain here
    return false;
  };
  
})();
/**
 * socket.io-node-client
 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

(function(){
  var io = this.io,
  
  /**
   * The XHR-Multipart transport uses the a multipart XHR connection to
   * stream in the data from the Socket.IO server
   *
   * @constructor
   * @extends {io.Transport.XHR}
   * @api public
   */
  XHRMultipart = io.Transport['xhr-multipart'] = function(){
    io.Transport.XHR.apply(this, arguments);
  };
  
  io.util.inherit(XHRMultipart, io.Transport.XHR);
  
   /**
   * The transport type, you use this to identify which transport was chosen.
   *
   * @type {String}
   * @api public
   */
  XHRMultipart.prototype.type = 'xhr-multipart';
  
  /**
   * Starts the multipart stream for incomming messages.
   *
   * @api private
   */
  XHRMultipart.prototype.get = function(){
    var self = this;
    this.xhr = this.request('', 'GET', true);
    this.xhr.onreadystatechange = function(){
      if (self.xhr.readyState == 4) self.onData(self.xhr.responseText);
    };
    this.xhr.send(null);
  };
  
  /**
   * Checks if browser supports this transport.
   *
   * @return {Boolean}
   * @api public
   */
  XHRMultipart.check = function(){
    return 'XMLHttpRequest' in window && 'prototype' in XMLHttpRequest && 'multipart' in XMLHttpRequest.prototype;
  };
  
  /**
   * Check if cross domain requests are supported.
   *
   * @returns {Boolean}
   * @api public
   */
  XHRMultipart.xdomainCheck = function(){
    return true;
  };
  
})();
/**
 * socket.io-node-client
 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

(function(){
  var io = this.io,
  
  /**
   * A small stub function that will be used to reduce memory leaks.
   *
   * @type {Function}
   * @api private
   */
  empty = new Function(),
  
  /**
   * The XHR-polling transport uses long polling XHR requests to create a
   * "persistent" connection with the server.
   *
   * @constructor
   * @extends {io.Transport.XHR}
   * @api public
   */
  XHRPolling = io.Transport['xhr-polling'] = function(){
    io.Transport.XHR.apply(this, arguments);
  };
  
  io.util.inherit(XHRPolling, io.Transport.XHR);
  
  /**
   * The transport type, you use this to identify which transport was chosen.
   *
   * @type {string}
   * @api public
   */
  XHRPolling.prototype.type = 'xhr-polling';
  
  /** 
   * Establish a connection, for iPhone and Android this will be done once the page
   * is loaded.
   *
   * @returns {Transport} Chaining.
   * @api public
   */
  XHRPolling.prototype.connect = function(){
    var self = this;
    io.util.defer(function(){ io.Transport.XHR.prototype.connect.call(self) });
    return false;
  };
  
   /**
   * Starts a XHR request to wait for incoming messages.
   *
   * @api private
   */
  XHRPolling.prototype.get = function(){
    var self = this;
    this.xhr = this.request(+ new Date, 'GET');
    this.xhr.onreadystatechange = function(){
      var status;
      if (self.xhr.readyState == 4){
        self.xhr.onreadystatechange = empty;
        try { status = self.xhr.status; } catch(e){}
        if (status == 200){
          self.onData(self.xhr.responseText);
          self.get();
        } else {
          self.onDisconnect();
        }
      }
    };
    this.xhr.send(null);
  };
  
  /**
   * Checks if browser supports this transport.
   *
   * @return {Boolean}
   * @api public
   */
  XHRPolling.check = function(){
    return io.Transport.XHR.check();
  };
  
  /**
   * Check if cross domain requests are supported
   *
   * @returns {Boolean}
   * @api public
   */
  XHRPolling.xdomainCheck = function(){
    return io.Transport.XHR.xdomainCheck();
  };

})();

/**
 * socket.io-node-client
 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

(function(){
  var io = this.io,
  
  /**
   * The JSONP transport creates an persistent connection by dynamically
   * inserting a script tag in the page. This script tag will receive the
   * information of the Socket.IO server. When new information is received
   * it creates a new script tag for the new data stream.
   *
   * @constructor
   * @extends {io.Transport.xhr-polling}
   * @api public
   */
  JSONPPolling = io.Transport['jsonp-polling'] = function(){
    io.Transport.XHR.apply(this, arguments);
    this.insertAt = document.getElementsByTagName('head')[0];
    this.index = io.JSONP.length;
    io.JSONP.push(this);
  };
  
  io.util.inherit(JSONPPolling, io.Transport['xhr-polling']);
  
  /**
   * A list of all JSONPolling transports, this is used for by
   * the Socket.IO server to distribute the callbacks.
   *
   * @type {Array}
   * @api private
   */
  io.JSONP = [];
  
  /**
   * The transport type, you use this to identify which transport was chosen.
   *
   * @type {String}
   * @api public
   */
  JSONPPolling.prototype.type = 'jsonp-polling';
  
  /**
   * Posts a encoded message to the Socket.IO server using an iframe.
   * The iframe is used because script tags can create POST based requests.
   * The iframe is positioned outside of the view so the user does not
   * notice it's existence.
   *
   * @param {String} data A encoded message.
   * @api private
   */
  JSONPPolling.prototype.sendIORequest = function(data){
    var self = this;
    if (!('form' in this)){
      var form = document.createElement('FORM'),
        area = document.createElement('TEXTAREA'),
        id = this.iframeId = 'socket_io_iframe_' + this.index,
        iframe;
  
      form.style.position = 'absolute';
      form.style.top = '-1000px';
      form.style.left = '-1000px';
      form.target = id;
      form.method = 'POST';
      form.action = this.prepareUrl() + '/' + (+new Date) + '/' + this.index;
      area.name = 'data';
      form.appendChild(area);
      this.insertAt.insertBefore(form, null);
      document.body.appendChild(form);
  
      this.form = form;
      this.area = area;
    }
  
    function complete(){
      initIframe();
      self.posting = false;
      self.checkSend();
    };
  
    function initIframe(){
      if (self.iframe){
        self.form.removeChild(self.iframe);
      }
  
      try {
        // ie6 dynamic iframes with target="" support (thanks Chris Lambacher)
        iframe = document.createElement('<iframe name="'+ self.iframeId +'">');
      } catch(e){
        iframe = document.createElement('iframe');
        iframe.name = self.iframeId;
      }
  
      iframe.id = self.iframeId;
  
      self.form.appendChild(iframe);
      self.iframe = iframe;
    };
  
    initIframe();
  
    this.posting = true;
    this.area.value = data;
  
    try {
      this.form.submit();
    } catch(e){}
  
    if (this.iframe.attachEvent){
      iframe.onreadystatechange = function(){
        if (self.iframe.readyState == 'complete') complete();
      };
    } else {
      this.iframe.onload = complete;
    }
  };
  
  /**
   * Creates a new JSONP poll that can be used to listen
   * for messages from the Socket.IO server.
   *
   * @api private
   */
  JSONPPolling.prototype.get = function(){
    var self = this,
        script = document.createElement('SCRIPT');
    if (this.script){
      this.script.parentNode.removeChild(this.script);
      this.script = null;
    }
    script.async = true;
    script.src = this.prepareUrl() + '/' + (+new Date) + '/' + this.index;
    script.onerror = function(){
      self.onDisconnect();
    };
    this.insertAt.insertBefore(script, null);
    this.script = script;
  };
  
  /**
   * Callback function for the incoming message stream from the Socket.IO server.
   *
   * @param {String} data The message
   * @param {document} doc Reference to the context
   * @api private
   */
  JSONPPolling.prototype._ = function(){
    this.onData.apply(this, arguments);
    this.get();
    return this;
  };
  
  /**
   * Checks if browser supports this transport.
   *
   * @return {Boolean}
   * @api public
   */
  JSONPPolling.check = function(){
    return true;
  };
  
  /**
   * Check if cross domain requests are supported
   *
   * @returns {Boolean}
   * @api public
   */
  JSONPPolling.xdomainCheck = function(){
    return true;
  };
})();

/**
 * socket.io-node-client
 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

(function(){
  var io = this.io;
  
  /**
   * Create a new `Socket.IO client` which can establish a persisted
   * connection with a Socket.IO enabled server.
   *
   * Options:
   *   - `secure`  Use secure connections, defaulting to false.
   *   - `document`  Reference to the document object to retrieve and set cookies, defaulting to document.
   *   - `port`  The port where the Socket.IO server listening on, defaulting to location.port.
   *   - `resource`  The path or namespace on the server where the Socket.IO requests are intercepted, defaulting to 'socket.io'.
   *   - `transports`  A ordered list with the available transports, defaulting to all transports.
   *   - `transportOption`  A {Object} containing the options for each transport. The key of the object should reflect
   *      name of the transport and the value a {Object} with the options.
   *   - `connectTimeout`  The duration in milliseconds that a transport has to establish a working connection, defaulting to 5000.
   *   - `tryTransportsOnConnectTimeout`  Should we attempt other transport methods when the connectTimeout occurs, defaulting to true.
   *   - `reconnect`  Should reconnection happen automatically, defaulting to true.
   *   - `reconnectionDelay`  The delay in milliseconds before we attempt to establish a working connection. This value will
   *      increase automatically using a exponential back off algorithm. Defaulting to 500.
   *   - `maxReconnectionAttempts`  Number of attempts we should make before seizing the reconnect operation, defaulting to 10.
   *   - `rememberTransport` Should the successfully connected transport be remembered in a cookie, defaulting to true.
   *
   * Examples:
   *
   * Create client with the default settings.
   *
   *     var socket = new io.Socket();
   *     socket.connect();
   *     socket.on('message', function(msg){
   *       console.log('Received message: ' + msg );
   *     });
   *     socket.on('connect', function(){
   *       socket.send('Hello from client');
   *     });
   *
   * Create a connection with server on a different port and host.
   *
   *     var socket = new io.Socket('http://example.com',{port:1337});
   *
   * @constructor
   * @exports Socket as io.Socket
   * @param {String} [host] The host where the Socket.IO server is located, it defaults to the host that runs the page.
   * @param {Objects} [options] The options that will configure the Socket.IO client. 
   * @property {String} host The supplied host arguments or the host that page runs.
   * @property {Object} options The passed options combined with the defaults.
   * @property {Boolean} connected Whether the socket is connected or not.
   * @property {Boolean} connecting Whether the socket is connecting or not.
   * @property {Boolean} reconnecting Whether the socket is reconnecting or not.
   * @property {Object} transport The selected transport instance.
   * @api public
   */
  var Socket = io.Socket = function(host, options){
    this.host = host || document.domain;
    this.options = {
      secure: false,
      document: document,
      port: document.location.port || 80,
      resource: 'socket.io',
      transports: ['websocket', 'flashsocket', 'htmlfile', 'xhr-multipart', 'xhr-polling', 'jsonp-polling'],
      transportOptions: {
        'xhr-polling': {
          timeout: 25000 // based on polling duration default
        },
        'jsonp-polling': {
          timeout: 25000
        }
      },
      connectTimeout: 5000,
      tryTransportsOnConnectTimeout: true,
      reconnect: true,
      reconnectionDelay: 500,
      maxReconnectionAttempts: 10,
      rememberTransport: true
    };
    io.util.merge(this.options, options);
    this.connected = false;
    this.connecting = false;
    this.reconnecting = false;
    this.events = {};
    this.transport = this.getTransport();
    if (!this.transport && 'console' in window) console.error('No transport available');
  };
  
  /**
   * Find an available transport based on the options supplied in the constructor. For example if the
   * `rememberTransport` option was set we will only connect with the previous successfully connected transport.
   * The supplied transports can be overruled if the `override` argument is supplied.
   *
   * Example:
   *
   * Override the existing transports.
   *
   *     var socket = new io.Socket();
   *     socket.getTransport(['jsonp-polling','websocket']);
   *     // returns the json-polling transport because it's availabe in all browsers.
   *
   * @param {Array} [override] A ordered list with transports that should be used instead of the options.transports.
   * @returns {Null|Transport} The available transport.
   * @api private
   */
  Socket.prototype.getTransport = function(override){
    var transports = override || this.options.transports, match;
    if (this.options.rememberTransport && !override){
      match = this.options.document.cookie.match('(?:^|;)\\s*socketio=([^;]*)');
      if (match){
        this.rememberedTransport = true;
        transports = [decodeURIComponent(match[1])];
      }
    } 
    for (var i = 0, transport; transport = transports[i]; i++){
      if (io.Transport[transport] 
        && io.Transport[transport].check() 
        && (!this.isXDomain() || io.Transport[transport].xdomainCheck())){
        return new io.Transport[transport](this, this.options.transportOptions[transport] || {});
      }
    }
    return null;
  };
  
  /**
   * Establish a new connection with the Socket.IO server. This is done using the selected transport by the
   * getTransport method. If the `connectTimeout` and the `tryTransportsOnConnectTimeout` options are set
   * the client will keep trying to connect to the server using a different transports when the timeout occurs.
   *
   * Example:
   *
   * Create a Socket.IO client with a connect callback (We assume we have the WebSocket transport avaliable).
   *
   *     var socket = new io.Socket();
   *     socket.connect(function(transport){
   *       console.log("Connected to server using the " + socket.transport.type + " transport.");
   *     });
   *     // => "Connected to server using the WebSocket transport."
   *
   * @param {Function} [fn] Callback.
   * @returns {io.Socket}
   * @api public
   */
  Socket.prototype.connect = function(fn){
    if (this.transport && !this.connected){
      if (this.connecting) this.disconnect(true);
      this.connecting = true;
      this.emit('connecting', [this.transport.type]);
      this.transport.connect();
      if (this.options.connectTimeout){
        var self = this;
        this.connectTimeoutTimer = setTimeout(function(){
          if (!self.connected){
            self.disconnect(true);
            if (self.options.tryTransportsOnConnectTimeout && !self.rememberedTransport){
              if(!self.remainingTransports) self.remainingTransports = self.options.transports.slice(0);
              var transports = self.remainingTransports;
              while(transports.length > 0 && transports.splice(0,1)[0] != self.transport.type){}
              if(transports.length){
                self.transport = self.getTransport(transports);
                self.connect();
              }
            }
            if(!self.remainingTransports || self.remainingTransports.length == 0) self.emit('connect_failed');
          }
          if(self.remainingTransports && self.remainingTransports.length == 0) delete self.remainingTransports;
        }, this.options.connectTimeout);
      }
    }
    if (fn && typeof fn == 'function') this.once('connect',fn);
    return this;
  };
  
  /**
   * Sends the data to the Socket.IO server. If there isn't a connection to the server
   * the data will be forwarded to the queue.
   *
   * @param {Mixed} data The data that needs to be send to the Socket.IO server.
   * @returns {io.Socket}
   * @api public
   */
  Socket.prototype.send = function(data){
    if (!this.transport || !this.transport.connected) return this.queue(data);
    this.transport.send(data);
    return this;
  };
  
  /**
   * Disconnect the established connect.
   *
   * @param {Boolean} [soft] A soft disconnect will keep the reconnect settings enabled.
   * @returns {io.Socket}
   * @api public
   */
  Socket.prototype.disconnect = function(soft){
    if (this.connectTimeoutTimer) clearTimeout(this.connectTimeoutTimer);
    if (!soft) this.options.reconnect = false;
    this.transport.disconnect();
    return this;
  };
  
  /**
   * Adds a new eventListener for the given event.
   *
   * Example:
   *
   *     var socket = new io.Socket();
   *     socket.on("connect", function(transport){
   *       console.log("Connected to server using the " + socket.transport.type + " transport.");
   *     });
   *     // => "Connected to server using the WebSocket transport."
   *
   * @param {String} name The name of the event.
   * @param {Function} fn The function that is called once the event is emitted.
   * @returns {io.Socket}
   * @api public
   */
  Socket.prototype.on = function(name, fn){
    if (!(name in this.events)) this.events[name] = [];
    this.events[name].push(fn);
    return this;
  };
  
  /**
   * Adds a one time listener, the listener will be removed after the event is emitted.
   *
   * Example:
   *
   *     var socket = new io.Socket();
   *     socket.once("custom:event", function(){
   *       console.log("I should only log once.");
   *     });
   *     socket.emit("custom:event");
   *     socket.emit("custom:event");
   *     // => "I should only log once."
   *
   * @param {String} name The name of the event.
   * @param {Function} fn The function that is called once the event is emitted.
   * @returns {io.Socket}
   * @api public
   */
  Socket.prototype.once = function(name, fn){
    var self = this
      , once = function(){
        self.removeEvent(name, once);
        fn.apply(self, arguments);
      };
    once.ref = fn;
    self.on(name, once);
    return this;
  };
  
  /**
   * Emit a event to all listeners.
   *
   * Example:
   *
   *     var socket = new io.Socket();
   *     socket.on("custom:event", function(){
   *       console.log("Emitted a custom:event");
   *     });
   *     socket.emit("custom:event");
   *     // => "Emitted a custom:event"
   *
   * @param {String} name The name of the event.
   * @param {Array} args Arguments for the event.
   * @returns {io.Socket}
   * @api private
   */
  Socket.prototype.emit = function(name, args){
    if (name in this.events){
      var events = this.events[name].concat();
      for (var i = 0, ii = events.length; i < ii; i++)
        events[i].apply(this, args === undefined ? [] : args);
    }
    return this;
  };

  /**
   * Removes a event listener from the listener array for the specified event.
   *
   * Example:
   *
   *     var socket = new io.Socket()
   *       , event = function(){};
   *     socket.on("connect", event);
   *     socket.removeEvent("connect", event);
   *
   * @param {String} name The name of the event.
   * @param {Function} fn The function that is called once the event is emitted.
   * @returns {io.Socket}
   * @api public
   */
  Socket.prototype.removeEvent = function(name, fn){
    if (name in this.events){
      for (var a = 0, l = this.events[name].length; a < l; a++)
        if (this.events[name][a] == fn || this.events[name][a].ref && this.events[name][a].ref == fn) this.events[name].splice(a, 1);    
    }
    return this;
  };
  
  /**
   * Queues messages when there isn't a active connection available. Once a connection has been
   * established you should call the `doQueue` method to send the queued messages to the server.
   *
   * @param {Mixed} message The message that was originally send to the `send` method.
   * @returns {io.Socket}
   * @api private
   */
  Socket.prototype.queue = function(message){
    if (!('queueStack' in this)) this.queueStack = [];
    this.queueStack.push(message);
    return this;
  };
  
  /**
   * If there are queued messages we send all messages to the Socket.IO server and empty
   * the queue.
   *
   * @returns {io.Socket}
   * @api private
   */
  Socket.prototype.doQueue = function(){
    if (!('queueStack' in this) || !this.queueStack.length) return this;
    this.transport.send(this.queueStack);
    this.queueStack = [];
    return this;
  };
  
  /**
   * Check if we need to use cross domain enabled transports. Cross domain would
   * be a different port or different domain name.
   *
   * @returns {Boolean}
   * @api private
   */
  Socket.prototype.isXDomain = function(){
    var locPort = window.location.port || 80;
    return this.host !== document.domain || this.options.port != locPort;
  };
  
  /**
   * When the transport established an working connection the Socket.IO server it notifies us
   * by calling this method so we can set the `connected` and `connecting` properties and emit
   * the connection event.
   *
   * @api private
   */
  Socket.prototype.onConnect = function(){
    this.connected = true;
    this.connecting = false;
    this.doQueue();
    if (this.options.rememberTransport) this.options.document.cookie = 'socketio=' + encodeURIComponent(this.transport.type);
    this.emit('connect');
  };
  
  /**
   * When the transport receives new messages from the Socket.IO server it notifies us by calling
   * this method with the decoded `data` it received.
   *
   * @param data The message from the Socket.IO server.
   * @api private
   */
  Socket.prototype.onMessage = function(data){
    this.emit('message', [data]);
  };
  
  /**
   * When the transport is disconnected from the Socket.IO server it notifies us by calling
   * this method. If we where connected and the `reconnect` is set we will attempt to reconnect.
   *
   * @api private
   */
  Socket.prototype.onDisconnect = function(){
    var wasConnected = this.connected;
    this.connected = false;
    this.connecting = false;
    this.queueStack = [];
    if (wasConnected){
      this.emit('disconnect');
      if (this.options.reconnect && !this.reconnecting) this.onReconnect();
    }
  };
  
  /**
   * The reconnection is done using an exponential back off algorithm to prevent
   * the server from being flooded with connection requests. When the transport
   * is disconnected we wait until the `reconnectionDelay` finishes. We multiply 
   * the `reconnectionDelay` (if the previous `reconnectionDelay` was 500 it will
   * be updated to 1000 and than 2000>4000>8000>16000 etc.) and tell the current
   * transport to connect again. When we run out of `reconnectionAttempts` we will 
   * do one final attempt and loop over all enabled transport methods to see if 
   * other transports might work. If everything fails we emit the `reconnect_failed`
   * event.
   *
   * @api private
   */
  Socket.prototype.onReconnect = function(){
    this.reconnecting = true;
    this.reconnectionAttempts = 0;
    this.reconnectionDelay = this.options.reconnectionDelay;
    
    var self = this
      , tryTransportsOnConnectTimeout = this.options.tryTransportsOnConnectTimeout
      , rememberTransport = this.options.rememberTransport;
    
    function reset(){
      if(self.connected) self.emit('reconnect',[self.transport.type,self.reconnectionAttempts]);
      self.removeEvent('connect_failed', maybeReconnect).removeEvent('connect', maybeReconnect);
      self.reconnecting = false;
      delete self.reconnectionAttempts;
      delete self.reconnectionDelay;
      delete self.reconnectionTimer;
      delete self.redoTransports;
      self.options.tryTransportsOnConnectTimeout = tryTransportsOnConnectTimeout;
      self.options.rememberTransport = rememberTransport;
      
      return;
    };
    
    function maybeReconnect(){
      if (!self.reconnecting) return;
      if (!self.connected){
        if (self.connecting && self.reconnecting) return self.reconnectionTimer = setTimeout(maybeReconnect, 1000);
        
        if (self.reconnectionAttempts++ >= self.options.maxReconnectionAttempts){
          if (!self.redoTransports){
            self.on('connect_failed', maybeReconnect);
            self.options.tryTransportsOnConnectTimeout = true;
            self.transport = self.getTransport(self.options.transports); // override with all enabled transports
            self.redoTransports = true;
            self.connect();
          } else {
            self.emit('reconnect_failed');
            reset();
          }
        } else {
          self.reconnectionDelay *= 2; // exponential back off
          self.connect();
          self.emit('reconnecting', [self.reconnectionDelay,self.reconnectionAttempts]);
          self.reconnectionTimer = setTimeout(maybeReconnect, self.reconnectionDelay);
        }
      } else {
        reset();
      }
    };
    this.options.tryTransportsOnConnectTimeout = false;
    this.reconnectionTimer = setTimeout(maybeReconnect, this.reconnectionDelay);
    
    this.on('connect', maybeReconnect);
  };
  
  /**
   * API compatiblity
   */
  Socket.prototype.fire = Socket.prototype.emit;
  Socket.prototype.addListener = Socket.prototype.addEvent = Socket.prototype.addEventListener = Socket.prototype.on;
  Socket.prototype.removeListener = Socket.prototype.removeEventListener = Socket.prototype.removeEvent;
  
})();
/*	SWFObject v2.2 <http://code.google.com/p/swfobject/> 
	is released under the MIT License <http://www.opensource.org/licenses/mit-license.php> 
*/
var swfobject=function(){var D="undefined",r="object",S="Shockwave Flash",W="ShockwaveFlash.ShockwaveFlash",q="application/x-shockwave-flash",R="SWFObjectExprInst",x="onreadystatechange",O=window,j=document,t=navigator,T=false,U=[h],o=[],N=[],I=[],l,Q,E,B,J=false,a=false,n,G,m=true,M=function(){var aa=typeof j.getElementById!=D&&typeof j.getElementsByTagName!=D&&typeof j.createElement!=D,ah=t.userAgent.toLowerCase(),Y=t.platform.toLowerCase(),ae=Y?/win/.test(Y):/win/.test(ah),ac=Y?/mac/.test(Y):/mac/.test(ah),af=/webkit/.test(ah)?parseFloat(ah.replace(/^.*webkit\/(\d+(\.\d+)?).*$/,"$1")):false,X=!+"\v1",ag=[0,0,0],ab=null;if(typeof t.plugins!=D&&typeof t.plugins[S]==r){ab=t.plugins[S].description;if(ab&&!(typeof t.mimeTypes!=D&&t.mimeTypes[q]&&!t.mimeTypes[q].enabledPlugin)){T=true;X=false;ab=ab.replace(/^.*\s+(\S+\s+\S+$)/,"$1");ag[0]=parseInt(ab.replace(/^(.*)\..*$/,"$1"),10);ag[1]=parseInt(ab.replace(/^.*\.(.*)\s.*$/,"$1"),10);ag[2]=/[a-zA-Z]/.test(ab)?parseInt(ab.replace(/^.*[a-zA-Z]+(.*)$/,"$1"),10):0}}else{if(typeof O.ActiveXObject!=D){try{var ad=new ActiveXObject(W);if(ad){ab=ad.GetVariable("$version");if(ab){X=true;ab=ab.split(" ")[1].split(",");ag=[parseInt(ab[0],10),parseInt(ab[1],10),parseInt(ab[2],10)]}}}catch(Z){}}}return{w3:aa,pv:ag,wk:af,ie:X,win:ae,mac:ac}}(),k=function(){if(!M.w3){return}if((typeof j.readyState!=D&&j.readyState=="complete")||(typeof j.readyState==D&&(j.getElementsByTagName("body")[0]||j.body))){f()}if(!J){if(typeof j.addEventListener!=D){j.addEventListener("DOMContentLoaded",f,false)}if(M.ie&&M.win){j.attachEvent(x,function(){if(j.readyState=="complete"){j.detachEvent(x,arguments.callee);f()}});if(O==top){(function(){if(J){return}try{j.documentElement.doScroll("left")}catch(X){setTimeout(arguments.callee,0);return}f()})()}}if(M.wk){(function(){if(J){return}if(!/loaded|complete/.test(j.readyState)){setTimeout(arguments.callee,0);return}f()})()}s(f)}}();function f(){if(J){return}try{var Z=j.getElementsByTagName("body")[0].appendChild(C("span"));Z.parentNode.removeChild(Z)}catch(aa){return}J=true;var X=U.length;for(var Y=0;Y<X;Y++){U[Y]()}}function K(X){if(J){X()}else{U[U.length]=X}}function s(Y){if(typeof O.addEventListener!=D){O.addEventListener("load",Y,false)}else{if(typeof j.addEventListener!=D){j.addEventListener("load",Y,false)}else{if(typeof O.attachEvent!=D){i(O,"onload",Y)}else{if(typeof O.onload=="function"){var X=O.onload;O.onload=function(){X();Y()}}else{O.onload=Y}}}}}function h(){if(T){V()}else{H()}}function V(){var X=j.getElementsByTagName("body")[0];var aa=C(r);aa.setAttribute("type",q);var Z=X.appendChild(aa);if(Z){var Y=0;(function(){if(typeof Z.GetVariable!=D){var ab=Z.GetVariable("$version");if(ab){ab=ab.split(" ")[1].split(",");M.pv=[parseInt(ab[0],10),parseInt(ab[1],10),parseInt(ab[2],10)]}}else{if(Y<10){Y++;setTimeout(arguments.callee,10);return}}X.removeChild(aa);Z=null;H()})()}else{H()}}function H(){var ag=o.length;if(ag>0){for(var af=0;af<ag;af++){var Y=o[af].id;var ab=o[af].callbackFn;var aa={success:false,id:Y};if(M.pv[0]>0){var ae=c(Y);if(ae){if(F(o[af].swfVersion)&&!(M.wk&&M.wk<312)){w(Y,true);if(ab){aa.success=true;aa.ref=z(Y);ab(aa)}}else{if(o[af].expressInstall&&A()){var ai={};ai.data=o[af].expressInstall;ai.width=ae.getAttribute("width")||"0";ai.height=ae.getAttribute("height")||"0";if(ae.getAttribute("class")){ai.styleclass=ae.getAttribute("class")}if(ae.getAttribute("align")){ai.align=ae.getAttribute("align")}var ah={};var X=ae.getElementsByTagName("param");var ac=X.length;for(var ad=0;ad<ac;ad++){if(X[ad].getAttribute("name").toLowerCase()!="movie"){ah[X[ad].getAttribute("name")]=X[ad].getAttribute("value")}}P(ai,ah,Y,ab)}else{p(ae);if(ab){ab(aa)}}}}}else{w(Y,true);if(ab){var Z=z(Y);if(Z&&typeof Z.SetVariable!=D){aa.success=true;aa.ref=Z}ab(aa)}}}}}function z(aa){var X=null;var Y=c(aa);if(Y&&Y.nodeName=="OBJECT"){if(typeof Y.SetVariable!=D){X=Y}else{var Z=Y.getElementsByTagName(r)[0];if(Z){X=Z}}}return X}function A(){return !a&&F("6.0.65")&&(M.win||M.mac)&&!(M.wk&&M.wk<312)}function P(aa,ab,X,Z){a=true;E=Z||null;B={success:false,id:X};var ae=c(X);if(ae){if(ae.nodeName=="OBJECT"){l=g(ae);Q=null}else{l=ae;Q=X}aa.id=R;if(typeof aa.width==D||(!/%$/.test(aa.width)&&parseInt(aa.width,10)<310)){aa.width="310"}if(typeof aa.height==D||(!/%$/.test(aa.height)&&parseInt(aa.height,10)<137)){aa.height="137"}j.title=j.title.slice(0,47)+" - Flash Player Installation";var ad=M.ie&&M.win?"ActiveX":"PlugIn",ac="MMredirectURL="+O.location.toString().replace(/&/g,"%26")+"&MMplayerType="+ad+"&MMdoctitle="+j.title;if(typeof ab.flashvars!=D){ab.flashvars+="&"+ac}else{ab.flashvars=ac}if(M.ie&&M.win&&ae.readyState!=4){var Y=C("div");X+="SWFObjectNew";Y.setAttribute("id",X);ae.parentNode.insertBefore(Y,ae);ae.style.display="none";(function(){if(ae.readyState==4){ae.parentNode.removeChild(ae)}else{setTimeout(arguments.callee,10)}})()}u(aa,ab,X)}}function p(Y){if(M.ie&&M.win&&Y.readyState!=4){var X=C("div");Y.parentNode.insertBefore(X,Y);X.parentNode.replaceChild(g(Y),X);Y.style.display="none";(function(){if(Y.readyState==4){Y.parentNode.removeChild(Y)}else{setTimeout(arguments.callee,10)}})()}else{Y.parentNode.replaceChild(g(Y),Y)}}function g(ab){var aa=C("div");if(M.win&&M.ie){aa.innerHTML=ab.innerHTML}else{var Y=ab.getElementsByTagName(r)[0];if(Y){var ad=Y.childNodes;if(ad){var X=ad.length;for(var Z=0;Z<X;Z++){if(!(ad[Z].nodeType==1&&ad[Z].nodeName=="PARAM")&&!(ad[Z].nodeType==8)){aa.appendChild(ad[Z].cloneNode(true))}}}}}return aa}function u(ai,ag,Y){var X,aa=c(Y);if(M.wk&&M.wk<312){return X}if(aa){if(typeof ai.id==D){ai.id=Y}if(M.ie&&M.win){var ah="";for(var ae in ai){if(ai[ae]!=Object.prototype[ae]){if(ae.toLowerCase()=="data"){ag.movie=ai[ae]}else{if(ae.toLowerCase()=="styleclass"){ah+=' class="'+ai[ae]+'"'}else{if(ae.toLowerCase()!="classid"){ah+=" "+ae+'="'+ai[ae]+'"'}}}}}var af="";for(var ad in ag){if(ag[ad]!=Object.prototype[ad]){af+='<param name="'+ad+'" value="'+ag[ad]+'" />'}}aa.outerHTML='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"'+ah+">"+af+"</object>";N[N.length]=ai.id;X=c(ai.id)}else{var Z=C(r);Z.setAttribute("type",q);for(var ac in ai){if(ai[ac]!=Object.prototype[ac]){if(ac.toLowerCase()=="styleclass"){Z.setAttribute("class",ai[ac])}else{if(ac.toLowerCase()!="classid"){Z.setAttribute(ac,ai[ac])}}}}for(var ab in ag){if(ag[ab]!=Object.prototype[ab]&&ab.toLowerCase()!="movie"){e(Z,ab,ag[ab])}}aa.parentNode.replaceChild(Z,aa);X=Z}}return X}function e(Z,X,Y){var aa=C("param");aa.setAttribute("name",X);aa.setAttribute("value",Y);Z.appendChild(aa)}function y(Y){var X=c(Y);if(X&&X.nodeName=="OBJECT"){if(M.ie&&M.win){X.style.display="none";(function(){if(X.readyState==4){b(Y)}else{setTimeout(arguments.callee,10)}})()}else{X.parentNode.removeChild(X)}}}function b(Z){var Y=c(Z);if(Y){for(var X in Y){if(typeof Y[X]=="function"){Y[X]=null}}Y.parentNode.removeChild(Y)}}function c(Z){var X=null;try{X=j.getElementById(Z)}catch(Y){}return X}function C(X){return j.createElement(X)}function i(Z,X,Y){Z.attachEvent(X,Y);I[I.length]=[Z,X,Y]}function F(Z){var Y=M.pv,X=Z.split(".");X[0]=parseInt(X[0],10);X[1]=parseInt(X[1],10)||0;X[2]=parseInt(X[2],10)||0;return(Y[0]>X[0]||(Y[0]==X[0]&&Y[1]>X[1])||(Y[0]==X[0]&&Y[1]==X[1]&&Y[2]>=X[2]))?true:false}function v(ac,Y,ad,ab){if(M.ie&&M.mac){return}var aa=j.getElementsByTagName("head")[0];if(!aa){return}var X=(ad&&typeof ad=="string")?ad:"screen";if(ab){n=null;G=null}if(!n||G!=X){var Z=C("style");Z.setAttribute("type","text/css");Z.setAttribute("media",X);n=aa.appendChild(Z);if(M.ie&&M.win&&typeof j.styleSheets!=D&&j.styleSheets.length>0){n=j.styleSheets[j.styleSheets.length-1]}G=X}if(M.ie&&M.win){if(n&&typeof n.addRule==r){n.addRule(ac,Y)}}else{if(n&&typeof j.createTextNode!=D){n.appendChild(j.createTextNode(ac+" {"+Y+"}"))}}}function w(Z,X){if(!m){return}var Y=X?"visible":"hidden";if(J&&c(Z)){c(Z).style.visibility=Y}else{v("#"+Z,"visibility:"+Y)}}function L(Y){var Z=/[\\\"<>\.;]/;var X=Z.exec(Y)!=null;return X&&typeof encodeURIComponent!=D?encodeURIComponent(Y):Y}var d=function(){if(M.ie&&M.win){window.attachEvent("onunload",function(){var ac=I.length;for(var ab=0;ab<ac;ab++){I[ab][0].detachEvent(I[ab][1],I[ab][2])}var Z=N.length;for(var aa=0;aa<Z;aa++){y(N[aa])}for(var Y in M){M[Y]=null}M=null;for(var X in swfobject){swfobject[X]=null}swfobject=null})}}();return{registerObject:function(ab,X,aa,Z){if(M.w3&&ab&&X){var Y={};Y.id=ab;Y.swfVersion=X;Y.expressInstall=aa;Y.callbackFn=Z;o[o.length]=Y;w(ab,false)}else{if(Z){Z({success:false,id:ab})}}},getObjectById:function(X){if(M.w3){return z(X)}},embedSWF:function(ab,ah,ae,ag,Y,aa,Z,ad,af,ac){var X={success:false,id:ah};if(M.w3&&!(M.wk&&M.wk<312)&&ab&&ah&&ae&&ag&&Y){w(ah,false);K(function(){ae+="";ag+="";var aj={};if(af&&typeof af===r){for(var al in af){aj[al]=af[al]}}aj.data=ab;aj.width=ae;aj.height=ag;var am={};if(ad&&typeof ad===r){for(var ak in ad){am[ak]=ad[ak]}}if(Z&&typeof Z===r){for(var ai in Z){if(typeof am.flashvars!=D){am.flashvars+="&"+ai+"="+Z[ai]}else{am.flashvars=ai+"="+Z[ai]}}}if(F(Y)){var an=u(aj,am,ah);if(aj.id==ah){w(ah,true)}X.success=true;X.ref=an}else{if(aa&&A()){aj.data=aa;P(aj,am,ah,ac);return}else{w(ah,true)}}if(ac){ac(X)}})}else{if(ac){ac(X)}}},switchOffAutoHideShow:function(){m=false},ua:M,getFlashPlayerVersion:function(){return{major:M.pv[0],minor:M.pv[1],release:M.pv[2]}},hasFlashPlayerVersion:F,createSWF:function(Z,Y,X){if(M.w3){return u(Z,Y,X)}else{return undefined}},showExpressInstall:function(Z,aa,X,Y){if(M.w3&&A()){P(Z,aa,X,Y)}},removeSWF:function(X){if(M.w3){y(X)}},createCSS:function(aa,Z,Y,X){if(M.w3){v(aa,Z,Y,X)}},addDomLoadEvent:K,addLoadEvent:s,getQueryParamValue:function(aa){var Z=j.location.search||j.location.hash;if(Z){if(/\?/.test(Z)){Z=Z.split("?")[1]}if(aa==null){return L(Z)}var Y=Z.split("&");for(var X=0;X<Y.length;X++){if(Y[X].substring(0,Y[X].indexOf("="))==aa){return L(Y[X].substring((Y[X].indexOf("=")+1)))}}}return""},expressInstallCallback:function(){if(a){var X=c(R);if(X&&l){X.parentNode.replaceChild(l,X);if(Q){w(Q,true);if(M.ie&&M.win){l.style.display="block"}}if(E){E(B)}}a=false}}}}();
// Copyright: Hiroshi Ichikawa <http://gimite.net/en/>
// License: New BSD License
// Reference: http://dev.w3.org/html5/websockets/
// Reference: http://tools.ietf.org/html/draft-hixie-thewebsocketprotocol

(function() {
  
  if (window.WebSocket) return;

  var console = window.console;
  if (!console || !console.log || !console.error) {
    console = {log: function(){ }, error: function(){ }};
  }
  
  if (!swfobject.hasFlashPlayerVersion("10.0.0")) {
    console.error("Flash Player >= 10.0.0 is required.");
    return;
  }
  if (location.protocol == "file:") {
    console.error(
      "WARNING: web-socket-js doesn't work in file:///... URL " +
      "unless you set Flash Security Settings properly. " +
      "Open the page via Web server i.e. http://...");
  }

  /**
   * This class represents a faux web socket.
   * @param {string} url
   * @param {array or string} protocols
   * @param {string} proxyHost
   * @param {int} proxyPort
   * @param {string} headers
   */
  WebSocket = function(url, protocols, proxyHost, proxyPort, headers) {
    var self = this;
    self.__id = WebSocket.__nextId++;
    WebSocket.__instances[self.__id] = self;
    self.readyState = WebSocket.CONNECTING;
    self.bufferedAmount = 0;
    self.__events = {};
    if (!protocols) {
      protocols = [];
    } else if (typeof protocols == "string") {
      protocols = [protocols];
    }
    // Uses setTimeout() to make sure __createFlash() runs after the caller sets ws.onopen etc.
    // Otherwise, when onopen fires immediately, onopen is called before it is set.
    setTimeout(function() {
      WebSocket.__addTask(function() {
        WebSocket.__flash.create(
            self.__id, url, protocols, proxyHost || null, proxyPort || 0, headers || null);
      });
    }, 0);
  };

  /**
   * Send data to the web socket.
   * @param {string} data  The data to send to the socket.
   * @return {boolean}  True for success, false for failure.
   */
  WebSocket.prototype.send = function(data) {
    if (this.readyState == WebSocket.CONNECTING) {
      throw "INVALID_STATE_ERR: Web Socket connection has not been established";
    }
    // We use encodeURIComponent() here, because FABridge doesn't work if
    // the argument includes some characters. We don't use escape() here
    // because of this:
    // https://developer.mozilla.org/en/Core_JavaScript_1.5_Guide/Functions#escape_and_unescape_Functions
    // But it looks decodeURIComponent(encodeURIComponent(s)) doesn't
    // preserve all Unicode characters either e.g. "\uffff" in Firefox.
    // Note by wtritch: Hopefully this will not be necessary using ExternalInterface.  Will require
    // additional testing.
    var result = WebSocket.__flash.send(this.__id, encodeURIComponent(data));
    if (result < 0) { // success
      return true;
    } else {
      this.bufferedAmount += result;
      return false;
    }
  };

  /**
   * Close this web socket gracefully.
   */
  WebSocket.prototype.close = function() {
    if (this.readyState == WebSocket.CLOSED || this.readyState == WebSocket.CLOSING) {
      return;
    }
    this.readyState = WebSocket.CLOSING;
    WebSocket.__flash.close(this.__id);
  };

  /**
   * Implementation of {@link <a href="http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-registration">DOM 2 EventTarget Interface</a>}
   *
   * @param {string} type
   * @param {function} listener
   * @param {boolean} useCapture
   * @return void
   */
  WebSocket.prototype.addEventListener = function(type, listener, useCapture) {
    if (!(type in this.__events)) {
      this.__events[type] = [];
    }
    this.__events[type].push(listener);
  };

  /**
   * Implementation of {@link <a href="http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-registration">DOM 2 EventTarget Interface</a>}
   *
   * @param {string} type
   * @param {function} listener
   * @param {boolean} useCapture
   * @return void
   */
  WebSocket.prototype.removeEventListener = function(type, listener, useCapture) {
    if (!(type in this.__events)) return;
    var events = this.__events[type];
    for (var i = events.length - 1; i >= 0; --i) {
      if (events[i] === listener) {
        events.splice(i, 1);
        break;
      }
    }
  };

  /**
   * Implementation of {@link <a href="http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-registration">DOM 2 EventTarget Interface</a>}
   *
   * @param {Event} event
   * @return void
   */
  WebSocket.prototype.dispatchEvent = function(event) {
    var events = this.__events[event.type] || [];
    for (var i = 0; i < events.length; ++i) {
      events[i](event);
    }
    var handler = this["on" + event.type];
    if (handler) handler(event);
  };

  /**
   * Handles an event from Flash.
   * @param {Object} flashEvent
   */
  WebSocket.prototype.__handleEvent = function(flashEvent) {
    if ("readyState" in flashEvent) {
      this.readyState = flashEvent.readyState;
    }
    if ("protocol" in flashEvent) {
      this.protocol = flashEvent.protocol;
    }
    
    var jsEvent;
    if (flashEvent.type == "open" || flashEvent.type == "error") {
      jsEvent = this.__createSimpleEvent(flashEvent.type);
    } else if (flashEvent.type == "close") {
      // TODO implement jsEvent.wasClean
      jsEvent = this.__createSimpleEvent("close");
    } else if (flashEvent.type == "message") {
      var data = decodeURIComponent(flashEvent.message);
      jsEvent = this.__createMessageEvent("message", data);
    } else {
      throw "unknown event type: " + flashEvent.type;
    }
    
    this.dispatchEvent(jsEvent);
  };
  
  WebSocket.prototype.__createSimpleEvent = function(type) {
    if (document.createEvent && window.Event) {
      var event = document.createEvent("Event");
      event.initEvent(type, false, false);
      return event;
    } else {
      return {type: type, bubbles: false, cancelable: false};
    }
  };
  
  WebSocket.prototype.__createMessageEvent = function(type, data) {
    if (document.createEvent && window.MessageEvent && !window.opera) {
      var event = document.createEvent("MessageEvent");
      event.initMessageEvent("message", false, false, data, null, null, window, null);
      return event;
    } else {
      // IE and Opera, the latter one truncates the data parameter after any 0x00 bytes.
      return {type: type, data: data, bubbles: false, cancelable: false};
    }
  };
  
  /**
   * Define the WebSocket readyState enumeration.
   */
  WebSocket.CONNECTING = 0;
  WebSocket.OPEN = 1;
  WebSocket.CLOSING = 2;
  WebSocket.CLOSED = 3;

  WebSocket.__flash = null;
  WebSocket.__instances = {};
  WebSocket.__tasks = [];
  WebSocket.__nextId = 0;
  
  /**
   * Load a new flash security policy file.
   * @param {string} url
   */
  WebSocket.loadFlashPolicyFile = function(url){
    WebSocket.__addTask(function() {
      WebSocket.__flash.loadManualPolicyFile(url);
    });
  };

  /**
   * Loads WebSocketMain.swf and creates WebSocketMain object in Flash.
   */
  WebSocket.__initialize = function() {
    if (WebSocket.__flash) return;
    
    if (WebSocket.__swfLocation) {
      // For backword compatibility.
      window.WEB_SOCKET_SWF_LOCATION = WebSocket.__swfLocation;
    }
    if (!window.WEB_SOCKET_SWF_LOCATION) {
      console.error("[WebSocket] set WEB_SOCKET_SWF_LOCATION to location of WebSocketMain.swf");
      return;
    }
    var container = document.createElement("div");
    container.id = "webSocketContainer";
    // Hides Flash box. We cannot use display: none or visibility: hidden because it prevents
    // Flash from loading at least in IE. So we move it out of the screen at (-100, -100).
    // But this even doesn't work with Flash Lite (e.g. in Droid Incredible). So with Flash
    // Lite, we put it at (0, 0). This shows 1x1 box visible at left-top corner but this is
    // the best we can do as far as we know now.
    container.style.position = "absolute";
    if (WebSocket.__isFlashLite()) {
      container.style.left = "0px";
      container.style.top = "0px";
    } else {
      container.style.left = "-100px";
      container.style.top = "-100px";
    }
    var holder = document.createElement("div");
    holder.id = "webSocketFlash";
    container.appendChild(holder);
    document.body.appendChild(container);
    // See this article for hasPriority:
    // http://help.adobe.com/en_US/as3/mobile/WS4bebcd66a74275c36cfb8137124318eebc6-7ffd.html
    swfobject.embedSWF(
      WEB_SOCKET_SWF_LOCATION,
      "webSocketFlash",
      "1" /* width */,
      "1" /* height */,
      "10.0.0" /* SWF version */,
      null,
      null,
      {hasPriority: true, swliveconnect : true, allowScriptAccess: "always"},
      null,
      function(e) {
        if (!e.success) {
          console.error("[WebSocket] swfobject.embedSWF failed");
        }
      });
  };
  
  /**
   * Called by Flash to notify JS that it's fully loaded and ready
   * for communication.
   */
  WebSocket.__onFlashInitialized = function() {
    // We need to set a timeout here to avoid round-trip calls
    // to flash during the initialization process.
    setTimeout(function() {
      WebSocket.__flash = document.getElementById("webSocketFlash");
      WebSocket.__flash.setCallerUrl(location.href);
      WebSocket.__flash.setDebug(!!window.WEB_SOCKET_DEBUG);
      for (var i = 0; i < WebSocket.__tasks.length; ++i) {
        WebSocket.__tasks[i]();
      }
      WebSocket.__tasks = [];
    }, 0);
  };
  
  /**
   * Called by Flash to notify WebSockets events are fired.
   */
  WebSocket.__onFlashEvent = function() {
    setTimeout(function() {
      try {
        // Gets events using receiveEvents() instead of getting it from event object
        // of Flash event. This is to make sure to keep message order.
        // It seems sometimes Flash events don't arrive in the same order as they are sent.
        var events = WebSocket.__flash.receiveEvents();
        for (var i = 0; i < events.length; ++i) {
          WebSocket.__instances[events[i].webSocketId].__handleEvent(events[i]);
        }
      } catch (e) {
        console.error(e);
      }
    }, 0);
    return true;
  };
  
  // Called by Flash.
  WebSocket.__log = function(message) {
    console.log(decodeURIComponent(message));
  };
  
  // Called by Flash.
  WebSocket.__error = function(message) {
    console.error(decodeURIComponent(message));
  };
  
  WebSocket.__addTask = function(task) {
    if (WebSocket.__flash) {
      task();
    } else {
      WebSocket.__tasks.push(task);
    }
  };
  
  /**
   * Test if the browser is running flash lite.
   * @return {boolean} True if flash lite is running, false otherwise.
   */
  WebSocket.__isFlashLite = function() {
    if (!window.navigator || !window.navigator.mimeTypes) {
      return false;
    }
    var mimeType = window.navigator.mimeTypes["application/x-shockwave-flash"];
    if (!mimeType || !mimeType.enabledPlugin || !mimeType.enabledPlugin.filename) {
      return false;
    }
    return mimeType.enabledPlugin.filename.match(/flashlite/i) ? true : false;
  };
  
  if (!window.WEB_SOCKET_DISABLE_AUTO_INITIALIZATION) {
    if (window.addEventListener) {
      window.addEventListener("load", function(){
        WebSocket.__initialize();
      }, false);
    } else {
      window.attachEvent("onload", function(){
        WebSocket.__initialize();
      });
    }
  }
  
})();


(function() {
  var RTM, Request, System, default_cb, error, getCookie, getPort, log, send, sendHeartbeat, setCookie, setupAPI, start, validLevel;
  window.SS = {
    started: null,
    env: null,
    client: {},
    server: {},
    shared: {},
    models: {},
    internal: {
      cb_stack: {}
    },
    config: {
      log: {
        level: 0
      }
    }
  };
  SS.events = {
    _events: {},
    on: function(name, funct) {
      if (this._events[name] == null) {
        this._events[name] = [];
      }
      return this._events[name].push(funct);
    },
    emit: function(name, params) {
      var event, _i, _len, _ref, _results;
      if (this._events[name]) {
        _ref = this._events[name];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          event = _ref[_i];
          _results.push(event(params));
        }
        return _results;
      } else {
        return console.error("Error: Received incoming '" + name + "' event but no event handlers registered");
      }
    }
  };
  getPort = function() {
    if (document.location.port.length === 0) {
      if (document.location.protocol === 'https:') {
        return 443;
      } else {
        return 80;
      }
    } else {
      return document.location.port;
    }
  };
  SS.socket = new io.Socket(document.location.hostname, {
    port: getPort(),
    rememberTransport: false,
    secure: document.location.protocol === 'https:',
    transports: ['websocket', 'flashsocket'],
    tryTransportsOnConnectTimeout: false
  });
  SS.socket.on('message', function(raw) {
    var data;
    data = JSON.parse(raw);
    if (data.type) {
      if (Request[data.type] != null) {
        return Request[data.type](data);
      } else {
        return console.error("Error: Unable to find a message handler for '" + data.type + "' requests! Dropping message");
      }
    } else {
      return console.error("Error: No message type specified. Dropping message");
    }
  });
  SS.socket.on('disconnect', function() {
    var attemptReconnection;
    attemptReconnection = function() {
      if (!SS.socket.connecting) {
        SS.socket.connect();
      }
      return setTimeout(arguments.callee, 500);
    };
    return attemptReconnection();
  });
  SS.socket.connect();
  default_cb = function(server_response) {
    return console.log(server_response);
  };
  SS.internal.remote = function() {
    var args, cb, last_arg, msg;
    args = arguments;
    msg = {
      type: 'server'
    };
    msg.method = args[0];
    if (SS.config.remote_prefix) {
      msg.method = "" + SS.config.remote_prefix + "." + msg.method;
    }
    msg.params = args[1];
    msg.options = args.length >= 4 ? args[2] : null;
    last_arg = args[args.length - 1];
    cb = typeof last_arg === 'function' ? last_arg : default_cb;
    cb.options = msg.options;
    if (validLevel(4) && !(msg.options && msg.options.silent)) {
      console.log('<- ' + msg.method);
    }
    return send(msg, cb);
  };
  RTM = (function() {
    function RTM() {}
    RTM.prototype.findById = function(id, cb) {
      return this._send('findById', id, cb);
    };
    RTM.prototype.find = function() {
      var arg, args, cb, _i, _len;
      args = [];
      for (_i = 0, _len = arguments.length; _i < _len; _i++) {
        arg = arguments[_i];
        args.push(arg);
      }
      cb = args.pop();
      return this._send('find', args, cb);
    };
    RTM.prototype._send = function(action, params, cb) {
      log(2, "<~ " + this.name + "." + action);
      return send({
        type: 'rtm',
        rtm: this.name,
        action: action,
        params: params
      }, cb);
    };
    return RTM;
  })();
  System = {
    init: function(data) {
      var name, _i, _len, _ref;
      SS.env = data.env;
      SS.config = data.config || {};
      setCookie('session_id', data.session_id);
      _ref = data.api.models;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        name = _ref[_i];
        SS.models[name] = new RTM;
        SS.models[name].name = name;
      }
      eval('SS.server = ' + data.api.server);
      setupAPI(SS.server, []);
      SS.socket.ready = true;
      if (data.heartbeat) {
        sendHeartbeat();
      }
      return start();
    },
    error: function(details) {
      return error('SocketStream Server - ' + details);
    }
  };
  Request = {
    system: function(data) {
      return System[data.method](data.params);
    },
    server: function(data) {
      var cb, silent;
      cb = SS.internal.cb_stack[data.cb_id];
      silent = cb.msg.options && cb.msg.options.silent;
      if (!silent) {
        log(2, '-> ' + cb.msg.method, data.params);
      }
      cb.funkt(data.params);
      return delete SS.internal.cb_stack[data.cb_id];
    },
    event: function(data) {
      log(2, "=> " + data.event);
      return SS.events.emit(data.event, data.params);
    },
    rtm: function(data) {
      var cb;
      cb = SS.internal.cb_stack[data.cb_id];
      log(2, "~> " + cb.msg.rtm + "." + cb.msg.action);
      cb.funkt(data.data);
      return delete SS.internal.cb_stack[data.cb_id];
    }
  };
  start = function() {
    if (!SS.started) {
      if ($) {
        $(document).ready(function() {
          try {
            return SS.client.app.init();
          } catch (e) {
            return app.init();
          }
        });
      } else {
        app.init();
      }
      return SS.started = new Date;
    }
  };
  send = function(msg, cb) {
    var args, cb_id, recursive, retry_ms;
    if (cb == null) {
      cb = null;
    }
    args = arguments;
    try {
      if (SS.socket.connected === false && SS.socket.connecting === false) {
        SS.socket.ready = false;
        SS.socket.connect();
        throw 'NOT_READY';
      } else {
        if (SS.socket.ready === true) {
          if (cb) {
            cb_id = Math.random().toString().split('.')[1];
            SS.internal.cb_stack[cb_id] = {
              funkt: cb,
              msg: msg
            };
            msg.cb_id = cb_id;
          }
          msg = JSON.stringify(msg);
          SS.socket.send(msg);
        } else {
          throw 'NOT_READY';
        }
      }
    } catch (e) {
      if (e === 'NOT_READY') {
        retry_ms = 50;
        recursive = function() {
          return send.apply(this, args);
        };
        setTimeout(recursive, retry_ms);
      } else {
        throw e;
      }
    }
    return;
  };
  log = function(level, msg, params) {
    var o;
    if (validLevel(level)) {
      o = [msg];
      if (params && validLevel(3)) {
        o.push(params);
      }
      return console.log.apply(console, o);
    }
  };
  error = function(e) {
    if (validLevel(1)) {
      return console.error(e);
    }
  };
  validLevel = function(level) {
    return SS.config.log.level >= level;
  };
  setupAPI = function(root, ary) {
    var key, ns, value, _results;
    _results = [];
    for (key in root) {
      value = root[key];
      ns = ary.slice(0);
      ns.push(key);
      _results.push(typeof value === 'object' ? setupAPI(root[key], ns) : root[key] = new Function('SS.internal.remote.apply(window, ["' + ns.join('.') + '"].concat(Array.prototype.slice.call(arguments, 0)))'));
    }
    return _results;
  };
  sendHeartbeat = function() {
    if (SS.socket.connected) {
      send({
        type: 'heartbeat'
      });
    }
    return setTimeout(arguments.callee, SS.config.heartbeat_interval * 1000);
  };
  getCookie = function(c_name) {
    var c_end, c_start;
    if (document.cookie.length > 0) {
      c_start = document.cookie.indexOf(c_name + "=");
      if (c_start !== -1) {
        c_start = c_start + c_name.length + 1;
        c_end = document.cookie.indexOf(";", c_start);
        if (c_end === -1) {
          c_end = document.cookie.length;
        }
        return unescape(document.cookie.substring(c_start, c_end));
      }
    }
    return "";
  };
  setCookie = function(c_name, value, expiredays) {
    var exdate;
    exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    return document.cookie = ("" + c_name + "=" + (escape(value))) + (expiredays === null ? "" : ";expires=" + exdate.toUTCString());
  };
}).call(this);

