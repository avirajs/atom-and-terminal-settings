'use babel';

// Demand-load these modules.

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var DocView = null;
var QueryView = null;

var CompositeDisposable = require('atom').CompositeDisposable;
var Library = require('./library');
var Url = require('url');

var Application = (function () {
  _createClass(Application, null, [{
    key: 'LAZY_LOAD_DELAY_MS_',
    value: 3000,
    enumerable: true
  }]);

  function Application() {
    _classCallCheck(this, Application);

    this.subscriptions_ = new CompositeDisposable();
    this.library_ = new Library();

    setTimeout(this.lazyLoad_.bind(this), Application.LAZY_LOAD_DELAY_MS_);
  }

  _createClass(Application, [{
    key: 'activate',
    value: function activate(state) {
      // Keep all Disposables in a composite so we can clean up easily.
      this.subscriptions_.add(atom.commands.add('atom-workspace', { 'api-docs:search-under-cursor': this.searchUnderCursor_.bind(this) }));
      this.subscriptions_.add(atom.workspace.addOpener(this.opener_.bind(this)));
    }
  }, {
    key: 'deactivate',
    value: function deactivate() {
      this.subscriptions_.dispose();
    }
  }, {
    key: 'searchUnderCursor_',
    value: function searchUnderCursor_() {
      var editor = atom.workspace.getActiveTextEditor();
      if (!editor) {
        return;
      }

      var grammar = editor.getGrammar();
      var selectedText = editor.getSelectedText();
      var wordUnderCursor = editor.getWordUnderCursor({ includeNonWordCharacters: false });
      var items = this.library_.queryAll();

      var searchQuery = selectedText ? selectedText : wordUnderCursor;

      this.lazyLoad_();
      new QueryView(searchQuery, items);
    }
  }, {
    key: 'opener_',
    value: function opener_(url) {
      if (Url.parse(url).protocol == 'api-docs:') {
        this.lazyLoad_();
        return new DocView(this.library_, url);
      }
    }
  }, {
    key: 'lazyLoad_',
    value: function lazyLoad_() {
      if (!QueryView) {
        QueryView = require('./query_view');
      }
      if (!DocView) {
        DocView = require('./doc_view');
      }
    }
  }]);

  return Application;
})();

