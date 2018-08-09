(function() {
  var $, MemberView, View, ref,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require('atom-space-pen-views'), $ = ref.$, View = ref.View;

  module.exports = MemberView = (function(superClass) {
    extend(MemberView, superClass);

    function MemberView() {
      this.refresh = bind(this.refresh, this);
      this.eventHandlers = bind(this.eventHandlers, this);
      return MemberView.__super__.constructor.apply(this, arguments);
    }

    MemberView.content = function(stateController, member) {
      this.stateController = stateController;
      this.member = member;
      return this.li({
        id: this.member.channel.id,
        "class": 'member',
        outlet: 'conversation'
      }, (function(_this) {
        return function() {
          _this.span({
            "class": "dot " + _this.member.presence,
            outlet: 'presence'
          });
          return _this.span(_this.member.name);
        };
      })(this));
    };

    MemberView.prototype.initialize = function(stateController, member) {
      this.stateController = stateController;
      this.member = member;
      return this.eventHandlers();
    };

    MemberView.prototype.eventHandlers = function() {
      return this.on('click', (function(_this) {
        return function() {
          return _this.showConversation();
        };
      })(this));
    };

    MemberView.prototype.showConversation = function() {
      $("#" + this.member.channel.id).removeClass('unread');
      return this.stateController.setState('chat', this.member);
    };

    MemberView.prototype.refresh = function() {
      var presence;
      this.eventHandlers();
      presence = this.stateController.team.memberWithId(this.member.id).presence;
      return this.presence.removeClass('active away').addClass(presence);
    };

    return MemberView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYXZpcmFqcy8uYXRvbS9wYWNrYWdlcy9zbGFjay1jaGF0L2xpYi92aWV3cy9jb252ZXJzYXRpb25zL21lbWJlci12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQTtBQUFBLE1BQUEsd0JBQUE7SUFBQTs7OztFQUFBLE1BQVksT0FBQSxDQUFRLHNCQUFSLENBQVosRUFBQyxTQUFELEVBQUk7O0VBRUosTUFBTSxDQUFDLE9BQVAsR0FDTTs7Ozs7Ozs7O0lBQ0osVUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFDLGVBQUQsRUFBbUIsTUFBbkI7TUFBQyxJQUFDLENBQUEsa0JBQUQ7TUFBa0IsSUFBQyxDQUFBLFNBQUQ7YUFDM0IsSUFBQyxDQUFBLEVBQUQsQ0FBSTtRQUFBLEVBQUEsRUFBSSxJQUFDLENBQUEsTUFBTSxDQUFDLE9BQU8sQ0FBQyxFQUFwQjtRQUF3QixDQUFBLEtBQUEsQ0FBQSxFQUFPLFFBQS9CO1FBQXlDLE1BQUEsRUFBUSxjQUFqRDtPQUFKLEVBQXNFLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtVQUNwRSxLQUFDLENBQUEsSUFBRCxDQUFNO1lBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxNQUFBLEdBQU8sS0FBQyxDQUFBLE1BQU0sQ0FBQyxRQUF0QjtZQUFrQyxNQUFBLEVBQVEsVUFBMUM7V0FBTjtpQkFDQSxLQUFDLENBQUEsSUFBRCxDQUFNLEtBQUMsQ0FBQSxNQUFNLENBQUMsSUFBZDtRQUZvRTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBdEU7SUFEUTs7eUJBS1YsVUFBQSxHQUFZLFNBQUMsZUFBRCxFQUFtQixNQUFuQjtNQUFDLElBQUMsQ0FBQSxrQkFBRDtNQUFrQixJQUFDLENBQUEsU0FBRDthQUM3QixJQUFDLENBQUEsYUFBRCxDQUFBO0lBRFU7O3lCQUdaLGFBQUEsR0FBZSxTQUFBO2FBQ2IsSUFBQyxDQUFDLEVBQUYsQ0FBSyxPQUFMLEVBQWMsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUNaLEtBQUMsQ0FBQSxnQkFBRCxDQUFBO1FBRFk7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWQ7SUFEYTs7eUJBS2YsZ0JBQUEsR0FBa0IsU0FBQTtNQUVoQixDQUFBLENBQUUsR0FBQSxHQUFJLElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBTyxDQUFDLEVBQXRCLENBQTJCLENBQUMsV0FBNUIsQ0FBd0MsUUFBeEM7YUFDQSxJQUFDLENBQUEsZUFBZSxDQUFDLFFBQWpCLENBQTBCLE1BQTFCLEVBQWtDLElBQUMsQ0FBQSxNQUFuQztJQUhnQjs7eUJBTWxCLE9BQUEsR0FBUyxTQUFBO0FBQ1AsVUFBQTtNQUFBLElBQUMsQ0FBQSxhQUFELENBQUE7TUFDQSxRQUFBLEdBQVcsSUFBQyxDQUFBLGVBQWUsQ0FBQyxJQUFJLENBQUMsWUFBdEIsQ0FBbUMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxFQUEzQyxDQUE4QyxDQUFDO2FBQzFELElBQUMsQ0FBQSxRQUFRLENBQUMsV0FBVixDQUFzQixhQUF0QixDQUFvQyxDQUFDLFFBQXJDLENBQThDLFFBQTlDO0lBSE87Ozs7S0FwQmM7QUFIekIiLCJzb3VyY2VzQ29udGVudCI6WyJcbnskLCBWaWV3fSA9IHJlcXVpcmUgJ2F0b20tc3BhY2UtcGVuLXZpZXdzJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBNZW1iZXJWaWV3IGV4dGVuZHMgVmlld1xuICBAY29udGVudDogKEBzdGF0ZUNvbnRyb2xsZXIsIEBtZW1iZXIpIC0+XG4gICAgQGxpIGlkOiBAbWVtYmVyLmNoYW5uZWwuaWQsIGNsYXNzOiAnbWVtYmVyJywgb3V0bGV0OiAnY29udmVyc2F0aW9uJywgID0+XG4gICAgICBAc3BhbiBjbGFzczogXCJkb3QgI3tAbWVtYmVyLnByZXNlbmNlfVwiLCBvdXRsZXQ6ICdwcmVzZW5jZSdcbiAgICAgIEBzcGFuIEBtZW1iZXIubmFtZVxuXG4gIGluaXRpYWxpemU6IChAc3RhdGVDb250cm9sbGVyLCBAbWVtYmVyKSAtPlxuICAgIEBldmVudEhhbmRsZXJzKClcblxuICBldmVudEhhbmRsZXJzOiA9PlxuICAgIEAub24gJ2NsaWNrJywgPT5cbiAgICAgIEBzaG93Q29udmVyc2F0aW9uKClcblxuICAjIFNob3cgY29udmVyc2F0aW9uIHdoZW4gYSBtZW1iZXIgaXMgc2VsZWN0ZWRcbiAgc2hvd0NvbnZlcnNhdGlvbjogKCkgLT5cbiAgICAjIE1hcmsgYXMgcmVhZCBhbmQgZW50ZXIgdGhlIGNoYXQgc3RhdGUgZm9yIHRoaXMgbWVtYmVyXG4gICAgJChcIiMje0BtZW1iZXIuY2hhbm5lbC5pZH1cIikucmVtb3ZlQ2xhc3MoJ3VucmVhZCcpXG4gICAgQHN0YXRlQ29udHJvbGxlci5zZXRTdGF0ZSgnY2hhdCcsIEBtZW1iZXIpXG5cbiAgIyBSZWZyZXNoIHRoZSBtZW1iZXIgdmlldyAod2hlbiB0aGUgc3RhdGUgaGFzIGNoYW5nZWQpXG4gIHJlZnJlc2g6ID0+XG4gICAgQGV2ZW50SGFuZGxlcnMoKSAjIHVwZGF0ZSBldmVudCBoYW5kbGVyc1xuICAgIHByZXNlbmNlID0gQHN0YXRlQ29udHJvbGxlci50ZWFtLm1lbWJlcldpdGhJZChAbWVtYmVyLmlkKS5wcmVzZW5jZSAjIEFxdWlyZSB0aGUgbWVtYmVyJ3MgcHJlc2VuY2VcbiAgICBAcHJlc2VuY2UucmVtb3ZlQ2xhc3MoJ2FjdGl2ZSBhd2F5JykuYWRkQ2xhc3MocHJlc2VuY2UpICMgU2V0IHRoZSBhY3RpdmUvYXdheSBjbGFzcyBmb3IgdGhlIG1lbWJlclxuXG4iXX0=
