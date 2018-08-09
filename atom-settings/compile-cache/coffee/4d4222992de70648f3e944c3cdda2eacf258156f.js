(function() {
  var IS_WIN32, RsenseClient, RsenseProvider;

  RsenseClient = require('./autocomplete-ruby-client.coffee');

  IS_WIN32 = process.platform === 'win32';

  String.prototype.regExpEscape = function() {
    return this.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  };

  module.exports = RsenseProvider = (function() {
    RsenseProvider.prototype.selector = '.source.ruby';

    RsenseProvider.prototype.disableForSelector = '.source.ruby .comment';

    RsenseProvider.suggestionPriority = atom.config.get('autocomplete-ruby.suggestionPriority');

    RsenseProvider.prototype.inclusionPriority = 1;

    RsenseProvider.prototype.suggestionPriority = RsenseProvider.suggestionPriority === true ? 2 : void 0;

    RsenseProvider.prototype.rsenseClient = null;

    function RsenseProvider() {
      this.rsenseClient = new RsenseClient();
      if (!IS_WIN32) {
        this.rsenseClient.startRsenseUnix();
      }
      this.lastSuggestions = [];
    }

    RsenseProvider.prototype.getSuggestions = function(arg) {
      var bufferPosition, editor, prefix, scopeDescriptor;
      editor = arg.editor, bufferPosition = arg.bufferPosition, scopeDescriptor = arg.scopeDescriptor, prefix = arg.prefix;
      if (IS_WIN32) {
        this.rsenseClient.startRsenseWin32();
      }
      return new Promise((function(_this) {
        return function(resolve) {
          var col, completions, row;
          row = bufferPosition.row + 1;
          col = bufferPosition.column + 1;
          return completions = _this.rsenseClient.checkCompletion(editor, editor.buffer, row, col, function(completions) {
            var suggestions;
            suggestions = _this.findSuggestions(prefix, completions);
            if ((suggestions != null ? suggestions.length : void 0)) {
              _this.lastSuggestions = suggestions;
            }
            if (prefix === '.' || prefix === '::') {
              resolve(_this.lastSuggestions);
            }
            return resolve(_this.filterSuggestions(prefix, _this.lastSuggestions));
          });
        };
      })(this));
    };

    RsenseProvider.prototype.findSuggestions = function(prefix, completions) {
      var completion, i, kind, len, suggestion, suggestions;
      if (completions != null) {
        suggestions = [];
        for (i = 0, len = completions.length; i < len; i++) {
          completion = completions[i];
          kind = completion.kind.toLowerCase();
          if (kind === "module") {
            kind = "import";
          }
          suggestion = {
            text: completion.name,
            type: kind,
            leftLabel: completion.base_name
          };
          suggestions.push(suggestion);
        }
        suggestions.sort(function(x, y) {
          if (x.text > y.text) {
            return 1;
          } else if (x.text < y.text) {
            return -1;
          } else {
            return 0;
          }
        });
        return suggestions;
      }
      return [];
    };

    RsenseProvider.prototype.filterSuggestions = function(prefix, suggestions) {
      var expression, i, len, suggestion, suggestionBuffer;
      suggestionBuffer = [];
      if (!(prefix != null ? prefix.length : void 0) || !(suggestions != null ? suggestions.length : void 0)) {
        return [];
      }
      expression = new RegExp("^" + prefix.regExpEscape(), "i");
      for (i = 0, len = suggestions.length; i < len; i++) {
        suggestion = suggestions[i];
        if (expression.test(suggestion.text)) {
          suggestion.replacementPrefix = prefix;
          suggestionBuffer.push(suggestion);
        }
      }
      return suggestionBuffer;
    };

    RsenseProvider.prototype.dispose = function() {
      if (IS_WIN32) {
        return this.rsenseClient.stopRsense();
      }
      return this.rsenseClient.stopRsenseUnix();
    };

    return RsenseProvider;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYXZpcmFqcy8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtcnVieS9saWIvYXV0b2NvbXBsZXRlLXJ1YnktcHJvdmlkZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxZQUFBLEdBQWUsT0FBQSxDQUFRLG1DQUFSOztFQUNmLFFBQUEsR0FBVyxPQUFPLENBQUMsUUFBUixLQUFvQjs7RUFFL0IsTUFBTSxDQUFDLFNBQVMsQ0FBQyxZQUFqQixHQUFnQyxTQUFBO0FBQzlCLFdBQU8sSUFBQyxDQUFBLE9BQUQsQ0FBUyxxQ0FBVCxFQUFnRCxNQUFoRDtFQUR1Qjs7RUFHaEMsTUFBTSxDQUFDLE9BQVAsR0FDTTs2QkFDSixRQUFBLEdBQVU7OzZCQUNWLGtCQUFBLEdBQW9COztJQUNwQixjQUFDLENBQUEsa0JBQUQsR0FBc0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHNDQUFoQjs7NkJBRXRCLGlCQUFBLEdBQW1COzs2QkFDbkIsa0JBQUEsR0FBeUIsY0FBQyxDQUFBLGtCQUFELEtBQXVCLElBQTVCLEdBQUEsQ0FBQSxHQUFBOzs2QkFFcEIsWUFBQSxHQUFjOztJQUVELHdCQUFBO01BQ1gsSUFBQyxDQUFBLFlBQUQsR0FBZ0IsSUFBSSxZQUFKLENBQUE7TUFDaEIsSUFBbUMsQ0FBQyxRQUFwQztRQUFBLElBQUMsQ0FBQSxZQUFZLENBQUMsZUFBZCxDQUFBLEVBQUE7O01BQ0EsSUFBQyxDQUFBLGVBQUQsR0FBbUI7SUFIUjs7NkJBS2IsY0FBQSxHQUFnQixTQUFDLEdBQUQ7QUFDZCxVQUFBO01BRGdCLHFCQUFRLHFDQUFnQix1Q0FBaUI7TUFDekQsSUFBb0MsUUFBcEM7UUFBQSxJQUFDLENBQUEsWUFBWSxDQUFDLGdCQUFkLENBQUEsRUFBQTs7YUFDQSxJQUFJLE9BQUosQ0FBWSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsT0FBRDtBQUVWLGNBQUE7VUFBQSxHQUFBLEdBQU0sY0FBYyxDQUFDLEdBQWYsR0FBcUI7VUFDM0IsR0FBQSxHQUFNLGNBQWMsQ0FBQyxNQUFmLEdBQXdCO2lCQUM5QixXQUFBLEdBQWMsS0FBQyxDQUFBLFlBQVksQ0FBQyxlQUFkLENBQThCLE1BQTlCLEVBQ2QsTUFBTSxDQUFDLE1BRE8sRUFDQyxHQURELEVBQ00sR0FETixFQUNXLFNBQUMsV0FBRDtBQUN2QixnQkFBQTtZQUFBLFdBQUEsR0FBYyxLQUFDLENBQUEsZUFBRCxDQUFpQixNQUFqQixFQUF5QixXQUF6QjtZQUNkLElBQUUsdUJBQUMsV0FBVyxDQUFFLGVBQWQsQ0FBRjtjQUNFLEtBQUMsQ0FBQSxlQUFELEdBQW1CLFlBRHJCOztZQUlBLElBQTZCLE1BQUEsS0FBVSxHQUFWLElBQWlCLE1BQUEsS0FBVSxJQUF4RDtjQUFBLE9BQUEsQ0FBUSxLQUFDLENBQUEsZUFBVCxFQUFBOzttQkFFQSxPQUFBLENBQVEsS0FBQyxDQUFBLGlCQUFELENBQW1CLE1BQW5CLEVBQTJCLEtBQUMsQ0FBQSxlQUE1QixDQUFSO1VBUnVCLENBRFg7UUFKSjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBWjtJQUZjOzs2QkFrQmhCLGVBQUEsR0FBaUIsU0FBQyxNQUFELEVBQVMsV0FBVDtBQUNmLFVBQUE7TUFBQSxJQUFHLG1CQUFIO1FBQ0UsV0FBQSxHQUFjO0FBQ2QsYUFBQSw2Q0FBQTs7VUFDRSxJQUFBLEdBQU8sVUFBVSxDQUFDLElBQUksQ0FBQyxXQUFoQixDQUFBO1VBQ1AsSUFBbUIsSUFBQSxLQUFRLFFBQTNCO1lBQUEsSUFBQSxHQUFPLFNBQVA7O1VBQ0EsVUFBQSxHQUNFO1lBQUEsSUFBQSxFQUFNLFVBQVUsQ0FBQyxJQUFqQjtZQUNBLElBQUEsRUFBTSxJQUROO1lBRUEsU0FBQSxFQUFXLFVBQVUsQ0FBQyxTQUZ0Qjs7VUFHRixXQUFXLENBQUMsSUFBWixDQUFpQixVQUFqQjtBQVBGO1FBUUEsV0FBVyxDQUFDLElBQVosQ0FBaUIsU0FBQyxDQUFELEVBQUksQ0FBSjtVQUNmLElBQUcsQ0FBQyxDQUFDLElBQUYsR0FBTyxDQUFDLENBQUMsSUFBWjttQkFDRSxFQURGO1dBQUEsTUFFSyxJQUFHLENBQUMsQ0FBQyxJQUFGLEdBQU8sQ0FBQyxDQUFDLElBQVo7bUJBQ0gsQ0FBQyxFQURFO1dBQUEsTUFBQTttQkFHSCxFQUhHOztRQUhVLENBQWpCO0FBUUEsZUFBTyxZQWxCVDs7QUFtQkEsYUFBTztJQXBCUTs7NkJBdUJqQixpQkFBQSxHQUFtQixTQUFDLE1BQUQsRUFBUyxXQUFUO0FBQ2pCLFVBQUE7TUFBQSxnQkFBQSxHQUFtQjtNQUVuQixJQUFHLG1CQUFDLE1BQU0sQ0FBRSxnQkFBVCxJQUFtQix3QkFBQyxXQUFXLENBQUUsZ0JBQXBDO0FBQ0UsZUFBTyxHQURUOztNQUdBLFVBQUEsR0FBYSxJQUFJLE1BQUosQ0FBVyxHQUFBLEdBQUksTUFBTSxDQUFDLFlBQVAsQ0FBQSxDQUFmLEVBQXNDLEdBQXRDO0FBRWIsV0FBQSw2Q0FBQTs7UUFDRSxJQUFHLFVBQVUsQ0FBQyxJQUFYLENBQWdCLFVBQVUsQ0FBQyxJQUEzQixDQUFIO1VBQ0UsVUFBVSxDQUFDLGlCQUFYLEdBQStCO1VBQy9CLGdCQUFnQixDQUFDLElBQWpCLENBQXNCLFVBQXRCLEVBRkY7O0FBREY7QUFLQSxhQUFPO0lBYlU7OzZCQWVuQixPQUFBLEdBQVMsU0FBQTtNQUNQLElBQXFDLFFBQXJDO0FBQUEsZUFBTyxJQUFDLENBQUEsWUFBWSxDQUFDLFVBQWQsQ0FBQSxFQUFQOzthQUNBLElBQUMsQ0FBQSxZQUFZLENBQUMsY0FBZCxDQUFBO0lBRk87Ozs7O0FBOUVYIiwic291cmNlc0NvbnRlbnQiOlsiUnNlbnNlQ2xpZW50ID0gcmVxdWlyZSAnLi9hdXRvY29tcGxldGUtcnVieS1jbGllbnQuY29mZmVlJ1xuSVNfV0lOMzIgPSBwcm9jZXNzLnBsYXRmb3JtID09ICd3aW4zMidcblxuU3RyaW5nLnByb3RvdHlwZS5yZWdFeHBFc2NhcGUgPSAoKSAtPlxuICByZXR1cm4gQHJlcGxhY2UoL1tcXC1cXFtcXF1cXC9cXHtcXH1cXChcXClcXCpcXCtcXD9cXC5cXFxcXFxeXFwkXFx8XS9nLCBcIlxcXFwkJlwiKVxuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBSc2Vuc2VQcm92aWRlclxuICBzZWxlY3RvcjogJy5zb3VyY2UucnVieSdcbiAgZGlzYWJsZUZvclNlbGVjdG9yOiAnLnNvdXJjZS5ydWJ5IC5jb21tZW50J1xuICBAc3VnZ2VzdGlvblByaW9yaXR5ID0gYXRvbS5jb25maWcuZ2V0KCdhdXRvY29tcGxldGUtcnVieS5zdWdnZXN0aW9uUHJpb3JpdHknKVxuXG4gIGluY2x1c2lvblByaW9yaXR5OiAxXG4gIHN1Z2dlc3Rpb25Qcmlvcml0eTogMiBpZiBAc3VnZ2VzdGlvblByaW9yaXR5ID09IHRydWVcblxuICByc2Vuc2VDbGllbnQ6IG51bGxcblxuICBjb25zdHJ1Y3RvcjogLT5cbiAgICBAcnNlbnNlQ2xpZW50ID0gbmV3IFJzZW5zZUNsaWVudCgpXG4gICAgQHJzZW5zZUNsaWVudC5zdGFydFJzZW5zZVVuaXgoKSBpZiAhSVNfV0lOMzJcbiAgICBAbGFzdFN1Z2dlc3Rpb25zID0gW11cblxuICBnZXRTdWdnZXN0aW9uczogKHtlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uLCBzY29wZURlc2NyaXB0b3IsIHByZWZpeH0pIC0+XG4gICAgQHJzZW5zZUNsaWVudC5zdGFydFJzZW5zZVdpbjMyKCkgaWYgSVNfV0lOMzJcbiAgICBuZXcgUHJvbWlzZSAocmVzb2x2ZSkgPT5cbiAgICAgICMgcnNlbnNlIGV4cGVjdHMgMS1iYXNlZCBwb3NpdGlvbnNcbiAgICAgIHJvdyA9IGJ1ZmZlclBvc2l0aW9uLnJvdyArIDFcbiAgICAgIGNvbCA9IGJ1ZmZlclBvc2l0aW9uLmNvbHVtbiArIDFcbiAgICAgIGNvbXBsZXRpb25zID0gQHJzZW5zZUNsaWVudC5jaGVja0NvbXBsZXRpb24oZWRpdG9yLFxuICAgICAgZWRpdG9yLmJ1ZmZlciwgcm93LCBjb2wsIChjb21wbGV0aW9ucykgPT5cbiAgICAgICAgc3VnZ2VzdGlvbnMgPSBAZmluZFN1Z2dlc3Rpb25zKHByZWZpeCwgY29tcGxldGlvbnMpXG4gICAgICAgIGlmKHN1Z2dlc3Rpb25zPy5sZW5ndGgpXG4gICAgICAgICAgQGxhc3RTdWdnZXN0aW9ucyA9IHN1Z2dlc3Rpb25zXG5cbiAgICAgICAgIyByZXF1ZXN0IGNvbXBsZXRpb24gb24gYC5gIGFuZCBgOjpgXG4gICAgICAgIHJlc29sdmUoQGxhc3RTdWdnZXN0aW9ucykgaWYgcHJlZml4ID09ICcuJyB8fCBwcmVmaXggPT0gJzo6J1xuXG4gICAgICAgIHJlc29sdmUoQGZpbHRlclN1Z2dlc3Rpb25zKHByZWZpeCwgQGxhc3RTdWdnZXN0aW9ucykpXG4gICAgICApXG5cbiAgZmluZFN1Z2dlc3Rpb25zOiAocHJlZml4LCBjb21wbGV0aW9ucykgLT5cbiAgICBpZiBjb21wbGV0aW9ucz9cbiAgICAgIHN1Z2dlc3Rpb25zID0gW11cbiAgICAgIGZvciBjb21wbGV0aW9uIGluIGNvbXBsZXRpb25zXG4gICAgICAgIGtpbmQgPSBjb21wbGV0aW9uLmtpbmQudG9Mb3dlckNhc2UoKVxuICAgICAgICBraW5kID0gXCJpbXBvcnRcIiBpZiBraW5kID09IFwibW9kdWxlXCJcbiAgICAgICAgc3VnZ2VzdGlvbiA9XG4gICAgICAgICAgdGV4dDogY29tcGxldGlvbi5uYW1lXG4gICAgICAgICAgdHlwZToga2luZFxuICAgICAgICAgIGxlZnRMYWJlbDogY29tcGxldGlvbi5iYXNlX25hbWVcbiAgICAgICAgc3VnZ2VzdGlvbnMucHVzaChzdWdnZXN0aW9uKVxuICAgICAgc3VnZ2VzdGlvbnMuc29ydCAoeCwgeSkgLT5cbiAgICAgICAgaWYgeC50ZXh0PnkudGV4dFxuICAgICAgICAgIDFcbiAgICAgICAgZWxzZSBpZiB4LnRleHQ8eS50ZXh0XG4gICAgICAgICAgLTFcbiAgICAgICAgZWxzZVxuICAgICAgICAgIDBcblxuICAgICAgcmV0dXJuIHN1Z2dlc3Rpb25zXG4gICAgcmV0dXJuIFtdXG5cblxuICBmaWx0ZXJTdWdnZXN0aW9uczogKHByZWZpeCwgc3VnZ2VzdGlvbnMpIC0+XG4gICAgc3VnZ2VzdGlvbkJ1ZmZlciA9IFtdXG5cbiAgICBpZighcHJlZml4Py5sZW5ndGggfHwgIXN1Z2dlc3Rpb25zPy5sZW5ndGgpXG4gICAgICByZXR1cm4gW11cblxuICAgIGV4cHJlc3Npb24gPSBuZXcgUmVnRXhwKFwiXlwiK3ByZWZpeC5yZWdFeHBFc2NhcGUoKSwgXCJpXCIpXG5cbiAgICBmb3Igc3VnZ2VzdGlvbiBpbiBzdWdnZXN0aW9uc1xuICAgICAgaWYgZXhwcmVzc2lvbi50ZXN0KHN1Z2dlc3Rpb24udGV4dClcbiAgICAgICAgc3VnZ2VzdGlvbi5yZXBsYWNlbWVudFByZWZpeCA9IHByZWZpeFxuICAgICAgICBzdWdnZXN0aW9uQnVmZmVyLnB1c2goc3VnZ2VzdGlvbilcblxuICAgIHJldHVybiBzdWdnZXN0aW9uQnVmZmVyXG5cbiAgZGlzcG9zZTogLT5cbiAgICByZXR1cm4gQHJzZW5zZUNsaWVudC5zdG9wUnNlbnNlKCkgaWYgSVNfV0lOMzJcbiAgICBAcnNlbnNlQ2xpZW50LnN0b3BSc2Vuc2VVbml4KClcbiJdfQ==
