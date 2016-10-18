"use strict";

function bind(func, context) {
  return function(event) {
    return func.call(context, event);
  }
}
