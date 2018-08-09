(function() {
  var DefaultFileIcons, FileIcons;

  FileIcons = (function() {
    function FileIcons() {
      this.service = new DefaultFileIcons;
    }

    FileIcons.prototype.getService = function() {
      return this.service;
    };

    FileIcons.prototype.resetService = function() {
      return this.service = new DefaultFileIcons;
    };

    FileIcons.prototype.setService = function(service) {
      this.service = service;
    };

    return FileIcons;

  })();

  DefaultFileIcons = (function() {
    function DefaultFileIcons() {}

    DefaultFileIcons.prototype.iconClassForPath = function(filePath) {
      return '';
    };

    return DefaultFileIcons;

  })();

  module.exports = new FileIcons;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYXZpcmFqcy8uYXRvbS9wYWNrYWdlcy9leHBvc2UvbGliL2ZpbGUtaWNvbnMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBTTtJQUNTLG1CQUFBO01BQ1gsSUFBQyxDQUFBLE9BQUQsR0FBVyxJQUFJO0lBREo7O3dCQUdiLFVBQUEsR0FBWSxTQUFBO2FBQ1YsSUFBQyxDQUFBO0lBRFM7O3dCQUdaLFlBQUEsR0FBYyxTQUFBO2FBQ1osSUFBQyxDQUFBLE9BQUQsR0FBVyxJQUFJO0lBREg7O3dCQUdkLFVBQUEsR0FBWSxTQUFDLE9BQUQ7TUFBQyxJQUFDLENBQUEsVUFBRDtJQUFEOzs7Ozs7RUFFUjs7OytCQUNKLGdCQUFBLEdBQWtCLFNBQUMsUUFBRDthQUNoQjtJQURnQjs7Ozs7O0VBR3BCLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLElBQUk7QUFoQnJCIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgRmlsZUljb25zXG4gIGNvbnN0cnVjdG9yOiAtPlxuICAgIEBzZXJ2aWNlID0gbmV3IERlZmF1bHRGaWxlSWNvbnNcblxuICBnZXRTZXJ2aWNlOiAtPlxuICAgIEBzZXJ2aWNlXG5cbiAgcmVzZXRTZXJ2aWNlOiAtPlxuICAgIEBzZXJ2aWNlID0gbmV3IERlZmF1bHRGaWxlSWNvbnNcblxuICBzZXRTZXJ2aWNlOiAoQHNlcnZpY2UpIC0+XG5cbmNsYXNzIERlZmF1bHRGaWxlSWNvbnNcbiAgaWNvbkNsYXNzRm9yUGF0aDogKGZpbGVQYXRoKSAtPlxuICAgICcnXG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IEZpbGVJY29uc1xuIl19
