(function() {
  var $, ChannelView, View, ref,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require('atom-space-pen-views'), $ = ref.$, View = ref.View;

  module.exports = ChannelView = (function(superClass) {
    extend(ChannelView, superClass);

    function ChannelView() {
      this.eventHandlers = bind(this.eventHandlers, this);
      return ChannelView.__super__.constructor.apply(this, arguments);
    }

    ChannelView.content = function(stateController, channel) {
      this.stateController = stateController;
      this.channel = channel;
      return this.li({
        id: this.channel.id,
        "class": 'channel',
        outlet: 'converations'
      }, (function(_this) {
        return function() {
          _this.span("#", {
            "class": 'indicator'
          });
          return _this.span(_this.channel.name);
        };
      })(this));
    };

    ChannelView.prototype.initialize = function(stateController, channel) {
      this.stateController = stateController;
      this.channel = channel;
      return this.eventHandlers();
    };

    ChannelView.prototype.eventHandlers = function() {
      return this.on('click', (function(_this) {
        return function() {
          return _this.showConversation();
        };
      })(this));
    };

    ChannelView.prototype.showConversation = function() {
      $("#" + this.channel.id).removeClass('unread');
      return this.stateController.setState('chat', this.channel);
    };

    return ChannelView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYXZpcmFqcy8uYXRvbS9wYWNrYWdlcy9zbGFjay1jaGF0L2xpYi92aWV3cy9jb252ZXJzYXRpb25zL2NoYW5uZWwtdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0E7QUFBQSxNQUFBLHlCQUFBO0lBQUE7Ozs7RUFBQSxNQUFZLE9BQUEsQ0FBUSxzQkFBUixDQUFaLEVBQUMsU0FBRCxFQUFJOztFQUVKLE1BQU0sQ0FBQyxPQUFQLEdBQ007Ozs7Ozs7O0lBQ0osV0FBQyxDQUFBLE9BQUQsR0FBVSxTQUFDLGVBQUQsRUFBbUIsT0FBbkI7TUFBQyxJQUFDLENBQUEsa0JBQUQ7TUFBa0IsSUFBQyxDQUFBLFVBQUQ7YUFDM0IsSUFBQyxDQUFBLEVBQUQsQ0FBSTtRQUFBLEVBQUEsRUFBSSxJQUFDLENBQUEsT0FBTyxDQUFDLEVBQWI7UUFBaUIsQ0FBQSxLQUFBLENBQUEsRUFBTyxTQUF4QjtRQUFtQyxNQUFBLEVBQVEsY0FBM0M7T0FBSixFQUErRCxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7VUFDN0QsS0FBQyxDQUFBLElBQUQsQ0FBTSxHQUFOLEVBQVc7WUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLFdBQVA7V0FBWDtpQkFDQSxLQUFDLENBQUEsSUFBRCxDQUFNLEtBQUMsQ0FBQSxPQUFPLENBQUMsSUFBZjtRQUY2RDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBL0Q7SUFEUTs7MEJBS1YsVUFBQSxHQUFZLFNBQUMsZUFBRCxFQUFtQixPQUFuQjtNQUFDLElBQUMsQ0FBQSxrQkFBRDtNQUFrQixJQUFDLENBQUEsVUFBRDthQUM3QixJQUFDLENBQUEsYUFBRCxDQUFBO0lBRFU7OzBCQUdaLGFBQUEsR0FBZSxTQUFBO2FBQ2IsSUFBQyxDQUFDLEVBQUYsQ0FBSyxPQUFMLEVBQWMsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUNaLEtBQUMsQ0FBQSxnQkFBRCxDQUFBO1FBRFk7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWQ7SUFEYTs7MEJBS2YsZ0JBQUEsR0FBa0IsU0FBQTtNQUVoQixDQUFBLENBQUUsR0FBQSxHQUFJLElBQUMsQ0FBQSxPQUFPLENBQUMsRUFBZixDQUFvQixDQUFDLFdBQXJCLENBQWlDLFFBQWpDO2FBQ0EsSUFBQyxDQUFBLGVBQWUsQ0FBQyxRQUFqQixDQUEwQixNQUExQixFQUFrQyxJQUFDLENBQUEsT0FBbkM7SUFIZ0I7Ozs7S0FkTTtBQUgxQiIsInNvdXJjZXNDb250ZW50IjpbIlxueyQsIFZpZXd9ID0gcmVxdWlyZSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIENoYW5uZWxWaWV3IGV4dGVuZHMgVmlld1xuICBAY29udGVudDogKEBzdGF0ZUNvbnRyb2xsZXIsIEBjaGFubmVsKSAtPlxuICAgIEBsaSBpZDogQGNoYW5uZWwuaWQsIGNsYXNzOiAnY2hhbm5lbCcsIG91dGxldDogJ2NvbnZlcmF0aW9ucycsID0+XG4gICAgICBAc3BhbiBcIiNcIiwgY2xhc3M6ICdpbmRpY2F0b3InXG4gICAgICBAc3BhbiBAY2hhbm5lbC5uYW1lXG5cbiAgaW5pdGlhbGl6ZTogKEBzdGF0ZUNvbnRyb2xsZXIsIEBjaGFubmVsKSAtPlxuICAgIEBldmVudEhhbmRsZXJzKClcblxuICBldmVudEhhbmRsZXJzOiA9PlxuICAgIEAub24gJ2NsaWNrJywgPT5cbiAgICAgIEBzaG93Q29udmVyc2F0aW9uKClcblxuICAjIFNob3cgY29udmVyc2F0aW9uIHdoZW4gYSBjaGFubmVsIGlzIHNlbGVjdGVkXG4gIHNob3dDb252ZXJzYXRpb246ICgpIC0+XG4gICAgIyBNYXJrIGFzIHJlYWQgYW5kIGVudGVyIHRoZSBjaGF0IHN0YXRlIGZvciB0aGlzIGNoYW5uZWxcbiAgICAkKFwiIyN7QGNoYW5uZWwuaWR9XCIpLnJlbW92ZUNsYXNzKCd1bnJlYWQnKVxuICAgIEBzdGF0ZUNvbnRyb2xsZXIuc2V0U3RhdGUoJ2NoYXQnLCBAY2hhbm5lbClcbiJdfQ==
