(function() {
  var CompositeDisposable, GoToDefinitionRails, GoToDefinitionRailsView;

  GoToDefinitionRailsView = require('./go-to-definition-rails-view');

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = GoToDefinitionRails = {
    subscriptions: null,
    finder: null,
    activate: function(state) {
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'go-to-definition-rails:goToMethodDefinition': (function(_this) {
          return function() {
            return _this.goToMethodDefinition();
          };
        })(this)
      }));
      return this.subscriptions.add(atom.commands.add('atom-workspace', {
        'go-to-definition-rails:goToClassMethodDefinition': (function(_this) {
          return function() {
            return _this.goToClassMethodDefinition();
          };
        })(this)
      }));
    },
    deactivate: function() {
      this.subscriptions.dispose();
      if (this.finder != null) {
        return this.finder.cancel();
      }
    },
    goToMethodDefinition: function() {
      var current_word, editor, workspace;
      workspace = atom.workspace;
      editor = workspace.getActivePaneItem();
      current_word = editor.getWordUnderCursor();
      return this.goTo(RegExp("def\\s+" + current_word));
    },
    goToClassMethodDefinition: function() {
      var current_word, editor, workspace;
      workspace = atom.workspace;
      editor = workspace.getActivePaneItem();
      current_word = editor.getWordUnderCursor();
      return this.goTo(RegExp("def\\s+(self\\.)" + current_word));
    },
    goTo: function(regex) {
      var finder;
      if (this.finder != null) {
        this.finder.cancel();
      }
      return this.finder = finder = atom.workspace.defaultDirectorySearcher.search(atom.project.rootDirectories, regex, {
        inclusions: ['*.rb'],
        didMatch: function(searchResult) {
          atom.workspace.open(searchResult.filePath, {
            initialLine: searchResult['matches'][0].range[0][0]
          });
          return finder.cancel();
        },
        didError: function() {},
        didSearchPaths: function() {}
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYXZpcmFqcy8uYXRvbS9wYWNrYWdlcy9nby10by1kZWZpbml0aW9uLXJhaWxzL2xpYi9nby10by1kZWZpbml0aW9uLXJhaWxzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsdUJBQUEsR0FBMEIsT0FBQSxDQUFRLCtCQUFSOztFQUN6QixzQkFBdUIsT0FBQSxDQUFRLE1BQVI7O0VBRXhCLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLG1CQUFBLEdBQ2Y7SUFBQSxhQUFBLEVBQWUsSUFBZjtJQUNBLE1BQUEsRUFBUSxJQURSO0lBR0EsUUFBQSxFQUFVLFNBQUMsS0FBRDtNQUVSLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7TUFHckIsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0M7UUFBQSw2Q0FBQSxFQUErQyxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHLEtBQUMsQ0FBQSxvQkFBRCxDQUFBO1VBQUg7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQS9DO09BQXBDLENBQW5CO2FBQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0M7UUFBQSxrREFBQSxFQUFvRCxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHLEtBQUMsQ0FBQSx5QkFBRCxDQUFBO1VBQUg7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXBEO09BQXBDLENBQW5CO0lBTlEsQ0FIVjtJQVdBLFVBQUEsRUFBWSxTQUFBO01BQ1YsSUFBQyxDQUFBLGFBQWEsQ0FBQyxPQUFmLENBQUE7TUFDQSxJQUFvQixtQkFBcEI7ZUFBQSxJQUFDLENBQUEsTUFBTSxDQUFDLE1BQVIsQ0FBQSxFQUFBOztJQUZVLENBWFo7SUFlQSxvQkFBQSxFQUFzQixTQUFBO0FBQ3BCLFVBQUE7TUFBQSxTQUFBLEdBQVksSUFBSSxDQUFDO01BQ2pCLE1BQUEsR0FBUyxTQUFTLENBQUMsaUJBQVYsQ0FBQTtNQUNULFlBQUEsR0FBZSxNQUFNLENBQUMsa0JBQVAsQ0FBQTthQUNmLElBQUMsQ0FBQSxJQUFELENBQU0sTUFBQSxDQUFBLFNBQUEsR0FBVyxZQUFYLENBQU47SUFKb0IsQ0FmdEI7SUFxQkEseUJBQUEsRUFBMkIsU0FBQTtBQUN6QixVQUFBO01BQUEsU0FBQSxHQUFZLElBQUksQ0FBQztNQUNqQixNQUFBLEdBQVMsU0FBUyxDQUFDLGlCQUFWLENBQUE7TUFDVCxZQUFBLEdBQWUsTUFBTSxDQUFDLGtCQUFQLENBQUE7YUFDZixJQUFDLENBQUEsSUFBRCxDQUFNLE1BQUEsQ0FBQSxrQkFBQSxHQUFtQixZQUFuQixDQUFOO0lBSnlCLENBckIzQjtJQTJCQSxJQUFBLEVBQU0sU0FBQyxLQUFEO0FBQ0osVUFBQTtNQUFBLElBQW9CLG1CQUFwQjtRQUFBLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBUixDQUFBLEVBQUE7O2FBRUEsSUFBQyxDQUFBLE1BQUQsR0FBVSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyx3QkFBd0IsQ0FBQyxNQUF4QyxDQUErQyxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQTVELEVBQTZFLEtBQTdFLEVBQW9GO1FBQ3JHLFVBQUEsRUFBWSxDQUFDLE1BQUQsQ0FEeUY7UUFFckcsUUFBQSxFQUFVLFNBQUMsWUFBRDtVQUNSLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixZQUFZLENBQUMsUUFBakMsRUFBMkM7WUFBRSxXQUFBLEVBQWEsWUFBYSxDQUFBLFNBQUEsQ0FBVyxDQUFBLENBQUEsQ0FBRSxDQUFDLEtBQU0sQ0FBQSxDQUFBLENBQUcsQ0FBQSxDQUFBLENBQW5EO1dBQTNDO2lCQUNBLE1BQU0sQ0FBQyxNQUFQLENBQUE7UUFGUSxDQUYyRjtRQUtyRyxRQUFBLEVBQVUsU0FBQSxHQUFBLENBTDJGO1FBTXJHLGNBQUEsRUFBZ0IsU0FBQSxHQUFBLENBTnFGO09BQXBGO0lBSGYsQ0EzQk47O0FBSkYiLCJzb3VyY2VzQ29udGVudCI6WyJHb1RvRGVmaW5pdGlvblJhaWxzVmlldyA9IHJlcXVpcmUgJy4vZ28tdG8tZGVmaW5pdGlvbi1yYWlscy12aWV3J1xue0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcblxubW9kdWxlLmV4cG9ydHMgPSBHb1RvRGVmaW5pdGlvblJhaWxzID1cbiAgc3Vic2NyaXB0aW9uczogbnVsbFxuICBmaW5kZXI6IG51bGxcblxuICBhY3RpdmF0ZTogKHN0YXRlKSAtPlxuICAgICMgRXZlbnRzIHN1YnNjcmliZWQgdG8gaW4gYXRvbSdzIHN5c3RlbSBjYW4gYmUgZWFzaWx5IGNsZWFuZWQgdXAgd2l0aCBhIENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBAc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG5cbiAgICAjIFJlZ2lzdGVyIGNvbW1hbmQgdGhhdCB0b2dnbGVzIHRoaXMgdmlld1xuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLCAnZ28tdG8tZGVmaW5pdGlvbi1yYWlsczpnb1RvTWV0aG9kRGVmaW5pdGlvbic6ID0+IEBnb1RvTWV0aG9kRGVmaW5pdGlvbigpXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsICdnby10by1kZWZpbml0aW9uLXJhaWxzOmdvVG9DbGFzc01ldGhvZERlZmluaXRpb24nOiA9PiBAZ29Ub0NsYXNzTWV0aG9kRGVmaW5pdGlvbigpXG5cbiAgZGVhY3RpdmF0ZTogLT5cbiAgICBAc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICBAZmluZGVyLmNhbmNlbCgpIGlmIEBmaW5kZXI/XG5cbiAgZ29Ub01ldGhvZERlZmluaXRpb246IC0+XG4gICAgd29ya3NwYWNlID0gYXRvbS53b3Jrc3BhY2VcbiAgICBlZGl0b3IgPSB3b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZUl0ZW0oKVxuICAgIGN1cnJlbnRfd29yZCA9IGVkaXRvci5nZXRXb3JkVW5kZXJDdXJzb3IoKVxuICAgIEBnb1RvKC8vL2RlZlxccysje2N1cnJlbnRfd29yZH0vLy8pXG5cbiAgZ29Ub0NsYXNzTWV0aG9kRGVmaW5pdGlvbjogLT5cbiAgICB3b3Jrc3BhY2UgPSBhdG9tLndvcmtzcGFjZVxuICAgIGVkaXRvciA9IHdvcmtzcGFjZS5nZXRBY3RpdmVQYW5lSXRlbSgpXG4gICAgY3VycmVudF93b3JkID0gZWRpdG9yLmdldFdvcmRVbmRlckN1cnNvcigpXG4gICAgQGdvVG8oLy8vZGVmXFxzKyhzZWxmXFwuKSN7Y3VycmVudF93b3JkfS8vLylcblxuICBnb1RvOiAocmVnZXgpIC0+XG4gICAgQGZpbmRlci5jYW5jZWwoKSBpZiBAZmluZGVyP1xuXG4gICAgQGZpbmRlciA9IGZpbmRlciA9IGF0b20ud29ya3NwYWNlLmRlZmF1bHREaXJlY3RvcnlTZWFyY2hlci5zZWFyY2goYXRvbS5wcm9qZWN0LnJvb3REaXJlY3RvcmllcywgcmVnZXgsIHtcbiAgICAgIGluY2x1c2lvbnM6IFsnKi5yYiddXG4gICAgICBkaWRNYXRjaDogKHNlYXJjaFJlc3VsdCkgLT5cbiAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbihzZWFyY2hSZXN1bHQuZmlsZVBhdGgsIHsgaW5pdGlhbExpbmU6IHNlYXJjaFJlc3VsdFsnbWF0Y2hlcyddWzBdLnJhbmdlWzBdWzBdIH0pXG4gICAgICAgIGZpbmRlci5jYW5jZWwoKVxuICAgICAgZGlkRXJyb3I6ICgpIC0+XG4gICAgICBkaWRTZWFyY2hQYXRoczogKCkgLT5cbiAgICB9KVxuIyBtZXRob2QxXG4iXX0=
