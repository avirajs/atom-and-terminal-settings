(function() {
  var $, Commands, CompositeDisposable, SlackChat, StateController;

  StateController = require('./state-controller');

  Commands = require('./commands');

  CompositeDisposable = require('atom').CompositeDisposable;

  $ = require('atom-space-pen-views').$;

  module.exports = SlackChat = {
    config: {
      api_key: {
        title: "Client ID",
        description: "Slack API client id from https://api.slack.com/applications/new",
        "default": 'null',
        type: 'string'
      },
      api_secret: {
        title: "Client Secret",
        description: "Slack API client secret from https://api.slack.com/applications/new",
        "default": 'null',
        type: 'string'
      },
      api_token: {
        title: 'Slack Token',
        description: 'slack-chat should manage this for you (reset to change teams)',
        "default": 'null',
        type: 'string'
      },
      notifications: {
        title: 'Use system notifications',
        description: 'When this is enabled, system notifications will alert you of received messages.',
        "default": true,
        type: 'boolean'
      },
      preloadChat: {
        title: 'Load conversations on startup',
        description: 'slack-chat will load your conversations on startup instead of when requested',
        "default": false,
        type: 'boolean'
      }
    },
    subscriptions: null,
    activate: function(state) {
      this.subscriptions = new CompositeDisposable;
      this.stateController = new StateController(this.subscriptions);
      this.subscriptions.add(atom.commands.add('atom-workspace', 'slack-chat:toggle', (function(_this) {
        return function() {
          return _this.toggle();
        };
      })(this)));
      return this.commands = new Commands(this.stateController, this.subscriptions);
    },
    deactivate: function() {
      this.subscriptions.dispose();
      return this.stateController.destroyElements();
    },
    serialize: function() {},
    toggle: function() {
      console.log('SlackChat was toggled!');
      return this.stateController.toggle();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYXZpcmFqcy8uYXRvbS9wYWNrYWdlcy9zbGFjay1jaGF0L2xpYi9zbGFjay1jaGF0LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQTtBQUFBLE1BQUE7O0VBQUEsZUFBQSxHQUFrQixPQUFBLENBQVEsb0JBQVI7O0VBQ2xCLFFBQUEsR0FBVyxPQUFBLENBQVEsWUFBUjs7RUFDVixzQkFBdUIsT0FBQSxDQUFRLE1BQVI7O0VBRXZCLElBQUssT0FBQSxDQUFRLHNCQUFSOztFQUVOLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUEsR0FDZjtJQUFBLE1BQUEsRUFDRTtNQUFBLE9BQUEsRUFDRTtRQUFBLEtBQUEsRUFBTyxXQUFQO1FBQ0EsV0FBQSxFQUFhLGlFQURiO1FBRUEsQ0FBQSxPQUFBLENBQUEsRUFBUyxNQUZUO1FBR0EsSUFBQSxFQUFNLFFBSE47T0FERjtNQUtBLFVBQUEsRUFDRTtRQUFBLEtBQUEsRUFBTyxlQUFQO1FBQ0EsV0FBQSxFQUFhLHFFQURiO1FBRUEsQ0FBQSxPQUFBLENBQUEsRUFBUyxNQUZUO1FBR0EsSUFBQSxFQUFNLFFBSE47T0FORjtNQVVBLFNBQUEsRUFDRTtRQUFBLEtBQUEsRUFBTyxhQUFQO1FBQ0EsV0FBQSxFQUFhLCtEQURiO1FBRUEsQ0FBQSxPQUFBLENBQUEsRUFBUyxNQUZUO1FBR0EsSUFBQSxFQUFNLFFBSE47T0FYRjtNQWVBLGFBQUEsRUFDRTtRQUFBLEtBQUEsRUFBTywwQkFBUDtRQUNBLFdBQUEsRUFBYSxpRkFEYjtRQUVBLENBQUEsT0FBQSxDQUFBLEVBQVMsSUFGVDtRQUdBLElBQUEsRUFBTSxTQUhOO09BaEJGO01Bb0JBLFdBQUEsRUFDRTtRQUFBLEtBQUEsRUFBTywrQkFBUDtRQUNBLFdBQUEsRUFBYSw4RUFEYjtRQUVBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FGVDtRQUdBLElBQUEsRUFBTSxTQUhOO09BckJGO0tBREY7SUEyQkEsYUFBQSxFQUFlLElBM0JmO0lBNkJBLFFBQUEsRUFBVSxTQUFDLEtBQUQ7TUFFUixJQUFDLENBQUEsYUFBRCxHQUFpQixJQUFJO01BR3JCLElBQUMsQ0FBQSxlQUFELEdBQW1CLElBQUksZUFBSixDQUFvQixJQUFDLENBQUEsYUFBckI7TUFHbkIsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0MsbUJBQXBDLEVBQXlELENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFBRyxLQUFDLENBQUEsTUFBRCxDQUFBO1FBQUg7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXpELENBQW5CO2FBR0EsSUFBQyxDQUFBLFFBQUQsR0FBWSxJQUFJLFFBQUosQ0FBYSxJQUFDLENBQUEsZUFBZCxFQUErQixJQUFDLENBQUEsYUFBaEM7SUFYSixDQTdCVjtJQTBDQSxVQUFBLEVBQVksU0FBQTtNQUNWLElBQUMsQ0FBQSxhQUFhLENBQUMsT0FBZixDQUFBO2FBQ0EsSUFBQyxDQUFBLGVBQWUsQ0FBQyxlQUFqQixDQUFBO0lBRlUsQ0ExQ1o7SUE4Q0EsU0FBQSxFQUFXLFNBQUEsR0FBQSxDQTlDWDtJQWlEQSxNQUFBLEVBQVEsU0FBQTtNQUNOLE9BQU8sQ0FBQyxHQUFSLENBQVksd0JBQVo7YUFDQSxJQUFDLENBQUEsZUFBZSxDQUFDLE1BQWpCLENBQUE7SUFGTSxDQWpEUjs7QUFQRiIsInNvdXJjZXNDb250ZW50IjpbIlxuU3RhdGVDb250cm9sbGVyID0gcmVxdWlyZSAnLi9zdGF0ZS1jb250cm9sbGVyJ1xuQ29tbWFuZHMgPSByZXF1aXJlICcuL2NvbW1hbmRzJ1xue0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcblxueyR9ID0gcmVxdWlyZSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnXG5cbm1vZHVsZS5leHBvcnRzID0gU2xhY2tDaGF0ID1cbiAgY29uZmlnOlxuICAgIGFwaV9rZXk6XG4gICAgICB0aXRsZTogXCJDbGllbnQgSURcIlxuICAgICAgZGVzY3JpcHRpb246IFwiU2xhY2sgQVBJIGNsaWVudCBpZCBmcm9tIGh0dHBzOi8vYXBpLnNsYWNrLmNvbS9hcHBsaWNhdGlvbnMvbmV3XCJcbiAgICAgIGRlZmF1bHQ6ICdudWxsJ1xuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICBhcGlfc2VjcmV0OlxuICAgICAgdGl0bGU6IFwiQ2xpZW50IFNlY3JldFwiXG4gICAgICBkZXNjcmlwdGlvbjogXCJTbGFjayBBUEkgY2xpZW50IHNlY3JldCBmcm9tIGh0dHBzOi8vYXBpLnNsYWNrLmNvbS9hcHBsaWNhdGlvbnMvbmV3XCJcbiAgICAgIGRlZmF1bHQ6ICdudWxsJ1xuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICBhcGlfdG9rZW46XG4gICAgICB0aXRsZTogJ1NsYWNrIFRva2VuJ1xuICAgICAgZGVzY3JpcHRpb246ICdzbGFjay1jaGF0IHNob3VsZCBtYW5hZ2UgdGhpcyBmb3IgeW91IChyZXNldCB0byBjaGFuZ2UgdGVhbXMpJ1xuICAgICAgZGVmYXVsdDogJ251bGwnXG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgIG5vdGlmaWNhdGlvbnM6XG4gICAgICB0aXRsZTogJ1VzZSBzeXN0ZW0gbm90aWZpY2F0aW9ucydcbiAgICAgIGRlc2NyaXB0aW9uOiAnV2hlbiB0aGlzIGlzIGVuYWJsZWQsIHN5c3RlbSBub3RpZmljYXRpb25zIHdpbGwgYWxlcnQgeW91IG9mIHJlY2VpdmVkIG1lc3NhZ2VzLidcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgIHByZWxvYWRDaGF0OlxuICAgICAgdGl0bGU6ICdMb2FkIGNvbnZlcnNhdGlvbnMgb24gc3RhcnR1cCdcbiAgICAgIGRlc2NyaXB0aW9uOiAnc2xhY2stY2hhdCB3aWxsIGxvYWQgeW91ciBjb252ZXJzYXRpb25zIG9uIHN0YXJ0dXAgaW5zdGVhZCBvZiB3aGVuIHJlcXVlc3RlZCdcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICB0eXBlOiAnYm9vbGVhbidcblxuICBzdWJzY3JpcHRpb25zOiBudWxsXG5cbiAgYWN0aXZhdGU6IChzdGF0ZSkgLT5cbiAgICAjIEV2ZW50cyBzdWJzY3JpYmVkIHRvIGluIGF0b20ncyBzeXN0ZW0gY2FuIGJlIGVhc2lseSBjbGVhbmVkIHVwIHdpdGggYSBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuXG4gICAgIyBDb250cm9sIHNsYWNrLWNoYXQgc3RhdGUgYW5kIG9iamVjdHMgcGFzc2VkIHRvIGVhY2ggc3RhdGVcbiAgICBAc3RhdGVDb250cm9sbGVyID0gbmV3IFN0YXRlQ29udHJvbGxlcihAc3Vic2NyaXB0aW9ucylcblxuICAgICMgUmVnaXN0ZXIgY29tbWFuZCB0aGF0IHRvZ2dsZXMgdGhpcyB2aWV3XG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsICdzbGFjay1jaGF0OnRvZ2dsZScsID0+IEB0b2dnbGUoKVxuXG4gICAgIyBNYW5hZ2UgQ29tbWFuZHNcbiAgICBAY29tbWFuZHMgPSBuZXcgQ29tbWFuZHMoQHN0YXRlQ29udHJvbGxlciwgQHN1YnNjcmlwdGlvbnMpXG5cbiAgZGVhY3RpdmF0ZTogLT5cbiAgICBAc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICBAc3RhdGVDb250cm9sbGVyLmRlc3Ryb3lFbGVtZW50cygpXG5cbiAgc2VyaWFsaXplOiAtPlxuICAgICNzbGFja0NoYXRWaWV3U3RhdGU6IEBzbGFja0NoYXRWaWV3LnNlcmlhbGl6ZSgpXG5cbiAgdG9nZ2xlOiAtPlxuICAgIGNvbnNvbGUubG9nICdTbGFja0NoYXQgd2FzIHRvZ2dsZWQhJ1xuICAgIEBzdGF0ZUNvbnRyb2xsZXIudG9nZ2xlKClcblxuIl19
