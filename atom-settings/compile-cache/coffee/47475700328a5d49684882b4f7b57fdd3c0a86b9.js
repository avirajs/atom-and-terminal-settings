(function() {
  var $, ChannelView, ConversationView, MemberView, ScrollView, ref,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ChannelView = require('./conversations/channel-view');

  MemberView = require('./conversations/member-view');

  ref = require('atom-space-pen-views'), $ = ref.$, ScrollView = ref.ScrollView;

  module.exports = ConversationView = (function(superClass) {
    extend(ConversationView, superClass);

    function ConversationView() {
      this.setCurrentConversation = bind(this.setCurrentConversation, this);
      this.openConversation = bind(this.openConversation, this);
      this.prevConversation = bind(this.prevConversation, this);
      this.nextConversation = bind(this.nextConversation, this);
      this.getTeamInfo = bind(this.getTeamInfo, this);
      this.getMembers = bind(this.getMembers, this);
      this.getChannels = bind(this.getChannels, this);
      return ConversationView.__super__.constructor.apply(this, arguments);
    }

    ConversationView.content = function() {
      return this.div({
        id: 'conversations'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'title',
            outlet: 'title'
          });
          _this.ul({
            id: 'channels',
            outlet: 'channelElements'
          });
          return _this.ul({
            id: 'members',
            outlet: 'memberElements'
          });
        };
      })(this));
    };

    ConversationView.prototype.initialize = function(stateController, client) {
      this.stateController = stateController;
      this.client = client;
      ConversationView.__super__.initialize.apply(this, arguments);
      this.currentConversation = null;
      this.channelViews || (this.channelViews = []);
      this.memberViews || (this.memberViews = []);
      this.getChannels();
      this.getMembers();
      return this.getTeamInfo();
    };

    ConversationView.prototype.getChannels = function() {
      var channel, i, j, len, len1, ref1, ref2, results, view;
      this.channels = this.stateController.team.channels;
      ref1 = this.channels;
      for (i = 0, len = ref1.length; i < len; i++) {
        channel = ref1[i];
        this.channelViews.push(new ChannelView(this.stateController, channel));
        this.stateController.preloadChat(channel);
      }
      ref2 = this.channelViews;
      results = [];
      for (j = 0, len1 = ref2.length; j < len1; j++) {
        view = ref2[j];
        results.push(this.channelElements.append(view));
      }
      return results;
    };

    ConversationView.prototype.getMembers = function(callback) {
      var i, j, len, len1, member, ref1, ref2, ref3, results, view;
      this.members = this.stateController.team.membersNotMe();
      ref1 = this.members;
      for (i = 0, len = ref1.length; i < len; i++) {
        member = ref1[i];
        if ((member != null ? (ref2 = member.channel) != null ? ref2.id : void 0 : void 0) != null) {
          this.memberViews.push(new MemberView(this.stateController, member));
          this.stateController.preloadChat(member);
        }
      }
      ref3 = this.memberViews;
      results = [];
      for (j = 0, len1 = ref3.length; j < len1; j++) {
        view = ref3[j];
        results.push(this.memberElements.append(view));
      }
      return results;
    };

    ConversationView.prototype.getTeamInfo = function() {
      return this.client.get('team.info', {}, (function(_this) {
        return function(err, resp) {
          return _this.title.append(_this.titleElement(resp.body.team));
        };
      })(this));
    };

    ConversationView.prototype.nextConversation = function() {
      var convos, index;
      convos = $('li', '#conversations');
      if (this.currentConversation != null) {
        index = convos.index(this.currentConversation);
        if (index < convos.length - 1) {
          return this.setCurrentConversation($(convos[index + 1]));
        }
      } else {
        return this.setCurrentConversation($('li', '#conversations').first());
      }
    };

    ConversationView.prototype.prevConversation = function() {
      var convos, index;
      convos = $('li', '#conversations');
      if (this.currentConversation != null) {
        index = convos.index(this.currentConversation);
        if (index > 0) {
          return this.setCurrentConversation($(convos[index - 1]));
        }
      } else {
        return this.setCurrentConversation(convos.last());
      }
    };

    ConversationView.prototype.openConversation = function() {
      var index, ref1;
      this.convos = this.channelViews.concat(this.memberViews);
      index = $('li', '#conversations').index(this.currentConversation);
      this.currentConversation.removeClass('unread');
      return (ref1 = this.convos[index]) != null ? ref1.showConversation() : void 0;
    };

    ConversationView.prototype.setCurrentConversation = function($convo) {
      var el, i, len, ref1;
      ref1 = $('li', '#conversations');
      for (i = 0, len = ref1.length; i < len; i++) {
        el = ref1[i];
        $(el).removeClass('selected');
      }
      $convo.addClass('selected');
      return this.currentConversation = $convo;
    };

    ConversationView.prototype.refresh = function() {
      var i, j, len, len1, ref1, ref2, results, view;
      ref1 = this.memberViews;
      for (i = 0, len = ref1.length; i < len; i++) {
        view = ref1[i];
        view.refresh();
      }
      ref2 = this.channelViews;
      results = [];
      for (j = 0, len1 = ref2.length; j < len1; j++) {
        view = ref2[j];
        results.push(view.eventHandlers());
      }
      return results;
    };

    ConversationView.prototype.titleElement = function(team) {
      return "<img id='teamIcon' src='" + team.icon.image_44 + "' /><h1>" + team.name + "</h1>";
    };

    return ConversationView;

  })(ScrollView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYXZpcmFqcy8uYXRvbS9wYWNrYWdlcy9zbGFjay1jaGF0L2xpYi92aWV3cy9jb252ZXJzYXRpb24tdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0E7QUFBQSxNQUFBLDZEQUFBO0lBQUE7Ozs7RUFBQSxXQUFBLEdBQWMsT0FBQSxDQUFRLDhCQUFSOztFQUNkLFVBQUEsR0FBYSxPQUFBLENBQVEsNkJBQVI7O0VBQ2IsTUFBa0IsT0FBQSxDQUFRLHNCQUFSLENBQWxCLEVBQUMsU0FBRCxFQUFJOztFQUVKLE1BQU0sQ0FBQyxPQUFQLEdBQ007Ozs7Ozs7Ozs7Ozs7O0lBQ0osZ0JBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7UUFBQSxFQUFBLEVBQUksZUFBSjtPQUFMLEVBQTBCLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtVQUN4QixLQUFDLENBQUEsR0FBRCxDQUFLO1lBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxPQUFQO1lBQWdCLE1BQUEsRUFBUSxPQUF4QjtXQUFMO1VBQ0EsS0FBQyxDQUFBLEVBQUQsQ0FBSTtZQUFBLEVBQUEsRUFBSSxVQUFKO1lBQWdCLE1BQUEsRUFBUSxpQkFBeEI7V0FBSjtpQkFDQSxLQUFDLENBQUEsRUFBRCxDQUFJO1lBQUEsRUFBQSxFQUFJLFNBQUo7WUFBZSxNQUFBLEVBQVEsZ0JBQXZCO1dBQUo7UUFId0I7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTFCO0lBRFE7OytCQU1WLFVBQUEsR0FBWSxTQUFDLGVBQUQsRUFBbUIsTUFBbkI7TUFBQyxJQUFDLENBQUEsa0JBQUQ7TUFBa0IsSUFBQyxDQUFBLFNBQUQ7TUFDN0Isa0RBQUEsU0FBQTtNQUNBLElBQUMsQ0FBQSxtQkFBRCxHQUF1QjtNQUN2QixJQUFDLENBQUEsaUJBQUQsSUFBQyxDQUFBLGVBQWlCO01BQ2xCLElBQUMsQ0FBQSxnQkFBRCxJ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QUEsWUFBWSxDQUFDLE1BQWQsQ0FBcUIsSUFBQyxDQUFBLFdBQXRCO01BQ1YsS0FBQSxHQUFRLENBQUEsQ0FBRSxJQUFGLEVBQVEsZ0JBQVIsQ0FBeUIsQ0FBQyxLQUExQixDQUFnQyxJQUFDLENBQUEsbUJBQWpDO01BQ1IsSUFBQyxDQUFBLG1CQUFtQixDQUFDLFdBQXJCLENBQWlDLFFBQWpDO3VEQUNjLENBQUUsZ0JBQWhCLENBQUE7SUFKZ0I7OytCQU9sQixzQkFBQSxHQUF3QixTQUFDLE1BQUQ7QUFDdEIsVUFBQTtBQUFBO0FBQUEsV0FBQSxzQ0FBQTs7UUFBQSxDQUFBLENBQUUsRUFBRixDQUFLLENBQUMsV0FBTixDQUFrQixVQUFsQjtBQUFBO01BQ0EsTUFBTSxDQUFDLFFBQVAsQ0FBZ0IsVUFBaEI7YUFDQSxJQUFDLENBQUEsbUJBQUQsR0FBdUI7SUFIRDs7K0JBTXhCLE9BQUEsR0FBUyxTQUFBO0FBQ1AsVUFBQTtBQUFBO0FBQUEsV0FBQSxzQ0FBQTs7UUFBQSxJQUFJLENBQUMsT0FBTCxDQUFBO0FBQUE7QUFDQTtBQUFBO1dBQUEsd0NBQUE7O3FCQUFBLElBQUksQ0FBQyxhQUFMLENBQUE7QUFBQTs7SUFGTzs7K0JBS1QsWUFBQSxHQUFjLFNBQUMsSUFBRDthQUNaLDBCQUFBLEdBQTJCLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBckMsR0FBOEMsVUFBOUMsR0FBd0QsSUFBSSxDQUFDLElBQTdELEdBQWtFO0lBRHREOzs7O0tBOUVlO0FBTC9CIiwic291cmNlc0NvbnRlbnQiOlsiXG5DaGFubmVsVmlldyA9IHJlcXVpcmUgJy4vY29udmVyc2F0aW9ucy9jaGFubmVsLXZpZXcnXG5NZW1iZXJWaWV3ID0gcmVxdWlyZSAnLi9jb252ZXJzYXRpb25zL21lbWJlci12aWV3J1xueyQsIFNjcm9sbFZpZXd9ID0gcmVxdWlyZSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIENvbnZlcnNhdGlvblZpZXcgZXh0ZW5kcyBTY3JvbGxWaWV3XG4gIEBjb250ZW50OiAtPlxuICAgIEBkaXYgaWQ6ICdjb252ZXJzYXRpb25zJywgPT5cbiAgICAgIEBkaXYgY2xhc3M6ICd0aXRsZScsIG91dGxldDogJ3RpdGxlJ1xuICAgICAgQHVsIGlkOiAnY2hhbm5lbHMnLCBvdXRsZXQ6ICdjaGFubmVsRWxlbWVudHMnXG4gICAgICBAdWwgaWQ6ICdtZW1iZXJzJywgb3V0bGV0OiAnbWVtYmVyRWxlbWVudHMnXG5cbiAgaW5pdGlhbGl6ZTogKEBzdGF0ZUNvbnRyb2xsZXIsIEBjbGllbnQpIC0+XG4gICAgc3VwZXJcbiAgICBAY3VycmVudENvbnZlcnNhdGlvbiA9IG51bGxcbiAgICBAY2hhbm5lbFZpZXdzIHx8PSBbXVxuICAgIEBtZW1iZXJWaWV3cyB8fD0gW11cbiAgICBAZ2V0Q2hhbm5lbHMoKVxuICAgIEBnZXRNZW1iZXJzKClcbiAgICBAZ2V0VGVhbUluZm8oKVxuXG4gICMgUmV0cmlldmUgY2hhbm5lbHMgZnJvbSB0aGUgdGVhbSBvYmplY3QgYW5kIGNyZWF0ZSBjaGFubmVsIHZpZXdzIGZvciB0aGVtLiBUaGVzZSBWaWV3c1xuICAjIGFyZSB0aGVuIGFkZGVkIHRvIHRoZSBjb252ZXJzYXRpb24gdmlldyAoc2VsZilcbiAgZ2V0Q2hhbm5lbHM6ICgpID0+XG4gICAgQGNoYW5uZWxzID0gQHN0YXRlQ29udHJvbGxlci50ZWFtLmNoYW5uZWxzXG4gICAgZm9yIGNoYW5uZWwgaW4gQGNoYW5uZWxzXG4gICAgICBAY2hhbm5lbFZpZXdzLnB1c2ggbmV3IENoYW5uZWxWaWV3KEBzdGF0ZUNvbnRyb2xsZXIsIGNoYW5uZWwpXG4gICAgICBAc3RhdGVDb250cm9sbGVyLnByZWxvYWRDaGF0KGNoYW5uZWwpXG4gICAgQGNoYW5uZWxFbGVtZW50cy5hcHBlbmQodmlldykgZm9yIHZpZXcgaW4gQGNoYW5uZWxWaWV3c1xuXG4gICMgUmV0cmlldmUgbWVtYmVycyBmcm9tIHRoZSB0ZWFtIG9iamVjdCBhbmQgY3JlYXRlIG1lbWJlciB2aWV3cyBmb3IgdGhlbS4gVGhlc2UgVmlld3NcbiAgIyBhcmUgdGhlbiBhZGRlZCB0byB0aGUgY29udmVyc2F0aW9uIHZpZXcgKHNlbGYpXG4gIGdldE1lbWJlcnM6IChjYWxsYmFjaykgPT5cbiAgICBAbWVtYmVycyA9IEBzdGF0ZUNvbnRyb2xsZXIudGVhbS5tZW1iZXJzTm90TWUoKVxuICAgIGZvciBtZW1iZXIgaW4gQG1lbWJlcnNcbiAgICAgIGlmIG1lbWJlcj8uY2hhbm5lbD8uaWQ/XG4gICAgICAgIEBtZW1iZXJWaWV3cy5wdXNoIG5ldyBNZW1iZXJWaWV3KEBzdGF0ZUNvbnRyb2xsZXIsIG1lbWJlcilcbiAgICAgICAgQHN0YXRlQ29udHJvbGxlci5wcmVsb2FkQ2hhdChtZW1iZXIpXG4gICAgQG1lbWJlckVsZW1lbnRzLmFwcGVuZCh2aWV3KSBmb3IgdmlldyBpbiBAbWVtYmVyVmlld3NcblxuICAjIERpc3BsYXkgdGhlIHRlYW0gbmFtZSBhbmQgaW1hZ2UgYXQgdGhlIHRvcCBvZiB0aGUgY2hhbm5lbCB2aWV3XG4gIGdldFRlYW1JbmZvOiA9PlxuICAgIEBjbGllbnQuZ2V0ICd0ZWFtLmluZm8nLCB7fSwgKGVyciwgcmVzcCkgPT5cbiAgICAgIEB0aXRsZS5hcHBlbmQoQHRpdGxlRWxlbWVudChyZXNwLmJvZHkudGVhbSkpXG5cbiAgIyBVc2VkIGJ5IGtleWJpbmRpbmdzIHRvIG5hdmlnYXRlIHRvIHRoZSBuZXh0IHNlbGVjdGlvblxuICBuZXh0Q29udmVyc2F0aW9uOiA9PlxuICAgIGNvbnZvcyA9ICQoJ2xpJywgJyNjb252ZXJzYXRpb25zJylcbiAgICBpZiBAY3VycmVudENvbnZlcnNhdGlvbj9cbiAgICAgIGluZGV4ID0gY29udm9zLmluZGV4KEBjdXJyZW50Q29udmVyc2F0aW9uKVxuICAgICAgQHNldEN1cnJlbnRDb252ZXJzYXRpb24oJChjb252b3NbaW5kZXggKyAxXSkpIGlmIGluZGV4IDwgY29udm9zLmxlbmd0aCAtIDFcbiAgICBlbHNlXG4gICAgICBAc2V0Q3VycmVudENvbnZlcnNhdGlvbiAkKCdsaScsICcjY29udmVyc2F0aW9ucycpLmZpcnN0KClcblxuICAjIFVzZWQgYnkga2V5YmluZGluZ3MgdG8gbmF2aWdhdGUgdG8gdGhlIHByZXZpb3VzIHNlbGVjdGlvblxuICBwcmV2Q29udmVyc2F0aW9uOiA9PlxuICAgIGNvbnZvcyA9ICQoJ2xpJywgJyNjb252ZXJzYXRpb25zJylcbiAgICBpZiBAY3VycmVudENvbnZlcnNhdGlvbj9cbiAgICAgIGluZGV4ID0gY29udm9zLmluZGV4KEBjdXJyZW50Q29udmVyc2F0aW9uKVxuICAgICAgQHNldEN1cnJlbnRDb252ZXJzYXRpb24oJChjb252b3NbaW5kZXggLSAxXSkpIGlmIGluZGV4ID4gMFxuICAgIGVsc2VcbiAgICAgIEBzZXRDdXJyZW50Q29udmVyc2F0aW9uIGNvbnZvcy5sYXN0KClcblxuICAjIEVudGVyIHRoZSBjaGF0IHN0YXRlIGZvciB0aGUgc2VsZWN0ZWQgY29udmVyc2F0aW9uLiBVc2luZyB0aGUgY3VycmVudGx5IHNlbGVjdGVkXG4gICMgY29udmVyc2F0aW9uIGhlcmUgd291bGQgYmUgaWRlYWwsIGJ1dCBzb21lIHVzZXJzIGxpa2UgdGhlIG1vdXNlLlxuICBvcGVuQ29udmVyc2F0aW9uOiA9PlxuICAgIEBjb252b3MgPSBAY2hhbm5lbFZpZXdzLmNvbmNhdChAbWVtYmVyVmlld3MpICMgQ29tYmluZSBjaGFubmVsIGFuZCBtZW1iZXIgdmlld3NcbiAgICBpbmRleCA9ICQoJ2xpJywgJyNjb252ZXJzYXRpb25zJykuaW5kZXggQGN1cnJlbnRDb252ZXJzYXRpb24gIyBHZXQgYW4gaW5kZXggZm9yIHRoZSBzZWxlY3RlZCB2aWV3XG4gICAgQGN1cnJlbnRDb252ZXJzYXRpb24ucmVtb3ZlQ2xhc3MoJ3VucmVhZCcpICMgTWFyayBhcyByZWFkIHdoZW4gZW50ZXJpbmdcbiAgICBAY29udm9zW2luZGV4XT8uc2hvd0NvbnZlcnNhdGlvbigpICMgU2hvdyB0aGUgY29udmVyc2F0aW9uIGZvciB0aGUgc2VsZWN0ZWQgY2hhbm5lbC9tZW1iZXJcblxuICAjIFNldCB0aGUgY3VycmVudCBjb252ZXJzYXRpb24gYXMgdGhlIHVzZXIgbmF2aWdhdGVzIHVwIG9yIGRvd24gY29udmVyc2F0aW9ucyB3aXRoIHRoZSBrZXlib2FyZFxuICBzZXRDdXJyZW50Q29udmVyc2F0aW9uOiAoJGNvbnZvKSA9PlxuICAgICQoZWwpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpIGZvciBlbCBpbiAkKCdsaScsICcjY29udmVyc2F0aW9ucycpXG4gICAgJGNvbnZvLmFkZENsYXNzKCdzZWxlY3RlZCcpXG4gICAgQGN1cnJlbnRDb252ZXJzYXRpb24gPSAkY29udm9cblxuICAjIFJlZnJlc2ggZXZlbnQgaGFuZGxlcnMgYW5kIHZpZXcgYXR0cmlidXRlcyBmb3IgbWVtYmVyIGFuZCBjaGFubmVsIHZpZXdzXG4gIHJlZnJlc2g6IC0+XG4gICAgdmlldy5yZWZyZXNoKCkgZm9yIHZpZXcgaW4gQG1lbWJlclZpZXdzXG4gICAgdmlldy5ldmVudEhhbmRsZXJzKCkgZm9yIHZpZXcgaW4gQGNoYW5uZWxWaWV3c1xuXG4gICMgSFRNTCByZXByZXNlbnRhdGlvbiBvZiB0ZWFtIGRhdGEgYXQgdGhlIHRvcCBvZiB0aGUgdmlld1xuICB0aXRsZUVsZW1lbnQ6ICh0ZWFtKSAtPlxuICAgIFwiPGltZyBpZD0ndGVhbUljb24nIHNyYz0nI3t0ZWFtLmljb24uaW1hZ2VfNDR9JyAvPjxoMT4je3RlYW0ubmFtZX08L2gxPlwiXG4iXX0=
