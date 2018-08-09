(function() {
  var CompositeDisposable, ExposeTabView, ExposeView, Sortable, TextBuffer, TextEditorView, View, filter, ref, ref1,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require('atom'), CompositeDisposable = ref.CompositeDisposable, TextBuffer = ref.TextBuffer;

  ref1 = require('atom-space-pen-views'), View = ref1.View, TextEditorView = ref1.TextEditorView;

  filter = require('fuzzaldrin').filter;

  Sortable = require('sortablejs');

  ExposeTabView = require('./expose-tab-view');

  module.exports = ExposeView = (function(superClass) {
    extend(ExposeView, superClass);

    ExposeView.prototype.tabs = [];

    ExposeView.content = function(searchBuffer) {
      var searchTextEditor;
      searchTextEditor = atom.workspace.buildTextEditor({
        mini: true,
        tabLength: 2,
        softTabs: true,
        softWrapped: false,
        buffer: searchBuffer,
        placeholderText: 'Search tabs'
      });
      return this.div({
        "class": 'expose-view',
        tabindex: -1
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'expose-top input-block'
          }, function() {
            _this.div({
              "class": 'input-block-item input-block-item--flex'
            }, function() {
              return _this.subview('searchView', new TextEditorView({
                editor: searchTextEditor
              }));
            });
            return _this.div({
              "class": 'input-block-item'
            }, function() {
              return _this.div({
                "class": 'btn-group'
              }, function() {
                _this.button({
                  outlet: 'exposeSettings',
                  "class": 'btn icon-gear'
                });
                return _this.button({
                  "class": 'btn icon-x'
                });
              });
            });
          });
          return _this.div({
            outlet: 'tabList',
            "class": 'tab-list'
          });
        };
      })(this));
    };

    function ExposeView() {
      ExposeView.__super__.constructor.call(this, this.searchBuffer = new TextBuffer);
    }

    ExposeView.prototype.initialize = function() {
      this.disposables = new CompositeDisposable;
      this.handleEvents();
      return this.handleDrag();
    };

    ExposeView.prototype.destroy = function() {
      var ref2;
      this.remove();
      return (ref2 = this.disposables) != null ? ref2.dispose() : void 0;
    };

    ExposeView.prototype.handleEvents = function() {
      this.exposeSettings.on('click', function() {
        return atom.workspace.open('atom://config/packages/expose');
      });
      this.searchView.on('click', function(event) {
        return event.stopPropagation();
      });
      this.searchView.getModel().onDidStopChanging((function(_this) {
        return function() {
          if (_this.didIgnoreFirstChange) {
            _this.update();
          }
          return _this.didIgnoreFirstChange = true;
        };
      })(this));
      this.on('click', (function(_this) {
        return function(event) {
          event.stopPropagation();
          return _this.exposeHide();
        };
      })(this));
      this.disposables.add(atom.commands.add(this.element, {
        'core:confirm': (function(_this) {
          return function() {
            return _this.handleConfirm();
          };
        })(this),
        'core:cancel': (function(_this) {
          return function() {
            return _this.exposeHide();
          };
        })(this),
        'core:move-right': (function(_this) {
          return function() {
            return _this.nextTab();
          };
        })(this),
        'core:move-left': (function(_this) {
          return function() {
            return _this.nextTab(-1);
          };
        })(this),
        'expose:close': (function(_this) {
          return function() {
            return _this.exposeHide();
          };
        })(this),
        'expose:activate-1': (function(_this) {
          return function() {
            return _this.handleNumberKey(1);
          };
        })(this),
        'expose:activate-2': (function(_this) {
          return function() {
            return _this.handleNumberKey(2);
          };
        })(this),
        'expose:activate-3': (function(_this) {
          return function() {
            return _this.handleNumberKey(3);
          };
        })(this),
        'expose:activate-4': (function(_this) {
          return function() {
            return _this.handleNumberKey(4);
          };
        })(this),
        'expose:activate-5': (function(_this) {
          return function() {
            return _this.handleNumberKey(5);
          };
        })(this),
        'expose:activate-6': (function(_this) {
          return function() {
            return _this.handleNumberKey(6);
          };
        })(this),
        'expose:activate-7': (function(_this) {
          return function() {
            return _this.handleNumberKey(7);
          };
        })(this),
        'expose:activate-8': (function(_this) {
          return function() {
            return _this.handleNumberKey(8);
          };
        })(this),
        'expose:activate-9': (function(_this) {
          return function() {
            return _this.handleNumberKey(9);
          };
        })(this)
      }));
      this.on('keydown', (function(_this) {
        return function(event) {
          return _this.handleKeyEvent(event);
        };
      })(this));
      this.disposables.add(atom.workspace.onDidAddPaneItem((function(_this) {
        return function() {
          return _this.update();
        };
      })(this)));
      return this.disposables.add(atom.workspace.onDidDestroyPaneItem((function(_this) {
        return function() {
          return _this.update();
        };
      })(this)));
    };

    ExposeView.prototype.handleDrag = function() {
      return Sortable.create(this.tabList.context, {
        ghostClass: 'ghost',
        onEnd: (function(_this) {
          return function(evt) {
            return _this.moveTab(evt.oldIndex, evt.newIndex);
          };
        })(this)
      });
    };

    ExposeView.prototype.moveTab = function(from, to) {
      var fromItem, fromPane, i, item, j, len, ref2, ref3, ref4, toItem, toPane, toPaneIndex;
      if (!(fromItem = (ref2 = this.tabs[from]) != null ? ref2.item : void 0)) {
        return;
      }
      if (!(toItem = (ref3 = this.tabs[to]) != null ? ref3.item : void 0)) {
        return;
      }
      fromPane = atom.workspace.paneForItem(fromItem);
      toPane = atom.workspace.paneForItem(toItem);
      toPaneIndex = 0;
      ref4 = toPane.getItems();
      for (i = j = 0, len = ref4.length; j < len; i = ++j) {
        item = ref4[i];
        if (item === toItem) {
          toPaneIndex = i;
        }
      }
      fromPane.moveItemToPane(fromItem, toPane, toPaneIndex);
      return this.update(true);
    };

    ExposeView.prototype.didChangeVisible = function(visible) {
      this.visible = visible;
      if (this.visible) {
        this.searchBuffer.setText('');
        this.update();
        return this.focus();
      } else {
        return atom.workspace.getActivePane().activate();
      }
    };

    ExposeView.prototype.getGroupColor = function(n) {
      var colors;
      colors = ['#3498db', '#e74c3c', '#2ecc71', '#9b59b6'];
      return colors[n % colors.length];
    };

    ExposeView.prototype.update = function(force) {
      var color, i, item, j, k, len, len1, pane, ref2, ref3;
      if (!(this.visible || force)) {
        return;
      }
      this.removeTabs();
      this.tabs = [];
      ref2 = this.getPanes();
      for (i = j = 0, len = ref2.length; j < len; i = ++j) {
        pane = ref2[i];
        color = this.getGroupColor(i);
        ref3 = pane.getItems();
        for (k = 0, len1 = ref3.length; k < len1; k++) {
          item = ref3[k];
          this.tabs.push(new ExposeTabView(item, color));
        }
      }
      return this.renderTabs(this.tabs = this.filterTabs(this.tabs));
    };

    ExposeView.prototype.getPanes = function() {
      return atom.workspace.getCenter().getPanes();
    };

    ExposeView.prototype.filterTabs = function(tabs) {
      var text;
      text = this.searchBuffer.getText();
      if (text === '') {
        return tabs;
      }
      return filter(tabs, text, {
        key: 'title'
      });
    };

    ExposeView.prototype.renderTabs = function(tabs) {
      var j, len, results, tab;
      results = [];
      for (j = 0, len = tabs.length; j < len; j++) {
        tab = tabs[j];
        results.push(this.tabList.append(tab));
      }
      return results;
    };

    ExposeView.prototype.removeTabs = function() {
      var j, len, ref2, tab;
      this.tabList.empty();
      ref2 = this.tabs;
      for (j = 0, len = ref2.length; j < len; j++) {
        tab = ref2[j];
        tab.destroy();
      }
      return this.tabs = [];
    };

    ExposeView.prototype.activateTab = function(n) {
      var ref2;
      if (n == null) {
        n = 1;
      }
      if (n < 1) {
        n = 1;
      }
      if (n > 9 || n > this.tabs.length) {
        n = this.tabs.length;
      }
      if ((ref2 = this.tabs[n - 1]) != null) {
        ref2.activateTab();
      }
      return this.exposeHide();
    };

    ExposeView.prototype.handleConfirm = function() {
      if (this.isSearching()) {
        return this.activateTab();
      } else {
        return this.exposeHide();
      }
    };

    ExposeView.prototype.handleNumberKey = function(number) {
      if (this.isSearching()) {
        return this.searchView.getModel().insertText(number.toString());
      } else {
        return this.activateTab(number);
      }
    };

    ExposeView.prototype.handleKeyEvent = function(event) {
      var ignoredKeys;
      ignoredKeys = ['shift', 'control', 'alt', 'meta'];
      if (ignoredKeys.indexOf(event.key.toLowerCase()) === -1) {
        return this.searchView.focus();
      }
    };

    ExposeView.prototype.nextTab = function(n) {
      var i, j, len, nextTabView, ref2, tabView;
      if (n == null) {
        n = 1;
      }
      ref2 = this.tabs;
      for (i = j = 0, len = ref2.length; j < len; i = ++j) {
        tabView = ref2[i];
        if (tabView.isActiveTab()) {
          if (i + n < 0) {
            n = this.tabs.length - 1;
          }
          if (nextTabView = this.tabs[(i + n) % this.tabs.length]) {
            nextTabView.activateTab();
          }
          return this.focus();
        }
      }
    };

    ExposeView.prototype.exposeHide = function() {
      var j, k, len, len1, panel, ref2, ref3, results, tab;
      this.didIgnoreFirstChange = false;
      ref2 = this.tabs;
      for (j = 0, len = ref2.length; j < len; j++) {
        tab = ref2[j];
        tab.destroy();
      }
      ref3 = atom.workspace.getModalPanels();
      results = [];
      for (k = 0, len1 = ref3.length; k < len1; k++) {
        panel = ref3[k];
        if (panel.className === 'expose-panel') {
          results.push(panel.hide());
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    ExposeView.prototype.isSearching = function() {
      return this.searchView.hasClass('is-focused');
    };

    ExposeView.prototype.updateFileIcons = function() {
      var j, len, ref2, results, tab;
      ref2 = this.tabs;
      results = [];
      for (j = 0, len = ref2.length; j < len; j++) {
        tab = ref2[j];
        results.push(tab.updateIcon());
      }
      return results;
    };

    return ExposeView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYXZpcmFqcy8uYXRvbS9wYWNrYWdlcy9leHBvc2UvbGliL2V4cG9zZS12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsNkdBQUE7SUFBQTs7O0VBQUEsTUFBb0MsT0FBQSxDQUFRLE1BQVIsQ0FBcEMsRUFBQyw2Q0FBRCxFQUFzQjs7RUFDdEIsT0FBeUIsT0FBQSxDQUFRLHNCQUFSLENBQXpCLEVBQUMsZ0JBQUQsRUFBTzs7RUFDTixTQUFVLE9BQUEsQ0FBUSxZQUFSOztFQUNYLFFBQUEsR0FBVyxPQUFBLENBQVEsWUFBUjs7RUFFWCxhQUFBLEdBQWdCLE9BQUEsQ0FBUSxtQkFBUjs7RUFFaEIsTUFBTSxDQUFDLE9BQVAsR0FDTTs7O3lCQUNKLElBQUEsR0FBTTs7SUFFTixVQUFDLENBQUEsT0FBRCxHQUFVLFNBQUMsWUFBRDtBQUNSLFVBQUE7TUFBQSxnQkFBQSxHQUFtQixJQUFJLENBQUMsU0FBUyxDQUFDLGVBQWYsQ0FDakI7UUFBQSxJQUFBLEVBQU0sSUFBTjtRQUNBLFNBQUEsRUFBVyxDQURYO1FBRUEsUUFBQSxFQUFVLElBRlY7UUFHQSxXQUFBLEVBQWEsS0FIYjtRQUlBLE1BQUEsRUFBUSxZQUpSO1FBS0EsZUFBQSxFQUFpQixhQUxqQjtPQURpQjthQVNuQixJQUFDLENBQUEsR0FBRCxDQUFLO1FBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxhQUFQO1FBQXNCLFFBQUEsRUFBVSxDQUFDLENBQWpDO09BQUwsRUFBeUMsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO1VBQ3ZDLEtBQUMsQ0FBQSxHQUFELENBQUs7WUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLHdCQUFQO1dBQUwsRUFBc0MsU0FBQTtZQUNwQyxLQUFDLENBQUEsR0FBRCxDQUFLO2NBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyx5Q0FBUDthQUFMLEVBQXVELFNBQUE7cUJBQ3JELEtBQUMsQ0FB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QSxJQUFDLENBQUEsVUFBVSxDQUFDLEtBQVosQ0FBQSxFQUFBOztJQUZjOzt5QkFJaEIsT0FBQSxHQUFTLFNBQUMsQ0FBRDtBQUNQLFVBQUE7O1FBRFEsSUFBSTs7QUFDWjtBQUFBLFdBQUEsOENBQUE7O1FBQ0UsSUFBRyxPQUFPLENBQUMsV0FBUixDQUFBLENBQUg7VUFDRSxJQUF3QixDQUFBLEdBQUUsQ0FBRixHQUFNLENBQTlCO1lBQUEsQ0FBQSxHQUFJLElBQUMsQ0FBQSxJQUFJLENBQUMsTUFBTixHQUFlLEVBQW5COztVQUNBLElBQTZCLFdBQUEsR0FBYyxJQUFDLENBQUEsSUFBSyxDQUFBLENBQUMsQ0FBQSxHQUFFLENBQUgsQ0FBQSxHQUFNLElBQUMsQ0FBQSxJQUFJLENBQUMsTUFBWixDQUFqRDtZQUFBLFdBQVcsQ0FBQyxXQUFaLENBQUEsRUFBQTs7QUFDQSxpQkFBTyxJQUFDLENBQUEsS0FBRCxDQUFBLEVBSFQ7O0FBREY7SUFETzs7eUJBT1QsVUFBQSxHQUFZLFNBQUE7QUFDVixVQUFBO01BQUEsSUFBQyxDQUFBLG9CQUFELEdBQXdCO0FBQ3hCO0FBQUEsV0FBQSxzQ0FBQTs7UUFDRSxHQUFHLENBQUMsT0FBSixDQUFBO0FBREY7QUFFQTtBQUFBO1dBQUEsd0NBQUE7O1FBQ0UsSUFBZ0IsS0FBSyxDQUFDLFNBQU4sS0FBbUIsY0FBbkM7dUJBQUEsS0FBSyxDQUFDLElBQU4sQ0FBQSxHQUFBO1NBQUEsTUFBQTsrQkFBQTs7QUFERjs7SUFKVTs7eUJBT1osV0FBQSxHQUFhLFNBQUE7YUFBRyxJQUFDLENBQUEsVUFBVSxDQUFDLFFBQVosQ0FBcUIsWUFBckI7SUFBSDs7eUJBRWIsZUFBQSxHQUFpQixTQUFBO0FBQ2YsVUFBQTtBQUFBO0FBQUE7V0FBQSxzQ0FBQTs7cUJBQ0UsR0FBRyxDQUFDLFVBQUosQ0FBQTtBQURGOztJQURlOzs7O0tBM0tNO0FBUnpCIiwic291cmNlc0NvbnRlbnQiOlsie0NvbXBvc2l0ZURpc3Bvc2FibGUsIFRleHRCdWZmZXJ9ID0gcmVxdWlyZSAnYXRvbSdcbntWaWV3LCBUZXh0RWRpdG9yVmlld30gPSByZXF1aXJlICdhdG9tLXNwYWNlLXBlbi12aWV3cydcbntmaWx0ZXJ9ID0gcmVxdWlyZSAnZnV6emFsZHJpbidcblNvcnRhYmxlID0gcmVxdWlyZSAnc29ydGFibGVqcydcblxuRXhwb3NlVGFiVmlldyA9IHJlcXVpcmUgJy4vZXhwb3NlLXRhYi12aWV3J1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBFeHBvc2VWaWV3IGV4dGVuZHMgVmlld1xuICB0YWJzOiBbXVxuXG4gIEBjb250ZW50OiAoc2VhcmNoQnVmZmVyKSAtPlxuICAgIHNlYXJjaFRleHRFZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5idWlsZFRleHRFZGl0b3IoXG4gICAgICBtaW5pOiB0cnVlXG4gICAgICB0YWJMZW5ndGg6IDJcbiAgICAgIHNvZnRUYWJzOiB0cnVlXG4gICAgICBzb2Z0V3JhcHBlZDogZmFsc2VcbiAgICAgIGJ1ZmZlcjogc2VhcmNoQnVmZmVyXG4gICAgICBwbGFjZWhvbGRlclRleHQ6ICdTZWFyY2ggdGFicydcbiAgICApXG5cbiAgICBAZGl2IGNsYXNzOiAnZXhwb3NlLXZpZXcnLCB0YWJpbmRleDogLTEsID0+XG4gICAgICBAZGl2IGNsYXNzOiAnZXhwb3NlLXRvcCBpbnB1dC1ibG9jaycsID0+XG4gICAgICAgIEBkaXYgY2xhc3M6ICdpbnB1dC1ibG9jay1pdGVtIGlucHV0LWJsb2NrLWl0ZW0tLWZsZXgnLCA9PlxuICAgICAgICAgIEBzdWJ2aWV3ICdzZWFyY2hWaWV3JywgbmV3IFRleHRFZGl0b3JWaWV3KGVkaXRvcjogc2VhcmNoVGV4dEVkaXRvcilcbiAgICAgICAgQGRpdiBjbGFzczogJ2lucHV0LWJsb2NrLWl0ZW0nLCA9PlxuICAgICAgICAgIEBkaXYgY2xhc3M6ICdidG4tZ3JvdXAnLCA9PlxuICAgICAgICAgICAgQGJ1dHRvbiBvdXRsZXQ6ICdleHBvc2VTZXR0aW5ncycsIGNsYXNzOiAnYnRuIGljb24tZ2VhcidcbiAgICAgICAgICAgIEBidXR0b24gY2xhc3M6ICdidG4gaWNvbi14J1xuXG4gICAgICBAZGl2IG91dGxldDogJ3RhYkxpc3QnLCBjbGFzczogJ3RhYi1saXN0J1xuXG4gIGNvbnN0cnVjdG9yOiAoKSAtPlxuICAgIHN1cGVyIEBzZWFyY2hCdWZmZXIgPSBuZXcgVGV4dEJ1ZmZlclxuXG4gIGluaXRpYWxpemU6IC0+XG4gICAgQGRpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBAaGFuZGxlRXZlbnRzKClcbiAgICBAaGFuZGxlRHJhZygpXG5cbiAgZGVzdHJveTogLT5cbiAgICBAcmVtb3ZlKClcbiAgICBAZGlzcG9zYWJsZXM/LmRpc3Bvc2UoKVxuXG4gIGhhbmRsZUV2ZW50czogLT5cbiAgICBAZXhwb3NlU2V0dGluZ3Mub24gJ2NsaWNrJywgLT5cbiAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4gJ2F0b206Ly9jb25maWcvcGFja2FnZXMvZXhwb3NlJ1xuXG4gICAgQHNlYXJjaFZpZXcub24gJ2NsaWNrJywgKGV2ZW50KSAtPlxuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcblxuICAgIEBzZWFyY2hWaWV3LmdldE1vZGVsKCkub25EaWRTdG9wQ2hhbmdpbmcgPT5cbiAgICAgIEB1cGRhdGUoKSBpZiBAZGlkSWdub3JlRmlyc3RDaGFuZ2VcbiAgICAgIEBkaWRJZ25vcmVGaXJzdENoYW5nZSA9IHRydWVcblxuICAgICMgVGhpcyBldmVudCBnZXRzIHByb3BhZ2F0ZWQgZnJvbSBtb3N0IGVsZW1lbnQgY2xpY2tzIG9uIHRvcFxuICAgIEBvbiAnY2xpY2snLCAoZXZlbnQpID0+XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgQGV4cG9zZUhpZGUoKVxuXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCBAZWxlbWVudCxcbiAgICAgICdjb3JlOmNvbmZpcm0nOiA9PiBAaGFuZGxlQ29uZmlybSgpXG4gICAgICAnY29yZTpjYW5jZWwnOiA9PiBAZXhwb3NlSGlkZSgpXG4gICAgICAnY29yZTptb3ZlLXJpZ2h0JzogPT4gQG5leHRUYWIoKVxuICAgICAgJ2NvcmU6bW92ZS1sZWZ0JzogPT4gQG5leHRUYWIoLTEpXG4gICAgICAnZXhwb3NlOmNsb3NlJzogPT4gQGV4cG9zZUhpZGUoKVxuICAgICAgJ2V4cG9zZTphY3RpdmF0ZS0xJzogPT4gQGhhbmRsZU51bWJlcktleSgxKVxuICAgICAgJ2V4cG9zZTphY3RpdmF0ZS0yJzogPT4gQGhhbmRsZU51bWJlcktleSgyKVxuICAgICAgJ2V4cG9zZTphY3RpdmF0ZS0zJzogPT4gQGhhbmRsZU51bWJlcktleSgzKVxuICAgICAgJ2V4cG9zZTphY3RpdmF0ZS00JzogPT4gQGhhbmRsZU51bWJlcktleSg0KVxuICAgICAgJ2V4cG9zZTphY3RpdmF0ZS01JzogPT4gQGhhbmRsZU51bWJlcktleSg1KVxuICAgICAgJ2V4cG9zZTphY3RpdmF0ZS02JzogPT4gQGhhbmRsZU51bWJlcktleSg2KVxuICAgICAgJ2V4cG9zZTphY3RpdmF0ZS03JzogPT4gQGhhbmRsZU51bWJlcktleSg3KVxuICAgICAgJ2V4cG9zZTphY3RpdmF0ZS04JzogPT4gQGhhbmRsZU51bWJlcktleSg4KVxuICAgICAgJ2V4cG9zZTphY3RpdmF0ZS05JzogPT4gQGhhbmRsZU51bWJlcktleSg5KVxuXG4gICAgQG9uICdrZXlkb3duJywgKGV2ZW50KSA9PiBAaGFuZGxlS2V5RXZlbnQoZXZlbnQpXG5cbiAgICBAZGlzcG9zYWJsZXMuYWRkIGF0b20ud29ya3NwYWNlLm9uRGlkQWRkUGFuZUl0ZW0gPT4gQHVwZGF0ZSgpXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBhdG9tLndvcmtzcGFjZS5vbkRpZERlc3Ryb3lQYW5lSXRlbSA9PiBAdXBkYXRlKClcblxuICBoYW5kbGVEcmFnOiAtPlxuICAgIFNvcnRhYmxlLmNyZWF0ZShcbiAgICAgIEB0YWJMaXN0LmNvbnRleHRcbiAgICAgIGdob3N0Q2xhc3M6ICdnaG9zdCdcbiAgICAgIG9uRW5kOiAoZXZ0KSA9PiBAbW92ZVRhYihldnQub2xkSW5kZXgsIGV2dC5uZXdJbmRleClcbiAgICApXG5cbiAgbW92ZVRhYjogKGZyb20sIHRvKSAtPlxuICAgIHJldHVybiB1bmxlc3MgZnJvbUl0ZW0gPSBAdGFic1tmcm9tXT8uaXRlbVxuICAgIHJldHVybiB1bmxlc3MgdG9JdGVtID0gQHRhYnNbdG9dPy5pdGVtXG5cbiAgICBmcm9tUGFuZSA9IGF0b20ud29ya3NwYWNlLnBhbmVGb3JJdGVtKGZyb21JdGVtKVxuICAgIHRvUGFuZSA9IGF0b20ud29ya3NwYWNlLnBhbmVGb3JJdGVtKHRvSXRlbSlcblxuICAgIHRvUGFuZUluZGV4ID0gMFxuICAgIGZvciBpdGVtLCBpIGluIHRvUGFuZS5nZXRJdGVtcygpXG4gICAgICB0b1BhbmVJbmRleCA9IGkgaWYgaXRlbSBpcyB0b0l0ZW1cblxuICAgIGZyb21QYW5lLm1vdmVJdGVtVG9QYW5lKGZyb21JdGVtLCB0b1BhbmUsIHRvUGFuZUluZGV4KVxuICAgIEB1cGRhdGUodHJ1ZSlcblxuICBkaWRDaGFuZ2VWaXNpYmxlOiAoQHZpc2libGUpIC0+XG4gICAgaWYgQHZpc2libGVcbiAgICAgIEBzZWFyY2hCdWZmZXIuc2V0VGV4dCgnJylcbiAgICAgIEB1cGRhdGUoKVxuICAgICAgQGZvY3VzKClcbiAgICBlbHNlXG4gICAgICBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKCkuYWN0aXZhdGUoKVxuXG4gIGdldEdyb3VwQ29sb3I6IChuKSAtPlxuICAgIGNvbG9ycyA9IFsnIzM0OThkYicsICcjZTc0YzNjJywgJyMyZWNjNzEnLCAnIzliNTliNiddXG4gICAgY29sb3JzW24gJSBjb2xvcnMubGVuZ3RoXVxuXG4gIHVwZGF0ZTogKGZvcmNlKSAtPlxuICAgIHJldHVybiB1bmxlc3MgQHZpc2libGUgb3IgZm9yY2VcbiAgICBAcmVtb3ZlVGFicygpXG5cbiAgICBAdGFicyA9IFtdXG4gICAgZm9yIHBhbmUsIGkgaW4gQGdldFBhbmVzKClcbiAgICAgIGNvbG9yID0gQGdldEdyb3VwQ29sb3IoaSlcbiAgICAgIGZvciBpdGVtIGluIHBhbmUuZ2V0SXRlbXMoKVxuICAgICAgICBAdGFicy5wdXNoIG5ldyBFeHBvc2VUYWJWaWV3KGl0ZW0sIGNvbG9yKVxuXG4gICAgQHJlbmRlclRhYnMoQHRhYnMgPSBAZmlsdGVyVGFicyhAdGFicykpXG5cbiAgZ2V0UGFuZXM6IC0+XG4gICAgYXRvbS53b3Jrc3BhY2UuZ2V0Q2VudGVyKCkuZ2V0UGFuZXMoKVxuXG4gIGZpbHRlclRhYnM6ICh0YWJzKSAtPlxuICAgIHRleHQgPSBAc2VhcmNoQnVmZmVyLmdldFRleHQoKVxuICAgIHJldHVybiB0YWJzIGlmIHRleHQgaXMgJydcbiAgICBmaWx0ZXIodGFicywgdGV4dCwga2V5OiAndGl0bGUnKVxuXG4gIHJlbmRlclRhYnM6ICh0YWJzKSAtPlxuICAgIGZvciB0YWIgaW4gdGFic1xuICAgICAgQHRhYkxpc3QuYXBwZW5kIHRhYlxuXG4gIHJlbW92ZVRhYnM6IC0+XG4gICAgQHRhYkxpc3QuZW1wdHkoKVxuICAgIGZvciB0YWIgaW4gQHRhYnNcbiAgICAgIHRhYi5kZXN0cm95KClcbiAgICBAdGFicyA9IFtdXG5cbiAgYWN0aXZhdGVUYWI6IChuID0gMSkgLT5cbiAgICBuID0gMSBpZiBuIDwgMVxuICAgIG4gPSBAdGFicy5sZW5ndGggaWYgbiA+IDkgb3IgbiA+IEB0YWJzLmxlbmd0aFxuICAgIEB0YWJzW24tMV0/LmFjdGl2YXRlVGFiKClcbiAgICBAZXhwb3NlSGlkZSgpXG5cbiAgaGFuZGxlQ29uZmlybTogLT5cbiAgICBpZiBAaXNTZWFyY2hpbmcoKSB0aGVuIEBhY3RpdmF0ZVRhYigpIGVsc2UgQGV4cG9zZUhpZGUoKVxuXG4gIGhhbmRsZU51bWJlcktleTogKG51bWJlcikgLT5cbiAgICBpZiBAaXNTZWFyY2hpbmcoKVxuICAgICAgQHNlYXJjaFZpZXcuZ2V0TW9kZWwoKS5pbnNlcnRUZXh0KG51bWJlci50b1N0cmluZygpKVxuICAgIGVsc2VcbiAgICAgIEBhY3RpdmF0ZVRhYihudW1iZXIpXG5cbiAgaGFuZGxlS2V5RXZlbnQ6IChldmVudCkgLT5cbiAgICBpZ25vcmVkS2V5cyA9IFsnc2hpZnQnLCAnY29udHJvbCcsICdhbHQnLCAnbWV0YSddXG4gICAgQHNlYXJjaFZpZXcuZm9jdXMoKSBpZiBpZ25vcmVkS2V5cy5pbmRleE9mKGV2ZW50LmtleS50b0xvd2VyQ2FzZSgpKSBpcyAtMVxuXG4gIG5leHRUYWI6IChuID0gMSkgLT5cbiAgICBmb3IgdGFiVmlldywgaSBpbiBAdGFic1xuICAgICAgaWYgdGFiVmlldy5pc0FjdGl2ZVRhYigpXG4gICAgICAgIG4gPSBAdGFicy5sZW5ndGggLSAxIGlmIGkrbiA8IDBcbiAgICAgICAgbmV4dFRhYlZpZXcuYWN0aXZhdGVUYWIoKSBpZiBuZXh0VGFiVmlldyA9IEB0YWJzWyhpK24pJUB0YWJzLmxlbmd0aF1cbiAgICAgICAgcmV0dXJuIEBmb2N1cygpXG5cbiAgZXhwb3NlSGlkZTogLT5cbiAgICBAZGlkSWdub3JlRmlyc3RDaGFuZ2UgPSBmYWxzZVxuICAgIGZvciB0YWIgaW4gQHRhYnNcbiAgICAgIHRhYi5kZXN0cm95KClcbiAgICBmb3IgcGFuZWwgaW4gYXRvbS53b3Jrc3BhY2UuZ2V0TW9kYWxQYW5lbHMoKVxuICAgICAgcGFuZWwuaGlkZSgpIGlmIHBhbmVsLmNsYXNzTmFtZSBpcyAnZXhwb3NlLXBhbmVsJ1xuXG4gIGlzU2VhcmNoaW5nOiAtPiBAc2VhcmNoVmlldy5oYXNDbGFzcygnaXMtZm9jdXNlZCcpXG5cbiAgdXBkYXRlRmlsZUljb25zOiAtPlxuICAgIGZvciB0YWIgaW4gQHRhYnNcbiAgICAgIHRhYi51cGRhdGVJY29uKClcbiJdfQ==
