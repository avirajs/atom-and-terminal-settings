(function() {
  var $, ConversationView, FileUploadView, ScrollView, ref,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ConversationView = require('./conversation-view');

  ref = require('atom-space-pen-views'), $ = ref.$, ScrollView = ref.ScrollView;

  module.exports = FileUploadView = (function(superClass) {
    extend(FileUploadView, superClass);

    function FileUploadView() {
      this.uploadSelection = bind(this.uploadSelection, this);
      this.selectChannel = bind(this.selectChannel, this);
      this.refresh = bind(this.refresh, this);
      this.eventHandlers = bind(this.eventHandlers, this);
      return FileUploadView.__super__.constructor.apply(this, arguments);
    }

    FileUploadView.content = function(stateController) {
      this.stateController = stateController;
      return this.div({
        id: 'upload'
      }, (function(_this) {
        return function() {
          _this.div('Share with:', {
            "class": 'share-with'
          });
          _this.ul({
            id: 'channels'
          }, function() {
            var channel, i, len, ref1, results;
            ref1 = _this.stateController.team.channels;
            results = [];
            for (i = 0, len = ref1.length; i < len; i++) {
              channel = ref1[i];
              results.push(_this.li("#" + channel.name, {
                "class": 'channel',
                id: channel.id
              }));
            }
            return results;
          });
          _this.ul({
            id: 'members'
          }, function() {
            var i, len, member, ref1, results;
            ref1 = _this.stateController.team.membersNotMe();
            results = [];
            for (i = 0, len = ref1.length; i < len; i++) {
              member = ref1[i];
              results.push(_this.li(member.name, {
                "class": 'channel',
                id: member.channel.id
              }));
            }
            return results;
          });
          return _this.div({
            id: 'comment-wrapper'
          }, function() {
            _this.label('Comment', {
              "for": 'comment'
            });
            _this.textarea({
              id: 'comment',
              "class": 'form-control native-key-bindings',
              outlet: _this.comment
            });
            return _this.button('Upload', {
              id: 'submit',
              "class": 'btn btn-primary'
            });
          });
        };
      })(this));
    };

    FileUploadView.prototype.initialize = function(stateController, client) {
      this.stateController = stateController;
      this.client = client;
      this.width(250);
      this.channels = [];
      this.eventHandlers();
      return FileUploadView.__super__.initialize.apply(this, arguments);
    };

    FileUploadView.prototype.eventHandlers = function() {
      this.on('click', '.channel', this.selectChannel);
      return this.on('click', '#submit', this.uploadSelection);
    };

    FileUploadView.prototype.refresh = function() {
      return this.eventHandlers();
    };

    FileUploadView.prototype.selectChannel = function(e) {
      var el, i, len, ref1;
      if (e.ctrlKey || e.shiftKey) {
        this.channels.push($(e.target).attr('id'));
      } else {
        ref1 = $(".selected");
        for (i = 0, len = ref1.length; i < len; i++) {
          el = ref1[i];
          $(el).removeClass('selected');
        }
        this.channels = [$(e.target).attr('id')];
      }
      return $(e.target).addClass('selected');
    };

    FileUploadView.prototype.uploadSelection = function(e) {
      return this.stateController.fileManager.uploadSelection(this.channels, $("#comment").val());
    };

    return FileUploadView;

  })(ScrollView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYXZpcmFqcy8uYXRvbS9wYWNrYWdlcy9zbGFjay1jaGF0L2xpYi92aWV3cy9maWxlLXVwbG9hZC12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQTtBQUFBLE1BQUEsb0RBQUE7SUFBQTs7OztFQUFBLGdCQUFBLEdBQW1CLE9BQUEsQ0FBUSxxQkFBUjs7RUFDbkIsTUFBa0IsT0FBQSxDQUFRLHNCQUFSLENBQWxCLEVBQUMsU0FBRCxFQUFJOztFQUVKLE1BQU0sQ0FBQyxPQUFQLEdBQ007Ozs7Ozs7Ozs7O0lBQ0osY0FBQyxDQUFBLE9BQUQsR0FBVSxTQUFDLGVBQUQ7TUFBQyxJQUFDLENBQUEsa0JBQUQ7YUFDVCxJQUFDLENBQUEsR0FBRCxDQUFLO1FBQUEsRUFBQSxFQUFJLFFBQUo7T0FBTCxFQUFtQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7VUFDakIsS0FBQyxDQUFBLEdBQUQsQ0FBSyxhQUFMLEVBQW9CO1lBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxZQUFQO1dBQXBCO1VBQ0EsS0FBQyxDQUFBLEVBQUQsQ0FBSTtZQUFBLEVBQUEsRUFBSSxVQUFKO1dBQUosRUFBb0IsU0FBQTtBQUNsQixnQkFBQTtBQUFBO0FBQUE7aUJBQUEsc0NBQUE7OzJCQUNFLEtBQUMsQ0FBQSxFQUFELENBQUksR0FBQSxHQUFJLE9BQU8sQ0FBQyxJQUFoQixFQUF3QjtnQkFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLFNBQVA7Z0JBQWtCLEVBQUEsRUFBSSxPQUFPLENBQUMsRUFBOUI7ZUFBeEI7QUFERjs7VUFEa0IsQ0FBcEI7VUFHQSxLQUFDLENBQUEsRUFBRCxDQUFJO1lBQUEsRUFBQSxFQUFJLFNBQUo7V0FBSixFQUFtQixTQUFBO0FBQ2pCLGdCQUFBO0FBQUE7QUFBQTtpQkFBQSxzQ0FBQTs7MkJBQ0UsS0FBQyxDQUFBLEVBQUQsQ0FBSSxNQUFNLENBQUMsSUFBWCxFQUFpQjtnQkFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLFNBQVA7Z0JBQWtCLEVBQUEsRUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLEVBQXJDO2VBQWpCO0FBREY7O1VBRGlCLENBQW5CO2lCQUlBLEtBQUMsQ0FBQSxHQUFELENBQUs7WUFBQSxFQUFBLEVBQUksaUJBQUo7V0FBTCxFQUE0QixTQUFBO1lBQzFCLEtBQUMsQ0FBQSxLQUFELENBQU8sU0FBUCxFQUFrQjtjQUFBLENBQUEsR0FBQSxDQUFBLEVBQUssU0FBTDthQUFsQjtZQUNBLEtBQUMsQ0FBQSxRQUFELENBQVU7Y0FBQSxFQUFBLEVBQUksU0FBSjtjQUFlLENBQUEsS0FBQSxDQUFBLEVBQU8sa0NBQXRCO2NBQTBELE1BQUEsRUFBUSxLQUFDLENBQUEsT0FBbkU7YUFBVjttQkFDQSxLQUFDLENBQUEsTUFBRCxDQUFRLFFBQVIsRUFBa0I7Y0FBQSxFQUFBLEVBQUksUUFBSjtjQUFjLENBQUEsS0FBQSxDQUFBLEVBQU8saUJBQXJCO2FBQWxCO1VBSDBCLENBQTVCO1FBVGlCO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFuQjtJQURROzs2QkFnQlYsVUFBQSxHQUFZLFNBQUMsZUFBRCxFQUFtQixNQUFuQjtNQUFDLElBQUMsQ0FBQSxrQkFBRDtNQUFrQixJQUFDLENBQUEsU0FBRDtNQUM3QixJQUFDLENBQUEsS0FBRCxDQUFPLEdBQVA7TUFDQSxJQUFDLENBQUEsUUFBRCxHQUFZO01BQ1osSUFBQyxDQUFBLGFBQUQsQ0FBQTthQUNBLGdEQUFBLFNBQUE7SUFKVTs7NkJBT1osYUFBQSxHQUFlLFNBQUE7TUFDYixJQUFDLENBQUMsRUFBRixDQUFLLE9BQUwsRUFBYyxVQUFkLEVBQTBCLElBQUMsQ0FBQSxhQUEzQjthQUNBLElBQUMsQ0FBQyxFQUFGLENBQUssT0FBTCxFQUFjLFNBQWQsRUFBeUIsSUFBQyxDQUFBLGVBQTFCO0lBRmE7OzZCQU1mLE9BQUEsR0FBUyxTQUFBO2FBQ1AsSUFBQyxDQUFBLGFBQUQsQ0FBQTtJQURPOzs2QkFJVCxhQUFBLEdBQWUsU0FBQyxDQUFEO0FBQ2IsVUFBQTtNQUFBLElBQUcsQ0FBQyxDQUFDLE9BQUYsSUFBYSxDQUFDLENBQUMsUUFBbEI7UUFDRSxJQUFDLENBQUEsUUFBUSxDQUFDLElBQVYsQ0FBZSxDQUFBLENBQUUsQ0FBQyxDQUFDLE1BQUosQ0FBVyxDQUFDLElBQVosQ0FBaUIsSUFBakIsQ0FBZixFQURGO09BQUEsTUFBQTtBQUdFO0FBQUEsYUFBQSxzQ0FBQTs7VUFBQSxDQUFBLENBQUUsRUFBRixDQUFLLENBQUMsV0FBTixDQUFrQixVQUFsQjtBQUFBO1FBQ0EsSUFBQyxDQUFBLFFBQUQsR0FBWSxDQUFDLENBQUEsQ0FBRSxDQUFDLENBQUMsTUFBSixDQUFXLENBQUMsSUFBWixDQUFpQixJQUFqQixDQUFELEVBSmQ7O2FBS0EsQ0FBQSxDQUFFLENBQUMsQ0FBQyxNQUFKLENBQVcsQ0FBQyxRQUFaLENBQXFCLFVBQXJCO0lBTmE7OzZCQVNmLGVBQUEsR0FBaUIsU0FBQyxDQUFEO2FBQ2YsSUFBQyxDQUFBLGVBQWUsQ0FBQyxXQUFXLENBQUMsZUFBN0IsQ0FBNkMsSUFBQyxDQUFBLFFBQTlDLEVBQXdELENBQUEsQ0FBRSxVQUFGLENBQWEsQ0FBQyxHQUFkLENBQUEsQ0FBeEQ7SUFEZTs7OztLQTNDVTtBQUo3QiIsInNvdXJjZXNDb250ZW50IjpbIlxuQ29udmVyc2F0aW9uVmlldyA9IHJlcXVpcmUgJy4vY29udmVyc2F0aW9uLXZpZXcnXG57JCwgU2Nyb2xsVmlld30gPSByZXF1aXJlICdhdG9tLXNwYWNlLXBlbi12aWV3cydcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgRmlsZVVwbG9hZFZpZXcgZXh0ZW5kcyBTY3JvbGxWaWV3XG4gIEBjb250ZW50OiAoQHN0YXRlQ29udHJvbGxlcikgLT5cbiAgICBAZGl2IGlkOiAndXBsb2FkJywgPT5cbiAgICAgIEBkaXYgJ1NoYXJlIHdpdGg6JywgY2xhc3M6ICdzaGFyZS13aXRoJ1xuICAgICAgQHVsIGlkOiAnY2hhbm5lbHMnLCA9PlxuICAgICAgICBmb3IgY2hhbm5lbCBpbiBAc3RhdGVDb250cm9sbGVyLnRlYW0uY2hhbm5lbHNcbiAgICAgICAgICBAbGkgXCIjI3tjaGFubmVsLm5hbWV9XCIsIGNsYXNzOiAnY2hhbm5lbCcsIGlkOiBjaGFubmVsLmlkXG4gICAgICBAdWwgaWQ6ICdtZW1iZXJzJywgPT5cbiAgICAgICAgZm9yIG1lbWJlciBpbiBAc3RhdGVDb250cm9sbGVyLnRlYW0ubWVtYmVyc05vdE1lKClcbiAgICAgICAgICBAbGkgbWVtYmVyLm5hbWUsIGNsYXNzOiAnY2hhbm5lbCcsIGlkOiBtZW1iZXIuY2hhbm5lbC5pZFxuXG4gICAgICBAZGl2IGlkOiAnY29tbWVudC13cmFwcGVyJywgPT5cbiAgICAgICAgQGxhYmVsICdDb21tZW50JywgZm9yOiAnY29tbWVudCdcbiAgICAgICAgQHRleHRhcmVhIGlkOiAnY29tbWVudCcsIGNsYXNzOiAnZm9ybS1jb250cm9sIG5hdGl2ZS1rZXktYmluZGluZ3MnLCBvdXRsZXQ6IEBjb21tZW50XG4gICAgICAgIEBidXR0b24gJ1VwbG9hZCcsIGlkOiAnc3VibWl0JywgY2xhc3M6ICdidG4gYnRuLXByaW1hcnknXG5cblxuICBpbml0aWFsaXplOiAoQHN0YXRlQ29udHJvbGxlciwgQGNsaWVudCkgLT5cbiAgICBAd2lkdGgoMjUwKVxuICAgIEBjaGFubmVscyA9IFtdXG4gICAgQGV2ZW50SGFuZGxlcnMoKVxuICAgIHN1cGVyXG5cbiAgIyBGYWNpbGl0YXRlIHVzZXIgaW50ZXJhY3Rpb25cbiAgZXZlbnRIYW5kbGVyczogPT5cbiAgICBALm9uICdjbGljaycsICcuY2hhbm5lbCcsIEBzZWxlY3RDaGFubmVsXG4gICAgQC5vbiAnY2xpY2snLCAnI3N1Ym1pdCcsIEB1cGxvYWRTZWxlY3Rpb25cblxuICAjIEV2ZW50IGhhbmRsZXJzIGhhdmUgdG8gYmUgcmVmcmVzaGVkIHdoZW4gYSB2aWV3IGlzIHJlbW92ZWQgYW5kIHJlYWRkZWQgdG8gdGhlXG4gICMgc2xhY2std3JhcHBlciB2aWV3LiBUaGlzIGhhcHBlbnMgYSBsb3Qgd2hlbiBjaGFuZ2luZyBzdGF0ZXNcbiAgcmVmcmVzaDogPT5cbiAgICBAZXZlbnRIYW5kbGVycygpXG5cbiAgIyBTZWxlY3QgYSBjaGFubmVsIHRvIHVwbG9hZCB0aGUgc2VsZWN0aW9uL2ZpbGUgdG9cbiAgc2VsZWN0Q2hhbm5lbDogKGUpID0+XG4gICAgaWYgZS5jdHJsS2V5IG9yIGUuc2hpZnRLZXlcbiAgICAgIEBjaGFubmVscy5wdXNoICQoZS50YXJnZXQpLmF0dHIoJ2lkJylcbiAgICBlbHNlXG4gICAgICAkKGVsKS5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKSBmb3IgZWwgaW4gJChcIi5zZWxlY3RlZFwiKVxuICAgICAgQGNoYW5uZWxzID0gWyQoZS50YXJnZXQpLmF0dHIoJ2lkJyldXG4gICAgJChlLnRhcmdldCkuYWRkQ2xhc3MoJ3NlbGVjdGVkJylcblxuICAjIFVwbG9hZCB0aGUgc2VsZWN0aW9uIGFzIGEgdGV4dCBzbmlwcGV0IHRvIHNsYWNrIChpbmNsdWRlcyBjb21tZW50KVxuICB1cGxvYWRTZWxlY3Rpb246IChlKSA9PlxuICAgIEBzdGF0ZUNvbnRyb2xsZXIuZmlsZU1hbmFnZXIudXBsb2FkU2VsZWN0aW9uKEBjaGFubmVscywgJChcIiNjb21tZW50XCIpLnZhbCgpKVxuXG4iXX0=
