(function() {
  var FileManager, _,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  _ = require('underscore-plus');

  module.exports = FileManager = (function() {
    var VALID_FILE_TYPES, instance;

    VALID_FILE_TYPES = ["auto", "text", "applescript", "boxnote", "c", "csharp", "cpp", "css", "csv", "clojure", "coffeescript", "cfm", "diff", "erlang", "go", "groovy", "html", "haskell", "java", "javascript", "latex", "lisp", "lua", "matlab", "markdown", "objc", "php", "perl", "post", "puppet", "python", "r", "ruby", "sql", "scala", "scheme", "shell", "smalltalk", "tsv", "vb", "vbscript", "xml", "yaml"];

    instance = null;

    function FileManager(stateController) {
      this.stateController = stateController;
      this.getFileTypeFromGrammar = bind(this.getFileTypeFromGrammar, this);
      this.uploadFile = bind(this.uploadFile, this);
      this.uploadSelection = bind(this.uploadSelection, this);
      if (instance) {
        return instance;
      } else {
        instance = this;
      }
      this.client = this.stateController.client;
    }

    FileManager.prototype.uploadSelection = function(channels, comment) {
      return atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          return _this.uploadFile(editor, channels, comment);
        };
      })(this));
    };

    FileManager.prototype.uploadFile = function(editor, channels, comment) {
      return this.client.post("files.upload", {
        content: editor.getSelectedText(),
        filetype: this.getFileTypeFromGrammar(editor),
        initial_comment: comment,
        channels: channels.join(',')
      }, (function(_this) {
        return function(err, resp) {
          var chat;
          if (resp.body.ok) {
            chat = _this.stateController.team.chatWithChannel(channels[0]);
            return _this.stateController.setState('chat', chat);
          }
        };
      })(this));
    };

    FileManager.prototype.getFileTypeFromGrammar = function(editor) {
      var filetype, grammar;
      grammar = editor.getGrammar().name;
      filetype = _.find(VALID_FILE_TYPES, (function(_this) {
        return function(type) {
          return grammar.toLowerCase() === type;
        };
      })(this));
      return filetype || 'auto';
    };

    return FileManager;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYXZpcmFqcy8uYXRvbS9wYWNrYWdlcy9zbGFjay1jaGF0L2xpYi9maWxlLW1hbmFnZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBO0FBQUEsTUFBQSxjQUFBO0lBQUE7O0VBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUjs7RUFFSixNQUFNLENBQUMsT0FBUCxHQUNNO0FBRUosUUFBQTs7SUFBQSxnQkFBQSxHQUFtQixDQUFDLE1BQUQsRUFBUyxNQUFULEVBQWlCLGFBQWpCLEVBQWdDLFNBQWhDLEVBQTJDLEdBQTNDLEVBQWdELFFBQWhELEVBQTBELEtBQTFELEVBQ2pCLEtBRGlCLEVBQ1YsS0FEVSxFQUNILFNBREcsRUFDUSxjQURSLEVBQ3dCLEtBRHhCLEVBQytCLE1BRC9CLEVBQ3VDLFFBRHZDLEVBQ2lELElBRGpELEVBQ3VELFFBRHZELEVBRWpCLE1BRmlCLEVBRVQsU0FGUyxFQUVFLE1BRkYsRUFFVSxZQUZWLEVBRXdCLE9BRnhCLEVBRWlDLE1BRmpDLEVBRXlDLEtBRnpDLEVBRWdELFFBRmhELEVBR2pCLFVBSGlCLEVBR0wsTUFISyxFQUdHLEtBSEgsRUFHVSxNQUhWLEVBR2tCLE1BSGxCLEVBRzBCLFFBSDFCLEVBR29DLFFBSHBDLEVBRzhDLEdBSDlDLEVBR21ELE1BSG5ELEVBRzJELEtBSDNELEVBSWpCLE9BSmlCLEVBSVIsUUFKUSxFQUlFLE9BSkYsRUFJVyxXQUpYLEVBSXdCLEtBSnhCLEVBSStCLElBSi9CLEVBSXFDLFVBSnJDLEVBSWlELEtBSmpELEVBSXdELE1BSnhEOztJQU1uQixRQUFBLEdBQVc7O0lBRUUscUJBQUMsZUFBRDtNQUFDLElBQUMsQ0FBQSxrQkFBRDs7OztNQUNaLElBQUcsUUFBSDtBQUNFLGVBQU8sU0FEVDtPQUFBLE1BQUE7UUFHRSxRQUFBLEdBQVcsS0FIYjs7TUFLQSxJQUFDLENBQUEsTUFBRCxHQUFVLElBQUMsQ0FBQSxlQUFlLENBQUM7SUFOaEI7OzBCQVNiLGVBQUEsR0FBaUIsU0FBQyxRQUFELEVBQVcsT0FBWDthQUNmLElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWYsQ0FBa0MsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLE1BQUQ7aUJBQ2hDLEtBQUMsQ0FBQSxVQUFELENBQVksTUFBWixFQUFvQixRQUFwQixFQUE4QixPQUE5QjtRQURnQztNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEM7SUFEZTs7MEJBS2pCLFVBQUEsR0FBWSxTQUFDLE1BQUQsRUFBUyxRQUFULEVBQW1CLE9BQW5CO2FBQ1YsSUFBQyxDQUFBLE1BQU0sQ0FBQyxJQUFSLENBQWEsY0FBYixFQUNFO1FBQUEsT0FBQSxFQUFTLE1BQU0sQ0FBQyxlQUFQLENBQUEsQ0FBVDtRQUNBLFFBQUEsRUFBVSxJQUFDLENBQUEsc0JBQUQsQ0FBd0IsTUFBeEIsQ0FEVjtRQUVBLGVBQUEsRUFBaUIsT0FGakI7UUFHQSxRQUFBLEVBQVUsUUFBUSxDQUFDLElBQVQsQ0FBYyxHQUFkLENBSFY7T0FERixFQUtFLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxHQUFELEVBQU0sSUFBTjtBQUNBLGNBQUE7VUFBQSxJQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBYjtZQUNFLElBQUEsR0FBTyxLQUFDLENBQUEsZUFBZSxDQUFDLElBQUksQ0FBQyxlQUF0QixDQUFzQyxRQUFTLENBQUEsQ0FBQSxDQUEvQzttQkFDUCxLQUFDLENBQUEsZUFBZSxDQUFDLFFBQWpCLENBQTBCLE1BQTFCLEVBQWtDLElBQWxDLEVBRkY7O1FBREE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBTEY7SUFEVTs7MEJBYVosc0JBQUEsR0FBd0IsU0FBQyxNQUFEO0FBQ3RCLFVBQUE7TUFBQSxPQUFBLEdBQVUsTUFBTSxDQUFDLFVBQVAsQ0FBQSxDQUFtQixDQUFDO01BQzlCLFFBQUEsR0FBVyxDQUFDLENBQUMsSUFBRixDQUFPLGdCQUFQLEVBQXlCLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxJQUFEO2lCQUNsQyxPQUFPLENBQUMsV0FBUixDQUFBLENBQUEsS0FBeUI7UUFEUztNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBekI7YUFFWCxRQUFBLElBQVk7SUFKVTs7Ozs7QUF4QzFCIiwic291cmNlc0NvbnRlbnQiOlsiXG5fID0gcmVxdWlyZSAndW5kZXJzY29yZS1wbHVzJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBGaWxlTWFuYWdlclxuICAjIEZpbGUgdHlwZXMgdGhhdCBjYW4gYmUgYWNjZXB0ZWQgYnkgc2xhY2tcbiAgVkFMSURfRklMRV9UWVBFUyA9IFtcImF1dG9cIiwgXCJ0ZXh0XCIsIFwiYXBwbGVzY3JpcHRcIiwgXCJib3hub3RlXCIsIFwiY1wiLCBcImNzaGFycFwiLCBcImNwcFwiLFxuICAgIFwiY3NzXCIsIFwiY3N2XCIsIFwiY2xvanVyZVwiLCBcImNvZmZlZXNjcmlwdFwiLCBcImNmbVwiLCBcImRpZmZcIiwgXCJlcmxhbmdcIiwgXCJnb1wiLCBcImdyb292eVwiLFxuICAgIFwiaHRtbFwiLCBcImhhc2tlbGxcIiwgXCJqYXZhXCIsIFwiamF2YXNjcmlwdFwiLCBcImxhdGV4XCIsIFwibGlzcFwiLCBcImx1YVwiLCBcIm1hdGxhYlwiLFxuICAgIFwibWFya2Rvd25cIiwgXCJvYmpjXCIsIFwicGhwXCIsIFwicGVybFwiLCBcInBvc3RcIiwgXCJwdXBwZXRcIiwgXCJweXRob25cIiwgXCJyXCIsIFwicnVieVwiLCBcInNxbFwiLFxuICAgIFwic2NhbGFcIiwgXCJzY2hlbWVcIiwgXCJzaGVsbFwiLCBcInNtYWxsdGFsa1wiLCBcInRzdlwiLCBcInZiXCIsIFwidmJzY3JpcHRcIiwgXCJ4bWxcIiwgXCJ5YW1sXCJdXG5cbiAgaW5zdGFuY2UgPSBudWxsXG5cbiAgY29uc3RydWN0b3I6IChAc3RhdGVDb250cm9sbGVyKSAtPlxuICAgIGlmIGluc3RhbmNlXG4gICAgICByZXR1cm4gaW5zdGFuY2VcbiAgICBlbHNlXG4gICAgICBpbnN0YW5jZSA9IHRoaXNcblxuICAgIEBjbGllbnQgPSBAc3RhdGVDb250cm9sbGVyLmNsaWVudFxuXG4gICMgUmV0cmlldmVzIGEgc2VsZWN0aW9uIG9mIHRleHQgZnJvbSB0aGUgbWFpbiBlZGl0b3IgdmlldyBhbmQgZ29lcyBvbiB0byB1cGxvYWQgaXRcbiAgdXBsb2FkU2VsZWN0aW9uOiAoY2hhbm5lbHMsIGNvbW1lbnQpID0+XG4gICAgYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzIChlZGl0b3IpID0+XG4gICAgICBAdXBsb2FkRmlsZShlZGl0b3IsIGNoYW5uZWxzLCBjb21tZW50KVxuXG4gICMgVXBsb2FkIHRoZSBmaWxlIHRvIHNsYWNrIGZvciBhIHNldCBvZiBjaGFubmVscy5cbiAgdXBsb2FkRmlsZTogKGVkaXRvciwgY2hhbm5lbHMsIGNvbW1lbnQpID0+XG4gICAgQGNsaWVudC5wb3N0IFwiZmlsZXMudXBsb2FkXCIsXG4gICAgICBjb250ZW50OiBlZGl0b3IuZ2V0U2VsZWN0ZWRUZXh0KClcbiAgICAgIGZpbGV0eXBlOiBAZ2V0RmlsZVR5cGVGcm9tR3JhbW1hcihlZGl0b3IpXG4gICAgICBpbml0aWFsX2NvbW1lbnQ6IGNvbW1lbnRcbiAgICAgIGNoYW5uZWxzOiBjaGFubmVscy5qb2luKCcsJylcbiAgICAsIChlcnIsIHJlc3ApID0+XG4gICAgICBpZiByZXNwLmJvZHkub2tcbiAgICAgICAgY2hhdCA9IEBzdGF0ZUNvbnRyb2xsZXIudGVhbS5jaGF0V2l0aENoYW5uZWwoY2hhbm5lbHNbMF0pXG4gICAgICAgIEBzdGF0ZUNvbnRyb2xsZXIuc2V0U3RhdGUoJ2NoYXQnLCBjaGF0KVxuXG4gICMgVGhlIGVkaXRvciB3aWxsIGhhdmUgYSBncmFtbWFyIHRoYXQgbmVlZHMgdG8gYmUgY29udmVydGVkIHRvIHRoZSBjb3JyZXNwb25kaW5nXG4gICMgc2xhY2sgZmlsZSB0eXBlIChpZiBhdmFpbGFibGUpLiBNb3N0bHkgZm9yIHN5bnRheCBoaWdobGlnaHRpbmcgb24gc2xhY2tzIGVuZC5cbiAgZ2V0RmlsZVR5cGVGcm9tR3JhbW1hcjogKGVkaXRvcikgPT5cbiAgICBncmFtbWFyID0gZWRpdG9yLmdldEdyYW1tYXIoKS5uYW1lXG4gICAgZmlsZXR5cGUgPSBfLmZpbmQgVkFMSURfRklMRV9UWVBFUywgKHR5cGUpID0+XG4gICAgICBncmFtbWFyLnRvTG93ZXJDYXNlKCkgaXMgdHlwZVxuICAgIGZpbGV0eXBlIG9yICdhdXRvJ1xuXG4iXX0=
