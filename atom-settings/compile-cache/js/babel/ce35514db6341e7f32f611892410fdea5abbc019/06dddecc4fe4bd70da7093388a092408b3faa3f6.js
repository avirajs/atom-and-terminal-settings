'use babel';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var $ = require('jquery');
var SelectListView = require('atom-space-pen-views').SelectListView;

// Load names of available icon on demand.
var IconNames = null;

var QueryView = (function (_SelectListView) {
  _inherits(QueryView, _SelectListView);

  function QueryView(word, items) {
    _classCallCheck(this, QueryView);

    _get(Object.getPrototypeOf(QueryView.prototype), 'constructor', this).call(this);

    this.confirmed_ = false;
    this.setViewPromise_ = null;
    this.docView_ = null;
    this.panel_ = atom.workspace.addModalPanel({ item: this });

    this.filterEditorView.setText(word);
    this.setMaxItems(50);
    this.setItems(items);
    this.storeFocusedElement();
    this.focusFilterEditor();
  }

  _createClass(QueryView, [{
    key: 'viewForItem',
    value: function viewForItem(item) {
      icon = this.getIcon_(item.id);
      // HTML escape item.name.
      var text = $('<div/>').text(item.name).html();
      return '<li><div><img class="api-docs-icon" src="atom://api-docs/images/icon-' + icon + '.png" />' + text + '</div></li>';
    }
  }, {
    key: 'confirmed',
    value: function confirmed(item) {
      this.confirmed_ = true;
      this.showViewForItem(item);
      this.filterEditorView.blur();
    }
  }, {
    key: 'cancelled',
    value: function cancelled() {
      if (!this.confirmed_ && this.docView_) {
        this.docView_.destroy();
      }

      this.panel_.destroy();
    }
  }, {
    key: 'getFilterKey',
    value: function getFilterKey() {
      return 'name';
    }
  }, {
    key: 'showViewForItem',
    value: function showViewForItem(item) {
      var _this = this;

      if (!this.setViewPromise_) {
        this.setViewPromise_ = atom.workspace.open('api-docs://', { split: 'right', activatePane: false }).then(function (docView) {
          _this.docView_ = docView;
          _this.docView_.setView(item.url);
        });
      } else {
        this.setViewPromise_ = this.setViewPromise_.then(function () {
          _this.docView_.setView(item.url);
        });
      }
    }
  }, {
    key: 'getIcon_',
    value: function getIcon_(slug) {
      this.lazyLoadIconNames_();

      // find most specific available icon
      // first consider the full slug
      var indices = [slug.length];
      // then consider the substring without the minor version
      if (slug.indexOf('.') != -1) {
        indices.push(slug.indexOf('.'));
      }
      // then consider the substring without the version
      if (slug.indexOf('~') != -1) {
        indices.push(slug.indexOf('~'));
      }
      for (var i = 0; i < indices.length; ++i) {
        var name = slug.substring(0, indices[i]);
        if (IconNames.indexOf(name) != -1) {
          return name;
        }
      }
      // fallback to the full slug (even if it doesn't exist)
      // optionally this could show a default icon?
      return slug;
    }
  }, {
    key: 'lazyLoadIconNames_',
    value: function lazyLoadIconNames_() {
      if (!IconNames) {
        IconNames = [];
        fs = require('fs');
        path = require('path');
        filenames = fs.readdirSync(path.join(__dirname, '..', 'images'));
        prefix = 'icon-';
        suffix = '.png';
        for (var i = 0; i < filenames.length; ++i) {
          if (filenames[i].startsWith(prefix) && filenames[i].endsWith(suffix)) {
            IconNames.push(filenames[i].substring(prefix.length, filenames[i].length - suffix.length));
          }
        }
      }
    }
  }]);

  return QueryView;
})(SelectListView);

