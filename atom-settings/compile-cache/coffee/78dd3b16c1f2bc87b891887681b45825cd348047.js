(function() {
  var $, ChatLogView, ChatMessageView, ChatView, View, imagesLoaded, ref,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ChatMessageView = require('./chat/chat-message-view');

  ChatLogView = require('./chat/chat-log-view');

  ref = require('atom-space-pen-views'), $ = ref.$, View = ref.View;

  imagesLoaded = require('imagesloaded');

  module.exports = ChatView = (function(superClass) {
    extend(ChatView, superClass);

    function ChatView() {
      this.update = bind(this.update, this);
      this.submit = bind(this.submit, this);
      this.setMark = bind(this.setMark, this);
      this.refresh = bind(this.refresh, this);
      this.receiveMessage = bind(this.receiveMessage, this);
      this.keypress = bind(this.keypress, this);
      this.getChatLog = bind(this.getChatLog, this);
      this.eventHandlers = bind(this.eventHandlers, this);
      this.closeChat = bind(this.closeChat, this);
      return ChatView.__super__.constructor.apply(this, arguments);
    }

    ChatView.content = function(stateController, chat) {
      var image, name;
      this.stateController = stateController;
      this.chat = chat;
      image = this.chat.image;
      name = this.chat.name;
      return this.div({
        "class": 'chat'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'title'
          }, function() {
            _this.span({
              "class": 'chevron-left back'
            });
            if (image != null) {
              _this.img({
                "class": 'teamIcon',
                src: image
              });
            }
            return _this.h1(name, {
              "class": "" + (!_this.chat.profile ? 'channel' : void 0)
            });
          });
          _this.div({
            "class": 'chat-log',
            outlet: 'chatLog'
          });
          return _this.div({
            "class": 'response-container',
            outlet: 'responseContainer'
          }, function() {
            return _this.textarea({
              "class": 'response',
              "class": 'form-control native-key-bindings',
              outlet: 'response'
            });
          });
        };
      })(this));
    };

    ChatView.prototype.initialize = function(stateController, chat) {
      this.stateController = stateController;
      this.chat = chat;
      this.width(400);
      this.type = (function() {
        switch (false) {
          case this.chat.is_channel == null:
            return 'channels';
          case this.chat.is_group == null:
            return 'groups';
          case !((this.chat.is_im != null) || (this.chat.is_owner != null) || (this.chat.is_admin != null)):
            return 'im';
        }
      }).call(this);
      this.getChatLog();
      return this.eventHandlers();
    };

    ChatView.prototype.closeChat = function() {
      return this.stateController.setState('default');
    };

    ChatView.prototype.eventHandlers = function() {
      this.on('click', '.back', this.closeChat);
      this.on('keyup', 'textarea', this.keypress);
      return this.on('focus', 'textarea', this.setMark);
    };

    ChatView.prototype.getChatLog = function() {
      return this.stateController.client.get(this.type + ".history", {
        channel: this.chat.channel.id
      }, (function(_this) {
        return function(err, resp) {
          console.log(resp.body);
          _this.chatLogView = new ChatLogView(_this.stateController, resp.body.messages.reverse(), _this.chat);
          _this.chatLog.append(_this.chatLogView);
          return imagesLoaded(_this.chatLogView, _this.update);
        };
      })(this));
    };

    ChatView.prototype.keypress = function(e) {
      if (e.keyCode === 13 && !e.shiftKey) {
        this.submit();
        return false;
      }
      return this.update();
    };

    ChatView.prototype.receiveMessage = function(message) {
      this.chatLogView.receiveMessage(message);
      return setTimeout(this.update, 0);
    };

    ChatView.prototype.refresh = function() {
      this.eventHandlers();
      return this.update();
    };

    ChatView.prototype.setMark = function() {
      var type;
      type = (function() {
        switch (false) {
          case this.chat.is_channel == null:
            return 'channels';
          case this.chat.is_group == null:
            return 'groups';
          case !((this.chat.is_im != null) || (this.chat.is_owner != null) || (this.chat.is_admin != null)):
            return 'im';
        }
      }).call(this);
      return this.stateController.client.post(type + ".mark", {
        channel: this.chat.channel.id,
        ts: Date.now()
      }, (function(_this) {
        return function(err, msg, resp) {
          var i, len, message, ref1, results;
          if (err != null) {
            console.log(err);
          }
          if (resp.ok) {
            ref1 = $(".message");
            results = [];
            for (i = 0, len = ref1.length; i < len; i++) {
              message = ref1[i];
              results.push($(message).removeClass('new slack-mark'));
            }
            return results;
          }
        };
      })(this));
    };

    ChatView.prototype.submit = function() {
      var text;
      text = this.response.val();
      this.response.val('');
      this.update();
      return this.stateController.client.post("chat.postMessage", {
        channel: this.chat.channel.id,
        text: text,
        as_user: this.stateController.client.me.id
      }, (function(_this) {
        return function(err, msg, resp) {
          if (err != null) {
            return console.log(err);
          }
        };
      })(this));
    };

    ChatView.prototype.update = function(e) {
      var height;
      this.response.height(0);
      height = Math.min(this.response.get(0).scrollHeight, 150);
      this.response.height(height);
      this.chatLog.css('padding-bottom', 50 + parseInt(this.responseContainer.outerHeight()));
      return this.chatLog.scrollToBottom();
    };

    return ChatView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYXZpcmFqcy8uYXRvbS9wYWNrYWdlcy9zbGFjay1jaGF0L2xpYi92aWV3cy9jaGF0LXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBO0FBQUEsTUFBQSxrRUFBQTtJQUFBOzs7O0VBQUEsZUFBQSxHQUFrQixPQUFBLENBQVEsMEJBQVI7O0VBQ2xCLFdBQUEsR0FBYyxPQUFBLENBQVEsc0JBQVI7O0VBQ2QsTUFBWSxPQUFBLENBQVEsc0JBQVIsQ0FBWixFQUFDLFNBQUQsRUFBSTs7RUFDSixZQUFBLEdBQWUsT0FBQSxDQUFRLGNBQVI7O0VBRWYsTUFBTSxDQUFDLE9BQVAsR0FDTTs7Ozs7Ozs7Ozs7Ozs7OztJQUNKLFFBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQyxlQUFELEVBQW1CLElBQW5CO0FBQ1IsVUFBQTtNQURTLElBQUMsQ0FBQSxrQkFBRDtNQUFrQixJQUFDLENBQUEsT0FBRDtNQUMzQixLQUFBLEdBQVEsSUFBQyxDQUFBLElBQUksQ0FBQztNQUNkLElBQUEsR0FBTyxJQUFDLENBQUEsSUFBSSxDQUFDO2FBRWIsSUFBQyxDQUFBLEdBQUQsQ0FBSztRQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sTUFBUDtPQUFMLEVBQW9CLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtVQUNsQixLQUFDLENBQUEsR0FBRCxDQUFLO1lBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxPQUFQO1dBQUwsRUFBcUIsU0FBQTtZQUNuQixLQUFDLENBQUEsSUFBRCxDQUFNO2NBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxtQkFBUDthQUFOO1lBQ0EsSUFBc0MsYUFBdEM7Y0FBQSxLQUFDLENBQUEsR0FBRCxDQUFLO2dCQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sVUFBUDtnQkFBbUIsR0FBQSxFQUFLLEtBQXhCO2VBQUwsRUFBQTs7bUJBQ0EsS0FBQyxDQUFBLEVBQUQsQ0FBSSxJQUFKLEVBQVU7Y0FBQSxD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SUFBeEIsQ0FBNkIsa0JBQTdCLEVBQ0U7UUFBQSxPQUFBLEVBQVMsSUFBQyxDQUFBLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBdkI7UUFDQSxJQUFBLEVBQU0sSUFETjtRQUVBLE9BQUEsRUFBUyxJQUFDLENBQUEsZUFBZSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFGcEM7T0FERixFQUlFLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLElBQVg7VUFDQSxJQUFtQixXQUFuQjttQkFBQSxPQUFPLENBQUMsR0FBUixDQUFZLEdBQVosRUFBQTs7UUFEQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FKRjtJQUpNOzt1QkFZUixNQUFBLEdBQVEsU0FBQyxDQUFEO0FBQ04sVUFBQTtNQUFBLElBQUMsQ0FBQSxRQUFRLENBQUMsTUFBVixDQUFpQixDQUFqQjtNQUdBLE1BQUEsR0FBUyxJQUFJLENBQUMsR0FBTCxDQUFTLElBQUMsQ0FBQSxRQUFRLENBQUMsR0FBVixDQUFjLENBQWQsQ0FBZ0IsQ0FBQyxZQUExQixFQUF3QyxHQUF4QztNQUNULElBQUMsQ0FBQSxRQUFRLENBQUMsTUFBVixDQUFpQixNQUFqQjtNQUlBLElBQUMsQ0FBQSxPQUFPLENBQUMsR0FBVCxDQUFhLGdCQUFiLEVBQStCLEVBQUEsR0FBSyxRQUFBLENBQVMsSUFBQyxDQUFBLGlCQUFpQixDQUFDLFdBQW5CLENBQUEsQ0FBVCxDQUFwQzthQUNBLElBQUMsQ0FBQSxPQUFPLENBQUMsY0FBVCxDQUFBO0lBVk07Ozs7S0E1RmE7QUFOdkIiLCJzb3VyY2VzQ29udGVudCI6WyJcbkNoYXRNZXNzYWdlVmlldyA9IHJlcXVpcmUgJy4vY2hhdC9jaGF0LW1lc3NhZ2UtdmlldydcbkNoYXRMb2dWaWV3ID0gcmVxdWlyZSAnLi9jaGF0L2NoYXQtbG9nLXZpZXcnXG57JCwgVmlld30gPSByZXF1aXJlICdhdG9tLXNwYWNlLXBlbi12aWV3cydcbmltYWdlc0xvYWRlZCA9IHJlcXVpcmUgJ2ltYWdlc2xvYWRlZCdcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgQ2hhdFZpZXcgZXh0ZW5kcyBWaWV3XG4gIEBjb250ZW50OiAoQHN0YXRlQ29udHJvbGxlciwgQGNoYXQpIC0+XG4gICAgaW1hZ2UgPSBAY2hhdC5pbWFnZVxuICAgIG5hbWUgPSBAY2hhdC5uYW1lXG5cbiAgICBAZGl2IGNsYXNzOiAnY2hhdCcsID0+XG4gICAgICBAZGl2IGNsYXNzOiAndGl0bGUnLCA9PlxuICAgICAgICBAc3BhbiBjbGFzczogJ2NoZXZyb24tbGVmdCBiYWNrJ1xuICAgICAgICBAaW1nIGNsYXNzOiAndGVhbUljb24nLCBzcmM6IGltYWdlIGlmIGltYWdlP1xuICAgICAgICBAaDEgbmFtZSwgY2xhc3M6IFwiI3snY2hhbm5lbCcgdW5sZXNzIEBjaGF0LnByb2ZpbGV9XCJcbiAgICAgIEBkaXYgY2xhc3M6ICdjaGF0LWxvZycsIG91dGxldDogJ2NoYXRMb2cnXG4gICAgICBAZGl2IGNsYXNzOiAncmVzcG9uc2UtY29udGFpbmVyJywgb3V0bGV0OiAncmVzcG9uc2VDb250YWluZXInLCA9PlxuICAgICAgICBAdGV4dGFyZWEgY2xhc3M6ICdyZXNwb25zZScsIGNsYXNzOiAnZm9ybS1jb250cm9sIG5hdGl2ZS1rZXktYmluZGluZ3MnLCBvdXRsZXQ6ICdyZXNwb25zZSdcblxuICBpbml0aWFsaXplOiAoQHN0YXRlQ29udHJvbGxlciwgQGNoYXQpIC0+XG4gICAgQHdpZHRoKDQwMClcbiAgICBAdHlwZSA9XG4gICAgICBzd2l0Y2hcbiAgICAgICAgd2hlbiBAY2hhdC5pc19jaGFubmVsPyB0aGVuICdjaGFubmVscydcbiAgICAgICAgd2hlbiBAY2hhdC5pc19ncm91cD8gdGhlbiAnZ3JvdXBzJ1xuICAgICAgICB3aGVuIEBjaGF0LmlzX2ltPyB8fCBAY2hhdC5pc19vd25lcj8gfHwgQGNoYXQuaXNfYWRtaW4/IHRoZW4gJ2ltJ1xuICAgIEBnZXRDaGF0TG9nKClcbiAgICBAZXZlbnRIYW5kbGVycygpXG5cbiAgIyBSZXR1cm4gdG8gZGVmYXVsdCBzdGF0ZS4gT25lIGRheSB0aGlzIG1pZ2h0IGp1c3QgcG9wIHN0YXRlXG4gIGNsb3NlQ2hhdDogPT5cbiAgICBAc3RhdGVDb250cm9sbGVyLnNldFN0YXRlKCdkZWZhdWx0JylcblxuICAjIEJpbmQgZXZlbnRzIGZvciB0aGUgY2hhdCB2aWV3XG4gIGV2ZW50SGFuZGxlcnM6ID0+XG4gICAgQC5vbiAnY2xpY2snLCAnLmJhY2snLCBAY2xvc2VDaGF0XG4gICAgQC5vbiAna2V5dXAnLCAndGV4dGFyZWEnLCBAa2V5cHJlc3NcbiAgICBALm9uICdmb2N1cycsICd0ZXh0YXJlYScsIEBzZXRNYXJrXG5cbiAgIyBSZXRyaWV2ZSBjaGF0IGhpc3Rvcnkgb24gaW5pdGlhbGl6YXRpb25cbiAgZ2V0Q2hhdExvZzogPT5cbiAgICBAc3RhdGVDb250cm9sbGVyLmNsaWVudC5nZXQgXCIje0B0eXBlfS5oaXN0b3J5XCIsIHsgY2hhbm5lbDogQGNoYXQuY2hhbm5lbC5pZCB9LCAoZXJyLCByZXNwKSA9PlxuICAgICAgIyBWaWV3IGZvciBtYW5hZ2luZyBjaGF0IGxvZ3NcbiAgICAgIGNvbnNvbGUubG9nIHJlc3AuYm9keVxuICAgICAgQGNoYXRMb2dWaWV3ID0gbmV3IENoYXRMb2dWaWV3KEBzdGF0ZUNvbnRyb2xsZXIsIHJlc3AuYm9keS5tZXNzYWdlcy5yZXZlcnNlKCksIEBjaGF0KVxuICAgICAgQGNoYXRMb2cuYXBwZW5kKEBjaGF0TG9nVmlldykgIyBEaXNwbGF5IGxvZ3NcbiAgICAgIGltYWdlc0xvYWRlZCBAY2hhdExvZ1ZpZXcsIEB1cGRhdGUgIyB1cGRhdGUgKHNjcm9sbCBkb3duKSBhZnRlciBjb250ZW50IGhhcyBsb2FkZWQgKHRoaXMgZXhjbHVkZXMgYXN5bmMgY29udGVudCBlZy4gb3Blbl9ncmFwaClcblxuICAjIFNlbmQgbWVzc2FnZS9jcmVhdGUgbmV3bGluZSBmdW5jdGlvbmFsaXR5IGZvciB0aGUgdGV4dGFyZWFcbiAga2V5cHJlc3M6IChlKSA9PlxuICAgIGlmIGUua2V5Q29kZSBpcyAxMyBhbmQgbm90IGUuc2hpZnRLZXlcbiAgICAgIEBzdWJtaXQoKVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgQHVwZGF0ZSgpXG5cbiAgIyBBZGQgdGhlIG1lc3NhZ2UgdG8gdGhlIGNoYXQgbG9nIGFuZCB1cGRhdGUgdGhlIHZpZXdcbiAgcmVjZWl2ZU1lc3NhZ2U6IChtZXNzYWdlKSA9PlxuICAgIEBjaGF0TG9nVmlldy5yZWNlaXZlTWVzc2FnZShtZXNzYWdlKVxuICAgIHNldFRpbWVvdXQgQHVwZGF0ZSwgMFxuXG4gICMgQ2FsbGVkIHdoZW4gc3RhdGVzIGNoYW5nZSB0byBlbnN1cmUgZXZlbnQgaGFuZGxlcnMgYXJlIGFjdGl2ZSBhbmRcbiAgIyBjb250ZW50IGlzIHByZXNlbnQvaW4gcGxhY2VcbiAgcmVmcmVzaDogPT5cbiAgICBAZXZlbnRIYW5kbGVycygpXG4gICAgQHVwZGF0ZSgpXG5cbiAgIyBNYXJrIHRoZSBjaGFubmVsIGFzIHJlYWRcbiAgc2V0TWFyazogPT5cbiAgICB0eXBlID1cbiAgICAgIHN3aXRjaFxuICAgICAgICB3aGVuIEBjaGF0LmlzX2NoYW5uZWw/IHRoZW4gJ2NoYW5uZWxzJ1xuICAgICAgICB3aGVuIEBjaGF0LmlzX2dyb3VwPyB0aGVuICdncm91cHMnXG4gICAgICAgIHdoZW4gQGNoYXQuaXNfaW0/IHx8IEBjaGF0LmlzX293bmVyPyB8fCBAY2hhdC5pc19hZG1pbj8gdGhlbiAnaW0nXG4gICAgQHN0YXRlQ29udHJvbGxlci5jbGllbnQucG9zdCBcIiN7dHlwZX0ubWFya1wiLFxuICAgICAgY2hhbm5lbDogQGNoYXQuY2hhbm5lbC5pZFxuICAgICAgdHM6IERhdGUubm93KClcbiAgICAsIChlcnIsIG1zZywgcmVzcCkgPT5cbiAgICAgIGNvbnNvbGUubG9nIGVyciBpZiBlcnI/XG4gICAgICBpZiByZXNwLm9rXG4gICAgICAgICMgUmVtb3ZlIGNsYXNzZXMgdGhhdCBzaG93IHRoZSBzZWN0aW9uIG9mIHVucmVhZCBtZXNzYWdlc1xuICAgICAgICAkKG1lc3NhZ2UpLnJlbW92ZUNsYXNzKCduZXcgc2xhY2stbWFyaycpIGZvciBtZXNzYWdlIGluICQoXCIubWVzc2FnZVwiKVxuXG5cbiAgIyBTZW5kIGEgbWVzc2FnZSB0byBhIGNoYW5uZWwgdGhyb3VnaCB0aGUgc2xhY2sgYXBpIGFuZCBVcGRhdGUgdGhlIHZpZXcncyBzdGF0ZVxuICAjIGFjY29yZGluZ2x5LlxuICBzdWJtaXQ6ID0+XG4gICAgdGV4dCA9IEByZXNwb25zZS52YWwoKVxuICAgIEByZXNwb25zZS52YWwoJycpXG4gICAgQHVwZGF0ZSgpXG4gICAgQHN0YXRlQ29udHJvbGxlci5jbGllbnQucG9zdCBcImNoYXQucG9zdE1lc3NhZ2VcIixcbiAgICAgIGNoYW5uZWw6IEBjaGF0LmNoYW5uZWwuaWRcbiAgICAgIHRleHQ6IHRleHRcbiAgICAgIGFzX3VzZXI6IEBzdGF0ZUNvbnRyb2xsZXIuY2xpZW50Lm1lLmlkXG4gICAgLCAoZXJyLCBtc2csIHJlc3ApID0+XG4gICAgICBjb25zb2xlLmxvZyBlcnIgaWYgZXJyP1xuXG4gICMgQ2FsbGVkIGFsbCB0aGUgdGltZSB0byBtYWtlIHN1cmUgdGhlIHZpZXcgaXMgaW4gYW4gb3B0aW1hbCBzdGF0ZVxuICB1cGRhdGU6IChlKSA9PlxuICAgIEByZXNwb25zZS5oZWlnaHQoMCkgIyBTZXQgcmVzcG9uc2UgaGVpZ2h0IHRvIDAgdG8gY2FsY3VsYXRlIHNjcm9sbCBoZWlnaHRcblxuICAgICMgR2V0IHRoZSBuZXcgaGVpZ2h0IGJhc2VkIG9mZiB0aGUgc2Nyb2xsIGhlaWdodCBmb3IgYXV0by1yZXNpemluZyB0aGUgdGV4dGFyZWFcbiAgICBoZWlnaHQgPSBNYXRoLm1pbihAcmVzcG9uc2UuZ2V0KDApLnNjcm9sbEhlaWdodCwgMTUwKVxuICAgIEByZXNwb25zZS5oZWlnaHQoaGVpZ2h0KSAjIFNldCB0aGUgbmV3IGhlaWdodFxuXG4gICAgIyBVcGRhdGUgdGhlIGNoYXQgbG9nJ3MgcGFkZGluZyB0byBhY2NvbW9kYXRlIGZvciB0ZXh0YXJlYSdzIGNoYW5nZSBpbiBoZWlnaHQuXG4gICAgIyBBbHNvIG1ha2Ugc3VyZSB0aGUgdmlldyBpcyBkaXNwbGF5aW5nIHRoZSBuZXdlc3QgbWVzc2FnZSAoc2Nyb2xsIHRvIGJvdHRvbSlcbiAgICBAY2hhdExvZy5jc3MoJ3BhZGRpbmctYm90dG9tJywgNTAgKyBwYXJzZUludChAcmVzcG9uc2VDb250YWluZXIub3V0ZXJIZWlnaHQoKSkpXG4gICAgQGNoYXRMb2cuc2Nyb2xsVG9Cb3R0b20oKVxuIl19