var instance = new Application();
module.exports = {
  config: {
    '_theme': {
      title: 'Theme',
      description: 'This styles the documentation window.',
      type: 'string',
      'default': 'Light',
      'enum': ['Light', 'Dark'],
      order: 1
    }
  },

  activate: function activate() {
    instance.activate();
  },

  deactivate: function deactivate() {
    instance.deactivate();
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2F2aXJhanMvLmF0b20vcGFja2FnZXMvYXBpLWRvY3Mvc3JjL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFDOzs7Ozs7OztBQUdaLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQztBQUNuQixJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUM7O0FBRXJCLElBQU0sbUJBQW1CLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLG1CQUFtQixDQUFDO0FBQ2hFLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNyQyxJQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7O0lBRXJCLFdBQVc7ZUFBWCxXQUFXOztXQUNjLElBQUk7Ozs7QUFFdEIsV0FIUCxXQUFXLEdBR0Q7MEJBSFYsV0FBVzs7QUFJYixRQUFJLENBQUMsY0FBYyxHQUFHLElBQUksbUJBQW1CLEVBQUUsQ0FBQztBQUNoRCxRQUFJLENBQUMsUUFBUSxHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7O0FBRTlCLGNBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxXQUFXLENBQUMsbUJBQW1CLENBQUMsQ0FBQztHQUN4RTs7ZUFSRyxXQUFXOztXQVVQLGtCQUFDLEtBQUssRUFBRTs7QUFFZCxVQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFLDhCQUE4QixFQUFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDckksVUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQzVFOzs7V0FFUyxzQkFBRztBQUNYLFVBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDL0I7OztXQUVpQiw4QkFBRztBQUNuQixVQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixFQUFFLENBQUM7QUFDcEQsVUFBSSxDQUFDLE1BQU0sRUFBRTtBQUNYLGVBQU87T0FDUjs7QUFFRCxVQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUM7QUFDcEMsVUFBTSxZQUFZLEdBQUcsTUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDO0FBQzlDLFVBQU0sZUFBZSxHQUFHLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLHdCQUF3QixFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7QUFDdkYsVUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQzs7QUFFdkMsVUFBTSxXQUFXLEdBQUcsWUFBWSxHQUFHLFlBQVksR0FBRyxlQUFlLENBQUM7O0FBRWxFLFVBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUNqQixVQUFJLFNBQVMsQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDbkM7OztXQUVNLGlCQUFDLEdBQUcsRUFBRTtBQUNYLFVBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLElBQUksV0FBVyxFQUFFO0FBQzFDLFlBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUNqQixlQUFPLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUM7T0FDeEM7S0FDRjs7O1dBRVEscUJBQUc7QUFDVixVQUFJLENBQUMsU0FBUyxFQUFFO0FBQ2QsaUJBQVMsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7T0FDckM7QUFDRCxVQUFJLENBQUMsT0FBTyxFQUFFO0FBQ1osZUFBTyxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztPQUNqQztLQUNGOzs7U0FuREcsV0FBVzs7O0FBc0RqQixJQUFNLFFBQVEsR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDO0FBQ25DLE1BQU0sQ0FBQyxPQUFPLEdBQUc7QUFDZixRQUFNLEVBQUU7QUFDTixZQUFRLEVBQUU7QUFDUixXQUFLLEVBQUUsT0FBTztBQUNkLGlCQUFXLEVBQUUsdUNBQXVDO0FBQ3BELFVBQUksRUFBRSxRQUFRO0FBQ2QsaUJBQVMsT0FBTztBQUNoQixjQUFNLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQztBQUN2QixXQUFLLEVBQUUsQ0FBQztLQUNUO0dBQ0Y7O0FBRUQsVUFBUSxFQUFFLG9CQUFXO0FBQ25CLFlBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztHQUNyQjs7QUFFRCxZQUFVLEVBQUUsc0JBQVc7QUFDckIsWUFBUSxDQUFDLFVBQVUsRUFBRSxDQUFDO0dBQ3ZCO0NBQ0YsQ0FBQyIsImZpbGUiOiIvaG9tZS9hdmlyYWpzLy5hdG9tL3BhY2thZ2VzL2FwaS1kb2NzL3NyYy9tYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbi8vIERlbWFuZC1sb2FkIHRoZXNlIG1vZHVsZXMuXG52YXIgRG9jVmlldyA9IG51bGw7XG52YXIgUXVlcnlWaWV3ID0gbnVsbDtcblxuY29uc3QgQ29tcG9zaXRlRGlzcG9zYWJsZSA9IHJlcXVpcmUoJ2F0b20nKS5Db21wb3NpdGVEaXNwb3NhYmxlO1xuY29uc3QgTGlicmFyeSA9IHJlcXVpcmUoJy4vbGlicmFyeScpO1xuY29uc3QgVXJsID0gcmVxdWlyZSgndXJsJyk7XG5cbmNsYXNzIEFwcGxpY2F0aW9uIHtcbiAgc3RhdGljIExBWllfTE9BRF9ERUxBWV9NU18gPSAzMDAwO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9uc18gPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuICAgIHRoaXMubGlicmFyeV8gPSBuZXcgTGlicmFyeSgpO1xuXG4gICAgc2V0VGltZW91dCh0aGlzLmxhenlMb2FkXy5iaW5kKHRoaXMpLCBBcHBsaWNhdGlvbi5MQVpZX0xPQURfREVMQVlfTVNfKTtcbiAgfVxuXG4gIGFjdGl2YXRlKHN0YXRlKSB7XG4gICAgLy8gS2VlcCBhbGwgRGlzcG9zYWJsZXMgaW4gYSBjb21wb3NpdGUgc28gd2UgY2FuIGNsZWFuIHVwIGVhc2lseS5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnNfLmFkZChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCB7ICdhcGktZG9jczpzZWFyY2gtdW5kZXItY3Vyc29yJzogdGhpcy5zZWFyY2hVbmRlckN1cnNvcl8uYmluZCh0aGlzKSB9KSk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zXy5hZGQoYXRvbS53b3Jrc3BhY2UuYWRkT3BlbmVyKHRoaXMub3BlbmVyXy5iaW5kKHRoaXMpKSk7XG4gIH1cblxuICBkZWFjdGl2YXRlKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9uc18uZGlzcG9zZSgpO1xuICB9XG5cbiAgc2VhcmNoVW5kZXJDdXJzb3JfKCkge1xuICAgIGNvbnN0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcbiAgICBpZiAoIWVkaXRvcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGdyYW1tYXIgPSBlZGl0b3IuZ2V0R3JhbW1hcigpO1xuICAgIGNvbnN0IHNlbGVjdGVkVGV4dCA9IGVkaXRvci5nZXRTZWxlY3RlZFRleHQoKTtcbiAgICBjb25zdCB3b3JkVW5kZXJDdXJzb3IgPSBlZGl0b3IuZ2V0V29yZFVuZGVyQ3Vyc29yKHsgaW5jbHVkZU5vbldvcmRDaGFyYWN0ZXJzOiBmYWxzZSB9KTtcbiAgICBjb25zdCBpdGVtcyA9IHRoaXMubGlicmFyeV8ucXVlcnlBbGwoKTtcblxuICAgIGNvbnN0IHNlYXJjaFF1ZXJ5ID0gc2VsZWN0ZWRUZXh0ID8gc2VsZWN0ZWRUZXh0IDogd29yZFVuZGVyQ3Vyc29yO1xuXG4gICAgdGhpcy5sYXp5TG9hZF8oKTtcbiAgICBuZXcgUXVlcnlWaWV3KHNlYXJjaFF1ZXJ5LCBpdGVtcyk7XG4gIH1cblxuICBvcGVuZXJfKHVybCkge1xuICAgIGlmIChVcmwucGFyc2UodXJsKS5wcm90b2NvbCA9PSAnYXBpLWRvY3M6Jykge1xuICAgICAgdGhpcy5sYXp5TG9hZF8oKTtcbiAgICAgIHJldHVybiBuZXcgRG9jVmlldyh0aGlzLmxpYnJhcnlfLCB1cmwpO1xuICAgIH1cbiAgfVxuXG4gIGxhenlMb2FkXygpIHtcbiAgICBpZiAoIVF1ZXJ5Vmlldykge1xuICAgICAgUXVlcnlWaWV3ID0gcmVxdWlyZSgnLi9xdWVyeV92aWV3Jyk7XG4gICAgfVxuICAgIGlmICghRG9jVmlldykge1xuICAgICAgRG9jVmlldyA9IHJlcXVpcmUoJy4vZG9jX3ZpZXcnKTtcbiAgICB9XG4gIH1cbn1cblxuY29uc3QgaW5zdGFuY2UgPSBuZXcgQXBwbGljYXRpb24oKTtcbm1vZHVsZS5leHBvcnRzID0ge1xuICBjb25maWc6IHtcbiAgICAnX3RoZW1lJzoge1xuICAgICAgdGl0bGU6ICdUaGVtZScsXG4gICAgICBkZXNjcmlwdGlvbjogJ1RoaXMgc3R5bGVzIHRoZSBkb2N1bWVudGF0aW9uIHdpbmRvdy4nLFxuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBkZWZhdWx0OiAnTGlnaHQnLFxuICAgICAgZW51bTogWydMaWdodCcsICdEYXJrJ10sXG4gICAgICBvcmRlcjogMVxuICAgIH1cbiAgfSxcblxuICBhY3RpdmF0ZTogZnVuY3Rpb24oKSB7XG4gICAgaW5zdGFuY2UuYWN0aXZhdGUoKTtcbiAgfSxcblxuICBkZWFjdGl2YXRlOiBmdW5jdGlvbigpIHtcbiAgICBpbnN0YW5jZS5kZWFjdGl2YXRlKCk7XG4gIH1cbn07XG4iXX0=