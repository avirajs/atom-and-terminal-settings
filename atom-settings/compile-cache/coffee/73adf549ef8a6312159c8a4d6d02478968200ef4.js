(function() {
  var basename;

  basename = require('path').basename;

  module.exports = {
    activate: function(state) {
      return atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          var rspecGrammar;
          if (!_this._isRspecFile(editor.getPath())) {
            return;
          }
          rspecGrammar = atom.grammars.grammarForScopeName('source.ruby.rspec');
          if (rspecGrammar == null) {
            return;
          }
          return editor.setGrammar(rspecGrammar);
        };
      })(this));
    },
    deactivate: function() {},
    serialize: function() {},
    _isRspecFile: function(filename) {
      var rspec_filetype;
      if (typeof filename !== 'string') {
        return false;
      }
      rspec_filetype = 'spec.rb';
      return basename(filename).slice(-rspec_filetype.length) === rspec_filetype;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYXZpcmFqcy8uYXRvbS9wYWNrYWdlcy9sYW5ndWFnZS1yc3BlYy9saWIvbGFuZ3VhZ2UtcnNwZWMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQyxXQUFZLE9BQUEsQ0FBUSxNQUFSOztFQUViLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxRQUFBLEVBQVUsU0FBQyxLQUFEO2FBQ1IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBZixDQUFrQyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsTUFBRDtBQUNoQyxjQUFBO1VBQUEsSUFBQSxDQUFjLEtBQUMsQ0FBQSxZQUFELENBQWMsTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFkLENBQWQ7QUFBQSxtQkFBQTs7VUFDQSxZQUFBLEdBQWUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxtQkFBZCxDQUFrQyxtQkFBbEM7VUFDZixJQUFjLG9CQUFkO0FBQUEsbUJBQUE7O2lCQUNBLE1BQU0sQ0FBQyxVQUFQLENBQWtCLFlBQWxCO1FBSmdDO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFsQztJQURRLENBQVY7SUFPQSxVQUFBLEVBQVksU0FBQSxHQUFBLENBUFo7SUFTQSxTQUFBLEVBQVcsU0FBQSxHQUFBLENBVFg7SUFXQSxZQUFBLEVBQWMsU0FBQyxRQUFEO0FBQ1osVUFBQTtNQUFBLElBQW9CLE9BQU8sUUFBUCxLQUFvQixRQUF4QztBQUFBLGVBQU8sTUFBUDs7TUFDQSxjQUFBLEdBQWlCO2FBQ2pCLFFBQUEsQ0FBUyxRQUFULENBQWtCLENBQUMsS0FBbkIsQ0FBeUIsQ0FBQyxjQUFjLENBQUMsTUFBekMsQ0FBQSxLQUFvRDtJQUh4QyxDQVhkOztBQUhGIiwic291cmNlc0NvbnRlbnQiOlsie2Jhc2VuYW1lfSA9IHJlcXVpcmUgJ3BhdGgnXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgYWN0aXZhdGU6IChzdGF0ZSkgLT5cbiAgICBhdG9tLndvcmtzcGFjZS5vYnNlcnZlVGV4dEVkaXRvcnMgKGVkaXRvcikgPT5cbiAgICAgIHJldHVybiB1bmxlc3MgQF9pc1JzcGVjRmlsZShlZGl0b3IuZ2V0UGF0aCgpKVxuICAgICAgcnNwZWNHcmFtbWFyID0gYXRvbS5ncmFtbWFycy5ncmFtbWFyRm9yU2NvcGVOYW1lICdzb3VyY2UucnVieS5yc3BlYydcbiAgICAgIHJldHVybiB1bmxlc3MgcnNwZWNHcmFtbWFyP1xuICAgICAgZWRpdG9yLnNldEdyYW1tYXIgcnNwZWNHcmFtbWFyXG5cbiAgZGVhY3RpdmF0ZTogLT5cblxuICBzZXJpYWxpemU6IC0+XG5cbiAgX2lzUnNwZWNGaWxlOiAoZmlsZW5hbWUpIC0+XG4gICAgcmV0dXJuIGZhbHNlIHVubGVzcyB0eXBlb2YoZmlsZW5hbWUpID09ICdzdHJpbmcnXG4gICAgcnNwZWNfZmlsZXR5cGUgPSAnc3BlYy5yYidcbiAgICBiYXNlbmFtZShmaWxlbmFtZSkuc2xpY2UoLXJzcGVjX2ZpbGV0eXBlLmxlbmd0aCkgPT0gcnNwZWNfZmlsZXR5cGVcbiJdfQ==
