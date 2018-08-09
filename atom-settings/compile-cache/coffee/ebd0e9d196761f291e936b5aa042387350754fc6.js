(function() {
  var Team, _,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  _ = require('underscore-plus');

  module.exports = Team = (function() {
    function Team(client) {
      this.client = client;
      this.unknownUser = bind(this.unknownUser, this);
      this.setPresence = bind(this.setPresence, this);
      this.parseCustomEmoji = bind(this.parseCustomEmoji, this);
      this.customEmojiImage = bind(this.customEmojiImage, this);
      this.customEmoji = bind(this.customEmoji, this);
      this.chatWithChannel = bind(this.chatWithChannel, this);
      this.membersNotMe = bind(this.membersNotMe, this);
      this.memberWithId = bind(this.memberWithId, this);
      this.memberName = bind(this.memberName, this);
      this.memberImage = bind(this.memberImage, this);
      this.getTeamMembers = bind(this.getTeamMembers, this);
      this.getEmoji = bind(this.getEmoji, this);
      this.getChannels = bind(this.getChannels, this);
      this.members = [];
      this.channels = [];
      this.getChannels();
      this.getTeamMembers();
      this.getEmoji();
    }

    Team.prototype.getChannels = function() {
      var channel, i, len, ref, results;
      ref = this.client.channels.concat(this.client.groups);
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        channel = ref[i];
        channel.channel = {
          id: channel.id
        };
        if (!(channel.is_archived || (!channel.is_member && !channel.is_group))) {
          results.push(this.channels.push(channel));
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    Team.prototype.getEmoji = function() {
      return this.client.get('emoji.list', {}, (function(_this) {
        return function(err, resp) {
          return _this.emoji = resp.body.emoji;
        };
      })(this));
    };

    Team.prototype.getTeamMembers = function() {
      var i, len, ref, results, user;
      ref = this.client.users;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        user = ref[i];
        if (!user.deleted) {
          user.channel = _.findWhere(this.client.ims, {
            user: user.id
          });
          user.image = this.memberImage(user);
          results.push(this.members.push(user));
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    Team.prototype.memberImage = function(member, message) {
      if (member == null) {
        member = null;
      }
      if (message == null) {
        message = null;
      }
      if (member != null) {
        return member.profile.image_32;
      } else if (message.icons != null) {
        return message.icons.image_64;
      } else {
        return "https://slack.global.ssl.fastly.net/5a92/plugins/slackbot/assets/service_128.png";
      }
    };

    Team.prototype.memberName = function(member, message) {
      if (message == null) {
        message = null;
      }
      if (member != null) {
        return member.name;
      } else if (message.username != null) {
        return message.username;
      } else {
        return message.user;
      }
    };

    Team.prototype.memberWithId = function(id) {
      return _.findWhere(this.members, {
        id: id
      });
    };

    Team.prototype.membersNotMe = function() {
      return _.reject(this.members, (function(_this) {
        return function(member) {
          return member.id === _this.client.me.id;
        };
      })(this));
    };

    Team.prototype.chatWithChannel = function(channel) {
      var chats;
      chats = this.members.concat(this.channels);
      return _.find(chats, (function(_this) {
        return function(chat) {
          return (chat.channel != null) && chat.channel.id === channel;
        };
      })(this));
    };

    Team.prototype.customEmoji = function(match) {
      var emoji;
      if (!this.emoji) {
        return match;
      }
      emoji = match.replace(/:/g, '');
      if (this.emoji[emoji] != null) {
        return this.customEmojiImage(this.emoji[emoji], match);
      } else {
        return match;
      }
    };

    Team.prototype.customEmojiImage = function(emoji, match) {
      if (emoji.match(/http/) != null) {
        return "<img src='" + emoji + "' class='emoji' title='" + (match.replace(/:/g, '')) + "' alt='" + (match.replace(/:/g, '')) + "' />";
      } else {
        return this.customEmoji(":" + (emoji.split(':')[1]) + ":");
      }
    };

    Team.prototype.parseCustomEmoji = function(text) {
      var emoji, i, len, match;
      emoji = text.match(/:\S+:/g);
      if (emoji) {
        for (i = 0, len = emoji.length; i < len; i++) {
          match = emoji[i];
          text = text.replace(match, this.customEmoji(match));
        }
      }
      return text;
    };

    Team.prototype.setPresence = function(user, presence) {
      var i, len, member, ref, results;
      ref = this.members;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        member = ref[i];
        if (member.id === user) {
          results.push(member.presence = presence);
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    Team.prototype.unknownUser = function(message) {
      return {
        image: this.memberImage(null, message),
        name: this.memberName(null, message)
      };
    };

    return Team;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYXZpcmFqcy8uYXRvbS9wYWNrYWdlcy9zbGFjay1jaGF0L2xpYi90ZWFtLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQTtBQUFBLE1BQUEsT0FBQTtJQUFBOztFQUFBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVI7O0VBRUosTUFBTSxDQUFDLE9BQVAsR0FDTTtJQUVTLGNBQUMsTUFBRDtNQUFDLElBQUMsQ0FBQSxTQUFEOzs7Ozs7Ozs7Ozs7OztNQUNaLElBQUMsQ0FBQSxPQUFELEdBQVc7TUFDWCxJQUFDLENBQUEsUUFBRCxHQUFZO01BRVosSUFBQyxDQUFBLFdBQUQsQ0FBQTtNQUNBLElBQUMsQ0FBQSxjQUFELENBQUE7TUFDQSxJQUFDLENBQUEsUUFBRCxDQUFBO0lBTlc7O21CQVViLFdBQUEsR0FBYSxTQUFBO0FBQ1gsVUFBQTtBQUFBO0FBQUE7V0FBQSxxQ0FBQTs7UUFDRSxPQUFPLENBQUMsT0FBUixHQUFrQjtVQUFFLEVBQUEsRUFBSSxPQUFPLENBQUMsRUFBZDs7UUFDbEIsSUFBQSxDQUFBLENBQThCLE9BQU8sQ0FBQyxXQUFSLElBQXVCLENBQUMsQ0FBSSxPQUFPLENBQUMsU0FBWixJQUEwQixDQUFJLE9BQU8sQ0FBQyxRQUF2QyxDQUFyRCxDQUFBO3VCQUFBLElBQUMsQ0FBQSxRQUFRLENBQUMsSUFBVixDQUFlLE9BQWYsR0FBQTtTQUFBLE1BQUE7K0JBQUE7O0FBRkY7O0lBRFc7O21CQU1iLFFBQUEsR0FBVSxTQUFBO2FBQ1IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxHQUFSLENBQVksWUFBWixFQUEwQixFQUExQixFQUE4QixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsR0FBRCxFQUFNLElBQU47aUJBQzVCLEtBQUMsQ0FBQSxLQUFELEdBQVMsSUFBSSxDQUFDLElBQUksQ0FBQztRQURTO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE5QjtJQURROzttQkFLVixj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LENBQUgsR0FBd0IsR0FBckMsRUFIRjs7SUFEZ0I7O21CQVFsQixnQkFBQSxHQUFrQixTQUFDLElBQUQ7QUFFaEIsVUFBQTtNQUFBLEtBQUEsR0FBUSxJQUFJLENBQUMsS0FBTCxDQUFXLFFBQVg7TUFDUixJQUFHLEtBQUg7QUFDRSxhQUFBLHVDQUFBOztVQUFBLElBQUEsR0FBTyxJQUFJLENBQUMsT0FBTCxDQUFhLEtBQWIsRUFBb0IsSUFBQyxDQUFBLFdBQUQsQ0FBYSxLQUFiLENBQXBCO0FBQVAsU0FERjs7YUFFQTtJQUxnQjs7bUJBU2xCLFdBQUEsR0FBYSxTQUFDLElBQUQsRUFBTyxRQUFQO0FBQ1gsVUFBQTtBQUFBO0FBQUE7V0FBQSxxQ0FBQTs7UUFDRSxJQUE4QixNQUFNLENBQUMsRUFBUCxLQUFhLElBQTNDO3VCQUFBLE1BQU0sQ0FBQyxRQUFQLEdBQWtCLFVBQWxCO1NBQUEsTUFBQTsrQkFBQTs7QUFERjs7SUFEVzs7bUJBS2IsV0FBQSxHQUFhLFNBQUMsT0FBRDthQUNYO1FBQUEsS0FBQSxFQUFPLElBQUMsQ0FBQSxXQUFELENBQWEsSUFBYixFQUFtQixPQUFuQixDQUFQO1FBQ0EsSUFBQSxFQUFNLElBQUMsQ0FBQSxVQUFELENBQVksSUFBWixFQUFrQixPQUFsQixDQUROOztJQURXOzs7OztBQXJHZiIsInNvdXJjZXNDb250ZW50IjpbIlxuXyA9IHJlcXVpcmUgJ3VuZGVyc2NvcmUtcGx1cydcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgVGVhbVxuXG4gIGNvbnN0cnVjdG9yOiAoQGNsaWVudCkgLT5cbiAgICBAbWVtYmVycyA9IFtdXG4gICAgQGNoYW5uZWxzID0gW11cblxuICAgIEBnZXRDaGFubmVscygpXG4gICAgQGdldFRlYW1NZW1iZXJzKClcbiAgICBAZ2V0RW1vamkoKVxuXG4gICMgQ3JlYXRlcyBhbiBhcnJheSB0aGF0IHN0b3JlcyB0aGUgY2hhbm5lbHMgYSB1c2VyIGhhcyBhY2Nlc3MgdG8uIEl0IGFkZHNcbiAgIyB0aGUgYGNoYW5uZWxgIG9iamVjdCBzbyBpdCBjYW4gYmUgdXNlZCBpbiB0aGUgc2FtZSB3YXkgYXMgbWVtYmVycy5cbiAgZ2V0Q2hhbm5lbHM6ID0+XG4gICAgZm9yIGNoYW5uZWwgaW4gQGNsaWVudC5jaGFubmVscy5jb25jYXQoQGNsaWVudC5ncm91cHMpXG4gICAgICBjaGFubmVsLmNoYW5uZWwgPSB7IGlkOiBjaGFubmVsLmlkIH1cbiAgICAgIEBjaGFubmVscy5wdXNoIGNoYW5uZWwgdW5sZXNzIGNoYW5uZWwuaXNfYXJjaGl2ZWQgb3IgKG5vdCBjaGFubmVsLmlzX21lbWJlciBhbmQgbm90IGNoYW5uZWwuaXNfZ3JvdXApXG5cbiAgIyBSZXRyaWV2ZXMgYW55IGN1c3RvbSBlbW9qaSBmcm9tIHNsYWNrIHRoZSB1c2VyIGhhcyBhY2Nlc3MgdG9cbiAgZ2V0RW1vamk6ID0+XG4gICAgQGNsaWVudC5nZXQgJ2Vtb2ppLmxpc3QnLCB7fSwgKGVyciwgcmVzcCkgPT5cbiAgICAgIEBlbW9qaSA9IHJlc3AuYm9keS5lbW9qaVxuXG4gICMgUGFyc2UgdGVhbSBtZW1iZXJzIHdpdGggY2hhbm5lbCBpZHMgKGZvciBpbXMpIGZyb20gcnRtLnN0YXJ0IG9mIHNjLWNsaWVudFxuICBnZXRUZWFtTWVtYmVyczogPT5cbiAgICBmb3IgdXNlciBpbiBAY2xpZW50LnVzZXJzXG4gICAgICB1bmxlc3MgdXNlci5kZWxldGVkXG4gICAgICAgIHVzZXIuY2hhbm5lbCA9IF8uZmluZFdoZXJlKEBjbGllbnQuaW1zLCB7IHVzZXI6IHVzZXIuaWQgfSlcbiAgICAgICAgdXNlci5pbWFnZSA9IEBtZW1iZXJJbWFnZSh1c2VyKVxuICAgICAgICBAbWVtYmVycy5wdXNoIHVzZXJcblxuICAjIEltYWdlcyBhcmUgaW5jb25zaXN0ZW50LiBUaGV5IGNvbWUgZnJvbSBib3RzIG9yIHBlb3BsZSBvciBjaGFubmVscyBvciB3aGF0ZXZlciBlbHNlXG4gICMgc2xhY2sgZGVjaWRlcyB0byBzbGFwIGFuIGltYWdlIG9uLiBUaGVyZSBpc24ndCBtdWNoIG9mIGNvbnNpc3RlbmN5IHdpdGggdGhlaXIgbG9jYXRpb25cbiAgIyBpbiBvYmplY3RzIHNvIHdlIHBhcnNlIHRoZW0gaGVyZS5cbiAgbWVtYmVySW1hZ2U6IChtZW1iZXI9bnVsbCwgbWVzc2FnZT1udWxsKSA9PlxuICAgIGlmIG1lbWJlcj9cbiAgICAgIG1lbWJlci5wcm9maWxlLmltYWdlXzMyXG4gICAgZWxzZSBpZiBtZXNzYWdlLmljb25zP1xuICAgICAgbWVzc2FnZS5pY29ucy5pbWFnZV82NFxuICAgIGVsc2VcbiAgICAgIFwiaHR0cHM6Ly9zbGFjay5nbG9iYWwuc3NsLmZhc3RseS5uZXQvNWE5Mi9wbHVnaW5zL3NsYWNrYm90L2Fzc2V0cy9zZXJ2aWNlXzEyOC5wbmdcIlxuXG4gICMgU2FtZSBzdG9yeSBhcyBpbWFnZXMgKGFib3ZlKSBidXQgd2l0aCB0aGUgbmFtZSBvZiB0aGUgcGVyc29uL2NoYW5uZWwvYm90L2V0Yy5cbiAgbWVtYmVyTmFtZTogKG1lbWJlciwgbWVzc2FnZT1udWxsKSA9PlxuICAgIGlmIG1lbWJlcj9cbiAgICAgIG1lbWJlci5uYW1lXG4gICAgZWxzZSBpZiBtZXNzYWdlLnVzZXJuYW1lP1xuICAgICAgbWVzc2FnZS51c2VybmFtZVxuICAgIGVsc2VcbiAgICAgIG1lc3NhZ2UudXNlclxuXG4gICMgRmluZCBhIHNsYWNrIHVzZXIgb2JqZWN0IGdpdmVuIG9ubHkgdGhlaXIgdXNlciBpZFxuICBtZW1iZXJXaXRoSWQ6IChpZCkgPT5cbiAgICBfLmZpbmRXaGVyZShAbWVtYmVycywgeyBpZDogaWQgfSlcblxuICAjIFNpbmNlIG1lbWJlcnMgc3RvcmVzIGFsbCBtZW1iZXJzIGluY2x1ZGluZyBzZWxmLCB3ZSBmaWx0ZXIgb3V0IHNlbGYgd2l0aCB0aGlzIG1ldGhvZFxuICBtZW1iZXJzTm90TWU6ID0+XG4gICAgXy5yZWplY3QoQG1lbWJlcnMsIChtZW1iZXIpID0+IG1lbWJlci5pZCBpcyBAY2xpZW50Lm1lLmlkKVxuXG4gICMgQ2hhdCdzIGFyZSB0aGUgY29tYmluYXRpb24gb2YgbWVtYmVycyBhbmQgY2hhbm5lbHMuIFdlIGNvbWJpbmUgdGhlbSBoZXJlIGFuZCByZXR1cm5cbiAgIyB0aGUgb2JqZWN0IHdlJ3JlIGxvb2tpbmcgZm9yIHRoYXQgY29udGFpbnMgdGhlIGdpdmVuIGNoYW5uZWwgaWRcbiAgY2hhdFdpdGhDaGFubmVsOiAoY2hhbm5lbCkgPT5cbiAgICBjaGF0cyA9IEBtZW1iZXJzLmNvbmNhdChAY2hhbm5lbHMpXG4gICAgXy5maW5kIGNoYXRzLCAoY2hhdCkgPT5cbiAgICAgIGNoYXQuY2hhbm5lbD8gYW5kIGNoYXQuY2hhbm5lbC5pZCBpcyBjaGFubmVsXG5cbiAgIyBUcnkgdG8gdHVybiBjdXN0b20gZW1vamkgaW50byBhbiBpbWFnZSB0YWcgYW5kIHJldHVybiBpdC4gT3RoZXJ3aXNlIGp1c3QgcmV0dXJuXG4gICMgdGhlIHBhcmFtXG4gIGN1c3RvbUVtb2ppOiAobWF0Y2gpID0+XG4gICAgcmV0dXJuIG1hdGNoIHVubGVzcyBAZW1vamlcbiAgICBlbW9qaSA9IG1hdGNoLnJlcGxhY2UoLzovZywgJycpXG4gICAgaWYgQGVtb2ppW2Vtb2ppXT9cbiAgICAgIEBjdXN0b21FbW9qaUltYWdlKEBlbW9qaVtlbW9qaV0sIG1hdGNoKVxuICAgIGVsc2VcbiAgICAgIG1hdGNoXG5cbiAgIyBHZXQgY3JlYXRlIGFuIGltYWdlIGZyb20gYSBjdXN0b20gZW1vamlcbiAgY3VzdG9tRW1vamlJbWFnZTogKGVtb2ppLCBtYXRjaCkgPT5cbiAgICBpZiBlbW9qaS5tYXRjaCgvaHR0cC8pP1xuICAgICAgXCI8aW1nIHNyYz0nI3tlbW9qaX0nIGNsYXNzPSdlbW9qaScgdGl0bGU9JyN7bWF0Y2gucmVwbGFjZSgvOi9nLCAnJyl9JyBhbHQ9JyN7bWF0Y2gucmVwbGFjZSgvOi9nLCAnJyl9JyAvPlwiXG4gICAgZWxzZVxuICAgICAgQGN1c3RvbUVtb2ppKFwiOiN7ZW1vamkuc3BsaXQoJzonKVsxXX06XCIpXG5cblxuICAjIFJlcGxhY2UgZW1vamkgc2hvcnQgaGFuZCB3aXRoIGFuIGltYWdlIHRhZyBmb3IgdGhlIGVtb2ppXG4gIHBhcnNlQ3VzdG9tRW1vamk6ICh0ZXh0KSA9PlxuICAgICMgRmluZCBhbmQgcmVwbGFjZSBjdXN0b20gZW1vamkgd2l0aCBpbWFnZXNcbiAgICBlbW9qaSA9IHRleHQubWF0Y2goLzpcXFMrOi9nKVxuICAgIGlmIGVtb2ppXG4gICAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKG1hdGNoLCBAY3VzdG9tRW1vamkobWF0Y2gpKSBmb3IgbWF0Y2ggaW4gZW1vamlcbiAgICB0ZXh0XG5cbiAgIyBVcGRhdGUgdXNlciBwcmVzZW5jZSB2YXJpYWJsZXMuIFRoaXMgd2lsbCBsYXRlciBiZSB1c2VkIHRvIHNob3cgdGhlIGdyZWVuIG9yIGdyYXlcbiAgIyBkb3RzIGluZGljYXRpbmcgd2hldGhlciBvciBub3QgYSB1c2VyIGlzIG9ubGluZS5cbiAgc2V0UHJlc2VuY2U6ICh1c2VyLCBwcmVzZW5jZSkgPT5cbiAgICBmb3IgbWVtYmVyIGluIEBtZW1iZXJzXG4gICAgICBtZW1iZXIucHJlc2VuY2UgPSBwcmVzZW5jZSBpZiBtZW1iZXIuaWQgaXMgdXNlclxuXG4gICMgSWYgYSB1c2VyIGlzIHVua25vd24gKGJvdCkgY3JlYXRlIGEgcHNldWRvIHVzZXIgb2JqZWN0IGZvciB0aGUgdW5rbm93biB1c2VyXG4gIHVua25vd25Vc2VyOiAobWVzc2FnZSkgPT5cbiAgICBpbWFnZTogQG1lbWJlckltYWdlKG51bGwsIG1lc3NhZ2UpXG4gICAgbmFtZTogQG1lbWJlck5hbWUobnVsbCwgbWVzc2FnZSlcblxuXG4iXX0=
