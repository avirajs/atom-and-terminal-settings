(function() {
  var log, warn,
    slice = [].slice;

  log = function() {
    var args;
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    return console.log.apply(console, args);
  };

  warn = function() {
    var args;
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    return console.warn.apply(console, args);
  };

  module.exports = {
    log: log,
    warn: warn
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYXZpcmFqcy8uYXRvbS9wYWNrYWdlcy9maWxlLXdhdGNoZXIvbGliL3V0aWxzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsU0FBQTtJQUFBOztFQUFBLEdBQUEsR0FBTSxTQUFBO0FBQ0osUUFBQTtJQURLO1dBQ0wsT0FBTyxDQUFDLEdBQVIsZ0JBQVksSUFBWjtFQURJOztFQUdOLElBQUEsR0FBTyxTQUFBO0FBQ0wsUUFBQTtJQURNO1dBQ04sT0FBTyxDQUFDLElBQVIsZ0JBQWEsSUFBYjtFQURLOztFQUdQLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0lBQUMsS0FBQSxHQUFEO0lBQU0sTUFBQSxJQUFOOztBQU5qQiIsInNvdXJjZXNDb250ZW50IjpbImxvZyA9IChhcmdzLi4uKSAtPlxuICBjb25zb2xlLmxvZyBhcmdzLi4uXG5cbndhcm4gPSAoYXJncy4uLikgLT5cbiAgY29uc29sZS53YXJuIGFyZ3MuLi5cblxubW9kdWxlLmV4cG9ydHMgPSB7bG9nLCB3YXJufVxuIl19
