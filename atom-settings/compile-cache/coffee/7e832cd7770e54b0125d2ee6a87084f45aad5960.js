(function() {
  var $$, CompositeDisposable, ExposeView, FileIcons, View, ref,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require('atom-space-pen-views'), View = ref.View, $$ = ref.$$;

  CompositeDisposable = require('atom').CompositeDisposable;

  FileIcons = require('./file-icons');

  module.exports = ExposeView = (function(superClass) {
    extend(ExposeView, superClass);

    ExposeView.content = function(title, color) {
      return this.div({
        click: 'activateTab',
        "class": 'expose-tab'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'tab-header'
          }, function() {
            _this.div({
              outlet: 'itemTitle',
              'data-name': title
            }, title);
            return _this.div({
              click: 'closeTab',
              "class": 'close-icon icon-x'
            });
          });
          return _this.div({
            outlet: 'tabBody',
            "class": 'tab-body',
            style: "border-color: " + color
          });
        };
      })(this));
    };

    function ExposeView(item1, color1) {
      this.item = item1 != null ? item1 : {};
      this.color = color1 != null ? color1 : '#000';
      this.toggleActive = bind(this.toggleActive, this);
      this.refreshTab = bind(this.refreshTab, this);
      this.title = this.getItemTitle();
      ExposeView.__super__.constructor.call(this, this.title, this.color);
    }

    ExposeView.prototype.initialize = function() {
      this.disposables = new CompositeDisposable;
      this.handleEvents();
      this.populateTabBody();
      return this.updateIcon();
    };

    ExposeView.prototype.handleEvents = function() {
      this.on('click', '.icon-sync', this.refreshTab);
      this.disposables.add(atom.commands.add(this.element, {
        'expose:close-tab': (function(_this) {
          return function(e) {
            return _this.closeTab(e);
          };
        })(this)
      }));
      return this.disposables.add(atom.workspace.observeActivePaneItem(this.toggleActive));
    };

    ExposeView.prototype.destroy = function() {
      var ref1;
      this.remove();
      return (ref1 = this.disposables) != null ? ref1.dispose() : void 0;
    };

    ExposeView.prototype.populateTabBody = function() {
      if (this.drawImage()) {
        return;
      }
      if (this.drawMinimap()) {
        return;
      }
      return this.drawFallback();
    };

    ExposeView.prototype.drawFallback = function() {
      var iconClass, objectClass;
      objectClass = this.item.constructor.name;
      if (this.item.getIconName) {
        iconClass = 'icon-' + this.item.getIconName();
      }
      return this.tabBody.html($$(function() {
        return this.a({
          "class": iconClass || (function() {
            switch (objectClass) {
              case 'TextEditor':
                return 'icon-file-code';
              case 'ArchiveEditor':
                return 'icon-file-zip';
              default:
                return 'icon-file-text';
            }
          })()
        });
      }));
    };

    ExposeView.prototype.drawImage = function() {
      var filePath;
      if (this.item.constructor.name !== 'ImageEditor') {
        return;
      }
      filePath = this.item.file.path;
      return this.tabBody.html($$(function() {
        return this.img({
          src: filePath
        });
      }));
    };

    ExposeView.prototype.drawMinimap = function() {
      if (this.item.constructor.name !== 'TextEditor') {
        return;
      }
      if (!atom.packages.loadedPackages.minimap) {
        return;
      }
      return atom.packages.serviceHub.consume('minimap', '1.0.0', (function(_this) {
        return function(minimapAPI) {
          var minimap, minimapElement;
          if (minimapAPI.standAloneMinimapForEditor != null) {
            minimap = minimapAPI.standAloneMinimapForEditor(_this.item);
            minimapElement = atom.views.getView(minimap);
            minimapElement.style.cssText = 'width: 190px;\nheight: 130px;\nleft: 10px;\npointer-events: none;\nposition: absolute;';
            if (typeof minimap.setCharWidth === "function") {
              minimap.setCharWidth(2);
            }
            if (typeof minimap.setCharHeight === "function") {
              minimap.setCharHeight(4);
            }
            if (typeof minimap.setInterline === "function") {
              minimap.setInterline(2);
            }
            return _this.tabBody.html(minimapElement);
          } else {
            return _this.tabBody.html($$(function() {
              return this.a({
                "class": 'icon-sync'
              });
            }));
          }
        };
      })(this));
    };

    ExposeView.prototype.refreshTab = function(event) {
      event.stopPropagation();
      event.target.className += ' animate';
      atom.workspace.paneForItem(this.item).activateItem(this.item);
      return setTimeout(((function(_this) {
        return function() {
          return _this.populateTabBody();
        };
      })(this)), 1000);
    };

    ExposeView.prototype.activateTab = function() {
      var pane;
      pane = atom.workspace.paneForItem(this.item);
      pane.activate();
      return pane.activateItem(this.item);
    };

    ExposeView.prototype.toggleActive = function(item) {
      return this.toggleClass('active', item === this.item);
    };

    ExposeView.prototype.isActiveTab = function() {
      return atom.workspace.getActivePaneItem() === this.item;
    };

    ExposeView.prototype.closeTab = function(event) {
      if (event != null) {
        event.stopPropagation();
      }
      atom.workspace.paneForItem(this.item).destroyItem(this.item);
      return this.destroy();
    };

    ExposeView.prototype.getItemTitle = function() {
      var base, i, len, paneItem, ref1, title;
      if (!(title = typeof (base = this.item).getTitle === "function" ? base.getTitle() : void 0)) {
        return 'untitled';
      }
      ref1 = atom.workspace.getPaneItems();
      for (i = 0, len = ref1.length; i < len; i++) {
        paneItem = ref1[i];
        if (paneItem !== this.item) {
          if (paneItem.getTitle() === title && (this.item.getLongTitle != null)) {
            title = this.item.getLongTitle();
          }
        }
      }
      return title;
    };

    ExposeView.prototype.isItemPending = function() {
      var pane;
      if (!(pane = atom.workspace.paneForItem(this.item))) {
        return false;
      }
      if (pane.getPendingItem != null) {
        return pane.getPendingItem() === this.item;
      } else if (this.item.isPending != null) {
        return this.item.isPending();
      }
    };

    ExposeView.prototype.updateIcon = function() {
      var base, base1, classList, iconName, path;
      classList = 'title ';
      if (this.isItemPending()) {
        classList += 'pending ';
      }
      if (iconName = typeof (base = this.item).getIconName === "function" ? base.getIconName() : void 0) {
        classList += "icon-" + iconName;
      } else if (path = typeof (base1 = this.item).getPath === "function" ? base1.getPath() : void 0) {
        if (iconName = FileIcons.getService().iconClassForPath(path, 'expose')) {
          classList += iconName.join(' ');
        }
      }
      return this.itemTitle.attr('class', classList);
    };

    return ExposeView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYXZpcmFqcy8uYXRvbS9wYWNrYWdlcy9leHBvc2UvbGliL2V4cG9zZS10YWItdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLHlEQUFBO0lBQUE7Ozs7RUFBQSxNQUFhLE9BQUEsQ0FBUSxzQkFBUixDQUFiLEVBQUMsZUFBRCxFQUFPOztFQUNOLHNCQUF1QixPQUFBLENBQVEsTUFBUjs7RUFFeEIsU0FBQSxHQUFZLE9BQUEsQ0FBUSxjQUFSOztFQUVaLE1BQU0sQ0FBQyxPQUFQLEdBQ007OztJQUNKLFVBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQyxLQUFELEVBQVEsS0FBUjthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7UUFBQSxLQUFBLEVBQU8sYUFBUDtRQUFzQixDQUFBLEtBQUEsQ0FBQSxFQUFPLFlBQTdCO09BQUwsRUFBZ0QsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO1VBQzlDLEtBQUMsQ0FBQSxHQUFELENBQUs7WUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLFlBQVA7V0FBTCxFQUEwQixTQUFBO1lBQ3hCLEtBQUMsQ0FBQSxHQUFELENBQUs7Y0FBQSxNQUFBLEVBQVEsV0FBUjtjQUFxQixXQUFBLEVBQWEsS0FBbEM7YUFBTCxFQUE4QyxLQUE5QzttQkFDQSxLQUFDLENBQUEsR0FBRCxDQUFLO2NBQUEsS0FBQSxFQUFPLFVBQVA7Y0FBbUIsQ0FBQSxLQUFBLENBQUEsRUFBTyxtQkFBMUI7YUFBTDtVQUZ3QixDQUExQjtpQkFHQSxLQUFDLENBQUEsR0FBRCxDQUFLO1lBQUEsTUFBQSxFQUFRLFNBQVI7WUFBbUIsQ0FBQSxLQUFBLENBQUEsRUFBTyxVQUExQjtZQUFzQyxLQUFBLEVBQU8sZ0JBQUEsR0FBaUIsS0FBOUQ7V0FBTDtRQUo4QztNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBaEQ7SUFEUTs7SUFPRyxvQkFBQyxLQUFELEVBQWEsTUFBYjtN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NUI7T0FBQSxNQUVLLElBQUcsMkJBQUg7ZUFDSCxJQUFDLENBQUEsSUFBSSxDQUFDLFNBQU4sQ0FBQSxFQURHOztJQUpROzt5QkFPZixVQUFBLEdBQVksU0FBQTtBQUNWLFVBQUE7TUFBQSxTQUFBLEdBQVk7TUFDWixJQUEyQixJQUFDLENBQUEsYUFBRCxDQUFBLENBQTNCO1FBQUEsU0FBQSxJQUFhLFdBQWI7O01BRUEsSUFBRyxRQUFBLDhEQUFnQixDQUFDLHNCQUFwQjtRQUNFLFNBQUEsSUFBYSxPQUFBLEdBQVEsU0FEdkI7T0FBQSxNQUVLLElBQUcsSUFBQSw0REFBWSxDQUFDLGtCQUFoQjtRQUNILElBQUcsUUFBQSxHQUFXLFNBQVMsQ0FBQyxVQUFWLENBQUEsQ0FBc0IsQ0FBQyxnQkFBdkIsQ0FBd0MsSUFBeEMsRUFBOEMsUUFBOUMsQ0FBZDtVQUNFLFNBQUEsSUFBYSxRQUFRLENBQUMsSUFBVCxDQUFjLEdBQWQsRUFEZjtTQURHOzthQUlMLElBQUMsQ0FBQSxTQUFTLENBQUMsSUFBWCxDQUFnQixPQUFoQixFQUF5QixTQUF6QjtJQVZVOzs7O0tBaEhXO0FBTnpCIiwic291cmNlc0NvbnRlbnQiOlsie1ZpZXcsICQkfSA9IHJlcXVpcmUgJ2F0b20tc3BhY2UtcGVuLXZpZXdzJ1xue0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcblxuRmlsZUljb25zID0gcmVxdWlyZSAnLi9maWxlLWljb25zJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBFeHBvc2VWaWV3IGV4dGVuZHMgVmlld1xuICBAY29udGVudDogKHRpdGxlLCBjb2xvcikgLT5cbiAgICBAZGl2IGNsaWNrOiAnYWN0aXZhdGVUYWInLCBjbGFzczogJ2V4cG9zZS10YWInLCA9PlxuICAgICAgQGRpdiBjbGFzczogJ3RhYi1oZWFkZXInLCA9PlxuICAgICAgICBAZGl2IG91dGxldDogJ2l0ZW1UaXRsZScsICdkYXRhLW5hbWUnOiB0aXRsZSwgdGl0bGVcbiAgICAgICAgQGRpdiBjbGljazogJ2Nsb3NlVGFiJywgY2xhc3M6ICdjbG9zZS1pY29uIGljb24teCdcbiAgICAgIEBkaXYgb3V0bGV0OiAndGFiQm9keScsIGNsYXNzOiAndGFiLWJvZHknLCBzdHlsZTogXCJib3JkZXItY29sb3I6ICN7Y29sb3J9XCJcblxuICBjb25zdHJ1Y3RvcjogKEBpdGVtID0ge30sIEBjb2xvciA9ICcjMDAwJykgLT5cbiAgICBAdGl0bGUgPSBAZ2V0SXRlbVRpdGxlKClcbiAgICBzdXBlcihAdGl0bGUsIEBjb2xvcilcblxuICBpbml0aWFsaXplOiAtPlxuICAgIEBkaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgQGhhbmRsZUV2ZW50cygpXG4gICAgQHBvcHVsYXRlVGFiQm9keSgpXG4gICAgQHVwZGF0ZUljb24oKVxuXG4gIGhhbmRsZUV2ZW50czogLT5cbiAgICBAb24gJ2NsaWNrJywgJy5pY29uLXN5bmMnLCBAcmVmcmVzaFRhYlxuXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCBAZWxlbWVudCxcbiAgICAgICdleHBvc2U6Y2xvc2UtdGFiJzogKGUpID0+IEBjbG9zZVRhYihlKVxuXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBhdG9tLndvcmtzcGFjZS5vYnNlcnZlQWN0aXZlUGFuZUl0ZW0gQHRvZ2dsZUFjdGl2ZVxuXG4gIGRlc3Ryb3k6IC0+XG4gICAgQHJlbW92ZSgpXG4gICAgQGRpc3Bvc2FibGVzPy5kaXNwb3NlKClcblxuICBwb3B1bGF0ZVRhYkJvZHk6IC0+XG4gICAgcmV0dXJuIGlmIEBkcmF3SW1hZ2UoKVxuICAgIHJldHVybiBpZiBAZHJhd01pbmltYXAoKVxuICAgIEBkcmF3RmFsbGJhY2soKVxuXG4gIGRyYXdGYWxsYmFjazogLT5cbiAgICBvYmplY3RDbGFzcyA9IEBpdGVtLmNvbnN0cnVjdG9yLm5hbWVcbiAgICBpY29uQ2xhc3MgPSAnaWNvbi0nICsgQGl0ZW0uZ2V0SWNvbk5hbWUoKSBpZiBAaXRlbS5nZXRJY29uTmFtZVxuICAgIEB0YWJCb2R5Lmh0bWwgJCQgLT5cbiAgICAgIEBhIGNsYXNzOiBpY29uQ2xhc3Mgb3Igc3dpdGNoIG9iamVjdENsYXNzXG4gICAgICAgIHdoZW4gJ1RleHRFZGl0b3InIHRoZW4gJ2ljb24tZmlsZS1jb2RlJ1xuICAgICAgICB3aGVuICdBcmNoaXZlRWRpdG9yJyB0aGVuICdpY29uLWZpbGUtemlwJ1xuICAgICAgICBlbHNlICdpY29uLWZpbGUtdGV4dCdcblxuICBkcmF3SW1hZ2U6IC0+XG4gICAgcmV0dXJuIHVubGVzcyBAaXRlbS5jb25zdHJ1Y3Rvci5uYW1lIGlzICdJbWFnZUVkaXRvcidcbiAgICBmaWxlUGF0aCA9IEBpdGVtLmZpbGUucGF0aFxuICAgIEB0YWJCb2R5Lmh0bWwgJCQgLT5cbiAgICAgIEBpbWcgc3JjOiBmaWxlUGF0aFxuXG4gIGRyYXdNaW5pbWFwOiAtPlxuICAgIHJldHVybiB1bmxlc3MgQGl0ZW0uY29uc3RydWN0b3IubmFtZSBpcyAnVGV4dEVkaXRvcidcbiAgICByZXR1cm4gdW5sZXNzIGF0b20ucGFja2FnZXMubG9hZGVkUGFja2FnZXMubWluaW1hcFxuXG4gICAgYXRvbS5wYWNrYWdlcy5zZXJ2aWNlSHViLmNvbnN1bWUgJ21pbmltYXAnLCAnMS4wLjAnLCAobWluaW1hcEFQSSkgPT5cbiAgICAgIGlmIG1pbmltYXBBUEkuc3RhbmRBbG9uZU1pbmltYXBGb3JFZGl0b3I/XG4gICAgICAgIG1pbmltYXAgPSBtaW5pbWFwQVBJLnN0YW5kQWxvbmVNaW5pbWFwRm9yRWRpdG9yKEBpdGVtKVxuICAgICAgICBtaW5pbWFwRWxlbWVudCA9IGF0b20udmlld3MuZ2V0VmlldyhtaW5pbWFwKVxuICAgICAgICBtaW5pbWFwRWxlbWVudC5zdHlsZS5jc3NUZXh0ID0gJycnXG4gICAgICAgICAgd2lkdGg6IDE5MHB4O1xuICAgICAgICAgIGhlaWdodDogMTMwcHg7XG4gICAgICAgICAgbGVmdDogMTBweDtcbiAgICAgICAgICBwb2ludGVyLWV2ZW50czogbm9uZTtcbiAgICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICAgICcnJ1xuXG4gICAgICAgIG1pbmltYXAuc2V0Q2hhcldpZHRoPygyKVxuICAgICAgICBtaW5pbWFwLnNldENoYXJIZWlnaHQ/KDQpXG4gICAgICAgIG1pbmltYXAuc2V0SW50ZXJsaW5lPygyKVxuXG4gICAgICAgIEB0YWJCb2R5Lmh0bWwgbWluaW1hcEVsZW1lbnRcbiAgICAgIGVsc2VcbiAgICAgICAgQHRhYkJvZHkuaHRtbCAkJCAtPlxuICAgICAgICAgIEBhIGNsYXNzOiAnaWNvbi1zeW5jJ1xuXG4gIHJlZnJlc2hUYWI6IChldmVudCkgPT5cbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICAgIGV2ZW50LnRhcmdldC5jbGFzc05hbWUgKz0gJyBhbmltYXRlJ1xuICAgIGF0b20ud29ya3NwYWNlLnBhbmVGb3JJdGVtKEBpdGVtKS5hY3RpdmF0ZUl0ZW0oQGl0ZW0pXG4gICAgc2V0VGltZW91dCAoPT4gQHBvcHVsYXRlVGFiQm9keSgpKSwgMTAwMFxuXG4gIGFjdGl2YXRlVGFiOiAtPlxuICAgIHBhbmUgPSBhdG9tLndvcmtzcGFjZS5wYW5lRm9ySXRlbShAaXRlbSlcbiAgICBwYW5lLmFjdGl2YXRlKClcbiAgICBwYW5lLmFjdGl2YXRlSXRlbShAaXRlbSlcblxuICB0b2dnbGVBY3RpdmU6IChpdGVtKSA9PlxuICAgIEB0b2dnbGVDbGFzcygnYWN0aXZlJywgaXRlbSBpcyBAaXRlbSlcblxuICBpc0FjdGl2ZVRhYjogLT5cbiAgICBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lSXRlbSgpIGlzIEBpdGVtXG5cbiAgY2xvc2VUYWI6IChldmVudCkgLT5cbiAgICBldmVudD8uc3RvcFByb3BhZ2F0aW9uKClcbiAgICBhdG9tLndvcmtzcGFjZS5wYW5lRm9ySXRlbShAaXRlbSkuZGVzdHJveUl0ZW0oQGl0ZW0pXG4gICAgQGRlc3Ryb3koKVxuXG4gIGdldEl0ZW1UaXRsZTogLT5cbiAgICByZXR1cm4gJ3VudGl0bGVkJyB1bmxlc3MgdGl0bGUgPSBAaXRlbS5nZXRUaXRsZT8oKVxuXG4gICAgZm9yIHBhbmVJdGVtIGluIGF0b20ud29ya3NwYWNlLmdldFBhbmVJdGVtcygpIHdoZW4gcGFuZUl0ZW0gaXNudCBAaXRlbVxuICAgICAgaWYgcGFuZUl0ZW0uZ2V0VGl0bGUoKSBpcyB0aXRsZSBhbmQgQGl0ZW0uZ2V0TG9uZ1RpdGxlP1xuICAgICAgICB0aXRsZSA9IEBpdGVtLmdldExvbmdUaXRsZSgpXG4gICAgdGl0bGVcblxuICBpc0l0ZW1QZW5kaW5nOiAtPlxuICAgIHJldHVybiBmYWxzZSB1bmxlc3MgcGFuZSA9IGF0b20ud29ya3NwYWNlLnBhbmVGb3JJdGVtKEBpdGVtKVxuICAgIGlmIHBhbmUuZ2V0UGVuZGluZ0l0ZW0/XG4gICAgICBwYW5lLmdldFBlbmRpbmdJdGVtKCkgaXMgQGl0ZW1cbiAgICBlbHNlIGlmIEBpdGVtLmlzUGVuZGluZz9cbiAgICAgIEBpdGVtLmlzUGVuZGluZygpXG5cbiAgdXBkYXRlSWNvbjogLT5cbiAgICBjbGFzc0xpc3QgPSAndGl0bGUgJ1xuICAgIGNsYXNzTGlzdCArPSAncGVuZGluZyAnIGlmIEBpc0l0ZW1QZW5kaW5nKClcblxuICAgIGlmIGljb25OYW1lID0gQGl0ZW0uZ2V0SWNvbk5hbWU/KClcbiAgICAgIGNsYXNzTGlzdCArPSBcImljb24tI3tpY29uTmFtZX1cIlxuICAgIGVsc2UgaWYgcGF0aCA9IEBpdGVtLmdldFBhdGg/KClcbiAgICAgIGlmIGljb25OYW1lID0gRmlsZUljb25zLmdldFNlcnZpY2UoKS5pY29uQ2xhc3NGb3JQYXRoKHBhdGgsICdleHBvc2UnKVxuICAgICAgICBjbGFzc0xpc3QgKz0gaWNvbk5hbWUuam9pbignICcpXG5cbiAgICBAaXRlbVRpdGxlLmF0dHIoJ2NsYXNzJywgY2xhc3NMaXN0KVxuIl19
