(function() {
  var Commands,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  module.exports = Commands = (function() {
    function Commands(stateController, subscriptions) {
      this.stateController = stateController;
      this.subscriptions = subscriptions;
      this.uploadSelection = bind(this.uploadSelection, this);
      this.closeConversation = bind(this.closeConversation, this);
      this.openConversation = bind(this.openConversation, this);
      this.moveUp = bind(this.moveUp, this);
      this.moveDown = bind(this.moveDown, this);
      this.subscriptions.add(atom.commands.add('atom-workspace', 'slack-chat:move-down', (function(_this) {
        return function() {
          return _this.moveDown();
        };
      })(this)));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'slack-chat:move-up', (function(_this) {
        return function() {
          return _this.moveUp();
        };
      })(this)));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'slack-chat:open-conversation', (function(_this) {
        return function() {
          return _this.openConversation();
        };
      })(this)));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'slack-chat:close-conversation', (function(_this) {
        return function() {
          return _this.closeConversation();
        };
      })(this)));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'slack-chat:upload-selection', (function(_this) {
        return function() {
          return _this.uploadSelection();
        };
      })(this)));
    }

    Commands.prototype.moveDown = function() {
      if (this.stateController.modalPanel.isVisible()) {
        return this.stateController.channelView.nextConversation();
      }
    };

    Commands.prototype.moveUp = function() {
      if (this.stateController.modalPanel.isVisible()) {
        return this.stateController.channelView.prevConversation();
      }
    };

    Commands.prototype.openConversation = function() {
      if (this.stateController.modalPanel.isVisible()) {
        return this.stateController.channelView.openConversation();
      }
    };

    Commands.prototype.closeConversation = function() {
      if (this.stateController.modalPanel.isVisible()) {
        return this.stateController.setState('default');
      }
    };

    Commands.prototype.uploadSelection = function() {
      this.stateController.modalPanel.show();
      return this.stateController.setState('upload');
    };

    return Commands;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYXZpcmFqcy8uYXRvbS9wYWNrYWdlcy9zbGFjay1jaGF0L2xpYi9jb21tYW5kcy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0E7QUFBQSxNQUFBLFFBQUE7SUFBQTs7RUFBQSxNQUFNLENBQUMsT0FBUCxHQUNNO0lBRVMsa0JBQUMsZUFBRCxFQUFtQixhQUFuQjtNQUFDLElBQUMsQ0FBQSxrQkFBRDtNQUFrQixJQUFDLENBQUEsZ0JBQUQ7Ozs7OztNQUU5QixJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQyxzQkFBcEMsRUFBNEQsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUFHLEtBQUMsQ0FBQSxRQUFELENBQUE7UUFBSDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBNUQsQ0FBbkI7TUFDQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQyxvQkFBcEMsRUFBMEQsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUFHLEtBQUMsQ0FBQSxNQUFELENBQUE7UUFBSDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBMUQsQ0FBbkI7TUFDQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQyw4QkFBcEMsRUFBb0UsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUFHLEtBQUMsQ0FBQSxnQkFBRCxDQUFBO1FBQUg7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXBFLENBQW5CO01BQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0MsK0JBQXBDLEVBQXFFLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFBRyxLQUFDLENBQUEsaUJBQUQsQ0FBQTtRQUFIO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFyRSxDQUFuQjtNQUNBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DLDZCQUFwQyxFQUFtRSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQUcsS0FBQyxDQUFBLGVBQUQsQ0FBQTtRQUFIO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFuRSxDQUFuQjtJQU5XOzt1QkFTYixRQUFBLEdBQVUsU0FBQTtNQUNSLElBQUcsSUFBQyxDQUFBLGVBQWUsQ0FBQyxVQUFVLENBQUMsU0FBNUIsQ0FBQSxDQUFIO2VBQ0UsSUFBQyxDQUFBLGVBQWUsQ0FBQyxXQUFXLENBQUMsZ0JBQTdCLENBQUEsRUFERjs7SUFEUTs7dUJBS1YsTUFBQSxHQUFRLFNBQUE7TUFDTixJQUFHLElBQUMsQ0FBQSxlQUFlLENBQUMsVUFBVSxDQUFDLFNBQTVCLENBQUEsQ0FBSDtlQUNFLElBQUMsQ0FBQSxlQUFlLENBQUMsV0FBVyxDQUFDLGdCQUE3QixDQUFBLEVBREY7O0lBRE07O3VCQUtSLGdCQUFBLEdBQWtCLFNBQUE7TUFDaEIsSUFBRyxJQUFDLENBQUEsZUFBZSxDQUFDLFVBQVUsQ0FBQyxTQUE1QixDQUFBLENBQUg7ZUFDRSxJQUFDLENBQUEsZUFBZSxDQUFDLFdBQVcsQ0FBQyxnQkFBN0IsQ0FBQSxFQURGOztJQURnQjs7dUJBS2xCLGlCQUFBLEdBQW1CLFNBQUE7TUFDakIsSUFBRyxJQUFDLENBQUEsZUFBZSxDQUFDLFVBQVUsQ0FBQyxTQUE1QixDQUFBLENBQUg7ZUFDRSxJQUFDLENBQUEsZUFBZSxDQUFDLFFBQWpCLENBQTBCLFNBQTFCLEVBREY7O0lBRGlCOzt1QkFLbkIsZUFBQSxHQUFpQixTQUFBO01BQ2YsSUFBQyxDQUFBLGVBQWUsQ0FBQyxVQUFVLENBQUMsSUFBNUIsQ0FBQTthQUNBLElBQUMsQ0FBQSxlQUFlLENBQUMsUUFBakIsQ0FBMEIsUUFBMUI7SUFGZTs7Ozs7QUFoQ25CIiwic291cmNlc0NvbnRlbnQiOlsiXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBDb21tYW5kc1xuXG4gIGNvbnN0cnVjdG9yOiAoQHN0YXRlQ29udHJvbGxlciwgQHN1YnNjcmlwdGlvbnMpIC0+XG4gICAgIyBSZWdpc3RlciBzbGFjay1jaGF0IGNvbW1hbmRzXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsICdzbGFjay1jaGF0Om1vdmUtZG93bicsID0+IEBtb3ZlRG93bigpXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsICdzbGFjay1jaGF0Om1vdmUtdXAnLCA9PiBAbW92ZVVwKClcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ3NsYWNrLWNoYXQ6b3Blbi1jb252ZXJzYXRpb24nLCA9PiBAb3BlbkNvbnZlcnNhdGlvbigpXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsICdzbGFjay1jaGF0OmNsb3NlLWNvbnZlcnNhdGlvbicsID0+IEBjbG9zZUNvbnZlcnNhdGlvbigpXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsICdzbGFjay1jaGF0OnVwbG9hZC1zZWxlY3Rpb24nLCA9PiBAdXBsb2FkU2VsZWN0aW9uKClcblxuICAjIE1vdmUgY2hhbm5lbC9tZW1iZXIgc2VsZWN0aW9uIGRvd25cbiAgbW92ZURvd246ID0+XG4gICAgaWYgQHN0YXRlQ29udHJvbGxlci5tb2RhbFBhbmVsLmlzVmlzaWJsZSgpXG4gICAgICBAc3RhdGVDb250cm9sbGVyLmNoYW5uZWxWaWV3Lm5leHRDb252ZXJzYXRpb24oKVxuXG4gICMgTW92ZSBjaGFubmVsL21lbWJlciBzZWxlY3Rpb24gdXBcbiAgbW92ZVVwOiA9PlxuICAgIGlmIEBzdGF0ZUNvbnRyb2xsZXIubW9kYWxQYW5lbC5pc1Zpc2libGUoKVxuICAgICAgQHN0YXRlQ29udHJvbGxlci5jaGFubmVsVmlldy5wcmV2Q29udmVyc2F0aW9uKClcblxuICAjIEVudGVyIGNoYXQgdmlldyBmb3IgYSBjaGFubmVsXG4gIG9wZW5Db252ZXJzYXRpb246ID0+XG4gICAgaWYgQHN0YXRlQ29udHJvbGxlci5tb2RhbFBhbmVsLmlzVmlzaWJsZSgpXG4gICAgICBAc3RhdGVDb250cm9sbGVyLmNoYW5uZWxWaWV3Lm9wZW5Db252ZXJzYXRpb24oKVxuXG4gICMgUmV0dXJuIHRvIGRlZmF1bHQgc3RhdGUgKGNvbnZlcnNhdGlvbiB2aWV3KVxuICBjbG9zZUNvbnZlcnNhdGlvbjogPT5cbiAgICBpZiBAc3RhdGVDb250cm9sbGVyLm1vZGFsUGFuZWwuaXNWaXNpYmxlKClcbiAgICAgIEBzdGF0ZUNvbnRyb2xsZXIuc2V0U3RhdGUoJ2RlZmF1bHQnKVxuXG4gICMgVXBsb2FkIGEgc2VsZWN0aW9uIG9mIHRleHRcbiAgdXBsb2FkU2VsZWN0aW9uOiA9PlxuICAgIEBzdGF0ZUNvbnRyb2xsZXIubW9kYWxQYW5lbC5zaG93KClcbiAgICBAc3RhdGVDb250cm9sbGVyLnNldFN0YXRlKCd1cGxvYWQnKVxuIl19
