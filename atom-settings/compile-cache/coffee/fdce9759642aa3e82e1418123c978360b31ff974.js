(function() {
  var $, AtomTrelloView, Entities, Marked, SelectListView, Shell,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  SelectListView = require('atom-space-pen-views').SelectListView;

  $ = require('space-pen').$;

  Shell = require('shell', Entities = require('html-entities').AllHtmlEntities);

  Marked = require('marked');

  module.exports = AtomTrelloView = (function(superClass) {
    extend(AtomTrelloView, superClass);

    function AtomTrelloView() {
      return AtomTrelloView.__super__.constructor.apply(this, arguments);
    }

    AtomTrelloView.prototype.api = null;

    AtomTrelloView.prototype.elem = null;

    AtomTrelloView.prototype.backBtn = null;

    AtomTrelloView.prototype.activeBoards = null;

    AtomTrelloView.prototype.activeLanes = null;

    AtomTrelloView.prototype.currentView = 'boards';

    AtomTrelloView.prototype.user = null;

    AtomTrelloView.prototype.avatarUrl = "https://trello-avatars.s3.amazonaws.com/";

    AtomTrelloView.prototype.entities = new Entities();

    AtomTrelloView.prototype.initialize = function() {
      AtomTrelloView.__super__.initialize.apply(this, arguments);
      this.getFilterKey = function() {
        return 'name';
      };
      this.addClass('atom-trello overlay from-top');
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.elem = $(this.panel.item.element);
      this.setButtons();
      return Marked.setOptions({
        sanitize: true
      });
    };

    AtomTrelloView.prototype.setApi = function(api) {
      return this.api = api;
    };

    AtomTrelloView.prototype.setUser = function(user) {
      return this.user = user;
    };

    AtomTrelloView.prototype.encode = function(str) {
      return str = str.replace();
    };

    AtomTrelloView.prototype.viewForItem = function(item) {
      switch (this.currentView) {
        case 'cards':
          return this.cardsView(item);
        default:
          return this.defaultView(item);
      }
    };

    AtomTrelloView.prototype.defaultView = function(item) {
      return "<li>" + item.name + "</li>";
    };

    AtomTrelloView.prototype.itemDescription = function(description) {
      if (description && this.showDesc) {
        return "<div class='secondary-line'>" + (Marked(description)) + "</div>";
      }
    };

    AtomTrelloView.prototype.cardsView = function(item) {
      var avatars, ref;
      avatars = (function(_this) {
        return function() {
          var avatarString;
          avatarString = "";
          item.members.map(function(obj) {
            if (obj.avatarHash) {
              return avatarString += "<img class='at-avatar' src='" + (_this.getAvatar(obj.avatarHash)) + "'/>";
            } else {
              return avatarString += "<span class='at-avatar no-img'>" + obj.initials + "</span>";
            }
          });
          return avatarString;
        };
      })(this);
      if (this.filterMyCards && (ref = this.user.id, indexOf.call(item.idMembers, ref) < 0)) {
        return false;
      }
      return "<li class='two-lines'> <div class='primary-line'> <div class='at-title'>" + (this.entities.encode(item.name)) + "</div> <div class='at-avatars'>" + (avatars()) + "</div> </div> <div class='atom-trello-card-description'> " + (this.itemDescription(item.desc)) + " </div> </li>";
    };

    AtomTrelloView.prototype.showView = function(items, showBackBtn) {
      if (showBackBtn == null) {
        showBackBtn = true;
      }
      this.setItems(items);
      this.focusFilterEditor();
      if (showBackBtn) {
        return this.backBtn.show();
      } else {
        return this.backBtn.hide();
      }
    };

    AtomTrelloView.prototype.loadBoards = function() {
      this.currentView = 'boards';
      this.activeLanes = null;
      this.panel.show();
      this.backBtn.hide();
      this.setLoading("Your Boards are Loading!");
      this.confirmed = (function(_this) {
        return function(board) {
          _this.cancel();
          return _this.loadLanes(board);
        };
      })(this);
      if (this.activeBoards) {
        this.showView(this.activeBoards, false);
        return;
      }
      return this.api.get('/1/members/me/boards', {
        filter: "open"
      }, (function(_this) {
        return function(err, data) {
          _this.activeBoards = data;
          return _this.showView(_this.activeBoards, false);
        };
      })(this));
    };

    AtomTrelloView.prototype.loadLanes = function(board) {
      this.currentView = 'lanes';
      this.panel.show();
      this.backBtn.hide();
      this.setLoading("Your Lanes are Loading!");
      this.confirmed = (function(_this) {
        return function(lane) {
          _this.cancel();
          return _this.loadCards(lane);
        };
      })(this);
      if (this.activeLanes) {
        this.showView(this.activeLanes);
        this.backBtn.show();
        return;
      }
      return this.api.get("/1/boards/" + board.id + '/lists', {
        cards: "open"
      }, (function(_this) {
        return function(err, data) {
          _this.activeLanes = data;
          _this.activeCards = null;
          return _this.showView(_this.activeLanes);
        };
      })(this));
    };

    AtomTrelloView.prototype.loadCards = function(lane) {
      var user;
      this.currentView = 'cards';
      this.panel.show();
      this.backBtn.hide();
      this.setLoading("Your Cards are Loading!");
      this.confirmed = (function(_this) {
        return function(card) {
          return Shell.openExternal(card.url);
        };
      })(this);
      user = this.user;
      return this.api.get("/1/lists/" + lane.id + "/cards", {
        filter: "open",
        members: true
      }, (function(_this) {
        return function(err, data) {
          var activeCards;
          activeCards = data;
          return _this.showView(activeCards);
        };
      })(this));
    };

    AtomTrelloView.prototype.cardActions = function(card) {
      this.currentView = 'card';
      this.panel.show();
      this.setLoading("Loading Card");
      return this.api.get("/1/cards/" + card.id, (function(_this) {
        return function(err, data) {
          return console.log(data);
        };
      })(this));
    };

    AtomTrelloView.prototype.setButtons = function() {
      this.backBtn = $("<div id='back_btn' class='block'><button class='btn icon icon-arrow-left inline-block-tight'>Back</button></div>");
      this.backBtn.appendTo(this.elem).hide().on('mouseup', (function(_this) {
        return function(e) {
          e.preventDefault();
          e.stopPropagation();
          _this.cancel();
          switch (_this.currentView) {
            case 'card':
              return _this.loadCards();
            case 'cards':
              return _this.loadLanes();
            case 'lanes':
              return _this.loadBoards();
            default:
              return _this.loadBoards();
          }
        };
      })(this));
      this.backBtn.on('mousedown', (function(_this) {
        return function(e) {
          e.preventDefault();
          return e.stopPropagation();
        };
      })(this));
      this.cardOptions = $('<div class="settings-view at-filter"></div>');
      this.cardFilter = $('<div class="checkbox"><input id="atomTrello_cardFilter" type="checkbox"><div class="setting-title">only my cards</div></div>');
      this.cardFilterInput = this.cardFilter.find('input');
      this.cardFilter.appendTo(this.cardOptions);
      this.cardFilter.on('mousedown', (function(_this) {
        return function(e) {
          e.preventDefault();
          return e.stopPropagation();
        };
      })(this));
      this.cardFilter.on('mouseup', (function(_this) {
        return function(e) {
          e.preventDefault();
          e.stopPropagation();
          _this.filterMyCards = !_this.cardFilterInput.prop('checked');
          _this.cardFilterInput.prop('checked', _this.filterMyCards);
          return _this.populateList();
        };
      })(this)).find('input').on('click change', (function(_this) {
        return function(e) {
          e.preventDefault();
          return e.stopPropagation();
        };
      })(this));
      this.descFilter = $('<div class="checkbox"><input id="atomTrello_descFilter" type="checkbox"><div class="setting-title">show descriptions</div></div>');
      this.descFilterInput = this.descFilter.find('input');
      this.descFilter.appendTo(this.cardOptions);
      this.descFilter.on('mousedown', (function(_this) {
        return function(e) {
          e.preventDefault();
          return e.stopPropagation();
        };
      })(this));
      this.descFilter.on('mouseup', (function(_this) {
        return function(e) {
          e.preventDefault();
          e.stopPropagation();
          _this.showDesc = !_this.descFilterInput.prop('checked');
          _this.descFilterInput.prop('checked', _this.showDesc);
          return _this.populateList();
        };
      })(this)).find('input').on('click change', (function(_this) {
        return function(e) {
          e.preventDefault();
          return e.stopPropagation();
        };
      })(this));
      return this.cardOptions.appendTo(this.elem);
    };

    AtomTrelloView.prototype.getAvatar = function(id, large) {
      var size;
      if (large == null) {
        large = false;
      }
      size = large ? '170' : '30';
      return this.avatarUrl + id + ("/" + size + ".png");
    };

    AtomTrelloView.prototype.cancelled = function() {
      return this.panel.hide();
    };

    return AtomTrelloView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYXZpcmFqcy8uYXRvbS9wYWNrYWdlcy9hdG9tLXRyZWxsby9saWIvYXRvbS10cmVsbG8tdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLDBEQUFBO0lBQUE7Ozs7RUFBQyxpQkFBa0IsT0FBQSxDQUFRLHNCQUFSOztFQUNsQixJQUFLLE9BQUEsQ0FBUSxXQUFSOztFQUNOLEtBQUEsR0FBUSxPQUFBLENBQVEsT0FBUixFQUNSLFFBQUEsR0FBVyxPQUFBLENBQVEsZUFBUixDQUF3QixDQUFDLGVBRDVCOztFQUVSLE1BQUEsR0FBUyxPQUFBLENBQVEsUUFBUjs7RUFFVCxNQUFNLENBQUMsT0FBUCxHQUVNOzs7Ozs7OzZCQUNKLEdBQUEsR0FBSzs7NkJBQ0wsSUFBQSxHQUFNOzs2QkFDTixPQUFBLEdBQVM7OzZCQUNULFlBQUEsR0FBYzs7NkJBQ2QsV0FBQSxHQUFhOzs2QkFDYixXQUFBLEdBQWE7OzZCQUNiLElBQUEsR0FBTTs7NkJBQ04sU0FBQSxHQUFXOzs2QkFDWCxRQUFBLEdBQVUsSUFBSSxRQUFKLENBQUE7OzZCQUVWLFVBQUEsR0FBWSxTQUFBO01BQ1YsZ0RBQUEsU0FBQTtNQUNBLElBQUMsQ0FBQSxZQUFELEdBQWdCLFNBQUE7QUFDZCxlQUFPO01BRE87TUFHaEIsSUFBQyxDQUFBLFFBQUQsQ0FBVSw4QkFBVjs7UUFDQSxJQUFDLENBQUEsUUFBUyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBNkI7VUFBQSxJQUFBLEVBQU0sSUFBTjtTQUE3Qjs7TUFDVixJQUFDLENBQUEsSUFBRCxHQUFRLENBQUEsQ0FBRSxJQUFDLENBQUEsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFkO01BQ1IsSUFBQyxDQUFBLFVBQUQsQ0FBQTthQUVBLE1BQU0sQ0FBQyxVQUFQLENBQWtCO1FBQ2hCLFFBQUEsRUFBVSxJQURNO09BQWxCO0lBVlU7OzZCQWVaLE1BQUEsR0FB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Q0FBQyxJQUFQLENBQUE7SUFEUzs7OztLQTdNZ0I7QUFSN0IiLCJzb3VyY2VzQ29udGVudCI6WyJ7U2VsZWN0TGlzdFZpZXd9ID0gcmVxdWlyZSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnXG57JH0gPSByZXF1aXJlICdzcGFjZS1wZW4nXG5TaGVsbCA9IHJlcXVpcmUgJ3NoZWxsJyxcbkVudGl0aWVzID0gcmVxdWlyZSgnaHRtbC1lbnRpdGllcycpLkFsbEh0bWxFbnRpdGllcztcbk1hcmtlZCA9IHJlcXVpcmUoJ21hcmtlZCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5cbmNsYXNzIEF0b21UcmVsbG9WaWV3IGV4dGVuZHMgU2VsZWN0TGlzdFZpZXdcbiAgYXBpOiBudWxsXG4gIGVsZW06IG51bGxcbiAgYmFja0J0bjogbnVsbFxuICBhY3RpdmVCb2FyZHM6IG51bGxcbiAgYWN0aXZlTGFuZXM6IG51bGxcbiAgY3VycmVudFZpZXc6ICdib2FyZHMnXG4gIHVzZXI6IG51bGxcbiAgYXZhdGFyVXJsOiBcImh0dHBzOi8vdHJlbGxvLWF2YXRhcnMuczMuYW1hem9uYXdzLmNvbS9cIlxuICBlbnRpdGllczogbmV3IEVudGl0aWVzKClcblxuICBpbml0aWFsaXplOiAoKSAtPlxuICAgIHN1cGVyXG4gICAgQGdldEZpbHRlcktleSA9ICgpIC0+XG4gICAgICByZXR1cm4gJ25hbWUnXG5cbiAgICBAYWRkQ2xhc3MoJ2F0b20tdHJlbGxvIG92ZXJsYXkgZnJvbS10b3AnKVxuICAgIEBwYW5lbCA/PSBhdG9tLndvcmtzcGFjZS5hZGRNb2RhbFBhbmVsKGl0ZW06IHRoaXMpXG4gICAgQGVsZW0gPSAkKEBwYW5lbC5pdGVtLmVsZW1lbnQpXG4gICAgQHNldEJ1dHRvbnMoKVxuXG4gICAgTWFya2VkLnNldE9wdGlvbnMoe1xuICAgICAgc2FuaXRpemU6IHRydWVcbiAgICB9KVxuXG5cbiAgc2V0QXBpOiAoYXBpKSAtPlxuICAgIEBhcGkgPSBhcGlcblxuICBzZXRVc2VyOiAodXNlcikgLT5cbiAgICBAdXNlciA9IHVzZXJcblxuICBlbmNvZGU6IChzdHIpIC0+XG4gICAgc3RyID0gc3RyLnJlcGxhY2UoKVxuICB2aWV3Rm9ySXRlbTogKGl0ZW0pIC0+XG4gICAgc3dpdGNoIEBjdXJyZW50Vmlld1xuICAgICAgd2hlbiAnY2FyZHMnIHRoZW4gQGNhcmRzVmlldyhpdGVtKVxuICAgICAgZWxzZSBAZGVmYXVsdFZpZXcoaXRlbSlcblxuICBkZWZhdWx0VmlldzogKGl0ZW0pIC0+XG4gICAgXCI8bGk+I3tpdGVtLm5hbWV9PC9saT5cIlxuXG4gIGl0ZW1EZXNjcmlwdGlvbjogKGRlc2NyaXB0aW9uKSAtPlxuICAgIGlmIGRlc2NyaXB0aW9uIGFuZCBAc2hvd0Rlc2NcbiAgICAgIHJldHVybiBcIjxkaXYgY2xhc3M9J3NlY29uZGFyeS1saW5lJz4je01hcmtlZChkZXNjcmlwdGlvbil9PC9kaXY+XCJcblxuICBjYXJkc1ZpZXc6IChpdGVtKSAtPlxuICAgIGF2YXRhcnMgPSAoKSA9PlxuICAgICAgYXZhdGFyU3RyaW5nID0gXCJcIlxuICAgICAgaXRlbS5tZW1iZXJzLm1hcCAob2JqKSA9PlxuICAgICAgICBpZiBvYmouYXZhdGFySGFzaFxuICAgICAgICAgIGF2YXRhclN0cmluZyArPSBcIjxpbWcgY2xhc3M9J2F0LWF2YXRhcicgc3JjPScje0BnZXRBdmF0YXIgb2JqLmF2YXRhckhhc2h9Jy8+XCJcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGF2YXRhclN0cmluZyArPSBcIjxzcGFuIGNsYXNzPSdhdC1hdmF0YXIgbm8taW1nJz4je29iai5pbml0aWFsc308L3NwYW4+XCJcbiAgICAgIHJldHVybiBhdmF0YXJTdHJpbmdcblxuICAgIGlmIEBmaWx0ZXJNeUNhcmRzIGFuZCBAdXNlci5pZCBub3QgaW4gaXRlbS5pZE1lbWJlcnNcbiAgICAgIHJldHVybiBmYWxzZVxuXG5cbiAgICBcIjxsaSBjbGFzcz0ndHdvLWxpbmVzJz5cbiAgICAgICAgPGRpdiBjbGFzcz0ncHJpbWFyeS1saW5lJz5cbiAgICAgICAgICA8ZGl2IGNsYXNzPSdhdC10aXRsZSc+I3tAZW50aXRpZXMuZW5jb2RlKGl0ZW0ubmFtZSl9PC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz0nYXQtYXZhdGFycyc+I3thdmF0YXJzKCl9PC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPSdhdG9tLXRyZWxsby1jYXJkLWRlc2NyaXB0aW9uJz5cbiAgICAgICAgICAje0BpdGVtRGVzY3JpcHRpb24oaXRlbS5kZXNjKX1cbiAgICAgICAgPC9kaXY+XG4gICAgPC9saT5cIlxuXG4gIHNob3dWaWV3OiAoaXRlbXMsIHNob3dCYWNrQnRuID0gdHJ1ZSkgLT5cbiAgICBAc2V0SXRlbXMoaXRlbXMpXG4gICAgQGZvY3VzRmlsdGVyRWRpdG9yKClcbiAgICBpZiBzaG93QmFja0J0biB0aGVuIEBiYWNrQnRuLnNob3coKSBlbHNlIEBiYWNrQnRuLmhpZGUoKVxuXG4gIGxvYWRCb2FyZHM6ICgpIC0+XG4gICAgQGN1cnJlbnRWaWV3ID0gJ2JvYXJkcydcbiAgICBAYWN0aXZlTGFuZXMgPSBudWxsXG4gICAgQHBhbmVsLnNob3coKVxuICAgIEBiYWNrQnRuLmhpZGUoKVxuICAgIEBzZXRMb2FkaW5nIFwiWW91ciBCb2FyZHMgYXJlIExvYWRpbmchXCJcblxuICAgIEBjb25maXJtZWQgPSAoYm9hcmQpID0+XG4gICAgICBAY2FuY2VsKClcbiAgICAgIEBsb2FkTGFuZXMoYm9hcmQpXG5cbiAgICBpZiBAYWN0aXZlQm9hcmRzXG4gICAgICBAc2hvd1ZpZXcgQGFjdGl2ZUJvYXJkcywgZmFsc2VcbiAgICAgIHJldHVyblxuXG4gICAgQGFwaS5nZXQgJy8xL21lbWJlcnMvbWUvYm9hcmRzJywgeyBmaWx0ZXI6IFwib3BlblwiIH0sIChlcnIsIGRhdGEpID0+XG4gICAgICBAYWN0aXZlQm9hcmRzID0gZGF0YTtcbiAgICAgIEBzaG93VmlldyBAYWN0aXZlQm9hcmRzLCBmYWxzZVxuXG4gIGxvYWRMYW5lczogKGJvYXJkKSAtPlxuICAgIEBjdXJyZW50VmlldyA9ICdsYW5lcydcbiAgICBAcGFuZWwuc2hvdygpXG4gICAgQGJhY2tCdG4uaGlkZSgpXG4gICAgQHNldExvYWRpbmcgXCJZb3VyIExhbmVzIGFyZSBMb2FkaW5nIVwiXG5cbiAgICBAY29uZmlybWVkID0gKGxhbmUpID0+XG4gICAgICBAY2FuY2VsKClcbiAgICAgIEBsb2FkQ2FyZHMobGFuZSlcblxuICAgIGlmIEBhY3RpdmVMYW5lc1xuICAgICAgQHNob3dWaWV3KEBhY3RpdmVMYW5lcylcbiAgICAgIEBiYWNrQnRuLnNob3coKVxuICAgICAgcmV0dXJuXG5cbiAgICBAYXBpLmdldCBcIi8xL2JvYXJkcy9cIiArIGJvYXJkLmlkICsgJy9saXN0cycsIHtjYXJkczogXCJvcGVuXCJ9ICwoZXJyLCBkYXRhKSA9PlxuICAgICAgQGFjdGl2ZUxhbmVzID0gZGF0YVxuICAgICAgQGFjdGl2ZUNhcmRzID0gbnVsbFxuICAgICAgQHNob3dWaWV3KEBhY3RpdmVMYW5lcylcblxuICBsb2FkQ2FyZHM6IChsYW5lKSAtPlxuICAgIEBjdXJyZW50VmlldyA9ICdjYXJkcydcbiAgICBAcGFuZWwuc2hvdygpXG4gICAgQGJhY2tCdG4uaGlkZSgpXG4gICAgQHNldExvYWRpbmcgXCJZb3VyIENhcmRzIGFyZSBMb2FkaW5nIVwiXG5cbiAgICBAY29uZmlybWVkID0gKGNhcmQpID0+XG4gICAgICBTaGVsbC5vcGVuRXh0ZXJuYWwoY2FyZC51cmwpXG5cbiAgICB1c2VyID0gQHVzZXJcblxuICAgIEBhcGkuZ2V0IFwiLzEvbGlzdHMvI3tsYW5lLmlkfS9jYXJkc1wiLCB7IGZpbHRlcjogXCJvcGVuXCIsIG1lbWJlcnM6IHRydWUgfSwgKGVyciwgZGF0YSkgPT5cbiAgICAgIGFjdGl2ZUNhcmRzID0gZGF0YVxuXG4gICAgICBAc2hvd1ZpZXcoYWN0aXZlQ2FyZHMpXG5cbiAgY2FyZEFjdGlvbnM6IChjYXJkKSAtPlxuICAgIEBjdXJyZW50VmlldyA9ICdjYXJkJ1xuICAgIEBwYW5lbC5zaG93KClcbiAgICBAc2V0TG9hZGluZyBcIkxvYWRpbmcgQ2FyZFwiXG4gICAgQGFwaS5nZXQgXCIvMS9jYXJkcy9cIiArIGNhcmQuaWQsIChlcnIsIGRhdGEpID0+XG4gICAgICBjb25zb2xlLmxvZyBkYXRhXG5cbiAgc2V0QnV0dG9uczogKCkgLT5cbiAgICBAYmFja0J0biA9ICQoXCI8ZGl2IGlkPSdiYWNrX2J0bicgY2xhc3M9J2Jsb2NrJz48YnV0dG9uIGNsYXNzPSdidG4gaWNvbiBpY29uLWFycm93LWxlZnQgaW5saW5lLWJsb2NrLXRpZ2h0Jz5CYWNrPC9idXR0b24+PC9kaXY+XCIpXG4gICAgQGJhY2tCdG5cbiAgICAgIC5hcHBlbmRUbyhAZWxlbSlcbiAgICAgIC5oaWRlKClcbiAgICAgIC5vbiAnbW91c2V1cCcsIChlKSA9PlxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICBAY2FuY2VsKClcbiAgICAgICAgc3dpdGNoIEBjdXJyZW50Vmlld1xuICAgICAgICAgIHdoZW4gJ2NhcmQnIHRoZW4gQGxvYWRDYXJkcygpXG4gICAgICAgICAgd2hlbiAnY2FyZHMnIHRoZW4gQGxvYWRMYW5lcygpXG4gICAgICAgICAgd2hlbiAnbGFuZXMnIHRoZW4gQGxvYWRCb2FyZHMoKVxuICAgICAgICAgIGVsc2UgQGxvYWRCb2FyZHMoKVxuXG4gICAgQGJhY2tCdG5cbiAgICAgIC5vbiAnbW91c2Vkb3duJywgKGUpID0+XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG5cbiAgICBAY2FyZE9wdGlvbnMgPSAkKCc8ZGl2IGNsYXNzPVwic2V0dGluZ3MtdmlldyBhdC1maWx0ZXJcIj48L2Rpdj4nKTtcblxuICAgIEBjYXJkRmlsdGVyID0gJCgnPGRpdiBjbGFzcz1cImNoZWNrYm94XCI+PGlucHV0IGlkPVwiYXRvbVRyZWxsb19jYXJkRmlsdGVyXCIgdHlwZT1cImNoZWNrYm94XCI+PGRpdiBjbGFzcz1cInNldHRpbmctdGl0bGVcIj5vbmx5IG15IGNhcmRzPC9kaXY+PC9kaXY+JylcbiAgICBAY2FyZEZpbHRlcklucHV0ID0gQGNhcmRGaWx0ZXIuZmluZCgnaW5wdXQnKVxuICAgIEBjYXJkRmlsdGVyLmFwcGVuZFRvKEBjYXJkT3B0aW9ucylcblxuICAgIEBjYXJkRmlsdGVyXG4gICAgICAub24gJ21vdXNlZG93bicsIChlKSA9PlxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuXG4gICAgQGNhcmRGaWx0ZXJcbiAgICAgIC5vbiAnbW91c2V1cCcsIChlKSA9PlxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICBAZmlsdGVyTXlDYXJkcyA9ICFAY2FyZEZpbHRlcklucHV0LnByb3AoJ2NoZWNrZWQnKVxuICAgICAgICBAY2FyZEZpbHRlcklucHV0LnByb3AoJ2NoZWNrZWQnLCBAZmlsdGVyTXlDYXJkcylcbiAgICAgICAgQHBvcHVsYXRlTGlzdCgpXG4gICAgICAuZmluZCgnaW5wdXQnKS5vbiAnY2xpY2sgY2hhbmdlJywgKGUpID0+XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG5cbiAgICBAZGVzY0ZpbHRlciA9ICQoJzxkaXYgY2xhc3M9XCJjaGVja2JveFwiPjxpbnB1dCBpZD1cImF0b21UcmVsbG9fZGVzY0ZpbHRlclwiIHR5cGU9XCJjaGVja2JveFwiPjxkaXYgY2xhc3M9XCJzZXR0aW5nLXRpdGxlXCI+c2hvdyBkZXNjcmlwdGlvbnM8L2Rpdj48L2Rpdj4nKVxuICAgIEBkZXNjRmlsdGVySW5wdXQgPSBAZGVzY0ZpbHRlci5maW5kKCdpbnB1dCcpXG4gICAgQGRlc2NGaWx0ZXIuYXBwZW5kVG8oQGNhcmRPcHRpb25zKVxuXG4gICAgQGRlc2NGaWx0ZXJcbiAgICAgIC5vbiAnbW91c2Vkb3duJywgKGUpID0+XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG5cbiAgICBAZGVzY0ZpbHRlclxuICAgICAgLm9uICdtb3VzZXVwJywgKGUpID0+XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgIEBzaG93RGVzYyA9ICFAZGVzY0ZpbHRlcklucHV0LnByb3AoJ2NoZWNrZWQnKVxuICAgICAgICBAZGVzY0ZpbHRlcklucHV0LnByb3AoJ2NoZWNrZWQnLCBAc2hvd0Rlc2MpXG4gICAgICAgIEBwb3B1bGF0ZUxpc3QoKVxuICAgICAgLmZpbmQoJ2lucHV0Jykub24gJ2NsaWNrIGNoYW5nZScsIChlKSA9PlxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuXG4gICAgQGNhcmRPcHRpb25zLmFwcGVuZFRvKEBlbGVtKVxuXG4gIGdldEF2YXRhcjogKGlkLCBsYXJnZSA9IGZhbHNlKSAtPlxuICAgIHNpemUgPSBpZiBsYXJnZSB0aGVuICcxNzAnIGVsc2UgJzMwJ1xuICAgIHJldHVybiBAYXZhdGFyVXJsICsgaWQgKyBcIi8je3NpemV9LnBuZ1wiXG5cbiAgY2FuY2VsbGVkOiAtPlxuICAgIEBwYW5lbC5oaWRlKClcbiJdfQ==
