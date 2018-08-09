(function() {
  var $, ChatView, ConversationView, FileManager, FileUploadView, SlackChatView, SlackClient, StateController, Team, allowUnsafeEval, notifier,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  SlackChatView = require('./views/slack-chat-view');

  ConversationView = require('./views/conversation-view');

  ChatView = require('./views/chat-view');

  FileManager = require('./file-manager');

  FileUploadView = require('./views/file-upload-view');

  SlackClient = require('./slack-client');

  notifier = require('node-notifier');

  Team = require('./team');

  $ = require('atom-space-pen-views').$;

  allowUnsafeEval = require('loophole').allowUnsafeEval;

  module.exports = StateController = (function() {
    var instance;

    StateController.prototype.slackChatView = null;

    instance = null;

    function StateController(subscriptions) {
      var clientId, clientSecret, token;
      this.subscriptions = subscriptions;
      this.toggle = bind(this.toggle, this);
      this.stateUpload = bind(this.stateUpload, this);
      this.stateDefault = bind(this.stateDefault, this);
      this.updateChatView = bind(this.updateChatView, this);
      this.updateChat = bind(this.updateChat, this);
      this.preloadChat = bind(this.preloadChat, this);
      this.stateChat = bind(this.stateChat, this);
      this.setState = bind(this.setState, this);
      this.getPanel = bind(this.getPanel, this);
      this.destroyElements = bind(this.destroyElements, this);
      this.clearRoot = bind(this.clearRoot, this);
      this.presence_change = bind(this.presence_change, this);
      this.message = bind(this.message, this);
      this.hello = bind(this.hello, this);
      if (instance) {
        return instance;
      } else {
        instance = this;
      }
      this.chatHistory = {};
      this.stateHistory = [];
      this.state = null;
      token = atom.config.get('slack-chat.api_token');
      token = token === 'null' ? null : token;
      clientId = atom.config.get('slack-chat.api_key');
      clientId = clientId === 'null' ? null : clientId;
      clientSecret = atom.config.get('slack-chat.api_secret');
      clientSecret = clientSecret === 'null' ? null : clientSecret;
      this.client = new SlackClient(clientId, clientSecret, token);
      this.slackChatView = new SlackChatView(this, this.client);
      this.modalPanel = atom.workspace.addRightPanel({
        item: this.slackChatView,
        visible: false,
        className: 'slack-panel'
      });
      this.client.addSubscriber((function(_this) {
        return function(message) {
          var msg, name;
          msg = JSON.parse(message);
          return typeof _this[name = msg.type] === "function" ? _this[name](msg) : void 0;
        };
      })(this));
    }

    StateController.prototype.hello = function() {
      console.log('hello');
      if (this.client) {
        this.team || (this.team = new Team(this.client));
      }
      this.fileManager = new FileManager(this);
      atom.config.set('slack-chat.api_token', this.client.token);
      return this.setState('default');
    };

    StateController.prototype.message = function(message) {
      var member;
      this.updateChat(message);
      if (message.user !== this.client.me.id) {
        $("#" + message.channel, this.channelView).addClass("unread");
        member = this.team.memberWithId(message.user);
        if (atom.config.get('slack-chat.notifications') && (member != null)) {
          notifier.notify({
            title: "New message from " + member.name,
            message: "" + (message.text.substring(0, 140)),
            icon: "https://raw.githubusercontent.com/callahanrts/slack-chat/master/lib/assets/icon256.png",
            wait: true,
            member: member
          }, (function(_this) {
            return function(err, response) {};
          })(this));
          return notifier.on('click', (function(_this) {
            return function(nc, obj) {
              _this.modalPanel.show();
              return _this.setState('chat', obj.member);
            };
          })(this));
        }
      }
    };

    StateController.prototype.presence_change = function(message) {
      this.team.setPresence(message.user, message.presence);
      if (this.channelView) {
        return this.channelView.refresh();
      }
    };

    StateController.prototype.clearRoot = function() {
      return this.slackChatView.clearViews();
    };

    StateController.prototype.destroyElements = function() {
      this.modalPanel.destroy();
      return this.slackChatView.destroy();
    };

    StateController.prototype.getInstance = function() {
      return instance;
    };

    StateController.prototype.getPanel = function() {
      return this.modalPanel;
    };

    StateController.prototype.previousState = function() {
      return this.setState(this.stateHistory.pop());
    };

    StateController.prototype.setState = function(state) {
      state = state[0].toUpperCase() + state.slice(1).toLowerCase();
      if (this.state) {
        this.stateHistory.push(this.state);
      }
      this.state = state;
      this.clearRoot();
      return this["state" + state].apply(this, arguments);
    };

    StateController.prototype.stateChat = function(state, chatTarget) {
      var base, name;
      if (this.chatHistory[chatTarget.channel.id]) {
        this.slackChatView.addView(this.chatHistory[chatTarget.channel.id]);
        return this.chatHistory[chatTarget.channel.id].refresh();
      } else {
        (base = this.chatHistory)[name = chatTarget.channel.id] || (base[name] = new ChatView(this, chatTarget));
        return this.slackChatView.addView(this.chatHistory[chatTarget.channel.id]);
      }
    };

    StateController.prototype.preloadChat = function(chat) {
      var base, name;
      if (atom.config.get('slack-chat.preloadChat')) {
        return (base = this.chatHistory)[name = chat.id] || (base[name] = new ChatView(this, chat));
      }
    };

    StateController.prototype.updateChat = function(message) {
      console.log("update chat");
      if (this.chatHistory[message.channel]) {
        return this.chatHistory[message.channel].receiveMessage(message);
      }
    };

    StateController.prototype.updateChatView = function(channel) {
      if (this.chatHistory[channel]) {
        return this.chatHistory[channel].update();
      }
    };

    StateController.prototype.stateDefault = function() {
      this.stateHistory = [];
      if (this.channelView) {
        this.channelView.refresh();
      }
      this.channelView || (this.channelView = new ConversationView(this, this.client));
      return this.slackChatView.addView(this.channelView);
    };

    StateController.prototype.stateUpload = function() {
      if (this.uploadView) {
        this.uploadView.refresh();
      }
      this.uploadView || (this.uploadView = new FileUploadView(this));
      return this.slackChatView.addView(this.uploadView);
    };

    StateController.prototype.toggle = function() {
      if (this.modalPanel.isVisible()) {
        return this.modalPanel.hide();
      } else {
        return this.modalPanel.show();
      }
    };

    return StateController;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYXZpcmFqcy8uYXRvbS9wYWNrYWdlcy9zbGFjay1jaGF0L2xpYi9zdGF0ZS1jb250cm9sbGVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQTtBQUFBLE1BQUEsd0lBQUE7SUFBQTs7RUFBQSxhQUFBLEdBQWdCLE9BQUEsQ0FBUSx5QkFBUjs7RUFDaEIsZ0JBQUEsR0FBbUIsT0FBQSxDQUFRLDJCQUFSOztFQUNuQixRQUFBLEdBQVcsT0FBQSxDQUFRLG1CQUFSOztFQUNYLFdBQUEsR0FBYyxPQUFBLENBQVEsZ0JBQVI7O0VBQ2QsY0FBQSxHQUFpQixPQUFBLENBQVEsMEJBQVI7O0VBQ2pCLFdBQUEsR0FBYyxPQUFBLENBQVEsZ0JBQVI7O0VBRWQsUUFBQSxHQUFXLE9BQUEsQ0FBUSxlQUFSOztFQUNYLElBQUEsR0FBTyxPQUFBLENBQVEsUUFBUjs7RUFFTixJQUFLLE9BQUEsQ0FBUSxzQkFBUjs7RUFDTCxrQkFBbUIsT0FBQSxDQUFRLFVBQVI7O0VBRXBCLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixRQUFBOzs4QkFBQSxhQUFBLEdBQWU7O0lBQ2YsUUFBQSxHQUFXOztJQUVFLHlCQUFDLGFBQUQ7QUFFWCxVQUFBO01BRlksSUFBQyxDQUFBLGdCQUFEOzs7Ozs7Ozs7Ozs7Ozs7TUFFWixJQUFHLFFBQUg7QUFDRSxlQUFPLFNBRFQ7T0FBQSxNQUFBO1FBR0UsUUFBQSxHQUFXLEtBSGI7O01BS0EsSUFBQyxDQUFBLFdBQUQsR0FBZTtNQUNmLElBQUMsQ0FBQSxZQUFELEdBQWdCO01BQ2hCLElBQUMsQ0FBQSxLQUFELEdBQVM7TUFHVCxLQUFBLEdBQVEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHNCQUFoQjtNQUNSLEtBQUEsR0FBVyxLQUFBLEtBQVMsTUFBWixHQUF3QixJQUF4QixHQUFrQztNQUUxQyxRQUFBLEdBQVcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENB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QUEsR0FBYyxTQUFBO01BQ1osSUFBQyxDQUFBLFlBQUQsR0FBZ0I7TUFDaEIsSUFBMEIsSUFBQyxDQUFBLFdBQTNCO1FBQUEsSUFBQyxDQUFBLFdBQVcsQ0FBQyxPQUFiLENBQUEsRUFBQTs7TUFDQSxJQUFDLENBQUEsZ0JBQUQsSUFBQyxDQUFBLGNBQWdCLElBQUksZ0JBQUosQ0FBcUIsSUFBckIsRUFBd0IsSUFBQyxDQUFBLE1BQXpCO2FBQ2pCLElBQUMsQ0FBQSxhQUFhLENBQUMsT0FBZixDQUF1QixJQUFDLENBQUEsV0FBeEI7SUFKWTs7OEJBUWQsV0FBQSxHQUFhLFNBQUE7TUFDWCxJQUF5QixJQUFDLENBQUEsVUFBMUI7UUFBQSxJQUFDLENBQUEsVUFBVSxDQUFDLE9BQVosQ0FBQSxFQUFBOztNQUNBLElBQUMsQ0FBQSxlQUFELElBQUMsQ0FBQSxhQUFlLElBQUksY0FBSixDQUFtQixJQUFuQjthQUNoQixJQUFDLENBQUEsYUFBYSxDQUFDLE9BQWYsQ0FBdUIsSUFBQyxDQUFBLFVBQXhCO0lBSFc7OzhCQUtiLE1BQUEsR0FBUSxTQUFBO01BQ04sSUFBRyxJQUFDLENBQUEsVUFBVSxDQUFDLFNBQVosQ0FBQSxDQUFIO2VBQWdDLElBQUMsQ0FBQSxVQUFVLENBQUMsSUFBWixDQUFBLEVBQWhDO09BQUEsTUFBQTtlQUF3RCxJQUFDLENBQUEsVUFBVSxDQUFDLElBQVosQ0FBQSxFQUF4RDs7SUFETTs7Ozs7QUExS1YiLCJzb3VyY2VzQ29udGVudCI6WyJcblNsYWNrQ2hhdFZpZXcgPSByZXF1aXJlICcuL3ZpZXdzL3NsYWNrLWNoYXQtdmlldydcbkNvbnZlcnNhdGlvblZpZXcgPSByZXF1aXJlICcuL3ZpZXdzL2NvbnZlcnNhdGlvbi12aWV3J1xuQ2hhdFZpZXcgPSByZXF1aXJlICcuL3ZpZXdzL2NoYXQtdmlldydcbkZpbGVNYW5hZ2VyID0gcmVxdWlyZSAnLi9maWxlLW1hbmFnZXInXG5GaWxlVXBsb2FkVmlldyA9IHJlcXVpcmUgJy4vdmlld3MvZmlsZS11cGxvYWQtdmlldydcblNsYWNrQ2xpZW50ID0gcmVxdWlyZSgnLi9zbGFjay1jbGllbnQnKVxuXG5ub3RpZmllciA9IHJlcXVpcmUgJ25vZGUtbm90aWZpZXInXG5UZWFtID0gcmVxdWlyZSAnLi90ZWFtJ1xuXG57JH0gPSByZXF1aXJlICdhdG9tLXNwYWNlLXBlbi12aWV3cydcbnthbGxvd1Vuc2FmZUV2YWx9ID0gcmVxdWlyZSAnbG9vcGhvbGUnXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIFN0YXRlQ29udHJvbGxlclxuICBzbGFja0NoYXRWaWV3OiBudWxsXG4gIGluc3RhbmNlID0gbnVsbFxuXG4gIGNvbnN0cnVjdG9yOiAoQHN1YnNjcmlwdGlvbnMpIC0+XG4gICAgIyBFbnN1cmUgdGhlcmUgaXMgb25seSBldmVyIG9uZSBpbnN0YW5jZSBvZiB0aGlzIGNsYXNzXG4gICAgaWYgaW5zdGFuY2VcbiAgICAgIHJldHVybiBpbnN0YW5jZVxuICAgIGVsc2VcbiAgICAgIGluc3RhbmNlID0gdGhpc1xuXG4gICAgQGNoYXRIaXN0b3J5ID0ge31cbiAgICBAc3RhdGVIaXN0b3J5ID0gW11cbiAgICBAc3RhdGUgPSBudWxsXG5cbiAgICAjIFJldHJpZXZlIHNsYWNrIHRva2VuIGlmIHdlJ3ZlIHByZXZpb3VzbHkgYXV0aGVudGljYXRlZCBhIHVzZXJcbiAgICB0b2tlbiA9IGF0b20uY29uZmlnLmdldCgnc2xhY2stY2hhdC5hcGlfdG9rZW4nKVxuICAgIHRva2VuID0gaWYgdG9rZW4gaXMgJ251bGwnIHRoZW4gbnVsbCBlbHNlIHRva2VuXG5cbiAgICBjbGllbnRJZCA9IGF0b20uY29uZmlnLmdldCgnc2xhY2stY2hhdC5hcGlfa2V5JylcbiAgICBjbGllbnRJZCA9IGlmIGNsaWVudElkIGlzICdudWxsJyB0aGVuIG51bGwgZWxzZSBjbGllbnRJZFxuXG4gICAgY2xpZW50U2VjcmV0ID0gYXRvbS5jb25maWcuZ2V0KCdzbGFjay1jaGF0LmFwaV9zZWNyZXQnKVxuICAgIGNsaWVudFNlY3JldCA9IGlmIGNsaWVudFNlY3JldCBpcyAnbnVsbCcgdGhlbiBudWxsIGVsc2UgY2xpZW50U2VjcmV0XG4gICAgQGNsaWVudCA9IG5ldyBTbGFja0NsaWVudChjbGllbnRJZCwgY2xpZW50U2VjcmV0LCB0b2tlbilcblxuICAgICMgQ3JlYXRlIG1haW4gdmlldyBmb3IgdGhlIHNsYWNrLWNoYXQgcGFja2FnZSBhbmQgYmluZCBpdCB0byB0aGUgcmlnaHQgbW9kYWwgcGFuZWxcbiAgICBAc2xhY2tDaGF0VmlldyA9IG5ldyBTbGFja0NoYXRWaWV3KEAsIEBjbGllbnQpXG4gICAgQG1vZGFsUGFuZWwgPSBhdG9tLndvcmtzcGFjZS5hZGRSaWdodFBhbmVsKGl0ZW06IEBzbGFja0NoYXRWaWV3LCB2aXNpYmxlOiBmYWxzZSwgY2xhc3NOYW1lOiAnc2xhY2stcGFuZWwnKVxuXG4gICAgIyBTdWJzY3JpYmUgdG8gbm90aWZpY2F0aW9ucyBmcm9tIHRoZSBSVE0gc2xhY2sgYXBpLiBUaGUgY2xpZW50IGNvbm5lY3RzIHRvIHRoZSBSVE0gYXBpXG4gICAgIyB1c2luZyBhIHdlYnNvY2tldCBhbmQgY2FsbHMgc3Vic2NyaWJlcnMgd2hlbiBzaGl0IGhhcHBlbnNcbiAgICBAY2xpZW50LmFkZFN1YnNjcmliZXIgKG1lc3NhZ2UpID0+XG4gICAgICBtc2cgPSBKU09OLnBhcnNlKG1lc3NhZ2UpXG4gICAgICBAW21zZy50eXBlXT8obXNnKSAjIENhbGwgcnRtIG1ldGhvZCBpZiBpdCBleGlzdHNcblxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICMgUlRNIE1ldGhvZHNcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICBoZWxsbzogPT5cbiAgICAjIEFueXRoaW5nIHRoYXQgc2hvdWxkIGJlIGluaXRpYWxpemVkIGFmdGVyIHNsYWNrIGlzIGFsbCBjb25uZWN0ZWQgc2hvdWxkXG4gICAgIyBiZSBpbml0aWFsaXplZCBoZXJlLiBUaGlzIGlzIHRoZSBmaXJzdCBtZXRob2QgY2FsbGVkIGZyb20gdGhlIHJ0bSBjbGllbnRcbiAgICAjIGFmdGVyIGJlaW5nIGNvbm5lY3RlZFxuICAgIGNvbnNvbGUubG9nICdoZWxsbydcbiAgICBAdGVhbSB8fD0gbmV3IFRlYW0oQGNsaWVudCkgaWYgQGNsaWVudCAjIEdhdGhlciBzbGFjayB0ZWFtXG4gICAgQGZpbGVNYW5hZ2VyID0gbmV3IEZpbGVNYW5hZ2VyKEApICMgQ3JlYXRlIGZpbGUgdXBsb2FkIG1hbmFnZXI7IGNvdWxkIHByb2JhYmx5IGJlIGluaXRpYWxpemVkIGVsc2V3aGVyZVxuICAgIGF0b20uY29uZmlnLnNldCgnc2xhY2stY2hhdC5hcGlfdG9rZW4nLCBAY2xpZW50LnRva2VuKSAjIHNhdmUgc2xhY2sgdG9rZW5cbiAgICBAc2V0U3RhdGUoJ2RlZmF1bHQnKSAjIGVudGVyIGRlZmF1bHQgc2xhY2stY2hhdCBzdGF0ZVxuXG4gIG1lc3NhZ2U6IChtZXNzYWdlKSA9PlxuICAgIEB1cGRhdGVDaGF0KG1lc3NhZ2UpXG4gICAgdW5sZXNzIG1lc3NhZ2UudXNlciBpcyBAY2xpZW50Lm1lLmlkXG4gICAgICAjIE1hcmsgdGhlIGNoYW5uZWwgYXMgdW5yZWFkIHNvIGl0IGlzIGhpZ2hsaWdodGVkXG4gICAgICAkKFwiIyN7bWVzc2FnZS5jaGFubmVsfVwiLCBAY2hhbm5lbFZpZXcpLmFkZENsYXNzKFwidW5yZWFkXCIpXG5cbiAgICAgICMgRmluZCB0aGUgbWVtYmVyIHRoYXQgc2VudCB0aGUgbWVzc2FnZVxuICAgICAgbWVtYmVyID0gQHRlYW0ubWVtYmVyV2l0aElkKG1lc3NhZ2UudXNlcilcblxuICAgICAgIyBTZW5kIGdyb3dsL25hdGl2ZS93aGF0ZXZlciBub3RpZmljYXRpb25zIHdoZW4gYSBtZXNzYWdlIGhhcyBiZWVuIHJlY2VpdmVkXG4gICAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ3NsYWNrLWNoYXQubm90aWZpY2F0aW9ucycpIGFuZCBtZW1iZXI/XG4gICAgICAgIG5vdGlmaWVyLm5vdGlmeVxuICAgICAgICAgIHRpdGxlOiBcIk5ldyBtZXNzYWdlIGZyb20gI3ttZW1iZXIubmFtZX1cIixcbiAgICAgICAgICBtZXNzYWdlOiBcIiN7bWVzc2FnZS50ZXh0LnN1YnN0cmluZygwLDE0MCl9XCJcbiAgICAgICAgICBpY29uOiBcImh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9jYWxsYWhhbnJ0cy9zbGFjay1jaGF0L21hc3Rlci9saWIvYXNzZXRzL2ljb24yNTYucG5nXCJcbiAgICAgICAgICB3YWl0OiB0cnVlXG4gICAgICAgICAgbWVtYmVyOiBtZW1iZXJcbiAgICAgICAgLCAoZXJyLCByZXNwb25zZSkgPT5cblxuICAgICAgICAjIENsaWNrIGhhbmRsZXIgd2lsbCBlbnRlciB0aGUgY2hhdCBzdGF0ZSBmb3IgdGhlIGNoYW5uZWwgdGhlIG1lc3NhZ2Ugd2FzIHBvc3RlZCBpbi5cbiAgICAgICAgbm90aWZpZXIub24gJ2NsaWNrJywgKG5jLCBvYmopID0+XG4gICAgICAgICAgQG1vZGFsUGFuZWwuc2hvdygpICMgRW5zdXJlIHNsYWNrIGNoYXQgaXMgdmlzaWJsZVxuICAgICAgICAgIEBzZXRTdGF0ZSgnY2hhdCcsIG9iai5tZW1iZXIpICMgRGlzcGxheSBjaGF0XG5cblxuICAjIFVwZGF0ZSB1c2VyIHBlc2VuY2UgYW5kIGNoYW5uZWwgdmlldyB0byBhY2N1cmF0ZWx5IGRpc3BsYXkgdXNlcnMgd2hvIGFyZVxuICAjIG9uIG9yIG9mZiBsaW5lXG4gIHByZXNlbmNlX2NoYW5nZTogKG1lc3NhZ2UpID0+XG4gICAgQHRlYW0uc2V0UHJlc2VuY2UobWVzc2FnZS51c2VyLCBtZXNzYWdlLnByZXNlbmNlKVxuICAgIEBjaGFubmVsVmlldy5yZWZyZXNoKCkgaWYgQGNoYW5uZWxWaWV3XG5cblxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICMgVmlldyBNZXRob2RzXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuICAjIENsZWFyIGFsbCBjaGlsZCBlbGVtZW50cyBvZiB0aGUgU2xhY2tDaGF0Vmlld1xuICBjbGVhclJvb3Q6ID0+XG4gICAgQHNsYWNrQ2hhdFZpZXcuY2xlYXJWaWV3cygpXG5cbiAgZGVzdHJveUVsZW1lbnRzOiA9PlxuICAgIEBtb2RhbFBhbmVsLmRlc3Ryb3koKVxuICAgIEBzbGFja0NoYXRWaWV3LmRlc3Ryb3koKVxuXG4gIGdldEluc3RhbmNlOiAtPlxuICAgIHJldHVybiBpbnN0YW5jZVxuXG4gIGdldFBhbmVsOiA9PlxuICAgIHJldHVybiBAbW9kYWxQYW5lbFxuXG4gIHByZXZpb3VzU3RhdGU6IC0+XG4gICAgQHNldFN0YXRlIEBzdGF0ZUhpc3RvcnkucG9wKClcblxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICMgU3RhdGUgTWV0aG9kc1xuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICMgSGFuZGxlcyBjdXJyZW50IHN0YXRlIGFuZCBzdGF0ZSBoaXN0b3J5LiBDYWxsIG1ldGhvZHMgY29ycmVzcG9uZGluZyB0byBzdGF0ZSBzbyBzdGF0ZXNcbiAgIyBjYW4gYmUgaW5pdGlhbGl6ZWQvaGFuZGxlZCBpbmRlcGVuZGVudGx5IG9mIG9uZSBhbm90aGVyLlxuICBzZXRTdGF0ZTogKHN0YXRlKSA9PlxuICAgIHN0YXRlID0gc3RhdGVbMF0udG9VcHBlckNhc2UoKSArIHN0YXRlWzEuLi0xXS50b0xvd2VyQ2FzZSgpXG4gICAgQHN0YXRlSGlzdG9yeS5wdXNoIEBzdGF0ZSBpZiBAc3RhdGUgIyBrZWVwIHRyYWNrIG9mIHN0YXRlIGhpc3RvcnlcbiAgICBAc3RhdGUgPSBzdGF0ZVxuICAgIEBjbGVhclJvb3QoKSAjIENsZWFyIG91dCBhbGwgY2hpbGQgZWxlbWVudHMgYmVmb3JlIGFkZGluZyBhbiBlbGVtZW50IHRvIHRoZSBtYWluIHZpZXdcbiAgICBAW1wic3RhdGUje3N0YXRlfVwiXS5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG5cbiAgIyBFbnRlciBhIGNoYXQgY29udmVyc2F0aW9uIHN0YXRlLiBVc2UgY2FjaGVkIGNoYXQgdmlld3Mgd2hlbiBhdmFpbGFibGUgYXMgaXQgd2lsbCBhdm9pZFxuICAjIGEgY2FsbCB0byB0aGUgYXBpLiBOZXcgbWVzc2FnZXMgd2lsbCBiZSBoYW5kbGVkIHZpYSBydG0gc28gd2Ugc2hvdWxkIG5ldmVyIGdldCBiZWhpbmQuXG4gIHN0YXRlQ2hhdDogKHN0YXRlLCBjaGF0VGFyZ2V0KSA9PlxuICAgIGlmIEBjaGF0SGlzdG9yeVtjaGF0VGFyZ2V0LmNoYW5uZWwuaWRdXG4gICAgICBAc2xhY2tDaGF0Vmlldy5hZGRWaWV3KEBjaGF0SGlzdG9yeVtjaGF0VGFyZ2V0LmNoYW5uZWwuaWRdKVxuICAgICAgQGNoYXRIaXN0b3J5W2NoYXRUYXJnZXQuY2hhbm5lbC5pZF0ucmVmcmVzaCgpXG4gICAgZWxzZVxuICAgICAgQGNoYXRIaXN0b3J5W2NoYXRUYXJnZXQuY2hhbm5lbC5pZF0gfHw9IG5ldyBDaGF0VmlldyhALCBjaGF0VGFyZ2V0KVxuICAgICAgQHNsYWNrQ2hhdFZpZXcuYWRkVmlldyhAY2hhdEhpc3RvcnlbY2hhdFRhcmdldC5jaGFubmVsLmlkXSlcblxuICAjIFByZWxvYWQgY2hhdCBtZXNzYWdlcyBvbiBzdGFydHVwIHNvIGVudGVyaW5nIGNoYXQgc3RhdGUgaXMgYSBsaXR0bGUgZmFzdGVyXG4gIHByZWxvYWRDaGF0OiAoY2hhdCkgPT5cbiAgICBAY2hhdEhpc3RvcnlbY2hhdC5pZF0gfHw9IG5ldyBDaGF0VmlldyhALCBjaGF0KSBpZiBhdG9tLmNvbmZpZy5nZXQoJ3NsYWNrLWNoYXQucHJlbG9hZENoYXQnKVxuXG4gICMgVXBkYXRpbmcgdGhlIGNoYXQgdmlldyB3aGVuIGEgbWVzc2FnZSBpcyByZWNlaXZlZC4gSXQgd2lsbCBlbnN1cmUgdGhlIHZpZXcgZGlzcGxheXMgdGhlXG4gICMgbWVzc2FnZSBjb3JyZWN0bHkuXG4gIHVwZGF0ZUNoYXQ6IChtZXNzYWdlKSA9PlxuICAgIGNvbnNvbGUubG9nIFwidXBkYXRlIGNoYXRcIlxuICAgIGlmIEBjaGF0SGlzdG9yeVttZXNzYWdlLmNoYW5uZWxdXG4gICAgICBAY2hhdEhpc3RvcnlbbWVzc2FnZS5jaGFubmVsXS5yZWNlaXZlTWVzc2FnZShtZXNzYWdlKVxuXG4gICMgVXBkYXRpbmcgdGhlIGNoYXQgdmlldyB2aWEgY2hhbm5lbCB3aWxsIHNjcm9sbCB0byBib3R0b20uIFRoaXMgaXMgdXNlZCBmb3IgdGhlIGZldyBjYXNlcyBpbWFnZXNcbiAgIyBoYXZlbid0IGxvYWRlZCB5ZXQuIFdoZW4gdGhleSBsb2FkLCB0aGV5J2xsIGNhbGwgdGhpcyBtZXRob2Qgd2hpY2ggd2lsbCBzY3JvbGwgdG8gdGhlIGJvdHRvbVxuICAjIGFmdGVyIHRoZSBuZXcgaGVpZ2h0IGlzIGNhbGN1bGF0ZWQuXG4gIHVwZGF0ZUNoYXRWaWV3OiAoY2hhbm5lbCkgPT5cbiAgICBpZiBAY2hhdEhpc3RvcnlbY2hhbm5lbF1cbiAgICAgIEBjaGF0SGlzdG9yeVtjaGFubmVsXS51cGRhdGUoKVxuXG4gICMgRGVmYXVsdCBzdGF0ZSB3aGVyZSBhdmFpbGFibGUgY2hhbm5lbHMgYW5kIHVzZXJzIGFyZSBkaXNwbGF5ZWRcbiAgc3RhdGVEZWZhdWx0OiA9PlxuICAgIEBzdGF0ZUhpc3RvcnkgPSBbXSAjIE5vIG5lZWQgdG8gc3RvcmUgcHJldmlvdXMgc3RhdGVzIHdoZW4gd2UgbGFuZCBhdCB0aGUgZGVmYXVsdFxuICAgIEBjaGFubmVsVmlldy5yZWZyZXNoKCkgaWYgQGNoYW5uZWxWaWV3ICMgcmVmcmVzaGVzIGV2ZW50IGhhbmRsZXJzXG4gICAgQGNoYW5uZWxWaWV3IHx8PSBuZXcgQ29udmVyc2F0aW9uVmlldyhALCBAY2xpZW50KVxuICAgIEBzbGFja0NoYXRWaWV3LmFkZFZpZXcoQGNoYW5uZWxWaWV3KVxuXG4gICMgU2ltaWxhciB0byB0aGUgZGVmYXVsdCBjaGFubmVsIHZpZXcgc3RhdGUsIHRoZSB1cGxvYWQgc3RhdGUgbGV0cyB5b3UgY2hvb3NlIGNoYW5uZWxzIHRoYXRcbiAgIyBzaG91bGQgcmVjZWl2ZSB0aGUgc2VsZWN0aW9uIG9mIHRleHQgKHNuaXBwZXQpXG4gIHN0YXRlVXBsb2FkOiA9PlxuICAgIEB1cGxvYWRWaWV3LnJlZnJlc2goKSBpZiBAdXBsb2FkVmlld1xuICAgIEB1cGxvYWRWaWV3IHx8PSBuZXcgRmlsZVVwbG9hZFZpZXcoQClcbiAgICBAc2xhY2tDaGF0Vmlldy5hZGRWaWV3KEB1cGxvYWRWaWV3KVxuXG4gIHRvZ2dsZTogPT5cbiAgICBpZiBAbW9kYWxQYW5lbC5pc1Zpc2libGUoKSB0aGVuIEBtb2RhbFBhbmVsLmhpZGUoKSBlbHNlIEBtb2RhbFBhbmVsLnNob3coKVxuXG4iXX0=
