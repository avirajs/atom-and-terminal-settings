'use babel';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var $ = require('jquery');
var Disposable = require('atom').Disposable;
var Emitter = require('atom').Emitter;
var Highlight = require('./highlight');
var Resource = require('./resource');
var ScrollView = require('atom-space-pen-views').ScrollView;
var Shell = require('shell');
var Url = require('url');

var DocView = (function (_ScrollView) {
  _inherits(DocView, _ScrollView);

  _createClass(DocView, null, [{
    key: 'content',
    value: function content() {
      // Magic required to enable scrolling and keyboard shortcuts for scrolling.
      return this.div({ 'class': 'api-docs-doc', tabindex: -1 });
    }
  }, {
    key: 'DOC_STYLE_LIGHT_',
    value: '',
    enumerable: true
  }, {
    key: 'DOC_STYLE_DARK_',
    value: '',
    enumerable: true
  }, {
    key: 'DOC_STYLE_PROMISE_',
    value: Resource.get('style-light.css').then(function (result) {
      return DocView.DOC_STYLE_LIGHT_ = result;
    }).then(function () {
      return Resource.get('style-dark.css');
    }).then(function (result) {
      return DocView.DOC_STYLE_DARK_ = result;
    }),
    enumerable: true
  }]);

  function DocView(library, url) {
    _classCallCheck(this, DocView);

    _get(Object.getPrototypeOf(DocView.prototype), 'constructor', this).call(this);
    this.emitter_ = new Emitter();
    this.library_ = library;
    this.title_ = 'Loading...';
    this.url_ = url;
    this.pane_ = null;
  }

  _createClass(DocView, [{
    key: 'setView',
    value: function setView(url) {
      var _this = this;

      // Set the view only after DOC_STYLE_{LIGHT|DARK}_ are set.
      DocView.DOC_STYLE_PROMISE_.then(function () {
        var parsedUrl = Url.parse(url, true);
        var path = parsedUrl.pathname.substr(1);
        // The hostname part of the url may contain a tilde if the slug does.
        // Therefore this can't rely on Url.parse() to determine the hostname and path.
        var hostname = parsedUrl.hostname;
        var indexAfterHostname = parsedUrl.protocol.length + 2 + parsedUrl.hostname.length;
        if (url.substr(indexAfterHostname, 1) == '~') {
          tildePart = url.substring(indexAfterHostname, url.indexOf('/', indexAfterHostname));
          // move tilde part from path to hostname
          path = path.substring(tildePart.length + 1);
          hostname += tildePart;
        }
        var docset = _this.library_.get(hostname);
        if (!docset && path.startsWith('~') && url.substr(indexAfterHostname, 1) != '~') {
          // relative links from other views come already modified with the tilde in the path
          tildePart = path.substring(0, path.indexOf('/'));
          // move tilde part from path to hostname
          path = path.substring(tildePart.length + 1);
          hostname += tildePart;
          docset = _this.library_.get(hostname);
        }

        var style = DocView.DOC_STYLE_LIGHT_;
        var styleClass = '#fff';
        if (atom.config.get('api-docs._theme') == 'Dark') {
          style = DocView.DOC_STYLE_DARK_;
          styleClass = '#303030';
        }

        var root = _this.element.createShadowRoot();
        root.innerHTML = '<style type="text/css">' + style + '</style>';
        root.innerHTML += '<div class="' + docset.classNames + '" style="font-size: 10pt; background-color: ' + styleClass + '">' + docset.getContent(path) + '</div>';

        // Set up click handlers for relative URLs so we can resolve internally.
        var elements = $(root).find('a');

        var _loop = function (i) {
          var href = elements[i].getAttribute('href');
          if (!href) {
            return 'continue';
          }

          if (href.startsWith('http')) {
            elements[i].onclick = function (event) {
              return Shell.openExternal(href);
            };
          } else {
            elements[i].onclick = function (event) {
              return _this.setView(Url.resolve(url, href));
            };
          }
        };

        for (var i = 0; i < elements.length; ++i) {
          var _ret = _loop(i);

          if (_ret === 'continue') continue;
        }

        Highlight(docset.type, root);

        // Scroll to element with passed id
        if (parsedUrl.hash) {
          // escape special characters in selector
          var hash = parsedUrl.hash.replace('.', '\\.');
          var foundElements = $(root).find(hash);
          if (foundElements) {
            var foundElement = foundElements[0];
            $($(root).find('div')[0]).scrollTop(foundElement.offsetTop);
          }
        }

        _this.title_ = docset.getTitle(path);
        _this.emitter_.emit('did-change-title');
      });
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.pane_.destroyItem(this);
      if (this.pane_.getItems().length === 0) {
        this.pane_.destroy();
      }
    }
  }, {
    key: 'attached',
    value: function attached() {
      this.pane_ = atom.workspace.paneForURI(this.getURI());
      this.pane_.activateItem(this);
    }
  }, {
    key: 'onDidChangeTitle',
    value: function onDidChangeTitle(callback) {
      return this.emitter_.on('did-change-title', callback);
    }
  }, {
    key: 'onDidChangeModified',
    value: function onDidChangeModified(callback) {
      return new Disposable();
    }

    // Required to find the pane for this instance.
  }, {
    key: 'getURI',
    value: function getURI() {
      return this.url_;
    }
  }, {
    key: 'getTitle',
    value: function getTitle() {
      return this.title_;
    }
  }]);

  return DocView;
})(ScrollView);