module.exports = QueryView;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2F2aXJhanMvLmF0b20vcGFja2FnZXMvYXBpLWRvY3Mvc3JjL3F1ZXJ5X3ZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFDOzs7Ozs7Ozs7O0FBRVosSUFBTSxDQUFDLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzVCLElBQU0sY0FBYyxHQUFHLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLGNBQWMsQ0FBQzs7O0FBR3RFLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQzs7SUFFZixTQUFTO1lBQVQsU0FBUzs7QUFDRixXQURQLFNBQVMsQ0FDRCxJQUFJLEVBQUUsS0FBSyxFQUFFOzBCQURyQixTQUFTOztBQUVYLCtCQUZFLFNBQVMsNkNBRUg7O0FBRVIsUUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7QUFDeEIsUUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7QUFDNUIsUUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7QUFDckIsUUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxFQUFDLElBQUksRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDOztBQUV6RCxRQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3BDLFFBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDckIsUUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNyQixRQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztBQUMzQixRQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztHQUMxQjs7ZUFkRyxTQUFTOztXQWdCRixxQkFBQyxJQUFJLEVBQUU7QUFDaEIsVUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDOztBQUU5QixVQUFNLElBQUksR0FBRyxDQUFDLENBQUMsUUFB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USxDQUFDLENBQUMsQ0FBQztBQUNqRSxjQUFNLEdBQUcsT0FBTyxDQUFDO0FBQ2pCLGNBQU0sR0FBRyxNQUFNLENBQUM7QUFDaEIsYUFBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUU7QUFDekMsY0FBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUU7QUFDcEUscUJBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7V0FDNUY7U0FDRjtPQUNGO0tBQ0Y7OztTQTlGRyxTQUFTO0dBQVMsY0FBYzs7QUFpR3RDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDIiwiZmlsZSI6Ii9ob21lL2F2aXJhanMvLmF0b20vcGFja2FnZXMvYXBpLWRvY3Mvc3JjL3F1ZXJ5X3ZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuY29uc3QgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuY29uc3QgU2VsZWN0TGlzdFZpZXcgPSByZXF1aXJlKCdhdG9tLXNwYWNlLXBlbi12aWV3cycpLlNlbGVjdExpc3RWaWV3O1xuXG4vLyBMb2FkIG5hbWVzIG9mIGF2YWlsYWJsZSBpY29uIG9uIGRlbWFuZC5cbnZhciBJY29uTmFtZXMgPSBudWxsO1xuXG5jbGFzcyBRdWVyeVZpZXcgZXh0ZW5kcyBTZWxlY3RMaXN0VmlldyB7XG4gIGNvbnN0cnVjdG9yKHdvcmQsIGl0ZW1zKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuY29uZmlybWVkXyA9IGZhbHNlO1xuICAgIHRoaXMuc2V0Vmlld1Byb21pc2VfID0gbnVsbDtcbiAgICB0aGlzLmRvY1ZpZXdfID0gbnVsbDtcbiAgICB0aGlzLnBhbmVsXyA9IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwoe2l0ZW06IHRoaXN9KTtcblxuICAgIHRoaXMuZmlsdGVyRWRpdG9yVmlldy5zZXRUZXh0KHdvcmQpO1xuICAgIHRoaXMuc2V0TWF4SXRlbXMoNTApO1xuICAgIHRoaXMuc2V0SXRlbXMoaXRlbXMpO1xuICAgIHRoaXMuc3RvcmVGb2N1c2VkRWxlbWVudCgpO1xuICAgIHRoaXMuZm9jdXNGaWx0ZXJFZGl0b3IoKTtcbiAgfVxuXG4gIHZpZXdGb3JJdGVtKGl0ZW0pIHtcbiAgICBpY29uID0gdGhpcy5nZXRJY29uXyhpdGVtLmlkKTtcbiAgICAvLyBIVE1MIGVzY2FwZSBpdGVtLm5hbWUuXG4gICAgY29uc3QgdGV4dCA9ICQoJzxkaXYvPicpLnRleHQoaXRlbS5uYW1lKS5odG1sKCk7XG4gICAgcmV0dXJuIGA8bGk+PGRpdj48aW1nIGNsYXNzPVwiYXBpLWRvY3MtaWNvblwiIHNyYz1cImF0b206Ly9hcGktZG9jcy9pbWFnZXMvaWNvbi0ke2ljb259LnBuZ1wiIC8+JHt0ZXh0fTwvZGl2PjwvbGk+YDtcbiAgfVxuXG4gIGNvbmZpcm1lZChpdGVtKSB7XG4gICAgdGhpcy5jb25maXJtZWRfID0gdHJ1ZTtcbiAgICB0aGlzLnNob3dWaWV3Rm9ySXRlbShpdGVtKTtcbiAgICB0aGlzLmZpbHRlckVkaXRvclZpZXcuYmx1cigpO1xuICB9XG5cbiAgY2FuY2VsbGVkKCkge1xuICAgIGlmICghdGhpcy5jb25maXJtZWRfICYmIHRoaXMuZG9jVmlld18pIHtcbiAgICAgIHRoaXMuZG9jVmlld18uZGVzdHJveSgpO1xuICAgIH1cblxuICAgIHRoaXMucGFuZWxfLmRlc3Ryb3koKTtcbiAgfVxuXG4gIGdldEZpbHRlcktleSgpIHtcbiAgICByZXR1cm4gJ25hbWUnO1xuICB9XG5cbiAgc2hvd1ZpZXdGb3JJdGVtKGl0ZW0pIHtcbiAgICBpZiAoIXRoaXMuc2V0Vmlld1Byb21pc2VfKSB7XG4gICAgICB0aGlzLnNldFZpZXdQcm9taXNlXyA9IGF0b20ud29ya3NwYWNlLm9wZW4oJ2FwaS1kb2NzOi8vJywgeyBzcGxpdDogJ3JpZ2h0JywgYWN0aXZhdGVQYW5lOiBmYWxzZSB9KVxuICAgICAgICAgIC50aGVuKGRvY1ZpZXcgPT4ge1xuICAgICAgICAgICAgdGhpcy5kb2NWaWV3XyA9IGRvY1ZpZXc7XG4gICAgICAgICAgICB0aGlzLmRvY1ZpZXdfLnNldFZpZXcoaXRlbS51cmwpO1xuICAgICAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNldFZpZXdQcm9taXNlXyA9IHRoaXMuc2V0Vmlld1Byb21pc2VfLnRoZW4oKCkgPT4ge1xuICAgICAgICB0aGlzLmRvY1ZpZXdfLnNldFZpZXcoaXRlbS51cmwpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgZ2V0SWNvbl8oc2x1Zykge1xuICAgIHRoaXMubGF6eUxvYWRJY29uTmFtZXNfKCk7XG5cbiAgICAvLyBmaW5kIG1vc3Qgc3BlY2lmaWMgYXZhaWxhYmxlIGljb25cbiAgICAvLyBmaXJzdCBjb25zaWRlciB0aGUgZnVsbCBzbHVnXG4gICAgdmFyIGluZGljZXMgPSBbc2x1Zy5sZW5ndGhdO1xuICAgIC8vIHRoZW4gY29uc2lkZXIgdGhlIHN1YnN0cmluZyB3aXRob3V0IHRoZSBtaW5vciB2ZXJzaW9uXG4gICAgaWYgKHNsdWcuaW5kZXhPZignLicpICE9IC0xKSB7XG4gICAgICBpbmRpY2VzLnB1c2goc2x1Zy5pbmRleE9mKCcuJykpO1xuICAgIH1cbiAgICAvLyB0aGVuIGNvbnNpZGVyIHRoZSBzdWJzdHJpbmcgd2l0aG91dCB0aGUgdmVyc2lvblxuICAgIGlmIChzbHVnLmluZGV4T2YoJ34nKSAhPSAtMSkge1xuICAgICAgaW5kaWNlcy5wdXNoKHNsdWcuaW5kZXhPZignficpKTtcbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpbmRpY2VzLmxlbmd0aDsgKytpKSB7XG4gICAgICB2YXIgbmFtZSA9IHNsdWcuc3Vic3RyaW5nKDAsIGluZGljZXNbaV0pO1xuICAgICAgaWYgKEljb25OYW1lcy5pbmRleE9mKG5hbWUpICE9IC0xKSB7XG4gICAgICAgIHJldHVybiBuYW1lO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBmYWxsYmFjayB0byB0aGUgZnVsbCBzbHVnIChldmVuIGlmIGl0IGRvZXNuJ3QgZXhpc3QpXG4gICAgLy8gb3B0aW9uYWxseSB0aGlzIGNvdWxkIHNob3cgYSBkZWZhdWx0IGljb24/XG4gICAgcmV0dXJuIHNsdWc7XG4gIH1cblxuICBsYXp5TG9hZEljb25OYW1lc18oKSB7XG4gICAgaWYgKCFJY29uTmFtZXMpIHtcbiAgICAgIEljb25OYW1lcyA9IFtdO1xuICAgICAgZnMgPSByZXF1aXJlKCdmcycpO1xuICAgICAgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbiAgICAgIGZpbGVuYW1lcyA9IGZzLnJlYWRkaXJTeW5jKHBhdGguam9pbihfX2Rpcm5hbWUsICcuLicsICdpbWFnZXMnKSk7XG4gICAgICBwcmVmaXggPSAnaWNvbi0nO1xuICAgICAgc3VmZml4ID0gJy5wbmcnO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmaWxlbmFtZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgaWYgKGZpbGVuYW1lc1tpXS5zdGFydHNXaXRoKHByZWZpeCkgJiYgZmlsZW5hbWVzW2ldLmVuZHNXaXRoKHN1ZmZpeCkpIHtcbiAgICAgICAgICBJY29uTmFtZXMucHVzaChmaWxlbmFtZXNbaV0uc3Vic3RyaW5nKHByZWZpeC5sZW5ndGgsIGZpbGVuYW1lc1tpXS5sZW5ndGggLSBzdWZmaXgubGVuZ3RoKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBRdWVyeVZpZXc7XG4iXX0=