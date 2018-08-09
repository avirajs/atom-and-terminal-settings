(function() {
  var $, ChatMessageView, View, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require('atom-space-pen-views'), $ = ref.$, View = ref.View;

  module.exports = ChatMessageView = (function(superClass) {
    extend(ChatMessageView, superClass);

    function ChatMessageView() {
      return ChatMessageView.__super__.constructor.apply(this, arguments);
    }

    ChatMessageView.content = function(author, message) {
      var image, name;
      this.author = author;
      this.message = message;
      image = this.author != null ? this.author.profile.image_32 : this.message.icons.image_64;
      name = this.author != null ? this.author.name : this.message.username;
      return this.div({
        "class": 'message native-key-bindings'
      }, (function(_this) {
        return function() {
          return _this.table(function() {
            _this.tr(function() {
              _this.td(function() {
                return _this.img({
                  "class": 'image',
                  src: image
                });
              });
              return _this.td(function() {
                _this.span({
                  "class": 'name'
                }, name);
                return _this.span({
                  "class": 'ts'
                }, _this.message.ts);
              });
            });
            return _this.tr(function() {
              _this.td('');
              return _this.td(function() {
                return _this.div(_this.message.text, {
                  "class": 'text'
                });
              });
            });
          });
        };
      })(this));
    };

    ChatMessageView.prototype.initialize = function(stateController, chat, message) {
      this.stateController = stateController;
      this.chat = chat;
      this.message = message;
    };

    return ChatMessageView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYXZpcmFqcy8uYXRvbS9wYWNrYWdlcy9zbGFjay1jaGF0L2xpYi92aWV3cy9jaGF0L2NoYXQtbWVzc2FnZS12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQTtBQUFBLE1BQUEsNkJBQUE7SUFBQTs7O0VBQUEsTUFBWSxPQUFBLENBQVEsc0JBQVIsQ0FBWixFQUFDLFNBQUQsRUFBSTs7RUFFSixNQUFNLENBQUMsT0FBUCxHQUNNOzs7Ozs7O0lBQ0osZUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFDLE1BQUQsRUFBVSxPQUFWO0FBQ1IsVUFBQTtNQURTLElBQUMsQ0FBQSxTQUFEO01BQVMsSUFBQyxDQUFBLFVBQUQ7TUFDbEIsS0FBQSxHQUFXLG1CQUFILEdBQWlCLElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQWpDLEdBQStDLElBQUMsQ0FBQSxPQUFPLENBQUMsS0FBSyxDQUFDO01BQ3RFLElBQUEsR0FBVSxtQkFBSCxHQUFpQixJQUFDLENBQUEsTUFBTSxDQUFDLElBQXpCLEdBQW1DLElBQUMsQ0FBQSxPQUFPLENBQUM7YUFDbkQsSUFBQyxDQUFBLEdBQUQsQ0FBSztRQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sNkJBQVA7T0FBTCxFQUEyQyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQ3pDLEtBQUMsQ0FBQSxLQUFELENBQU8sU0FBQTtZQUNMLEtBQUMsQ0FBQSxFQUFELENBQUksU0FBQTtjQUNGLEtBQUMsQ0FBQSxFQUFELENBQUksU0FBQTt1QkFDRixLQUFDLENBQUEsR0FBRCxDQUFLO2tCQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sT0FBUDtrQkFBZ0IsR0FBQSxFQUFLLEtBQXJCO2lCQUFMO2NBREUsQ0FBSjtxQkFFQSxLQUFDLENBQUEsRUFBRCxDQUFJLFNBQUE7Z0JBQ0YsS0FBQyxDQUFBLElBQUQsQ0FBTTtrQkFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLE1BQVA7aUJBQU4sRUFBcUIsSUFBckI7dUJBQ0EsS0FBQyxDQUFBLElBQUQsQ0FBTTtrQkFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLElBQVA7aUJBQU4sRUFBbUIsS0FBQyxDQUFBLE9BQU8sQ0FBQyxFQUE1QjtjQUZFLENBQUo7WUFIRSxDQUFKO21CQU1BLEtBQUMsQ0FBQSxFQUFELENBQUksU0FBQTtjQUNGLEtBQUMsQ0FBQSxFQUFELENBQUksRUFBSjtxQkFDQSxLQUFDLENBQUEsRUFBRCxDQUFJLFNBQUE7dUJBQ0YsS0FBQyxDQUFBLEdBQUQsQ0FBSyxLQUFDLENBQUEsT0FBTyxDQUFDLElBQWQsRUFBb0I7a0JBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxNQUFQO2lCQUFwQjtjQURFLENBQUo7WUFGRSxDQUFKO1VBUEssQ0FBUDtRQUR5QztNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBM0M7SUFIUTs7OEJBaUJWLFVBQUEsR0FBWSxTQUFDLGVBQUQsRUFBbUIsSUFBbkIsRUFBMEIsT0FBMUI7TUFBQyxJQUFDLENBQUEsa0JBQUQ7TUFBa0IsSUFBQyxDQUFBLE9BQUQ7TUFBTyxJQUFDLENBQUEsVUFBRDtJQUExQjs7OztLQWxCZ0I7QUFIOUIiLCJzb3VyY2VzQ29udGVudCI6WyJcbnskLCBWaWV3fSA9IHJlcXVpcmUgJ2F0b20tc3BhY2UtcGVuLXZpZXdzJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBDaGF0TWVzc2FnZVZpZXcgZXh0ZW5kcyBWaWV3XG4gIEBjb250ZW50OiAoQGF1dGhvciwgQG1lc3NhZ2UpIC0+XG4gICAgaW1hZ2UgPSBpZiBAYXV0aG9yPyB0aGVuIEBhdXRob3IucHJvZmlsZS5pbWFnZV8zMiBlbHNlIEBtZXNzYWdlLmljb25zLmltYWdlXzY0XG4gICAgbmFtZSA9IGlmIEBhdXRob3I/IHRoZW4gQGF1dGhvci5uYW1lIGVsc2UgQG1lc3NhZ2UudXNlcm5hbWVcbiAgICBAZGl2IGNsYXNzOiAnbWVzc2FnZSBuYXRpdmUta2V5LWJpbmRpbmdzJywgPT5cbiAgICAgIEB0YWJsZSA9PlxuICAgICAgICBAdHIgPT5cbiAgICAgICAgICBAdGQgPT5cbiAgICAgICAgICAgIEBpbWcgY2xhc3M6ICdpbWFnZScsIHNyYzogaW1hZ2VcbiAgICAgICAgICBAdGQgPT5cbiAgICAgICAgICAgIEBzcGFuIGNsYXNzOiAnbmFtZScsIG5hbWVcbiAgICAgICAgICAgIEBzcGFuIGNsYXNzOiAndHMnLCBAbWVzc2FnZS50c1xuICAgICAgICBAdHIgPT5cbiAgICAgICAgICBAdGQgJydcbiAgICAgICAgICBAdGQgPT5cbiAgICAgICAgICAgIEBkaXYgQG1lc3NhZ2UudGV4dCwgY2xhc3M6ICd0ZXh0J1xuXG5cbiAgaW5pdGlhbGl6ZTogKEBzdGF0ZUNvbnRyb2xsZXIsIEBjaGF0LCBAbWVzc2FnZSkgLT5cbiJdfQ==
