(function() {
  var AtomTrello, AtomTrelloView, CompositeDisposable, Shell, Trello;

  AtomTrelloView = require('./atom-trello-view');

  Trello = require('node-trello');

  Shell = require('shell');

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = AtomTrello = {
    subscriptions: null,
    atomTrelloView: null,
    hasLoaded: false,
    api: null,
    config: {
      devKey: {
        title: "Trello Developer Key",
        description: "get key at https://trello.com/1/appKey/generate",
        type: "string",
        "default": ""
      },
      token: {
        title: "Token",
        description: "Add developer key and you will be redirected to get your token. Paste below.",
        type: "string",
        "default": ""
      }
    },
    activate: function(state) {
      this.subscriptions = new CompositeDisposable;
      this.settingsInit();
      return this.subscriptions.add(atom.commands.add('atom-workspace', {
        'atom-trello:toggle': (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this)
      }));
    },
    deactivate: function() {
      this.subscriptions.dispose();
      return this.atomTrelloView.destroy();
    },
    initializePackage: function() {
      this.atomTrelloView = new AtomTrelloView();
      this.setApi();
      this.atomTrelloView.setApi(this.api);
      this.getUser((function(_this) {
        return function(data) {
          return _this.atomTrelloView.setUser(data);
        };
      })(this));
      this.atomTrelloView.loadBoards();
      return this.hasLoaded = true;
    },
    toggle: function() {
      if (!this.setApi() || !this.api) {
        atom.notifications.addWarning('Please enter your Trello key and token in the settings');
        return;
      }
      if (!this.hasLoaded) {
        this.initializePackage();
        return;
      }
      if (this.atomTrelloView.panel.isVisible()) {
        return this.atomTrelloView.panel.hide();
      } else {
        this.atomTrelloView.panel.show();
        this.atomTrelloView.populateList();
        return this.atomTrelloView.focusFilterEditor();
      }
    },
    settingsInit: function() {
      atom.config.onDidChange('atom-trello.devKey', (function(_this) {
        return function(arg) {
          var newValue, oldValue;
          newValue = arg.newValue, oldValue = arg.oldValue;
          if (newValue && !atom.config.get('atom-trello.token')) {
            return Shell.openExternal("https://trello.com/1/connect?key=" + newValue + "&name=AtomTrello&response_type=token&scope=read,write&expiration=never");
          } else {
            return _this.sendWelcome();
          }
        };
      })(this));
      return atom.config.onDidChange('atom-trello.token', (function(_this) {
        return function(arg) {
          var newValue, oldValue;
          newValue = arg.newValue, oldValue = arg.oldValue;
          if (newValue) {
            return _this.sendWelcome();
          }
        };
      })(this));
    },
    setApi: function() {
      this.devKey = atom.config.get('atom-trello.devKey');
      this.token = atom.config.get('atom-trello.token');
      if (!this.devKey || !this.token) {
        return false;
      }
      this.api = new Trello(this.devKey, this.token);
      return true;
    },
    getUser: function(callback) {
      return this.api.get('/1/members/me', (function(_this) {
        return function(err, data) {
          if (err != null) {
            atom.notifications.addError('Failed to set Trello API, check your credentials');
            _this.api = null;
            return;
          }
          if (data.username) {
            if (callback) {
              return callback(data);
            }
          }
        };
      })(this));
    },
    sendWelcome: function(callback) {
      if (!this.setApi()) {
        return;
      }
      return this.getUser(function(data) {
        if (data.username) {
          atom.notifications.addSuccess("Hey " + data.fullName + " you're good to go!");
          if (callback) {
            return callback();
          }
        }
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYXZpcmFqcy8uYXRvbS9wYWNrYWdlcy9hdG9tLXRyZWxsby9saWIvYXRvbS10cmVsbG8uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSxvQkFBUjs7RUFDakIsTUFBQSxHQUFTLE9BQUEsQ0FBUSxhQUFSOztFQUNULEtBQUEsR0FBUSxPQUFBLENBQVEsT0FBUjs7RUFDUCxzQkFBdUIsT0FBQSxDQUFRLE1BQVI7O0VBRXhCLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFVBQUEsR0FDZjtJQUFBLGFBQUEsRUFBZSxJQUFmO0lBQ0EsY0FBQSxFQUFnQixJQURoQjtJQUVBLFNBQUEsRUFBVyxLQUZYO0lBR0EsR0FBQSxFQUFLLElBSEw7SUFLQSxNQUFBLEVBQVE7TUFDTixNQUFBLEVBQ0U7UUFBQSxLQUFBLEVBQU8sc0JBQVA7UUFDQSxXQUFBLEVBQWEsaURBRGI7UUFFQSxJQUFBLEVBQU0sUUFGTjtRQUdBLENBQUEsT0FBQSxDQUFBLEVBQVMsRUFIVDtPQUZJO01BTU4sS0FBQSxFQUNFO1FBQUEsS0FBQSxFQUFPLE9BQVA7UUFDQSxXQUFBLEVBQWEsOEVBRGI7UUFFQSxJQUFBLEVBQU0sUUFGTjtRQUdBLENBQUEsT0FBQSxDQUFBLEVBQVMsRUFIVDtPQVBJO0tBTFI7SUFrQkEsUUFBQSxFQUFVLFNBQUMsS0FBRDtNQUNSLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7TUFDckIsSUFBQyxDQUFBLFlBQUQsQ0FBQTthQUNBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DO1FBQUEsb0JBQUEsRUFBc0IsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTttQkFBRyxLQUFDLENBQUEsTUFBRCxDQUFBO1VBQUg7UUFBQSxDQUFBLENBQUEsQ0FBQSxJ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QTRFQSxPQUFBLEVBQVMsU0FBQyxRQUFEO2FBQ1AsSUFBQyxDQUFBLEdBQUcsQ0FBQyxHQUFMLENBQVMsZUFBVCxFQUEwQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsR0FBRCxFQUFNLElBQU47VUFDeEIsSUFBRyxXQUFIO1lBQ0UsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFuQixDQUE0QixrREFBNUI7WUFDQSxLQUFDLENBQUEsR0FBRCxHQUFPO0FBQ1AsbUJBSEY7O1VBSUEsSUFBRyxJQUFJLENBQUMsUUFBUjtZQUNFLElBQUcsUUFBSDtxQkFDRSxRQUFBLENBQVMsSUFBVCxFQURGO2FBREY7O1FBTHdCO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUExQjtJQURPLENBNUVUO0lBc0ZBLFdBQUEsRUFBYSxTQUFDLFFBQUQ7TUFDWCxJQUFHLENBQUMsSUFBQyxDQUFBLE1BQUQsQ0FBQSxDQUFKO0FBQ0UsZUFERjs7YUFFQSxJQUFDLENBQUEsT0FBRCxDQUFTLFNBQUMsSUFBRDtRQUNQLElBQUcsSUFBSSxDQUFDLFFBQVI7VUFDRSxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQW5CLENBQThCLE1BQUEsR0FBTyxJQUFJLENBQUMsUUFBWixHQUFxQixxQkFBbkQ7VUFDQSxJQUFHLFFBQUg7bUJBQ0UsUUFBQSxDQUFBLEVBREY7V0FGRjs7TUFETyxDQUFUO0lBSFcsQ0F0RmI7O0FBTkYiLCJzb3VyY2VzQ29udGVudCI6WyJBdG9tVHJlbGxvVmlldyA9IHJlcXVpcmUgJy4vYXRvbS10cmVsbG8tdmlldydcblRyZWxsbyA9IHJlcXVpcmUgJ25vZGUtdHJlbGxvJ1xuU2hlbGwgPSByZXF1aXJlICdzaGVsbCdcbntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG5cbm1vZHVsZS5leHBvcnRzID0gQXRvbVRyZWxsbyA9XG4gIHN1YnNjcmlwdGlvbnM6IG51bGxcbiAgYXRvbVRyZWxsb1ZpZXc6IG51bGxcbiAgaGFzTG9hZGVkOiBmYWxzZVxuICBhcGk6IG51bGxcblxuICBjb25maWc6IHtcbiAgICBkZXZLZXk6XG4gICAgICB0aXRsZTogXCJUcmVsbG8gRGV2ZWxvcGVyIEtleVwiXG4gICAgICBkZXNjcmlwdGlvbjogXCJnZXQga2V5IGF0IGh0dHBzOi8vdHJlbGxvLmNvbS8xL2FwcEtleS9nZW5lcmF0ZVwiXG4gICAgICB0eXBlOiBcInN0cmluZ1wiXG4gICAgICBkZWZhdWx0OiBcIlwiXG4gICAgdG9rZW46XG4gICAgICB0aXRsZTogXCJUb2tlblwiXG4gICAgICBkZXNjcmlwdGlvbjogXCJBZGQgZGV2ZWxvcGVyIGtleSBhbmQgeW91IHdpbGwgYmUgcmVkaXJlY3RlZCB0byBnZXQgeW91ciB0b2tlbi4gUGFzdGUgYmVsb3cuXCJcbiAgICAgIHR5cGU6IFwic3RyaW5nXCJcbiAgICAgIGRlZmF1bHQ6IFwiXCJcbiAgfVxuXG4gIGFjdGl2YXRlOiAoc3RhdGUpIC0+XG4gICAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIEBzZXR0aW5nc0luaXQoKVxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLCAnYXRvbS10cmVsbG86dG9nZ2xlJzogPT4gQHRvZ2dsZSgpXG5cbiAgZGVhY3RpdmF0ZTogLT5cbiAgICBAc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICBAYXRvbVRyZWxsb1ZpZXcuZGVzdHJveSgpXG5cbiAgIyBzZXJpYWxpemU6IC0+XG4gICMgICBhdG9tVGVzdFZpZXdTdGF0ZTogQGF0b21UZXN0Vmlldy5zZXJpYWxpemUoKVxuXG4gIGluaXRpYWxpemVQYWNrYWdlOiAoKSAtPlxuICAgIEBhdG9tVHJlbGxvVmlldyA9IG5ldyBBdG9tVHJlbGxvVmlldygpXG4gICAgQHNldEFwaSgpXG4gICAgQGF0b21UcmVsbG9WaWV3LnNldEFwaSBAYXBpXG4gICAgQGdldFVzZXIgKGRhdGEpID0+XG4gICAgICBAYXRvbVRyZWxsb1ZpZXcuc2V0VXNlciBkYXRhXG4gICAgQGF0b21UcmVsbG9WaWV3LmxvYWRCb2FyZHMoKVxuICAgIEBoYXNMb2FkZWQgPSB0cnVlXG5cbiAgdG9nZ2xlOiAtPlxuICAgIGlmICFAc2V0QXBpKCkgb3IgIUBhcGlcbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRXYXJuaW5nICdQbGVhc2UgZW50ZXIgeW91ciBUcmVsbG8ga2V5IGFuZCB0b2tlbiBpbiB0aGUgc2V0dGluZ3MnXG4gICAgICByZXR1cm5cblxuICAgIGlmICFAaGFzTG9hZGVkXG4gICAgICBAaW5pdGlhbGl6ZVBhY2thZ2UoKVxuICAgICAgcmV0dXJuXG5cbiAgICBpZiBAYXRvbVRyZWxsb1ZpZXcucGFuZWwuaXNWaXNpYmxlKClcbiAgICAgIEBhdG9tVHJlbGxvVmlldy5wYW5lbC5oaWRlKClcbiAgICBlbHNlXG4gICAgICBAYXRvbVRyZWxsb1ZpZXcucGFuZWwuc2hvdygpXG4gICAgICBAYXRvbVRyZWxsb1ZpZXcucG9wdWxhdGVMaXN0KClcbiAgICAgIEBhdG9tVHJlbGxvVmlldy5mb2N1c0ZpbHRlckVkaXRvcigpXG5cbiAgc2V0dGluZ3NJbml0OiAoKSAtPlxuICAgIGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlICdhdG9tLXRyZWxsby5kZXZLZXknLCAoe25ld1ZhbHVlLCBvbGRWYWx1ZX0pID0+XG4gICAgICBpZiBuZXdWYWx1ZSBhbmQgIWF0b20uY29uZmlnLmdldCgnYXRvbS10cmVsbG8udG9rZW4nKVxuICAgICAgICBTaGVsbC5vcGVuRXh0ZXJuYWwoXCJodHRwczovL3RyZWxsby5jb20vMS9jb25uZWN0P2tleT0je25ld1ZhbHVlfSZuYW1lPUF0b21UcmVsbG8mcmVzcG9uc2VfdHlwZT10b2tlbiZzY29wZT1yZWFkLHdyaXRlJmV4cGlyYXRpb249bmV2ZXJcIilcbiAgICAgIGVsc2VcbiAgICAgICAgQHNlbmRXZWxjb21lKClcblxuICAgIGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlICdhdG9tLXRyZWxsby50b2tlbicsICh7bmV3VmFsdWUsIG9sZFZhbHVlfSkgPT5cbiAgICAgIGlmIG5ld1ZhbHVlXG4gICAgICAgIEBzZW5kV2VsY29tZSgpXG5cbiAgc2V0QXBpOiAoKSAtPlxuICAgIEBkZXZLZXkgPSBhdG9tLmNvbmZpZy5nZXQoJ2F0b20tdHJlbGxvLmRldktleScpXG4gICAgQHRva2VuID0gYXRvbS5jb25maWcuZ2V0KCdhdG9tLXRyZWxsby50b2tlbicpXG5cbiAgICBpZiAhQGRldktleSB8fCAhQHRva2VuXG4gICAgICByZXR1cm4gZmFsc2VcblxuICAgIEBhcGkgPSBuZXcgVHJlbGxvIEBkZXZLZXksIEB0b2tlblxuICAgIHJldHVybiB0cnVlXG5cbiAgZ2V0VXNlcjogKGNhbGxiYWNrKSAtPlxuICAgIEBhcGkuZ2V0ICcvMS9tZW1iZXJzL21lJywgKGVyciwgZGF0YSkgPT5cbiAgICAgIGlmIGVycj9cbiAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yICdGYWlsZWQgdG8gc2V0IFRyZWxsbyBBUEksIGNoZWNrIHlvdXIgY3JlZGVudGlhbHMnXG4gICAgICAgIEBhcGkgPSBudWxsXG4gICAgICAgIHJldHVyblxuICAgICAgaWYgZGF0YS51c2VybmFtZVxuICAgICAgICBpZiBjYWxsYmFja1xuICAgICAgICAgIGNhbGxiYWNrKGRhdGEpXG5cbiAgc2VuZFdlbGNvbWU6IChjYWxsYmFjaykgLT5cbiAgICBpZiAhQHNldEFwaSgpXG4gICAgICByZXR1cm5cbiAgICBAZ2V0VXNlciAoZGF0YSkgLT5cbiAgICAgIGlmIGRhdGEudXNlcm5hbWVcbiAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFN1Y2Nlc3MgXCJIZXkgI3tkYXRhLmZ1bGxOYW1lfSB5b3UncmUgZ29vZCB0byBnbyFcIlxuICAgICAgICBpZiBjYWxsYmFja1xuICAgICAgICAgIGNhbGxiYWNrKClcbiJdfQ==
