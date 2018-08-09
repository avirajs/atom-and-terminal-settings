(function() {
  var SlackClient, WebSocket, needle, open,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  WebSocket = require('ws');

  needle = require('needle');

  open = require('open');

  module.exports = SlackClient = (function() {
    function SlackClient(clientId, clientSecret, token) {
      this.clientId = clientId;
      this.clientSecret = clientSecret;
      this.token = token;
      this.webSocket = bind(this.webSocket, this);
      this.rtmUrl = bind(this.rtmUrl, this);
      this.addSubscriber = bind(this.addSubscriber, this);
      this.subscribers = [];
      if (this.token === null) {
        if ((this.clientId != null) && (this.clientSecret != null)) {
          open("https://slack.com/oauth/authorize?client_id=" + this.clientId + "&redirect_uri=" + (this.redirectUri()) + "&scope=read,post,client&state=scstate");
        }
      } else {
        this.rtmUrl();
      }
    }

    SlackClient.prototype.addSubscriber = function(sub) {
      return this.subscribers.push(sub);
    };

    SlackClient.prototype.apiPath = function(path, data) {
      var key, params, val;
      params = "";
      for (key in data) {
        val = data[key];
        params += "&" + key + "=" + val;
      }
      return "https://slack.com/api/" + path + (params != null ? "?" + (params.substring(1)) : "");
    };

    SlackClient.prototype.redirectUri = function() {
      return "http://slack-chat.herokuapp.com/slack/" + this.clientId + "/" + this.clientSecret;
    };

    SlackClient.prototype.rtmUrl = function() {
      return needle.get(this.apiPath('rtm.start', {
        token: this.token
      }), (function(_this) {
        return function(err, resp) {
          _this.team = resp.body.team;
          _this.ims = resp.body.ims;
          _this.channels = resp.body.channels;
          _this.groups = resp.body.groups;
          _this.me = resp.body.self;
          _this.users = resp.body.users;
          _this.bots = resp.body.bots;
          return _this.webSocket(resp.body.url);
        };
      })(this));
    };

    SlackClient.prototype.webSocket = function(url) {
      this.client = new WebSocket(url);
      return this.client.on('message', (function(_this) {
        return function(message) {
          var i, len, ref, results, sub;
          ref = _this.subscribers;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            sub = ref[i];
            results.push(sub(message));
          }
          return results;
        };
      })(this));
    };

    SlackClient.prototype.get = function(method, data, callback) {
      if (data == null) {
        data = {};
      }
      data["token"] = this.token;
      return needle.get(this.apiPath(method, data), (function(_this) {
        return function(err, resp) {
          return callback(err, resp);
        };
      })(this));
    };

    SlackClient.prototype.post = function(method, data, options, callback) {
      if (data == null) {
        data = {};
      }
      if (options == null) {
        options = {};
      }
      data["token"] = this.token;
      return needle.post(this.apiPath(method), data, options, (function(_this) {
        return function(err, resp) {
          return callback(err, resp);
        };
      })(this));
    };

    return SlackClient;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYXZpcmFqcy8uYXRvbS9wYWNrYWdlcy9zbGFjay1jaGF0L2xpYi9zbGFjay1jbGllbnQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBO0FBQUEsTUFBQSxvQ0FBQTtJQUFBOztFQUFBLFNBQUEsR0FBWSxPQUFBLENBQVEsSUFBUjs7RUFDWixNQUFBLEdBQVMsT0FBQSxDQUFRLFFBQVI7O0VBQ1QsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUVQLE1BQU0sQ0FBQyxPQUFQLEdBQ007SUFFUyxxQkFBQyxRQUFELEVBQVksWUFBWixFQUEyQixLQUEzQjtNQUFDLElBQUMsQ0FBQSxXQUFEO01BQVcsSUFBQyxDQUFBLGVBQUQ7TUFBZSxJQUFDLENBQUEsUUFBRDs7OztNQUN0QyxJQUFDLENBQUEsV0FBRCxHQUFlO01BQ2YsSUFBRyxJQUFDLENBQUEsS0FBRCxLQUFVLElBQWI7UUFDRSxJQUFHLHVCQUFBLElBQWUsMkJBQWxCO1VBQ0UsSUFBQSxDQUFLLDhDQUFBLEdBQStDLElBQUMsQ0FBQSxRQUFoRCxHQUF5RCxnQkFBekQsR0FBd0UsQ0FBQyxJQUFDLENBQUEsV0FBRCxDQUFBLENBQUQsQ0FBeEUsR0FBd0YsdUNBQTdGLEVBREY7U0FERjtPQUFBLE1BQUE7UUFJRSxJQUFDLENBQUEsTUFBRCxDQUFBLEVBSkY7O0lBRlc7OzBCQVFiLGFBQUEsR0FBZSxTQUFDLEdBQUQ7YUFDYixJQUFDLENBQUEsV0FBVyxDQUFDLElBQWIsQ0FBa0IsR0FBbEI7SUFEYTs7MEJBR2YsT0FBQSxHQUFTLFNBQUMsSUFBRCxFQUFPLElBQVA7QUFDUCxVQUFBO01BQUEsTUFBQSxHQUFTO0FBQ1QsV0FBQSxXQUFBOztRQUFBLE1BQUEsSUFBVSxHQUFBLEdBQUksR0FBSixHQUFRLEdBQVIsR0FBVztBQUFyQjthQUNBLHdCQUFBLEdBQXlCLElBQXpCLEdBQStCLENBQUksY0FBSCxHQUFnQixHQUFBLEdBQUcsQ0FBQyxNQUFNLENBQUMsU0FBUCxDQUFpQixDQUFqQixDQUFELENBQW5CLEdBQStDLEVBQWhEO0lBSHhCOzswQkFLVCxXQUFBLEdBQWEsU0FBQTthQUNYLHdDQUFBLEdBQXlDLElBQUMsQ0FBQSxRQUExQyxHQUFtRCxHQUFuRCxHQUFzRCxJQUFDLENBQUE7SUFENUM7OzBCQUdiLE1BQUEsR0FBUSxTQUFBO2FBQ04sTUFBTSxDQUFDLEdBQVAsQ0FBVyxJQUFDLENBQUEsT0FBRCxDQUFTLFdBQVQsRUFBc0I7UUFBRSxLQUFBLEVBQU8sSUFBQyxDQUFBLEtBQVY7T0FBdEIsQ0FBWCxFQUFxRCxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsR0FBRCxFQUFNLElBQU47VUFDbkQsS0FBQyxDQUFBLElBQUQsR0FBWSxJQUFJLENBQUMsSUFBSSxDQUFDO1VBQ3RCLEtBQUMsQ0FBQSxHQUFELEdBQVksSUFBSSxDQUFDLElBQUksQ0FBQztVQUN0QixLQUFDLENBQUEsUUFBRCxHQUFZLElBQUksQ0FBQyxJQUFJLENBQUM7VUFDdEIsS0FBQyxDQUFBLE1BQUQsR0FBWSxJQUFJLENBQUMsSUFBSSxDQUFDO1VBQ3RCLEtBQUMsQ0FBQSxFQUFELEdBQVksSUFBSSxDQUFDLElBQUksQ0FBQztVQUN0QixLQUFDLENBQUEsS0FBRCxHQUFZLElBQUksQ0FBQyxJQUFJLENBQUM7VUFDdEIsS0FBQyxDQUFBLElBQUQsR0FBWSxJQUFJLENBQUMsSUFBSSxDQUFDO2lCQUN0QixLQUFDLENBQUEsU0FBRCxDQUFXLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBckI7UUFSbUQ7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXJEO0lBRE07OzBCQVdSLFNBQUEsR0FBVyxTQUFDLEdBQUQ7TUFDVCxJQUFDLENBQUEsTUFBRCxHQUFVLElBQUksU0FBSixDQUFjLEdBQWQ7YUFDVixJQUFDLENBQUEsTUFBTSxDQUFDLEVBQVIsQ0FBVyxTQUFYLEVBQXNCLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxPQUFEO0FBQ3BCLGNBQUE7QUFBQTtBQUFBO2VBQUEscUNBQUE7O3lCQUFBLEdBQUEsQ0FBSSxPQUFKO0FBQUE7O1FBRG9CO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF0QjtJQUZTOzswQkFLWCxHQUFBLEdBQUssU0FBQyxNQUFELEVBQVMsSUFBVCxFQUFrQixRQUFsQjs7UUFBUyxPQUFLOztNQUNqQixJQUFLLENBQUEsT0FBQSxDQUFMLEdBQWdCLElBQUMsQ0FBQTthQUNqQixNQUFNLENBQUMsR0FBUCxDQUFXLElBQUMsQ0FBQSxPQUFELENBQVMsTUFBVCxFQUFpQixJQUFqQixDQUFYLEVBQW1DLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxHQUFELEVBQU0sSUFBTjtpQkFDakMsUUFBQSxDQUFTLEdBQVQsRUFBYyxJQUFkO1FBRGlDO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFuQztJQUZHOzswQkFLTCxJQUFBLEdBQU0sU0FBQyxNQUFELEVBQVMsSUFBVCxFQUFrQixPQUFsQixFQUE4QixRQUE5Qjs7UUFBUyxPQUFLOzs7UUFBSSxVQUFROztNQUM5QixJQUFLLENBQUEsT0FBQSxDQUFMLEdBQWdCLElBQUMsQ0FBQTthQUNqQixNQUFNLENBQUMsSUFBUCxDQUFZLElBQUMsQ0FBQSxPQUFELENBQVMsTUFBVCxDQUFaLEVBQThCLElBQTlCLEVBQW9DLE9BQXBDLEVBQTZDLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxHQUFELEVBQU0sSUFBTjtpQkFDM0MsUUFBQSxDQUFTLEdBQVQsRUFBYyxJQUFkO1FBRDJDO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE3QztJQUZJOzs7OztBQS9DUiIsInNvdXJjZXNDb250ZW50IjpbIlxuV2ViU29ja2V0ID0gcmVxdWlyZSgnd3MnKSAgIyBXZWJzb2NrZXQgZm9yIHJ0bSBtZXNzYWdpbmcgdGhyb3VnaCBzbGFja1xubmVlZGxlID0gcmVxdWlyZSgnbmVlZGxlJykgIyBzaW1wbGUgaHR0cCByZXF1ZXN0c1xub3BlbiA9IHJlcXVpcmUoJ29wZW4nKVxuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBTbGFja0NsaWVudFxuXG4gIGNvbnN0cnVjdG9yOiAoQGNsaWVudElkLCBAY2xpZW50U2VjcmV0LCBAdG9rZW4pIC0+XG4gICAgQHN1YnNjcmliZXJzID0gW11cbiAgICBpZiBAdG9rZW4gaXMgbnVsbFxuICAgICAgaWYgQGNsaWVudElkPyBhbmQgQGNsaWVudFNlY3JldD9cbiAgICAgICAgb3BlbiBcImh0dHBzOi8vc2xhY2suY29tL29hdXRoL2F1dGhvcml6ZT9jbGllbnRfaWQ9I3tAY2xpZW50SWR9JnJlZGlyZWN0X3VyaT0je0ByZWRpcmVjdFVyaSgpfSZzY29wZT1yZWFkLHBvc3QsY2xpZW50JnN0YXRlPXNjc3RhdGVcIlxuICAgIGVsc2VcbiAgICAgIEBydG1VcmwoKVxuXG4gIGFkZFN1YnNjcmliZXI6IChzdWIpID0+XG4gICAgQHN1YnNjcmliZXJzLnB1c2ggc3ViXG5cbiAgYXBpUGF0aDogKHBhdGgsIGRhdGEpIC0+XG4gICAgcGFyYW1zID0gXCJcIlxuICAgIHBhcmFtcyArPSBcIiYje2tleX09I3t2YWx9XCIgZm9yIGtleSwgdmFsIG9mIGRhdGFcbiAgICBcImh0dHBzOi8vc2xhY2suY29tL2FwaS8je3BhdGh9I3tpZiBwYXJhbXM/IHRoZW4gXCI/I3twYXJhbXMuc3Vic3RyaW5nKDEpfVwiIGVsc2UgXCJcIn1cIlxuXG4gIHJlZGlyZWN0VXJpOiAtPlxuICAgIFwiaHR0cDovL3NsYWNrLWNoYXQuaGVyb2t1YXBwLmNvbS9zbGFjay8je0BjbGllbnRJZH0vI3tAY2xpZW50U2VjcmV0fVwiXG5cbiAgcnRtVXJsOiA9PlxuICAgIG5lZWRsZS5nZXQgQGFwaVBhdGgoJ3J0bS5zdGFydCcsIHsgdG9rZW46IEB0b2tlbiB9KSwgKGVyciwgcmVzcCkgPT5cbiAgICAgIEB0ZWFtICAgICA9IHJlc3AuYm9keS50ZWFtXG4gICAgICBAaW1zICAgICAgPSByZXNwLmJvZHkuaW1zXG4gICAgICBAY2hhbm5lbHMgPSByZXNwLmJvZHkuY2hhbm5lbHNcbiAgICAgIEBncm91cHMgICA9IHJlc3AuYm9keS5ncm91cHNcbiAgICAgIEBtZSAgICAgICA9IHJlc3AuYm9keS5zZWxmXG4gICAgICBAdXNlcnMgICAgPSByZXNwLmJvZHkudXNlcnNcbiAgICAgIEBib3RzICAgICA9IHJlc3AuYm9keS5ib3RzXG4gICAgICBAd2ViU29ja2V0IHJlc3AuYm9keS51cmxcblxuICB3ZWJTb2NrZXQ6ICh1cmwpID0+XG4gICAgQGNsaWVudCA9IG5ldyBXZWJTb2NrZXQodXJsKVxuICAgIEBjbGllbnQub24gJ21lc3NhZ2UnLCAobWVzc2FnZSkgPT5cbiAgICAgIHN1YihtZXNzYWdlKSBmb3Igc3ViIGluIEBzdWJzY3JpYmVyc1xuXG4gIGdldDogKG1ldGhvZCwgZGF0YT17fSwgY2FsbGJhY2spIC0+XG4gICAgZGF0YVtcInRva2VuXCJdID0gQHRva2VuXG4gICAgbmVlZGxlLmdldCBAYXBpUGF0aChtZXRob2QsIGRhdGEpLCAoZXJyLCByZXNwKSA9PlxuICAgICAgY2FsbGJhY2soZXJyLCByZXNwKVxuXG4gIHBvc3Q6IChtZXRob2QsIGRhdGE9e30sIG9wdGlvbnM9e30sIGNhbGxiYWNrKSAtPlxuICAgIGRhdGFbXCJ0b2tlblwiXSA9IEB0b2tlblxuICAgIG5lZWRsZS5wb3N0IEBhcGlQYXRoKG1ldGhvZCksIGRhdGEsIG9wdGlvbnMsIChlcnIsIHJlc3ApID0+XG4gICAgICBjYWxsYmFjayhlcnIsIHJlc3ApXG4iXX0=
