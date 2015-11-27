// Simplified jQuery.extend, based on from:
// https://github.com/jquery/jquery/blob/22449eb968622c2e14d6c8d8de2cf1e1ba4adccd/src/core.js#L118-L185
export function extend() {
  var options, name, src, copy, copyIsArray, clone,
    target = arguments[0] || {},
    i = 1,
    length = arguments.length,
    deep = false;
  // Handle a deep copy situation
  if (typeof target === "boolean") {
    deep = target;
    // Skip the boolean and the target
    target = arguments[i] || {};
    i++;
  }
  // Handle case when target is a string or something (possible in deep copy)
  if (typeof target !== "object") {
    target = {};
  }
  for (; i < length; i++) {
    // Only deal with non-null/undefined values
    if (( options = arguments[i] ) != null) {
      // Extend the base object
      for (name in options) {
        src = target[name];
        copy = options[name];
        // Prevent never-ending loop
        if (target === copy) {
          continue;
        }
        // Recurse if we're merging plain objects or arrays
        if (deep && copy && (isPlainObject(copy) ||
          (copyIsArray = Array.isArray(copy)))) {
          if (copyIsArray) {
            copyIsArray = false;
            clone = src && Array.isArray(src) ? src : [];
          } else {
            clone = src && isPlainObject(src) ? src : {};
          }
          // Never move original objects, clone them
          target[name] = extend(deep, clone, copy);
          // Don't bring in undefined values
        } else if (copy !== undefined) {
          target[name] = copy;
        }
      }
    }
  }
  // Return the modified object
  return target;
}

// Same as extend, but passing true as a first parameter.
export function deepExtend() {
  var args = Array.prototype.slice.call(arguments);
  args.unshift(true);
  return extend.apply(null, args);
}

window.ext = extend;

function isPlainObject(obj) {
  return typeof obj === "object";
}

