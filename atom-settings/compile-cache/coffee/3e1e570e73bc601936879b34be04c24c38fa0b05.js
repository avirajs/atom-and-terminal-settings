(function() {
  var MergeState;

  MergeState = (function() {
    function MergeState(conflicts, context1, isRebase) {
      this.conflicts = conflicts;
      this.context = context1;
      this.isRebase = isRebase;
    }

    MergeState.prototype.conflictPaths = function() {
      var c, i, len, ref, results;
      ref = this.conflicts;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        c = ref[i];
        results.push(c.path);
      }
      return results;
    };

    MergeState.prototype.reread = function() {
      return this.context.readConflicts().then((function(_this) {
        return function(conflicts) {
          _this.conflicts = conflicts;
        };
      })(this));
    };

    MergeState.prototype.isEmpty = function() {
      return this.conflicts.length === 0;
    };

    MergeState.prototype.relativize = function(filePath) {
      return this.context.workingDirectory.relativize(filePath);
    };

    MergeState.prototype.join = function(relativePath) {
      return this.context.joinPath(relativePath);
    };

    MergeState.read = function(context) {
      var isr;
      isr = context.isRebasing();
      return context.readConflicts().then(function(cs) {
        return new MergeState(cs, context, isr);
      });
    };

    return MergeState;

  })();

  module.exports = {
    MergeState: MergeState
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYXZpcmFqcy8uYXRvbS9wYWNrYWdlcy9tZXJnZS1jb25mbGljdHMvbGliL21lcmdlLXN0YXRlLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQU07SUFFUyxvQkFBQyxTQUFELEVBQWEsUUFBYixFQUF1QixRQUF2QjtNQUFDLElBQUMsQ0FBQSxZQUFEO01BQVksSUFBQyxDQUFBLFVBQUQ7TUFBVSxJQUFDLENBQUEsV0FBRDtJQUF2Qjs7eUJBRWIsYUFBQSxHQUFlLFNBQUE7QUFBRyxVQUFBO0FBQUE7QUFBQTtXQUFBLHFDQUFBOztxQkFBQSxDQUFDLENBQUM7QUFBRjs7SUFBSDs7eUJBRWYsTUFBQSxHQUFRLFNBQUE7YUFDTixJQUFDLENBQUEsT0FBTyxDQUFDLGFBQVQsQ0FBQSxDQUF3QixDQUFDLElBQXpCLENBQThCLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxTQUFEO1VBQUMsS0FBQyxDQUFBLFlBQUQ7UUFBRDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBOUI7SUFETTs7eUJBR1IsT0FBQSxHQUFTLFNBQUE7YUFBRyxJQUFDLENBQUEsU0FBUyxDQUFDLE1BQVgsS0FBcUI7SUFBeEI7O3lCQUVULFVBQUEsR0FBWSxTQUFDLFFBQUQ7YUFBYyxJQUFDLENBQUEsT0FBTyxDQUFDLGdCQUFnQixDQUFDLFVBQTFCLENBQXFDLFFBQXJDO0lBQWQ7O3lCQUVaLElBQUEsR0FBTSxTQUFDLFlBQUQ7YUFBa0IsSUFBQyxDQUFBLE9BQU8sQ0FBQyxRQUFULENBQWtCLFlBQWxCO0lBQWxCOztJQUVOLFVBQUMsQ0FBQSxJQUFELEdBQU8sU0FBQyxPQUFEO0FBQ0wsVUFBQTtNQUFBLEdBQUEsR0FBTSxPQUFPLENBQUMsVUFBUixDQUFBO2FBQ04sT0FBTyxDQUFDLGFBQVIsQ0FBQSxDQUF1QixDQUFDLElBQXhCLENBQTZCLFNBQUMsRUFBRDtlQUMzQixJQUFJLFVBQUosQ0FBZSxFQUFmLEVBQW1CLE9BQW5CLEVBQTRCLEdBQTVCO01BRDJCLENBQTdCO0lBRks7Ozs7OztFQUtULE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxVQUFBLEVBQVksVUFBWjs7QUFyQkYiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBNZXJnZVN0YXRlXG5cbiAgY29uc3RydWN0b3I6IChAY29uZmxpY3RzLCBAY29udGV4dCwgQGlzUmViYXNlKSAtPlxuXG4gIGNvbmZsaWN0UGF0aHM6IC0+IGMucGF0aCBmb3IgYyBpbiBAY29uZmxpY3RzXG5cbiAgcmVyZWFkOiAtPlxuICAgIEBjb250ZXh0LnJlYWRDb25mbGljdHMoKS50aGVuIChAY29uZmxpY3RzKSA9PlxuXG4gIGlzRW1wdHk6IC0+IEBjb25mbGljdHMubGVuZ3RoIGlzIDBcblxuICByZWxhdGl2aXplOiAoZmlsZVBhdGgpIC0+IEBjb250ZXh0LndvcmtpbmdEaXJlY3RvcnkucmVsYXRpdml6ZSBmaWxlUGF0aFxuXG4gIGpvaW46IChyZWxhdGl2ZVBhdGgpIC0+IEBjb250ZXh0LmpvaW5QYXRoKHJlbGF0aXZlUGF0aClcblxuICBAcmVhZDogKGNvbnRleHQpIC0+XG4gICAgaXNyID0gY29udGV4dC5pc1JlYmFzaW5nKClcbiAgICBjb250ZXh0LnJlYWRDb25mbGljdHMoKS50aGVuIChjcykgLT5cbiAgICAgIG5ldyBNZXJnZVN0YXRlKGNzLCBjb250ZXh0LCBpc3IpXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgTWVyZ2VTdGF0ZTogTWVyZ2VTdGF0ZVxuIl19
