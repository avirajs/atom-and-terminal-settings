(function() {
  var CompositeDisposable, Disposable, Expose, ExposeView, FileIcons, ref;

  ref = require('atom'), CompositeDisposable = ref.CompositeDisposable, Disposable = ref.Disposable;

  ExposeView = require('./expose-view');

  FileIcons = require('./file-icons');

  module.exports = Expose = {
    exposeView: null,
    modalPanel: null,
    activate: function() {
      this.exposeView = new ExposeView;
      this.modalPanel = atom.workspace.addModalPanel({
        item: this.exposeView,
        visible: false,
        className: 'expose-panel'
      });
      this.disposables = new CompositeDisposable;
      this.disposables.add(this.modalPanel.onDidChangeVisible((function(_this) {
        return function(visible) {
          return _this.exposeView.didChangeVisible(visible);
        };
      })(this)));
      return this.disposables.add(atom.commands.add('atom-workspace', {
        'expose:toggle': (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this)
      }));
    },
    deactivate: function() {
      this.exposeView.destroy();
      this.modalPanel.destroy();
      return this.disposables.dispose();
    },
    toggle: function() {
      if (this.modalPanel.isVisible()) {
        return this.exposeView.exposeHide();
      } else {
        return this.modalPanel.show();
      }
    },
    consumeFileIcons: function(service) {
      FileIcons.setService(service);
      this.exposeView.updateFileIcons();
      return new Disposable((function(_this) {
        return function() {
          FileIcons.resetService();
          return _this.exposeView.updateFileIcons();
        };
      })(this));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYXZpcmFqcy8uYXRvbS9wYWNrYWdlcy9leHBvc2UvbGliL2V4cG9zZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLE1BQW9DLE9BQUEsQ0FBUSxNQUFSLENBQXBDLEVBQUMsNkNBQUQsRUFBc0I7O0VBRXRCLFVBQUEsR0FBYSxPQUFBLENBQVEsZUFBUjs7RUFDYixTQUFBLEdBQVksT0FBQSxDQUFRLGNBQVI7O0VBRVosTUFBTSxDQUFDLE9BQVAsR0FBaUIsTUFBQSxHQUNmO0lBQUEsVUFBQSxFQUFZLElBQVo7SUFDQSxVQUFBLEVBQVksSUFEWjtJQUdBLFFBQUEsRUFBVSxTQUFBO01BQ1IsSUFBQyxDQUFBLFVBQUQsR0FBYyxJQUFJO01BQ2xCLElBQUMsQ0FBQSxVQUFELEdBQWMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQTZCO1FBQUEsSUFBQSxFQUFNLElBQUMsQ0FBQSxVQUFQO1FBQW1CLE9BQUEsRUFBUyxLQUE1QjtRQUFtQyxTQUFBLEVBQVcsY0FBOUM7T0FBN0I7TUFFZCxJQUFDLENBQUEsV0FBRCxHQUFlLElBQUk7TUFFbkIsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLElBQUMsQ0FBQSxVQUFVLENBQUMsa0JBQVosQ0FBK0IsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLE9BQUQ7aUJBQzlDLEtBQUMsQ0FBQSxVQUFVLENBQUMsZ0JBQVosQ0FBNkIsT0FBN0I7UUFEOEM7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQS9CLENBQWpCO2FBR0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFDZjtRQUFBLGVBQUEsRUFBaUIsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTttQkFBRyxLQUFDLENBQUEsTUFBRCxDQUFBO1VBQUg7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWpCO09BRGUsQ0FBakI7SUFUUSxDQUhWO0lBZUEsVUFBQSxFQUFZLFNBQUE7TUFDVixJQUFDLENBQUEsVUFBVSxDQUFDLE9BQVosQ0FBQTtNQUNBLElBQUMsQ0FBQSxVQUFVLENBQUMsT0FBWixDQUFBO2FBQ0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxPQUFiLENBQUE7SUFIVSxDQWZaO0lBb0JBLE1BQUEsRUFBUSxTQUFBO01BQ04sSUFBRyxJQUFDLENBQUEsVUFBVSxDQUFDLFNBQVosQ0FBQSxDQUFIO2VBQ0UsSUFBQyxDQUFBLFVBQVUsQ0FBQyxVQUFaLENBQUEsRUFERjtPQUFBLE1BQUE7ZUFHRSxJQUFDLENBQUEsVUFBVSxDQUFDLElBQVosQ0FBQSxFQUhGOztJQURNLENBcEJSO0lBMEJBLGdCQUFBLEVBQWtCLFNBQUMsT0FBRDtNQUNoQixTQUFTLENBQUMsVUFBVixDQUFxQixPQUFyQjtNQUNBLElBQUMsQ0FBQSxVQUFVLENBQUMsZUFBWixDQUFBO2FBQ0EsSUFBSSxVQUFKLENBQWUsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO1VBQ2IsU0FBUyxDQUFDLFlBQVYsQ0FBQTtpQkFDQSxLQUFDLENBQUEsVUFBVSxDQUFDLGVBQVosQ0FBQTtRQUZhO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFmO0lBSGdCLENBMUJsQjs7QUFORiIsInNvdXJjZXNDb250ZW50IjpbIntDb21wb3NpdGVEaXNwb3NhYmxlLCBEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG5cbkV4cG9zZVZpZXcgPSByZXF1aXJlICcuL2V4cG9zZS12aWV3J1xuRmlsZUljb25zID0gcmVxdWlyZSAnLi9maWxlLWljb25zJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IEV4cG9zZSA9XG4gIGV4cG9zZVZpZXc6IG51bGxcbiAgbW9kYWxQYW5lbDogbnVsbFxuXG4gIGFjdGl2YXRlOiAtPlxuICAgIEBleHBvc2VWaWV3ID0gbmV3IEV4cG9zZVZpZXdcbiAgICBAbW9kYWxQYW5lbCA9IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwoaXRlbTogQGV4cG9zZVZpZXcsIHZpc2libGU6IGZhbHNlLCBjbGFzc05hbWU6ICdleHBvc2UtcGFuZWwnKVxuXG4gICAgQGRpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcblxuICAgIEBkaXNwb3NhYmxlcy5hZGQgQG1vZGFsUGFuZWwub25EaWRDaGFuZ2VWaXNpYmxlICh2aXNpYmxlKSA9PlxuICAgICAgQGV4cG9zZVZpZXcuZGlkQ2hhbmdlVmlzaWJsZSh2aXNpYmxlKVxuXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLFxuICAgICAgJ2V4cG9zZTp0b2dnbGUnOiA9PiBAdG9nZ2xlKClcblxuICBkZWFjdGl2YXRlOiAtPlxuICAgIEBleHBvc2VWaWV3LmRlc3Ryb3koKVxuICAgIEBtb2RhbFBhbmVsLmRlc3Ryb3koKVxuICAgIEBkaXNwb3NhYmxlcy5kaXNwb3NlKClcblxuICB0b2dnbGU6IC0+XG4gICAgaWYgQG1vZGFsUGFuZWwuaXNWaXNpYmxlKClcbiAgICAgIEBleHBvc2VWaWV3LmV4cG9zZUhpZGUoKVxuICAgIGVsc2VcbiAgICAgIEBtb2RhbFBhbmVsLnNob3coKVxuXG4gIGNvbnN1bWVGaWxlSWNvbnM6IChzZXJ2aWNlKSAtPlxuICAgIEZpbGVJY29ucy5zZXRTZXJ2aWNlKHNlcnZpY2UpXG4gICAgQGV4cG9zZVZpZXcudXBkYXRlRmlsZUljb25zKClcbiAgICBuZXcgRGlzcG9zYWJsZSA9PlxuICAgICAgRmlsZUljb25zLnJlc2V0U2VydmljZSgpXG4gICAgICBAZXhwb3NlVmlldy51cGRhdGVGaWxlSWNvbnMoKVxuIl19
