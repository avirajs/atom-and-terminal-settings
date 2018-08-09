(function() {
  var $, ScrollView, SlackChatView, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require('atom-space-pen-views'), $ = ref.$, ScrollView = ref.ScrollView;

  module.exports = SlackChatView = (function(superClass) {
    extend(SlackChatView, superClass);

    function SlackChatView() {
      return SlackChatView.__super__.constructor.apply(this, arguments);
    }

    SlackChatView.content = function() {
      return this.div({
        "class": 'slack-wrapper'
      }, (function(_this) {
        return function() {
          return _this.div({
            id: 'content',
            outlet: 'content'
          });
        };
      })(this));
    };

    SlackChatView.prototype.initialize = function(stateController, client) {
      this.stateController = stateController;
      this.client = client;
    };

    SlackChatView.prototype.addView = function(view) {
      return this.content.append(view);
    };

    SlackChatView.prototype.clearViews = function() {
      return this.content.empty();
    };

    return SlackChatView;

  })(ScrollView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYXZpcmFqcy8uYXRvbS9wYWNrYWdlcy9zbGFjay1jaGF0L2xpYi92aWV3cy9zbGFjay1jaGF0LXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBO0FBQUEsTUFBQSxpQ0FBQTtJQUFBOzs7RUFBQSxNQUFrQixPQUFBLENBQVEsc0JBQVIsQ0FBbEIsRUFBQyxTQUFELEVBQUk7O0VBRUosTUFBTSxDQUFDLE9BQVAsR0FDTTs7Ozs7OztJQUNKLGFBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7UUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLGVBQVA7T0FBTCxFQUE2QixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQzNCLEtBQUMsQ0FBQSxHQUFELENBQUs7WUFBQSxFQUFBLEVBQUksU0FBSjtZQUFlLE1BQUEsRUFBUSxTQUF2QjtXQUFMO1FBRDJCO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE3QjtJQURROzs0QkFJVixVQUFBLEdBQVksU0FBQyxlQUFELEVBQW1CLE1BQW5CO01BQUMsSUFBQyxDQUFBLGtCQUFEO01BQWtCLElBQUMsQ0FBQSxTQUFEO0lBQW5COzs0QkFHWixPQUFBLEdBQVMsU0FBQyxJQUFEO2FBQ1AsSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUFULENBQWdCLElBQWhCO0lBRE87OzRCQUlULFVBQUEsR0FBWSxTQUFBO2FBQ1YsSUFBQyxDQUFBLE9BQU8sQ0FBQyxLQUFULENBQUE7SUFEVTs7OztLQVpjO0FBSDVCIiwic291cmNlc0NvbnRlbnQiOlsiXG57JCwgU2Nyb2xsVmlld30gPSByZXF1aXJlICdhdG9tLXNwYWNlLXBlbi12aWV3cydcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgU2xhY2tDaGF0VmlldyBleHRlbmRzIFNjcm9sbFZpZXdcbiAgQGNvbnRlbnQ6IC0+XG4gICAgQGRpdiBjbGFzczogJ3NsYWNrLXdyYXBwZXInLCA9PlxuICAgICAgQGRpdiBpZDogJ2NvbnRlbnQnLCBvdXRsZXQ6ICdjb250ZW50J1xuXG4gIGluaXRpYWxpemU6IChAc3RhdGVDb250cm9sbGVyLCBAY2xpZW50KSAtPlxuXG4gICMgQWRkIGEgdmlldyB0byB0aGUgc2xhY2std3JhcHBlclxuICBhZGRWaWV3OiAodmlldykgLT5cbiAgICBAY29udGVudC5hcHBlbmQgdmlld1xuXG4gICMgQ2xlYXIgb3V0IGFsbCB2aWV3cyB0aGF0IG1pZ2h0IGJlIGF0dGFjaGVkIHRvIHRoZSBzbGFjay13cmFwcGVyXG4gIGNsZWFyVmlld3M6IC0+XG4gICAgQGNvbnRlbnQuZW1wdHkoKVxuXG5cbiJdfQ==
