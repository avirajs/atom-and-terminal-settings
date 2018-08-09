(function() {
  var CompositeDisposable, FileWatcher, FileWatcherInitializer, log, ref, warn;

  CompositeDisposable = require('atom').CompositeDisposable;

  ref = require('./utils'), log = ref.log, warn = ref.warn;

  FileWatcher = require('./file-watcher');

  FileWatcherInitializer = (function() {
    function FileWatcherInitializer() {}

    FileWatcherInitializer.prototype.config = {
      autoReload: {
        order: 1,
        type: 'boolean',
        "default": false,
        title: 'Reload Automatically',
        description: 'Reload without a prompt. Warning: Overrides "Prompt on Change" and "Include the Compare option", and may cause a loss of work!'
      },
      promptWhenChange: {
        order: 2,
        type: 'boolean',
        "default": false,
        title: 'Prompt on Change',
        description: 'Also prompt to reload or ignore if the file on disk changes and there are no unsaved changes in Atom'
      },
      includeCompareOption: {
        order: 3,
        type: 'boolean',
        "default": true,
        title: 'Include the Compare option',
        description: 'Opens the file on disk as a new editor for comparisons'
      },
      useFsWatchFile: {
        order: 4,
        type: 'boolean',
        "default": false,
        title: 'Use WatchFile -- RELOAD REQUIRED',
        description: 'This is less efficient and should only be used for mounted files systems e.g. SSHFS'
      },
      postCompareCommand: {
        order: 5,
        type: 'string',
        "default": '',
        title: 'Post-Compare command',
        description: 'Command to run after the compare is shown e.g. split-diff:toggle'
      },
      logDebugMessages: {
        order: 6,
        type: 'boolean',
        "default": false,
        title: 'Log debug messages in the console'
      }
    };

    FileWatcherInitializer.prototype.activate = function() {
      this.subscriptions = new CompositeDisposable;
      this.watchers = [];
      return this.subscriptions.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          var fileWatcher;
          if (editor.fileWatcher != null) {
            return;
          }
          fileWatcher = new FileWatcher(editor);
          editor.fileWatcher = fileWatcher;
          _this.watchers.push(fileWatcher);
          return _this.subscriptions.add(fileWatcher.onDidDestroy(function() {
            return _this.watchers.splice(_this.watchers.indexOf(fileWatcher), 1);
          }));
        };
      })(this)));
    };

    FileWatcherInitializer.prototype.deactivate = function() {
      var fileWatcher, i, len, ref1;
      ref1 = this.watchers;
      for (i = 0, len = ref1.length; i < len; i++) {
        fileWatcher = ref1[i];
        if (fileWatcher != null) {
          fileWatcher.destroy();
        }
      }
      return this.subscriptions.dispose();
    };

    return FileWatcherInitializer;

  })();

  module.exports = new FileWatcherInitializer();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYXZpcmFqcy8uYXRvbS9wYWNrYWdlcy9maWxlLXdhdGNoZXIvbGliL2luaXQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVI7O0VBQ3hCLE1BQWMsT0FBQSxDQUFRLFNBQVIsQ0FBZCxFQUFDLGFBQUQsRUFBTTs7RUFDTixXQUFBLEdBQWMsT0FBQSxDQUFRLGdCQUFSOztFQUVSOzs7cUNBRUosTUFBQSxHQUNFO01BQUEsVUFBQSxFQUNFO1FBQUEsS0FBQSxFQUFPLENBQVA7UUFDQSxJQUFBLEVBQU0sU0FETjtRQUVBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FGVDtRQUdBLEtBQUEsRUFBTyxzQkFIUDtRQUlBLFdBQUEsRUFBYSxnSUFKYjtPQURGO01BTUEsZ0JBQUEsRUFDRTtRQUFBLEtBQUEsRUFBTyxDQUFQO1FBQ0EsSUFBQSxFQUFNLFNBRE47UUFFQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBRlQ7UUFHQSxLQUFBLEVBQU8sa0JBSFA7UUFJQSxXQUFBLEVBQWEsc0dBSmI7T0FQRjtNQVlBLG9CQUFBLEVBQ0U7UUFBQSxLQUFBLEVBQU8sQ0FBUDtRQUNBLElBQUEsRUFBTSxTQUROO1FBRUEsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQUZUO1FBR0EsS0FBQSxFQUFPLDRCQUhQO1FBSUEsV0FBQSxFQUFhLHdEQUpiO09BYkY7TUFrQkEsY0FBQSxFQUNFO1FBQUEsS0FBQSxFQUFPLENBQVA7UUFDQSxJQUFBLEVBQU0sU0FETjtRQUVBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FGVDtRQUdBLEtBQUEsRUFBTyxrQ0FIUDtRQUlBLFdBQUEsRUFBYSxxRkFKYjtPQW5CRjtNQXdCQSxrQkFBQSxFQUNFO1FBQUEsS0FBQSxFQUFPLENBQVA7UUFDQSxJQUFBLEVBQU0sUUFETjtRQUVBLENBQUEsT0FBQSxDQUFBLEVBQVMsRUFGVDtRQUdBLEtBQUEsRUFBTyxzQkFIUDtRQUlBLFdBQUEsRUFBYSxrRUFKYjtPQXpCRjtNQThCQSxnQkFBQSxFQUNFO1FBQUEsS0FBQSxFQUFPLENBQVA7UUFDQSxJQUFBLEVBQU0sU0FETjtRQUVBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FGVDtRQUdBLEtBQUEsRUFBTyxtQ0FIUDtPQS9CRjs7O3FDQW9DRixRQUFBLEdBQVUsU0FBQTtNQUNSLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7TUFFckIsSUFBQyxDQUFBLFFBQUQsR0FBWTthQUVaLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFmLENBQWtDLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxNQUFEO0FBQ25ELGNBQUE7VUFBQSxJQUFVLDBCQUFWO0FBQUEsbUJBQUE7O1VBRUEsV0FBQSxHQUFjLElBQUksV0FBSixDQUFnQixNQUFoQjtVQUNkLE1BQU0sQ0FBQyxXQUFQLEdBQXFCO1VBQ3JCLEtBQUMsQ0FBQSxRQUFRLENBQUMsSUFBVixDQUFlLFdBQWY7aUJBRUEsS0FBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLFdBQVcsQ0FBQyxZQUFaLENBQXlCLFNBQUE7bUJBQzFDLEtBQUMsQ0FBQSxRQUFRLENBQUMsTUFBVixDQUFpQixLQUFDLENBQUEsUUFBUSxDQUFDLE9BQVYsQ0FBa0IsV0FBbEIsQ0FBakIsRUFBaUQsQ0FBakQ7VUFEMEMsQ0FBekIsQ0FBbkI7UUFQbUQ7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxDLENBQW5CO0lBTFE7O3FDQWVWLFVBQUEsR0FBWSxTQUFBO0FBQ1YsVUFBQTtBQUFBO0FBQUEsV0FBQSxzQ0FBQTs7O1VBQUEsV0FBVyxDQUFFLE9BQWIsQ0FBQTs7QUFBQTthQUNBLElBQUMsQ0FBQSxhQUFhLENBQUMsT0FBZixDQUFBO0lBRlU7Ozs7OztFQUlkLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLElBQUksc0JBQUosQ0FBQTtBQTlEakIiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xue2xvZywgd2Fybn0gPSByZXF1aXJlICcuL3V0aWxzJ1xuRmlsZVdhdGNoZXIgPSByZXF1aXJlICcuL2ZpbGUtd2F0Y2hlcidcblxuY2xhc3MgRmlsZVdhdGNoZXJJbml0aWFsaXplclxuXG4gIGNvbmZpZzpcbiAgICBhdXRvUmVsb2FkOlxuICAgICAgb3JkZXI6IDFcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgIHRpdGxlOiAnUmVsb2FkIEF1dG9tYXRpY2FsbHknXG4gICAgICBkZXNjcmlwdGlvbjogJ1JlbG9hZCB3aXRob3V0IGEgcHJvbXB0LiBXYXJuaW5nOiBPdmVycmlkZXMgXCJQcm9tcHQgb24gQ2hhbmdlXCIgYW5kIFwiSW5jbHVkZSB0aGUgQ29tcGFyZSBvcHRpb25cIiwgYW5kIG1heSBjYXVzZSBhIGxvc3Mgb2Ygd29yayEnXG4gICAgcHJvbXB0V2hlbkNoYW5nZTpcbiAgICAgIG9yZGVyOiAyXG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICB0aXRsZTogJ1Byb21wdCBvbiBDaGFuZ2UnXG4gICAgICBkZXNjcmlwdGlvbjogJ0Fsc28gcHJvbXB0IHRvIHJlbG9hZCBvciBpZ25vcmUgaWYgdGhlIGZpbGUgb24gZGlzayBjaGFuZ2VzIGFuZCB0aGVyZSBhcmUgbm8gdW5zYXZlZCBjaGFuZ2VzIGluIEF0b20nXG4gICAgaW5jbHVkZUNvbXBhcmVPcHRpb246XG4gICAgICBvcmRlcjogM1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICB0aXRsZTogJ0luY2x1ZGUgdGhlIENvbXBhcmUgb3B0aW9uJ1xuICAgICAgZGVzY3JpcHRpb246ICdPcGVucyB0aGUgZmlsZSBvbiBkaXNrIGFzIGEgbmV3IGVkaXRvciBmb3IgY29tcGFyaXNvbnMnXG4gICAgdXNlRnNXYXRjaEZpbGU6XG4gICAgICBvcmRlcjogNFxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgdGl0bGU6ICdVc2UgV2F0Y2hGaWxlIC0tIFJFTE9BRCBSRVFVSVJFRCdcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhpcyBpcyBsZXNzIGVmZmljaWVudCBhbmQgc2hvdWxkIG9ubHkgYmUgdXNlZCBmb3IgbW91bnRlZCBmaWxlcyBzeXN0ZW1zIGUuZy4gU1NIRlMnXG4gICAgcG9zdENvbXBhcmVDb21tYW5kOlxuICAgICAgb3JkZXI6IDVcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiAnJ1xuICAgICAgdGl0bGU6ICdQb3N0LUNvbXBhcmUgY29tbWFuZCdcbiAgICAgIGRlc2NyaXB0aW9uOiAnQ29tbWFuZCB0byBydW4gYWZ0ZXIgdGhlIGNvbXBhcmUgaXMgc2hvd24gZS5nLiBzcGxpdC1kaWZmOnRvZ2dsZSdcbiAgICBsb2dEZWJ1Z01lc3NhZ2VzOlxuICAgICAgb3JkZXI6IDZcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgIHRpdGxlOiAnTG9nIGRlYnVnIG1lc3NhZ2VzIGluIHRoZSBjb25zb2xlJ1xuXG4gIGFjdGl2YXRlOiAtPlxuICAgIEBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcblxuICAgIEB3YXRjaGVycyA9IFtdXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzIChlZGl0b3IpID0+XG4gICAgICByZXR1cm4gaWYgZWRpdG9yLmZpbGVXYXRjaGVyP1xuXG4gICAgICBmaWxlV2F0Y2hlciA9IG5ldyBGaWxlV2F0Y2hlcihlZGl0b3IpXG4gICAgICBlZGl0b3IuZmlsZVdhdGNoZXIgPSBmaWxlV2F0Y2hlclxuICAgICAgQHdhdGNoZXJzLnB1c2goZmlsZVdhdGNoZXIpXG5cbiAgICAgIEBzdWJzY3JpcHRpb25zLmFkZCBmaWxlV2F0Y2hlci5vbkRpZERlc3Ryb3kgPT5cbiAgICAgICAgQHdhdGNoZXJzLnNwbGljZShAd2F0Y2hlcnMuaW5kZXhPZihmaWxlV2F0Y2hlciksIDEpXG5cbiAgZGVhY3RpdmF0ZTogLT5cbiAgICBmaWxlV2F0Y2hlcj8uZGVzdHJveSgpIGZvciBmaWxlV2F0Y2hlciBpbiBAd2F0Y2hlcnNcbiAgICBAc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgRmlsZVdhdGNoZXJJbml0aWFsaXplcigpXG4iXX0=