module.exports = DocView;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2F2aXJhanMvLmF0b20vcGFja2FnZXMvYXBpLWRvY3Mvc3JjL2RvY192aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQzs7Ozs7Ozs7OztBQUVaLElBQU0sQ0FBQyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUM1QixJQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsVUFBVSxDQUFDO0FBQzlDLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUM7QUFDeEMsSUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ3pDLElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUN2QyxJQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxVQUFVLENBQUM7QUFDOUQsSUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQy9CLElBQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQzs7SUFFckIsT0FBTztZQUFQLE9BQU87O2VBQVAsT0FBTzs7V0FNRyxtQkFBRzs7QUFFZixhQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBQyxTQUFPLGNBQWMsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO0tBQ3hEOzs7V0FSeUIsRUFBRTs7OztXQUNILEVBQUU7Ozs7V0FDQyxRQUFRLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsTUFBTTthQUFJLE9BQU8sQ0FBQyxnQkFBZ0IsR0FBRyxNQUFNO0tBQUEsQ0FBQyxDQUN4RyxJQUFJLENBQUM7YUFBTSxRQUFRLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDO0tBQUEsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLE1BQU07YUFBSSxPQUFPLENBQUMs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Z2VzL2FwaS1kb2NzL3NyYy9kb2Nfdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5jb25zdCAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG5jb25zdCBEaXNwb3NhYmxlID0gcmVxdWlyZSgnYXRvbScpLkRpc3Bvc2FibGU7XG5jb25zdCBFbWl0dGVyID0gcmVxdWlyZSgnYXRvbScpLkVtaXR0ZXI7XG5jb25zdCBIaWdobGlnaHQgPSByZXF1aXJlKCcuL2hpZ2hsaWdodCcpO1xuY29uc3QgUmVzb3VyY2UgPSByZXF1aXJlKCcuL3Jlc291cmNlJyk7XG5jb25zdCBTY3JvbGxWaWV3ID0gcmVxdWlyZSgnYXRvbS1zcGFjZS1wZW4tdmlld3MnKS5TY3JvbGxWaWV3O1xuY29uc3QgU2hlbGwgPSByZXF1aXJlKCdzaGVsbCcpO1xuY29uc3QgVXJsID0gcmVxdWlyZSgndXJsJyk7XG5cbmNsYXNzIERvY1ZpZXcgZXh0ZW5kcyBTY3JvbGxWaWV3IHtcbiAgc3RhdGljIERPQ19TVFlMRV9MSUdIVF8gPSAnJztcbiAgc3RhdGljIERPQ19TVFlMRV9EQVJLXyA9ICcnO1xuICBzdGF0aWMgRE9DX1NUWUxFX1BST01JU0VfID0gUmVzb3VyY2UuZ2V0KCdzdHlsZS1saWdodC5jc3MnKS50aGVuKHJlc3VsdCA9PiBEb2NWaWV3LkRPQ19TVFlMRV9MSUdIVF8gPSByZXN1bHQpXG4gICAgICAudGhlbigoKSA9PiBSZXNvdXJjZS5nZXQoJ3N0eWxlLWRhcmsuY3NzJykpLnRoZW4ocmVzdWx0ID0+IERvY1ZpZXcuRE9DX1NUWUxFX0RBUktfID0gcmVzdWx0KTtcblxuICBzdGF0aWMgY29udGVudCgpIHtcbiAgICAvLyBNYWdpYyByZXF1aXJlZCB0byBlbmFibGUgc2Nyb2xsaW5nIGFuZCBrZXlib2FyZCBzaG9ydGN1dHMgZm9yIHNjcm9sbGluZy5cbiAgICByZXR1cm4gdGhpcy5kaXYoe2NsYXNzOiAnYXBpLWRvY3MtZG9jJywgdGFiaW5kZXg6IC0xfSk7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihsaWJyYXJ5LCB1cmwpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuZW1pdHRlcl8gPSBuZXcgRW1pdHRlcigpO1xuICAgIHRoaXMubGlicmFyeV8gPSBsaWJyYXJ5O1xuICAgIHRoaXMudGl0bGVfID0gJ0xvYWRpbmcuLi4nO1xuICAgIHRoaXMudXJsXyA9IHVybDtcbiAgICB0aGlzLnBhbmVfID0gbnVsbDtcbiAgfVxuXG4gIHNldFZpZXcodXJsKSB7XG4gICAgLy8gU2V0IHRoZSB2aWV3IG9ubHkgYWZ0ZXIgRE9DX1NUWUxFX3tMSUdIVHxEQVJLfV8gYXJlIHNldC5cbiAgICBEb2NWaWV3LkRPQ19TVFlMRV9QUk9NSVNFXy50aGVuKCgpID0+IHtcbiAgICAgIGNvbnN0IHBhcnNlZFVybCA9IFVybC5wYXJzZSh1cmwsIHRydWUpO1xuICAgICAgdmFyIHBhdGggPSBwYXJzZWRVcmwucGF0aG5hbWUuc3Vic3RyKDEpO1xuICAgICAgLy8gVGhlIGhvc3RuYW1lIHBhcnQgb2YgdGhlIHVybCBtYXkgY29udGFpbiBhIHRpbGRlIGlmIHRoZSBzbHVnIGRvZXMuXG4gICAgICAvLyBUaGVyZWZvcmUgdGhpcyBjYW4ndCByZWx5IG9uIFVybC5wYXJzZSgpIHRvIGRldGVybWluZSB0aGUgaG9zdG5hbWUgYW5kIHBhdGguXG4gICAgICB2YXIgaG9zdG5hbWUgPSBwYXJzZWRVcmwuaG9zdG5hbWU7XG4gICAgICB2YXIgaW5kZXhBZnRlckhvc3RuYW1lID0gcGFyc2VkVXJsLnByb3RvY29sLmxlbmd0aCArIDIgKyBwYXJzZWRVcmwuaG9zdG5hbWUubGVuZ3RoO1xuICAgICAgaWYgKHVybC5zdWJzdHIoaW5kZXhBZnRlckhvc3RuYW1lLCAxKSA9PSAnficpIHtcbiAgICAgICAgdGlsZGVQYXJ0ID0gdXJsLnN1YnN0cmluZyhpbmRleEFmdGVySG9zdG5hbWUsIHVybC5pbmRleE9mKCcvJywgaW5kZXhBZnRlckhvc3RuYW1lKSk7XG4gICAgICAgIC8vIG1vdmUgdGlsZGUgcGFydCBmcm9tIHBhdGggdG8gaG9zdG5hbWVcbiAgICAgICAgcGF0aCA9IHBhdGguc3Vic3RyaW5nKHRpbGRlUGFydC5sZW5ndGggKyAxKTtcbiAgICAgICAgaG9zdG5hbWUgKz0gdGlsZGVQYXJ0O1xuICAgICAgfVxuICAgICAgdmFyIGRvY3NldCA9IHRoaXMubGlicmFyeV8uZ2V0KGhvc3RuYW1lKTtcbiAgICAgIGlmICghZG9jc2V0ICYmIHBhdGguc3RhcnRzV2l0aCgnficpICYmIHVybC5zdWJzdHIoaW5kZXhBZnRlckhvc3RuYW1lLCAxKSAhPSAnficpIHtcbiAgICAgICAgLy8gcmVsYXRpdmUgbGlua3MgZnJvbSBvdGhlciB2aWV3cyBjb21lIGFscmVhZHkgbW9kaWZpZWQgd2l0aCB0aGUgdGlsZGUgaW4gdGhlIHBhdGhcbiAgICAgICAgdGlsZGVQYXJ0ID0gcGF0aC5zdWJzdHJpbmcoMCwgcGF0aC5pbmRleE9mKCcvJykpO1xuICAgICAgICAvLyBtb3ZlIHRpbGRlIHBhcnQgZnJvbSBwYXRoIHRvIGhvc3RuYW1lXG4gICAgICAgIHBhdGggPSBwYXRoLnN1YnN0cmluZyh0aWxkZVBhcnQubGVuZ3RoICsgMSk7XG4gICAgICAgIGhvc3RuYW1lICs9IHRpbGRlUGFydDtcbiAgICAgICAgZG9jc2V0ID0gdGhpcy5saWJyYXJ5Xy5nZXQoaG9zdG5hbWUpO1xuICAgICAgfVxuXG4gICAgICBsZXQgc3R5bGUgPSBEb2NWaWV3LkRPQ19TVFlMRV9MSUdIVF87XG4gICAgICBsZXQgc3R5bGVDbGFzcyA9ICcjZmZmJztcbiAgICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ2FwaS1kb2NzLl90aGVtZScpID09ICdEYXJrJykge1xuICAgICAgICBzdHlsZSA9IERvY1ZpZXcuRE9DX1NUWUxFX0RBUktfO1xuICAgICAgICBzdHlsZUNsYXNzID0gJyMzMDMwMzAnO1xuICAgICAgfVxuXG4gICAgICBjb25zdCByb290ID0gdGhpcy5lbGVtZW50LmNyZWF0ZVNoYWRvd1Jvb3QoKTtcbiAgICAgIHJvb3QuaW5uZXJIVE1MID0gYDxzdHlsZSB0eXBlPVwidGV4dC9jc3NcIj4ke3N0eWxlfTwvc3R5bGU+YDtcbiAgICAgIHJvb3QuaW5uZXJIVE1MICs9IGA8ZGl2IGNsYXNzPVwiJHtkb2NzZXQuY2xhc3NOYW1lc31cIiBzdHlsZT1cImZvbnQtc2l6ZTogMTBwdDsgYmFja2dyb3VuZC1jb2xvcjogJHtzdHlsZUNsYXNzfVwiPiR7ZG9jc2V0LmdldENvbnRlbnQocGF0aCl9PC9kaXY+YDtcblxuICAgICAgLy8gU2V0IHVwIGNsaWNrIGhhbmRsZXJzIGZvciByZWxhdGl2ZSBVUkxzIHNvIHdlIGNhbiByZXNvbHZlIGludGVybmFsbHkuXG4gICAgICBjb25zdCBlbGVtZW50cyA9ICQocm9vdCkuZmluZCgnYScpO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbGVtZW50cy5sZW5ndGg7ICsraSkge1xuICAgICAgICBjb25zdCBocmVmID0gZWxlbWVudHNbaV0uZ2V0QXR0cmlidXRlKCdocmVmJyk7XG4gICAgICAgIGlmICghaHJlZikge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGhyZWYuc3RhcnRzV2l0aCgnaHR0cCcpKSB7XG4gICAgICAgICAgZWxlbWVudHNbaV0ub25jbGljayA9IGV2ZW50ID0+IFNoZWxsLm9wZW5FeHRlcm5hbChocmVmKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlbGVtZW50c1tpXS5vbmNsaWNrID0gZXZlbnQgPT4gdGhpcy5zZXRWaWV3KFVybC5yZXNvbHZlKHVybCwgaHJlZikpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIEhpZ2hsaWdodChkb2NzZXQudHlwZSwgcm9vdCk7XG5cbiAgICAgIC8vIFNjcm9sbCB0byBlbGVtZW50IHdpdGggcGFzc2VkIGlkXG4gICAgICBpZiAocGFyc2VkVXJsLmhhc2gpIHtcbiAgICAgICAgLy8gZXNjYXBlIHNwZWNpYWwgY2hhcmFjdGVycyBpbiBzZWxlY3RvclxuICAgICAgICBjb25zdCBoYXNoID0gcGFyc2VkVXJsLmhhc2gucmVwbGFjZSgnLicsICdcXFxcLicpO1xuICAgICAgICBjb25zdCBmb3VuZEVsZW1lbnRzID0gJChyb290KS5maW5kKGhhc2gpO1xuICAgICAgICBpZiAoZm91bmRFbGVtZW50cykge1xuICAgICAgICAgIGNvbnN0IGZvdW5kRWxlbWVudCA9IGZvdW5kRWxlbWVudHNbMF07XG4gICAgICAgICAgJCgkKHJvb3QpLmZpbmQoJ2RpdicpWzBdKS5zY3JvbGxUb3AoZm91bmRFbGVtZW50Lm9mZnNldFRvcCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy50aXRsZV8gPSBkb2NzZXQuZ2V0VGl0bGUocGF0aCk7XG4gICAgICB0aGlzLmVtaXR0ZXJfLmVtaXQoJ2RpZC1jaGFuZ2UtdGl0bGUnKTtcbiAgICB9KTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy5wYW5lXy5kZXN0cm95SXRlbSh0aGlzKTtcbiAgICBpZiAodGhpcy5wYW5lXy5nZXRJdGVtcygpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhpcy5wYW5lXy5kZXN0cm95KCk7XG4gICAgfVxuICB9XG5cbiAgYXR0YWNoZWQoKSB7XG4gICAgdGhpcy5wYW5lXyA9IGF0b20ud29ya3NwYWNlLnBhbmVGb3JVUkkodGhpcy5nZXRVUkkoKSk7XG4gICAgdGhpcy5wYW5lXy5hY3RpdmF0ZUl0ZW0odGhpcyk7XG4gIH1cblxuICBvbkRpZENoYW5nZVRpdGxlKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlcl8ub24oJ2RpZC1jaGFuZ2UtdGl0bGUnLCBjYWxsYmFjayk7XG4gIH1cblxuICBvbkRpZENoYW5nZU1vZGlmaWVkKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIG5ldyBEaXNwb3NhYmxlKCk7XG4gIH1cblxuICAvLyBSZXF1aXJlZCB0byBmaW5kIHRoZSBwYW5lIGZvciB0aGlzIGluc3RhbmNlLlxuICBnZXRVUkkoKSB7XG4gICAgcmV0dXJuIHRoaXMudXJsXztcbiAgfVxuXG4gIGdldFRpdGxlKCkge1xuICAgIHJldHVybiB0aGlzLnRpdGxlXztcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IERvY1ZpZXc7XG4iXX0=