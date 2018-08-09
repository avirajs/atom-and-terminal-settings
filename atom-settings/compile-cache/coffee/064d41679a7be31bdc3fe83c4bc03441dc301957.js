(function() {
  var GoToDefinitionRailsView;

  module.exports = GoToDefinitionRailsView = (function() {
    function GoToDefinitionRailsView(serializedState) {
      var message;
      this.element = document.createElement('div');
      this.element.classList.add('go-to-definition-rails');
      message = document.createElement('div');
      message.textContent = "The GoToDefinitionRails package is Alive! It's ALIVE!";
      message.classList.add('message');
      this.element.appendChild(message);
    }

    GoToDefinitionRailsView.prototype.serialize = function() {};

    GoToDefinitionRailsView.prototype.destroy = function() {
      return this.element.remove();
    };

    GoToDefinitionRailsView.prototype.getElement = function() {
      return this.element;
    };

    return GoToDefinitionRailsView;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYXZpcmFqcy8uYXRvbS9wYWNrYWdlcy9nby10by1kZWZpbml0aW9uLXJhaWxzL2xpYi9nby10by1kZWZpbml0aW9uLXJhaWxzLXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxNQUFNLENBQUMsT0FBUCxHQUNNO0lBQ1MsaUNBQUMsZUFBRDtBQUVYLFVBQUE7TUFBQSxJQUFDLENBQUEsT0FBRCxHQUFXLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCO01BQ1gsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBbkIsQ0FBdUIsd0JBQXZCO01BR0EsT0FBQSxHQUFVLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCO01BQ1YsT0FBTyxDQUFDLFdBQVIsR0FBc0I7TUFDdEIsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFsQixDQUFzQixTQUF0QjtNQUNBLElBQUMsQ0FBQSxPQUFPLENBQUMsV0FBVCxDQUFxQixPQUFyQjtJQVRXOztzQ0FZYixTQUFBLEdBQVcsU0FBQSxHQUFBOztzQ0FHWCxPQUFBLEdBQVMsU0FBQTthQUNQLElBQUMsQ0FBQSxPQUFPLENBQUMsTUFBVCxDQUFBO0lBRE87O3NDQUdULFVBQUEsR0FBWSxTQUFBO2FBQ1YsSUFBQyxDQUFBO0lBRFM7Ozs7O0FBcEJkIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgR29Ub0RlZmluaXRpb25SYWlsc1ZpZXdcbiAgY29uc3RydWN0b3I6IChzZXJpYWxpemVkU3RhdGUpIC0+XG4gICAgIyBDcmVhdGUgcm9vdCBlbGVtZW50XG4gICAgQGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIEBlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2dvLXRvLWRlZmluaXRpb24tcmFpbHMnKVxuXG4gICAgIyBDcmVhdGUgbWVzc2FnZSBlbGVtZW50XG4gICAgbWVzc2FnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgbWVzc2FnZS50ZXh0Q29udGVudCA9IFwiVGhlIEdvVG9EZWZpbml0aW9uUmFpbHMgcGFja2FnZSBpcyBBbGl2ZSEgSXQncyBBTElWRSFcIlxuICAgIG1lc3NhZ2UuY2xhc3NMaXN0LmFkZCgnbWVzc2FnZScpXG4gICAgQGVsZW1lbnQuYXBwZW5kQ2hpbGQobWVzc2FnZSlcblxuICAjIFJldHVybnMgYW4gb2JqZWN0IHRoYXQgY2FuIGJlIHJldHJpZXZlZCB3aGVuIHBhY2thZ2UgaXMgYWN0aXZhdGVkXG4gIHNlcmlhbGl6ZTogLT5cblxuICAjIFRlYXIgZG93biBhbnkgc3RhdGUgYW5kIGRldGFjaFxuICBkZXN0cm95OiAtPlxuICAgIEBlbGVtZW50LnJlbW92ZSgpXG5cbiAgZ2V0RWxlbWVudDogLT5cbiAgICBAZWxlbWVudFxuIl19
