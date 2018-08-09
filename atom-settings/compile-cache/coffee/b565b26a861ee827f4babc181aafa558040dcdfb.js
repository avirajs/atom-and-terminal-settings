(function() {
  var CompositeDisposable, Emitter, FileWatcher, fs, log, path, ref, ref1, warn;

  fs = require('fs');

  path = require('path');

  ref = require('atom'), CompositeDisposable = ref.CompositeDisposable, Emitter = ref.Emitter;

  ref1 = require('./utils'), log = ref1.log, warn = ref1.warn;

  module.exports = FileWatcher = (function() {
    function FileWatcher(editor) {
      var ref2, savedByAtom;
      this.editor = editor;
      this.subscriptions = new CompositeDisposable;
      this.emitter = new Emitter;
      if (this.editor == null) {
        warn('No editor instance on this editor');
        return;
      }
      this.hasUnderlyingFile = ((ref2 = this.editor.getBuffer()) != null ? ref2.file : void 0) != null;
      this.currPath = this.editor.getPath();
      savedByAtom = false;
      this.subscriptions.add(atom.config.observe('file-watcher.autoReload', (function(_this) {
        return function(autoReload) {
          return _this.autoReload = autoReload;
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('file-watcher.promptWhenChange', (function(_this) {
        return function(prompt) {
          return _this.showChangePrompt = prompt;
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('file-watcher.includeCompareOption', (function(_this) {
        return function(compare) {
          return _this.includeCompareOption = compare;
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('file-watcher.useFsWatchFile', (function(_this) {
        return function(useFsWatchFile) {
          return _this.useFsWatchFile = useFsWatchFile;
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('file-watcher.postCompareCommand', (function(_this) {
        return function(command) {
          return _this.postCompareCommand = command;
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('file-watcher.logDebugMessages', (function(_this) {
        return function(debug) {
          return _this.debug = debug;
        };
      })(this)));
      if (this.hasUnderlyingFile) {
        this.subscribeToFileChange();
      }
      this.subscriptions.add(this.editor.onDidConflict((function(_this) {
        return function() {
          return _this.conflictInterceptor();
        };
      })(this)));
      this.subscriptions.add(this.editor.onDidSave((function(_this) {
        return function() {
          _this.ignoreChange = true;
          if (!_this.hasUnderlyingFile) {
            _this.hasUnderlyingFile = true;
            return _this.subscribeToFileChange();
          }
        };
      })(this)));
      this.subscriptions.add(this.editor.onDidDestroy((function(_this) {
        return function() {
          return _this.destroy();
        };
      })(this)));
    }

    FileWatcher.prototype.subscribeToFileChange = function() {
      var ref2, ref3;
      this.currPath = this.editor.getPath();
      if (this.useFsWatchFile) {
        fs.unwatchFile(this.currPath);
        fs.watchFile(this.currPath, (function(_this) {
          return function(curr, prev) {
            if (_this.showChangePrompt && !_this.ignoreChange && curr.mtime.getTime() > prev.mtime.getTime()) {
              _this.confirmReload();
            }
            if (_this.ignoreChange) {
              return _this.ignoreChange = false;
            }
          };
        })(this));
      }
      this.subscriptions.add((ref2 = this.editor.getBuffer()) != null ? ref2.file.onDidChange((function(_this) {
        return function() {
          return _this.changeInterceptor();
        };
      })(this)) : void 0);
      return (ref3 = this.editor.getBuffer()) != null ? ref3.subscribeToFile() : void 0;
    };

    FileWatcher.prototype.isBufferInConflict = function() {
      var ref2;
      return (ref2 = this.editor.getBuffer()) != null ? ref2.isInConflict() : void 0;
    };

    FileWatcher.prototype.changeInterceptor = function() {
      var ref2;
      if (this.debug) {
        log('Change: ' + this.editor.getPath());
      }
      if (this.showChangePrompt) {
        if ((ref2 = this.editor.getBuffer()) != null) {
          ref2.conflict = true;
        }
      }
      if (this.useFsWatchFile && this.showChangePrompt) {
        return this.ignoreChange = true;
      }
    };

    FileWatcher.prototype.conflictInterceptor = function() {
      if (this.debug) {
        log('Conflict: ' + this.editor.getPath());
      }
      if (this.isBufferInConflict()) {
        return this.confirmReload();
      }
    };

    FileWatcher.prototype.forceReload = function() {
      var currBuffer;
      currBuffer = this.editor.getBuffer();
      if (this.useFsWatchFile && currBuffer && currBuffer.updateCachedDiskContents !== void 0) {
        return currBuffer.updateCachedDiskContents(true, (function(_this) {
          return function() {
            return currBuffer != null ? currBuffer.reload() : void 0;
          };
        })(this));
      } else {
        return currBuffer != null ? currBuffer.reload() : void 0;
      }
    };

    FileWatcher.prototype.confirmReload = function() {
      var choice, compPromise, currEncoding, currGrammar, currView, ref2, ref3, scopePath, scopePostCompare;
      if (this.autoReload) {
        this.forceReload();
        return;
      }
      choice = atom.confirm({
        message: 'The file "' + path.basename(this.currPath) + '" has changed.',
        buttons: this.includeCompareOption ? ['Reload', 'Ignore', 'Ignore All', 'Compare'] : ['Reload', 'Ignore', 'Ignore All']
      });
      if (choice === 0) {
        this.forceReload();
        return;
      }
      if (choice === 1) {
        if ((ref2 = this.editor.getBuffer()) != null) {
          ref2.emitModifiedStatusChanged(true);
        }
        return;
      }
      if (choice === 2) {
        this.destroy();
        return;
      }
      scopePath = this.editor.getPath();
      scopePostCompare = this.postCompareCommand;
      currEncoding = ((ref3 = this.editor.getBuffer()) != null ? ref3.getEncoding() : void 0) || 'utf8';
      currGrammar = this.editor.getGrammar();
      currView = atom.views.getView(this.editor);
      compPromise = atom.workspace.open(null, {
        split: 'right'
      });
      return compPromise.then(function(ed) {
        ed.insertText(fs.readFileSync(scopePath, {
          encoding: currEncoding
        }));
        ed.setGrammar(currGrammar);
        if (scopePostCompare) {
          return atom.commands.dispatch(currView, scopePostCompare);
        }
      });
    };

    FileWatcher.prototype.destroy = function() {
      this.subscriptions.dispose();
      if (this.currPath && this.hasUnderlyingFile) {
        fs.unwatchFile(this.currPath);
      }
      return this.emitter.emit('did-destroy');
    };

    FileWatcher.prototype.onDidDestroy = function(callback) {
      return this.emitter.on('did-destroy', callback);
    };

    return FileWatcher;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYXZpcmFqcy8uYXRvbS9wYWNrYWdlcy9maWxlLXdhdGNoZXIvbGliL2ZpbGUtd2F0Y2hlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUjs7RUFDTCxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsTUFBaUMsT0FBQSxDQUFRLE1BQVIsQ0FBakMsRUFBQyw2Q0FBRCxFQUFzQjs7RUFDdEIsT0FBYyxPQUFBLENBQVEsU0FBUixDQUFkLEVBQUMsY0FBRCxFQUFNOztFQUVOLE1BQU0sQ0FBQyxPQUFQLEdBQ007SUFFUyxxQkFBQyxNQUFEO0FBQ1gsVUFBQTtNQURZLElBQUMsQ0FBQSxTQUFEO01BQ1osSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFBSTtNQUNyQixJQUFDLENBQUEsT0FBRCxHQUFXLElBQUk7TUFFZixJQUFPLG1CQUFQO1FBQ0UsSUFBQSxDQUFLLG1DQUFMO0FBQ0EsZUFGRjs7TUFJQSxJQUFDLENBQUEsaUJBQUQsR0FBcUI7TUFDckIsSUFBQyxDQUFBLFFBQUQsR0FBWSxJQUFDLENBQUEsTUFBTSxDQUFDLE9BQVIsQ0FBQTtNQUNaLFdBQUEsR0FBYztNQUVkLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0IseUJBQXBCLEVBQ2pCLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxVQUFEO2lCQUFnQixLQUFDLENBQUEsVUFBRCxHQUFjO1FBQTlCO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQURpQixDQUFuQjtNQUdBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0IsK0JBQXBCLEVBQ2pCLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxNQUFEO2lCQUFZLEtBQUMsQ0FB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Q0FBQTtNQUVwQixZQUFBLG1EQUFrQyxDQUFFLFdBQXJCLENBQUEsV0FBQSxJQUFzQztNQUNyRCxXQUFBLEdBQWMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxVQUFSLENBQUE7TUFDZCxRQUFBLEdBQVcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUMsQ0FBQSxNQUFwQjtNQUVYLFdBQUEsR0FBYyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsSUFBcEIsRUFDWjtRQUFBLEtBQUEsRUFBTyxPQUFQO09BRFk7YUFHZCxXQUFXLENBQUMsSUFBWixDQUFpQixTQUFDLEVBQUQ7UUFFZixFQUFFLENBQUMsVUFBSCxDQUFjLEVBQUUsQ0FBQyxZQUFILENBQWdCLFNBQWhCLEVBQTJCO1VBQUEsUUFBQSxFQUFVLFlBQVY7U0FBM0IsQ0FBZDtRQUNBLEVBQUUsQ0FBQyxVQUFILENBQWMsV0FBZDtRQUNBLElBQXNELGdCQUF0RDtpQkFBQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsUUFBdkIsRUFBaUMsZ0JBQWpDLEVBQUE7O01BSmUsQ0FBakI7SUFqQ2E7OzBCQXVDZixPQUFBLEdBQVMsU0FBQTtNQUNQLElBQUMsQ0FBQSxhQUFhLENBQUMsT0FBZixDQUFBO01BQ0EsSUFBOEIsSUFBQyxDQUFBLFFBQUQsSUFBYyxJQUFDLENBQUEsaUJBQTdDO1FBQUMsRUFBRSxDQUFDLFdBQUgsQ0FBZSxJQUFDLENBQUEsUUFBaEIsRUFBRDs7YUFDQSxJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyxhQUFkO0lBSE87OzBCQUtULFlBQUEsR0FBYyxTQUFDLFFBQUQ7YUFDWixJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxhQUFaLEVBQTJCLFFBQTNCO0lBRFk7Ozs7O0FBekloQiIsInNvdXJjZXNDb250ZW50IjpbImZzID0gcmVxdWlyZSAnZnMnXG5wYXRoID0gcmVxdWlyZSAncGF0aCdcbntDb21wb3NpdGVEaXNwb3NhYmxlLCBFbWl0dGVyfSA9IHJlcXVpcmUgJ2F0b20nXG57bG9nLCB3YXJufSA9IHJlcXVpcmUgJy4vdXRpbHMnXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIEZpbGVXYXRjaGVyXG5cbiAgY29uc3RydWN0b3I6IChAZWRpdG9yKSAtPlxuICAgIEBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBAZW1pdHRlciA9IG5ldyBFbWl0dGVyXG5cbiAgICB1bmxlc3MgQGVkaXRvcj9cbiAgICAgIHdhcm4gJ05vIGVkaXRvciBpbnN0YW5jZSBvbiB0aGlzIGVkaXRvcidcbiAgICAgIHJldHVyblxuXG4gICAgQGhhc1VuZGVybHlpbmdGaWxlID0gQGVkaXRvci5nZXRCdWZmZXIoKT8uZmlsZT9cbiAgICBAY3VyclBhdGggPSBAZWRpdG9yLmdldFBhdGgoKVxuICAgIHNhdmVkQnlBdG9tID0gZmFsc2VcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbmZpZy5vYnNlcnZlICdmaWxlLXdhdGNoZXIuYXV0b1JlbG9hZCcsXG4gICAgICAoYXV0b1JlbG9hZCkgPT4gQGF1dG9SZWxvYWQgPSBhdXRvUmVsb2FkXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb25maWcub2JzZXJ2ZSAnZmlsZS13YXRjaGVyLnByb21wdFdoZW5DaGFuZ2UnLFxuICAgICAgKHByb21wdCkgPT4gQHNob3dDaGFuZ2VQcm9tcHQgPSBwcm9tcHRcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbmZpZy5vYnNlcnZlICdmaWxlLXdhdGNoZXIuaW5jbHVkZUNvbXBhcmVPcHRpb24nLFxuICAgICAgKGNvbXBhcmUpID0+IEBpbmNsdWRlQ29tcGFyZU9wdGlvbiA9IGNvbXBhcmVcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbmZpZy5vYnNlcnZlICdmaWxlLXdhdGNoZXIudXNlRnNXYXRjaEZpbGUnLFxuICAgICAgKHVzZUZzV2F0Y2hGaWxlKSA9PiBAdXNlRnNXYXRjaEZpbGUgPSB1c2VGc1dhdGNoRmlsZVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29uZmlnLm9ic2VydmUgJ2ZpbGUtd2F0Y2hlci5wb3N0Q29tcGFyZUNvbW1hbmQnLFxuICAgICAgKGNvbW1hbmQpID0+IEBwb3N0Q29tcGFyZUNvbW1hbmQgPSBjb21tYW5kXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb25maWcub2JzZXJ2ZSAnZmlsZS13YXRjaGVyLmxvZ0RlYnVnTWVzc2FnZXMnLFxuICAgICAgKGRlYnVnKSA9PiBAZGVidWcgPSBkZWJ1Z1xuXG4gICAgQHN1YnNjcmliZVRvRmlsZUNoYW5nZSgpIGlmIEBoYXNVbmRlcmx5aW5nRmlsZVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIEBlZGl0b3Iub25EaWRDb25mbGljdCA9PlxuICAgICAgQGNvbmZsaWN0SW50ZXJjZXB0b3IoKVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIEBlZGl0b3Iub25EaWRTYXZlID0+XG4gICAgICAjIGF2b2lkIGNoYW5nZSBmaXJpbmcgd2hlbiBBdG9tIHNhdmVzIHRoZSBmaWxlXG4gICAgICBAaWdub3JlQ2hhbmdlID0gdHJ1ZVxuICAgICAgaWYgIUBoYXNVbmRlcmx5aW5nRmlsZVxuICAgICAgICBAaGFzVW5kZXJseWluZ0ZpbGUgPSB0cnVlXG4gICAgICAgIEBzdWJzY3JpYmVUb0ZpbGVDaGFuZ2UoKVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIEBlZGl0b3Iub25EaWREZXN0cm95ID0+XG4gICAgICBAZGVzdHJveSgpXG5cbiAgc3Vic2NyaWJlVG9GaWxlQ2hhbmdlOiAtPlxuICAgIEBjdXJyUGF0aCA9IEBlZGl0b3IuZ2V0UGF0aCgpXG5cbiAgICBpZiBAdXNlRnNXYXRjaEZpbGVcbiAgICAgICMgdHJ5IHRvIHVzZSB3YXRjaEZpbGUgdG8gaGFuZGxlIGNoYW5nZXMgb24gZmlsZSBzeXN0ZW1zIHRoYXQgZG9uJ3Qgc3VwcG9ydCBpbm90aWZ5XG4gICAgICAjIHJlbW92ZSBleGlzdGluZyB3YXRjaCBmaXJzdFxuICAgICAgZnMudW53YXRjaEZpbGUgQGN1cnJQYXRoXG4gICAgICBmcy53YXRjaEZpbGUgQGN1cnJQYXRoLCAoY3VyciwgcHJldikgPT5cbiAgICAgICAgQGNvbmZpcm1SZWxvYWQoKSBpZiBAc2hvd0NoYW5nZVByb21wdCBhbmQgbm90IEBpZ25vcmVDaGFuZ2UgYW5kIGN1cnIubXRpbWUuZ2V0VGltZSgpID4gcHJldi5tdGltZS5nZXRUaW1lKClcbiAgICAgICAgQGlnbm9yZUNoYW5nZSA9IGZhbHNlIGlmIEBpZ25vcmVDaGFuZ2VcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBAZWRpdG9yLmdldEJ1ZmZlcigpPy5maWxlLm9uRGlkQ2hhbmdlID0+XG4gICAgICBAY2hhbmdlSW50ZXJjZXB0b3IoKVxuXG4gICAgIyBjYWxsIHRoaXMgdG8gcmVzZXQgb3JkZXIgb2YgZXZlbnRzLCBvdGhlcndpc2UgYnVmZmVyIGZpcmVzIGZpcnN0XG4gICAgQGVkaXRvci5nZXRCdWZmZXIoKT8uc3Vic2NyaWJlVG9GaWxlKClcblxuICBpc0J1ZmZlckluQ29uZmxpY3Q6IC0+XG4gICAgcmV0dXJuIEBlZGl0b3IuZ2V0QnVmZmVyKCk/LmlzSW5Db25mbGljdCgpXG5cbiAgY2hhbmdlSW50ZXJjZXB0b3I6IC0+XG4gICAgKGxvZyAnQ2hhbmdlOiAnICsgQGVkaXRvci5nZXRQYXRoKCkpIGlmIEBkZWJ1Z1xuICAgIEBlZGl0b3IuZ2V0QnVmZmVyKCk/LmNvbmZsaWN0ID0gdHJ1ZSBpZiBAc2hvd0NoYW5nZVByb21wdFxuXG4gICAgIyBpZ25vcmUgaWYgaGFuZGxlZCBieSB0aGUgbm9uLW1vdW50ZWQgZmlsZSBzeXN0ZW1cbiAgICBAaWdub3JlQ2hhbmdlID0gdHJ1ZSBpZiBAdXNlRnNXYXRjaEZpbGUgYW5kIEBzaG93Q2hhbmdlUHJvbXB0XG5cbiAgY29uZmxpY3RJbnRlcmNlcHRvcjogLT5cbiAgICAobG9nICdDb25mbGljdDogJyArIEBlZGl0b3IuZ2V0UGF0aCgpKSBpZiBAZGVidWdcbiAgICBAY29uZmlybVJlbG9hZCgpIGlmIEBpc0J1ZmZlckluQ29uZmxpY3QoKVxuXG4gIGZvcmNlUmVsb2FkOiAtPlxuICAgIGN1cnJCdWZmZXIgPSBAZWRpdG9yLmdldEJ1ZmZlcigpXG4gICAgIyBwYXRjaCAtIG5ldyB2ZXJzaW9uIG9mIEF0b20gcmVtb3ZlZCB1cGRhdGVDYWNoZWREaXNrQ29udGVudHMoKSBmcm9tIGJ1ZmZlclxuICAgIGlmIEB1c2VGc1dhdGNoRmlsZSBhbmQgY3VyckJ1ZmZlciBhbmQgY3VyckJ1ZmZlci51cGRhdGVDYWNoZWREaXNrQ29udGVudHMgIT0gdW5kZWZpbmVkXG4gICAgICAjIGZvcmNlIGEgcmUtcmVhZCBmcm9tIHRoZSBmaWxlIHRoZW4gcmVsb2FkXG4gICAgICBjdXJyQnVmZmVyLnVwZGF0ZUNhY2hlZERpc2tDb250ZW50cyB0cnVlLCA9PiBjdXJyQnVmZmVyPy5yZWxvYWQoKVxuICAgIGVsc2VcbiAgICAgIGN1cnJCdWZmZXI/LnJlbG9hZCgpXG5cbiAgY29uZmlybVJlbG9hZDogLT5cbiAgICAjIGlmIHRoZSB1c2VyIGhhcyBzZWxlY3RlZCBhdXRvUmVsb2FkIHdlIGNhbiBqdXN0IHJlbG9hZCBhbmQgZXhpdFxuICAgIGlmIEBhdXRvUmVsb2FkXG4gICAgICBAZm9yY2VSZWxvYWQoKVxuICAgICAgcmV0dXJuXG5cbiAgICBjaG9pY2UgPSBhdG9tLmNvbmZpcm1cbiAgICAgIG1lc3NhZ2U6ICdUaGUgZmlsZSBcIicgKyBwYXRoLmJhc2VuYW1lKEBjdXJyUGF0aCkgKyAnXCIgaGFzIGNoYW5nZWQuJ1xuICAgICAgYnV0dG9uczogaWYgQGluY2x1ZGVDb21wYXJlT3B0aW9uIHRoZW4gWydSZWxvYWQnLCAnSWdub3JlJywgJ0lnbm9yZSBBbGwnLCAnQ29tcGFyZSddIGVsc2UgWydSZWxvYWQnLCAnSWdub3JlJywgJ0lnbm9yZSBBbGwnXVxuXG4gICAgaWYgY2hvaWNlIGlzIDAgIyBSZWxvYWRcbiAgICAgIEBmb3JjZVJlbG9hZCgpXG4gICAgICByZXR1cm5cblxuICAgIGlmIGNob2ljZSBpcyAxICNJZ25vcmVcbiAgICAgIEBlZGl0b3IuZ2V0QnVmZmVyKCk/LmVtaXRNb2RpZmllZFN0YXR1c0NoYW5nZWQodHJ1ZSlcbiAgICAgIHJldHVyblxuXG4gICAgaWYgY2hvaWNlIGlzIDIgIyBJZ25vcmUgQWxsXG4gICAgICBAZGVzdHJveSgpXG4gICAgICByZXR1cm5cblxuICAgICMgQ29tcGFyZVxuICAgIHNjb3BlUGF0aCA9IEBlZGl0b3IuZ2V0UGF0aCgpXG4gICAgc2NvcGVQb3N0Q29tcGFyZSA9IEBwb3N0Q29tcGFyZUNvbW1hbmRcblxuICAgIGN1cnJFbmNvZGluZyA9IEBlZGl0b3IuZ2V0QnVmZmVyKCk/LmdldEVuY29kaW5nKCkgfHwgJ3V0ZjgnXG4gICAgY3VyckdyYW1tYXIgPSBAZWRpdG9yLmdldEdyYW1tYXIoKVxuICAgIGN1cnJWaWV3ID0gYXRvbS52aWV3cy5nZXRWaWV3KEBlZGl0b3IpXG5cbiAgICBjb21wUHJvbWlzZSA9IGF0b20ud29ya3NwYWNlLm9wZW4gbnVsbCxcbiAgICAgIHNwbGl0OiAncmlnaHQnXG5cbiAgICBjb21wUHJvbWlzZS50aGVuIChlZCkgLT5cbiAgICAgICMgQGN1cnJQYXRoIGlzIGxvc3Qgc28gdXNlIHBhdGggZnJvbSBjbG9zdXJlXG4gICAgICBlZC5pbnNlcnRUZXh0IGZzLnJlYWRGaWxlU3luYyhzY29wZVBhdGgsIGVuY29kaW5nOiBjdXJyRW5jb2RpbmcpXG4gICAgICBlZC5zZXRHcmFtbWFyIGN1cnJHcmFtbWFyXG4gICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKGN1cnJWaWV3LCBzY29wZVBvc3RDb21wYXJlKSBpZiBzY29wZVBvc3RDb21wYXJlXG5cbiAgZGVzdHJveTogLT5cbiAgICBAc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICAoZnMudW53YXRjaEZpbGUgQGN1cnJQYXRoKSBpZiBAY3VyclBhdGggYW5kIEBoYXNVbmRlcmx5aW5nRmlsZVxuICAgIEBlbWl0dGVyLmVtaXQgJ2RpZC1kZXN0cm95J1xuXG4gIG9uRGlkRGVzdHJveTogKGNhbGxiYWNrKSAtPlxuICAgIEBlbWl0dGVyLm9uICdkaWQtZGVzdHJveScsIGNhbGxiYWNrXG4iXX0=
