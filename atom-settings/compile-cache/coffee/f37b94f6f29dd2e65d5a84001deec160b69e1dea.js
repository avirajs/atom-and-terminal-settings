(function() {
  var $, ChatLogView, ChatMessageView, ScrollView, emoji, highlight, imagesLoaded, marked, og, ref, renderer,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ChatMessageView = require('./chat-message-view');

  ref = require('atom-space-pen-views'), $ = ref.$, ScrollView = ref.ScrollView;

  marked = require('marked');

  renderer = new marked.Renderer();

  imagesLoaded = require('imagesloaded');

  highlight = require('highlight.js');

  emoji = require('emoji-images');

  og = require('open-graph');

  marked.setOptions({
    renderer: renderer,
    highlight: function(code) {
      return highlight.highlightAuto(code).value;
    }
  });

  module.exports = ChatLogView = (function(superClass) {
    var root;

    extend(ChatLogView, superClass);

    function ChatLogView() {
      this.youtubeElement = bind(this.youtubeElement, this);
      this.vimeoElement = bind(this.vimeoElement, this);
      this.receiveMessage = bind(this.receiveMessage, this);
      this.openGraphElement = bind(this.openGraphElement, this);
      this.openGraphData = bind(this.openGraphData, this);
      this.metaElements = bind(this.metaElements, this);
      this.message = bind(this.message, this);
      this.parseMessage = bind(this.parseMessage, this);
      this.parseLinks = bind(this.parseLinks, this);
      this.file_comment = bind(this.file_comment, this);
      this.fileText = bind(this.fileText, this);
      this.fileImage = bind(this.fileImage, this);
      this.fileComments = bind(this.fileComments, this);
      this.file_share = bind(this.file_share, this);
      this.messageElement = bind(this.messageElement, this);
      this.addMessage = bind(this.addMessage, this);
      return ChatLogView.__super__.constructor.apply(this, arguments);
    }

    root = ChatLogView;

    ChatLogView.content = function(stateController, messages) {
      this.stateController = stateController;
      this.messages = messages;
      return this.div({
        "class": 'messages native-key-bindings',
        tabindex: -1
      }, (function(_this) {
        return function() {
          return _this.div({
            "class": 'list',
            outlet: 'messageViews'
          });
        };
      })(this));
    };

    ChatLogView.prototype.initialize = function(stateController, messages, chat) {
      var i, len, message, ref1, results;
      this.stateController = stateController;
      this.messages = messages;
      this.chat = chat;
      ChatLogView.__super__.initialize.apply(this, arguments);
      ref1 = this.messages;
      results = [];
      for (i = 0, len = ref1.length; i < len; i++) {
        message = ref1[i];
        results.push(this.addMessage(message));
      }
      return results;
    };

    ChatLogView.prototype.addMessage = function(message) {
      return this.messageViews.append(this.messageElement(message));
    };

    ChatLogView.prototype.getTime = function(timestamp) {
      var a, date, hour, min, month, months, t, year;
      a = new Date(timestamp * 1000);
      months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      month = months[a.getMonth()];
      date = a.getDate();
      hour = a.getHours();
      min = a.getMinutes();
      min = min < 10 ? "0" + min : min;
      year = a.getFullYear();
      if (hour > 12) {
        hour = hour - 12;
        t = " pm";
      } else {
        t = " am";
      }
      return month + " " + date + (year < (new Date()).getFullYear() ? ", " + year : '') + " " + hour + ":" + min + " " + t;
    };

    ChatLogView.prototype.messageElement = function(message) {
      var author, image, name;
      author = this.stateController.team.memberWithId(message.user) || this.stateController.team.unknownUser(message);
      image = author.image;
      name = author.name;
      return "<div class='message native-key-bindings " + message.subtype + "'>\n  <table>\n    <tr>\n      <td>\n        <img class='image' src=" + image + " />\n      </td>\n      <td>\n        <span class='name'>" + name + "</span>\n        <span class='ts'>" + (this.getTime(message.ts)) + "</span>\n      </td>\n    </tr>\n    <tr>\n      <td></td>\n      <td>\n        <div class='text'>" + (this.parseMessage(message)) + "</div>\n      </td>\n    </tr>\n  <table>\n</div>";
    };

    ChatLogView.prototype.file_share = function(message) {
      var dl, file, msg;
      file = message.file;
      dl = file.name + "<a href='" + file.url_download + "'><span class='download'></span></a>";
      msg = (function() {
        switch (false) {
          case file.mimetype.match(/text/) == null:
            return this.fileText(file);
          case file.mimetype.match(/image/g) == null:
            return this.fileImage(file);
          default:
            return "";
        }
      }).call(this);
      msg.concat(this.fileComments(file));
      return dl + "<br>" + msg;
    };

    ChatLogView.prototype.fileComments = function(file) {
      if (file.initial_comment) {
        return "<div id='" + file.id + "_comments' class='file comment'>\n  <div class=\"file_comment\">\n    <div class=\"text\">\n      <p>" + file.initial_comment.comment + "</p>\n    </div>\n  </div>\n</div>";
      } else {
        return "";
      }
    };

    ChatLogView.prototype.fileImage = function(file) {
      return "<div class='file'>\n  <a href='" + file.url + "'><img src='" + file.url + "' class='image' /></a>\n</div>";
    };

    ChatLogView.prototype.fileText = function(file) {
      return marked("<span class='file'>\n  ```\n  " + file.preview + "\n  ```\n</file>");
    };

    ChatLogView.prototype.file_comment = function(message) {
      var comment, user;
      comment = message.comment;
      user = this.stateController.team.memberWithId(comment.user);
      return $("#" + message.file.id + "_comments", this.messageViews).append("<div class=\"file_comment\">\n<span class='name' >" + user.name + "</span>\n<span class='ts' >" + (this.getTime(comment.timestamp)) + "</span>\n<div class='text'>" + (marked(comment.comment)) + "</div>\n</div>");
    };

    ChatLogView.prototype.getURLParam = function(url, param) {
      var ref1, ref2, ref3;
      return url != null ? (ref1 = url.split(param + "=")) != null ? (ref2 = ref1[1]) != null ? (ref3 = ref2.split("&")) != null ? ref3[0] : void 0 : void 0 : void 0 : void 0;
    };

    ChatLogView.prototype.parseLinks = function(message) {
      var data, i, len, url, urls;
      urls = message.replace(/<[^>]*>/g, "");
      urls = urls.match(/(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/g);
      data = '';
      if (urls) {
        for (i = 0, len = urls.length; i < len; i++) {
          url = urls[i];
          data = (function() {
            switch (false) {
              case !/\.(gif|jpg|jpeg|tiff|png)$/i.test(url):
                return this.fileImage({
                  url: url
                });
              case !/youtube\.com.*$/i.test(url):
                return this.youtubeElement(url);
              case !/vimeo\.com.*$/i.test(url):
                return this.vimeoElement(url);
              default:
                return this.openGraphElement(url);
            }
          }).call(this);
        }
      }
      return message.concat(data);
    };

    ChatLogView.prototype.parseMessage = function(message) {
      switch (message.subtype) {
        case 'file_comment':
          return this.file_comment(message);
        case 'file_share':
          return this.file_share(message);
        default:
          return this.message(message);
      }
    };

    ChatLogView.prototype.message = function(message) {
      var text;
      if ((message != null ? message.text : void 0) == null) {
        return '';
      }
      text = message.text;
      text = marked(text);
      text = text.replace(/(?:\r\n|\r|\n)/g, '<br />');
      text = this.parseLinks(text);
      text = this.stateController.team.parseCustomEmoji(text);
      text = emoji(text, "https://raw.githubusercontent.com/HenrikJoreteg/emoji-images/master/pngs/");
      return text;
    };

    ChatLogView.prototype.metaElements = function(url, meta) {
      var elements, ref1;
      elements = [];
      if ((meta != null ? (ref1 = meta.image) != null ? ref1.url : void 0 : void 0) != null) {
        elements.push("<img src='" + meta.image.url + "' class='og_image' />");
      }
      if ((meta != null ? meta.title : void 0) != null) {
        elements.push("<a href='" + url + "'><div class='og_title'>" + meta.title + "</div></a>");
      }
      if ((meta != null ? meta.description : void 0) != null) {
        elements.push("<div class='og_description'>" + meta.description + "</div>");
      }
      return elements.join('');
    };

    ChatLogView.prototype.openGraphData = function(url, id) {
      return og(url, (function(_this) {
        return function(err, meta) {
          var og_elements;
          og_elements = _this.metaElements(url, meta);
          if (!err) {
            $("#" + id).html(og_elements);
          }
          if (!og_elements) {
            $("#" + id).remove();
          }
          return imagesLoaded($("#" + id), function() {
            return _this.stateController.updateChatView(_this.chat.channel.id);
          });
        };
      })(this));
    };

    ChatLogView.prototype.openGraphElement = function(url) {
      var id;
      id = Date.now();
      this.openGraphData(url, id);
      return "<div id='" + id + "' class='og_data'></div>";
    };

    ChatLogView.prototype.receiveMessage = function(message) {
      this.addMessage(message);
      if (message.user !== this.stateController.client.me.id) {
        return $(".message", this.messageViews).last().addClass("new " + ($(".new", this.messageViews).length === 0 ? 'slack-mark' : void 0));
      }
    };

    ChatLogView.prototype.vimeoElement = function(url) {
      var id, url_parts;
      url_parts = url.split("/");
      id = url_parts[url_parts.length - 1];
      return "<div class='video-wrapper'>\n  <iframe src=\"https://player.vimeo.com/video/" + id + "\" frameborder=\"0\"></iframe>\n</div>";
    };

    ChatLogView.prototype.youtubeElement = function(url) {
      var id;
      id = this.getURLParam(url, 'v');
      return "<div class='video-wrapper'>\n  <iframe width='560' height='315' src='https://www.youtube.com/embed/" + id + "' frameborder='0'></iframe>\n</div>";
    };

    return ChatLogView;

  })(ScrollView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYXZpcmFqcy8uYXRvbS9wYWNrYWdlcy9zbGFjay1jaGF0L2xpYi92aWV3cy9jaGF0L2NoYXQtbG9nLXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBO0FBQUEsTUFBQSxzR0FBQTtJQUFBOzs7O0VBQUEsZUFBQSxHQUFrQixPQUFBLENBQVEscUJBQVI7O0VBQ2xCLE1BQWtCLE9BQUEsQ0FBUSxzQkFBUixDQUFsQixFQUFDLFNBQUQsRUFBSTs7RUFDSixNQUFBLEdBQVMsT0FBQSxDQUFRLFFBQVI7O0VBQ1QsUUFBQSxHQUFXLElBQUksTUFBTSxDQUFDLFFBQVgsQ0FBQTs7RUFDWCxZQUFBLEdBQWUsT0FBQSxDQUFRLGNBQVI7O0VBQ2YsU0FBQSxHQUFZLE9BQUEsQ0FBUSxjQUFSOztFQUNaLEtBQUEsR0FBUSxPQUFBLENBQVEsY0FBUjs7RUFDUixFQUFBLEdBQUssT0FBQSxDQUFRLFlBQVI7O0VBR0wsTUFBTSxDQUFDLFVBQVAsQ0FDRTtJQUFBLFFBQUEsRUFBVSxRQUFWO0lBQ0EsU0FBQSxFQUFXLFNBQUMsSUFBRDtBQUNULGFBQU8sU0FBUyxDQUFDLGFBQVYsQ0FBd0IsSUFBeEIsQ0FBNkIsQ0FBQztJQUQ1QixDQURYO0dBREY7O0VBS0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLFFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQUFBLElBQUEsR0FBTzs7SUFDUCxXQUFDLENBQUEsT0FBRCxHQUFVLFNBQUMsZUFBRCxFQUFtQixRQUFuQjtNQUFDLElBQUMsQ0FBQSxrQkFBRDtNQUFrQixJQUFDLENBQUEsV0FBRDthQUMzQixJQUFDLENBQUEsR0FBRCxDQUFLO1FBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyw4QkFBUDtRQUF1QyxRQUFBLEVBQVUsQ0FBQyxDQUFsRDtPQUFMLEVBQTBELENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFDeEQsS0FBQyxDQUFBLEdBQUQs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LEtBQUosQ0FBVSxHQUFWO01BQ1osRUFBQSxHQUFLLFNBQVUsQ0FBQSxTQUFTLENBQUMsTUFBVixHQUFtQixDQUFuQjthQUNmLDhFQUFBLEdBRWdELEVBRmhELEdBRW1EO0lBTHZDOzswQkFVZCxjQUFBLEdBQWdCLFNBQUMsR0FBRDtBQUNkLFVBQUE7TUFBQSxFQUFBLEdBQUssSUFBQyxDQUFBLFdBQUQsQ0FBYSxHQUFiLEVBQWtCLEdBQWxCO2FBQ0wscUdBQUEsR0FFd0UsRUFGeEUsR0FFMkU7SUFKN0Q7Ozs7S0FsTlE7QUFoQjFCIiwic291cmNlc0NvbnRlbnQiOlsiXG5DaGF0TWVzc2FnZVZpZXcgPSByZXF1aXJlICcuL2NoYXQtbWVzc2FnZS12aWV3J1xueyQsIFNjcm9sbFZpZXd9ID0gcmVxdWlyZSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnXG5tYXJrZWQgPSByZXF1aXJlICdtYXJrZWQnXG5yZW5kZXJlciA9IG5ldyBtYXJrZWQuUmVuZGVyZXIoKVxuaW1hZ2VzTG9hZGVkID0gcmVxdWlyZSAnaW1hZ2VzbG9hZGVkJ1xuaGlnaGxpZ2h0ID0gcmVxdWlyZSAnaGlnaGxpZ2h0LmpzJ1xuZW1vamkgPSByZXF1aXJlICdlbW9qaS1pbWFnZXMnXG5vZyA9IHJlcXVpcmUgJ29wZW4tZ3JhcGgnXG5cbiMgU2V0IG9wdGlvbnMgZm9yIHRoZSBtYXJrZG93biBwYXJzZXJcbm1hcmtlZC5zZXRPcHRpb25zXG4gIHJlbmRlcmVyOiByZW5kZXJlclxuICBoaWdobGlnaHQ6IChjb2RlKSAtPlxuICAgIHJldHVybiBoaWdobGlnaHQuaGlnaGxpZ2h0QXV0byhjb2RlKS52YWx1ZVxuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBDaGF0TG9nVmlldyBleHRlbmRzIFNjcm9sbFZpZXdcbiAgcm9vdCA9IEBcbiAgQGNvbnRlbnQ6IChAc3RhdGVDb250cm9sbGVyLCBAbWVzc2FnZXMpIC0+XG4gICAgQGRpdiBjbGFzczogJ21lc3NhZ2VzIG5hdGl2ZS1rZXktYmluZGluZ3MnLCB0YWJpbmRleDogLTEsID0+XG4gICAgICBAZGl2IGNsYXNzOiAnbGlzdCcsIG91dGxldDogJ21lc3NhZ2VWaWV3cydcblxuICBpbml0aWFsaXplOiAoQHN0YXRlQ29udHJvbGxlciwgQG1lc3NhZ2VzLCBAY2hhdCkgLT5cbiAgICBzdXBlclxuICAgIEBhZGRNZXNzYWdlKG1lc3NhZ2UpIGZvciBtZXNzYWdlIGluIEBtZXNzYWdlc1xuXG4gICMgQWRkIGEgbWVzc2FnZSB0byB0aGUgY2hhdCBsb2cgd2hlbiBhIG5ldyBtZXNzYWdlIGlzIHJlY2VpdmVkXG4gIGFkZE1lc3NhZ2U6IChtZXNzYWdlKSA9PlxuICAgIEBtZXNzYWdlVmlld3MuYXBwZW5kKEBtZXNzYWdlRWxlbWVudChtZXNzYWdlKSlcblxuICAjIFBhcnNlIHRoZSB0aW1lIGEgbWVzc2FnZSB3YXMgc2VudCBmcm9tIGVwb2NoIHRvIGh1bWFuIHJlYWRhYmxlXG4gIGdldFRpbWU6ICh0aW1lc3RhbXApIC0+XG4gICAgYSA9IG5ldyBEYXRlKHRpbWVzdGFtcCAqIDEwMDApXG4gICAgbW9udGhzID0gW1wiSmFuXCIsIFwiRmViXCIsIFwiTWFyXCIsIFwiQXByXCIsIFwiTWF5XCIsIFwiSnVuXCIsIFwiSnVsXCIsIFwiQXVnXCIsIFwiU2VwXCIsIFwiT2N0XCIsIFwiTm92XCIsIFwiRGVjXCJdXG4gICAgbW9udGggPSBtb250aHNbYS5nZXRNb250aCgpXVxuICAgIGRhdGUgPSBhLmdldERhdGUoKVxuICAgIGhvdXIgPSBhLmdldEhvdXJzKClcbiAgICBtaW4gPSBhLmdldE1pbnV0ZXMoKVxuICAgIG1pbiA9IGlmIG1pbiA8IDEwIHRoZW4gXCIwI3ttaW59XCIgZWxzZSBtaW5cbiAgICB5ZWFyID0gYS5nZXRGdWxsWWVhcigpXG4gICAgaWYgaG91ciA+IDEyXG4gICAgICBob3VyID0gaG91ciAtIDEyXG4gICAgICB0ID0gXCIgcG1cIlxuICAgIGVsc2VcbiAgICAgIHQgPSBcIiBhbVwiXG4gICAgXCIje21vbnRofSAje2RhdGV9I3tpZiB5ZWFyIDwgKG5ldyBEYXRlKCkpLmdldEZ1bGxZZWFyKCkgdGhlbiBcIiwgI3t5ZWFyfVwiIGVsc2UgJyd9ICN7aG91cn06I3ttaW59ICN7dH1cIlxuXG4gICMgSFRNTCBSZXByZXNlbnRhdGlvbiBvZiBhIG1lc3NhZ2UuIFRoaXMgd2lsbCBwYXJzZSB0aGUgbWVzc2FnZSBzbyB0aGUgYXV0aG9yLCB0ZXh0LCBvcGVuIGdyYXBoLCBlbW9qaVxuICAjIGV0YyBjYW4gYWxsIGJlIGRpc3BsYXllZCBpbiBhIHBsZWFzaW5nIG1hbm5lclxuICBtZXNzYWdlRWxlbWVudDogKG1lc3NhZ2UpID0+XG4gICAgYXV0aG9yID0gQHN0YXRlQ29udHJvbGxlci50ZWFtLm1lbWJlcldpdGhJZChtZXNzYWdlLnVzZXIpIHx8IEBzdGF0ZUNvbnRyb2xsZXIudGVhbS51bmtub3duVXNlcihtZXNzYWdlKVxuICAgIGltYWdlID0gYXV0aG9yLmltYWdlXG4gICAgbmFtZSA9IGF1dGhvci5uYW1lXG4gICAgXCJcIlwiXG4gICAgPGRpdiBjbGFzcz0nbWVzc2FnZSBuYXRpdmUta2V5LWJpbmRpbmdzICN7bWVzc2FnZS5zdWJ0eXBlfSc+XG4gICAgICA8dGFibGU+XG4gICAgICAgIDx0cj5cbiAgICAgICAgICA8dGQ+XG4gICAgICAgICAgICA8aW1nIGNsYXNzPSdpbWFnZScgc3JjPSN7aW1hZ2V9IC8+XG4gICAgICAgICAgPC90ZD5cbiAgICAgICAgICA8dGQ+XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz0nbmFtZSc+I3tuYW1lfTwvc3Bhbj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPSd0cyc+I3tAZ2V0VGltZShtZXNzYWdlLnRzKX08L3NwYW4+XG4gICAgICAgICAgPC90ZD5cbiAgICAgICAgPC90cj5cbiAgICAgICAgPHRyPlxuICAgICAgICAgIDx0ZD48L3RkPlxuICAgICAgICAgIDx0ZD5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9J3RleHQnPiN7QHBhcnNlTWVzc2FnZShtZXNzYWdlKX08L2Rpdj5cbiAgICAgICAgICA8L3RkPlxuICAgICAgICA8L3RyPlxuICAgICAgPHRhYmxlPlxuICAgIDwvZGl2PlxuICAgIFwiXCJcIlxuXG5cbiAgIyBDYWxsZWQgd2hlbiB0aGUgZmlsZV9zaGFyZSBtZXNzYWdlIHN1YnR5cGUgaXMgZW5jb3VudGVyZWQuIEl0IHBhcnNlcyBhbmQgZGlzcGxheXMgdGhlIGZpbGVcbiAgZmlsZV9zaGFyZTogKG1lc3NhZ2UpID0+XG4gICAgZmlsZSA9IG1lc3NhZ2UuZmlsZVxuXG4gICAgIyBDcmVhdGUgYSBkb3dubG9hZCBsaW5rIGZvciB0aGUgZmlsZSAoY2xvdWQgZG93bmxvYWQgaWNvbilcbiAgICBkbCA9IFwiI3tmaWxlLm5hbWV9PGEgaHJlZj0nI3tmaWxlLnVybF9kb3dubG9hZH0nPjxzcGFuIGNsYXNzPSdkb3dubG9hZCc+PC9zcGFuPjwvYT5cIlxuXG4gICAgIyBQYXJzZSB0aGUgdGV4dCBvciBpbWFnZSBmaWxlIHJlY2VpdmVkXG4gICAgbXNnID0gc3dpdGNoXG4gICAgICB3aGVuIGZpbGUubWltZXR5cGUubWF0Y2goL3RleHQvKT8gdGhlbiBAZmlsZVRleHQoZmlsZSlcbiAgICAgIHdoZW4gZmlsZS5taW1ldHlwZS5tYXRjaCgvaW1hZ2UvZyk/IHRoZW4gQGZpbGVJbWFnZShmaWxlKVxuICAgICAgZWxzZSBcIlwiXG5cbiAgICAjIE1ha2Ugc3VyZSBmaWxlIGNvbW1lbnRzIGFyZSBhdmFpbGFibGUgd2l0aCB0aGUgZmlsZVxuICAgIG1zZy5jb25jYXQgQGZpbGVDb21tZW50cyhmaWxlKVxuICAgIFwiI3tkbH08YnI+I3ttc2d9XCJcblxuICAjIENvbW1lbnRzIGFib3V0IGEgZmlsZS5cbiAgZmlsZUNvbW1lbnRzOiAoZmlsZSkgPT5cbiAgICAjIE9ubHkgZGlzcGxheSB0aGlzIGZpbGVfY29tbWVudHMgZGl2IGlmIHRoZSBjb21tZW50IGlzIHRoZSBmaXJzdCBjb21tZW50XG4gICAgIyBzaGlwcGVkIHdpdGggdGhlIGZpbGUgdXBsb2FkXG4gICAgaWYgZmlsZS5pbml0aWFsX2NvbW1lbnRcbiAgICAgIFwiXCJcIlxuICAgICAgPGRpdiBpZD0nI3tmaWxlLmlkfV9jb21tZW50cycgY2xhc3M9J2ZpbGUgY29tbWVudCc+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJmaWxlX2NvbW1lbnRcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwidGV4dFwiPlxuICAgICAgICAgICAgPHA+I3tmaWxlLmluaXRpYWxfY29tbWVudC5jb21tZW50fTwvcD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIFwiXCJcIlxuICAgIGVsc2VcbiAgICAgIFwiXCJcblxuICAjIENyZWF0ZSBhbiBpbWFnZSBlbGVtZW50IG91dCBvZiB0aGUgaW1hZ2UgZmlsZSB1cGxvYWRcbiAgZmlsZUltYWdlOiAoZmlsZSkgPT5cbiAgICBcIlwiXCJcbiAgICA8ZGl2IGNsYXNzPSdmaWxlJz5cbiAgICAgIDxhIGhyZWY9JyN7ZmlsZS51cmx9Jz48aW1nIHNyYz0nI3tmaWxlLnVybH0nIGNsYXNzPSdpbWFnZScgLz48L2E+XG4gICAgPC9kaXY+XG4gICAgXCJcIlwiXG5cbiAgIyBUZXh0IGZpbGVzIGFyZSB1c3VhbGx5IHNuaXBwZXRzIGFuZCBzaG91bGQgYmUgaW5zZXJ0ZWQgaW50byBhIGNvZGUgYmxvY2tcbiAgIyBhbmQgcGFyc2VkIHdpdGggbWFya2Rvd25cbiAgZmlsZVRleHQ6IChmaWxlKSA9PlxuICAgIG1hcmtlZChcIlwiXCI8c3BhbiBjbGFzcz0nZmlsZSc+XG4gICAgICBgYGBcbiAgICAgICN7ZmlsZS5wcmV2aWV3fVxuICAgICAgYGBgXG4gICAgPC9maWxlPlwiXCJcIilcblxuICAjIFdoZW4gdGhlIGZpbGVfY29tbWVudCBzdXB0eXBlIGlzIHJlY2VpdmVkLCBhIG1lc3NhZ2UgaXMgbm90IGFjdHVhbGx5IGFkZGVkIHRvXG4gICMgdG8gdGhlIGxvZywgYnV0IHRvIHRoZSBjb3JyZXNwb25kaW5nIGNvbW1lbnRzIHNlY3Rpb24gb2YgdGhlIGZpbGUgdXBsb2FkXG4gIGZpbGVfY29tbWVudDogKG1lc3NhZ2UpID0+XG4gICAgY29tbWVudCA9IG1lc3NhZ2UuY29tbWVudFxuICAgIHVzZXIgPSBAc3RhdGVDb250cm9sbGVyLnRlYW0ubWVtYmVyV2l0aElkKGNvbW1lbnQudXNlcilcblxuICAgICMgQXBwZW5kIGZpbGVfY29tbWVudCB0byB0aGUgZmlsZSB0aGF0IHdhcyBwcmV2aW91c2x5IHBhcnNlZFxuICAgICQoXCIjI3ttZXNzYWdlLmZpbGUuaWR9X2NvbW1lbnRzXCIsIEBtZXNzYWdlVmlld3MpLmFwcGVuZChcIlwiXCJcbiAgICAgIDxkaXYgY2xhc3M9XCJmaWxlX2NvbW1lbnRcIj5cbiAgICAgIDxzcGFuIGNsYXNzPSduYW1lJyA+I3t1c2VyLm5hbWV9PC9zcGFuPlxuICAgICAgPHNwYW4gY2xhc3M9J3RzJyA+I3tAZ2V0VGltZShjb21tZW50LnRpbWVzdGFtcCl9PC9zcGFuPlxuICAgICAgPGRpdiBjbGFzcz0ndGV4dCc+I3ttYXJrZWQoY29tbWVudC5jb21tZW50KX08L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICAgXCJcIlwiKVxuXG4gICMgU2ltcGxlIHVybCBwYXJzZXIgdG8gcmV0cmlldmUgcGFyYW1zIGZyb20gbGlua3MgKHlvdXR1YmUgdmlkZW8gaWQpXG4gIGdldFVSTFBhcmFtOiAodXJsLCBwYXJhbSkgLT5cbiAgICB1cmw/LnNwbGl0KFwiI3twYXJhbX09XCIpP1sxXT8uc3BsaXQoXCImXCIpP1swXVxuXG4gICMgUGFyc2UgbGlua3MgYW5kIGRlY2lkZSB3aGF0IHRvIGRvIHdpdGggdGhlbS5cbiAgcGFyc2VMaW5rczogKG1lc3NhZ2UpID0+XG4gICAgdXJscyA9IG1lc3NhZ2UucmVwbGFjZSgvPFtePl0qPi9nLCBcIlwiKSAjIEJyZWFrIGZyZWUgbGlua3MgdGhhdCBhcmUgc3R1Y2sgaW5zaWRlIG9mIGFuY2hvciB0YWdzXG5cbiAgICAjIEZpbmQgYWxsIHVybHMgaW4gdGhlIG1lc3NhZ2UgdGV4dCBhbmQgY3JlYXRlIGFuIGFycmF5IG91dCBvZiB0aGVtXG4gICAgdXJscyA9IHVybHMubWF0Y2goLyhodHRwcz86XFwvXFwvKD86d3d3XFwufCg/IXd3dykpW15cXHNcXC5dK1xcLlteXFxzXXsyLH18d3d3XFwuW15cXHNdK1xcLlteXFxzXXsyLH0pL2cpXG4gICAgZGF0YSA9ICcnXG4gICAgaWYgdXJsc1xuICAgICAgZm9yIHVybCBpbiB1cmxzXG4gICAgICAgICMgRm9yIGVhY2ggdXJsLCBkZWNpZGUgd2hldGhlciB0byBkaXNwbGF5IGFuIGltYWdlLCB2aWRlbywgb3Igb3BlbiBncmFwaCBkYXRhIGJhc2VkIG9uIHRoZVxuICAgICAgICAjIHNvdXJjZSBvZiB0aGUgdXJsXG4gICAgICAgIGRhdGEgPSBzd2l0Y2hcbiAgICAgICAgICB3aGVuICgvXFwuKGdpZnxqcGd8anBlZ3x0aWZmfHBuZykkL2kpLnRlc3QodXJsKSB0aGVuIEBmaWxlSW1hZ2Uoe3VybDogdXJsfSlcbiAgICAgICAgICB3aGVuICgveW91dHViZVxcLmNvbS4qJC9pKS50ZXN0KHVybCkgdGhlbiBAeW91dHViZUVsZW1lbnQodXJsKVxuICAgICAgICAgIHdoZW4gKC92aW1lb1xcLmNvbS4qJC9pKS50ZXN0KHVybCkgdGhlbiBAdmltZW9FbGVtZW50KHVybClcbiAgICAgICAgICBlbHNlIEBvcGVuR3JhcGhFbGVtZW50KHVybClcbiAgICBtZXNzYWdlLmNvbmNhdCBkYXRhXG5cbiAgIyBVc2UgZGlmZmVyZW50IHBhcnNpbmcgbWV0aG9kcyBiYXNlZCBvbiBtZXNzYWdlIHN1YnR5cGUuIERlZmF1bHQgdG8gcGxhaW50ZXh0IG1lc3NhZ2VcbiAgcGFyc2VNZXNzYWdlOiAobWVzc2FnZSkgPT5cbiAgICBzd2l0Y2ggbWVzc2FnZS5zdWJ0eXBlXG4gICAgICB3aGVuICdmaWxlX2NvbW1lbnQnIHRoZW4gQGZpbGVfY29tbWVudChtZXNzYWdlKVxuICAgICAgd2hlbiAnZmlsZV9zaGFyZScgdGhlbiBAZmlsZV9zaGFyZShtZXNzYWdlKVxuICAgICAgZWxzZSBAbWVzc2FnZShtZXNzYWdlKVxuXG4gICMgUGFyc2UgYWxsIHRoZSBlbW9qaSwgbWFya2Rvd24sIGFuZCBsaW5rcyB5b3UgbWlnaHQgZmluZCBpbiBhIHR5cGljYWwgbWVzc2FnZVxuICBtZXNzYWdlOiAobWVzc2FnZSkgPT5cbiAgICByZXR1cm4gJycgdW5sZXNzIG1lc3NhZ2U/LnRleHQ/XG4gICAgdGV4dCA9IG1lc3NhZ2UudGV4dFxuICAgIHRleHQgPSBtYXJrZWQodGV4dClcbiAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKC8oPzpcXHJcXG58XFxyfFxcbikvZywgJzxiciAvPicpXG4gICAgdGV4dCA9IEBwYXJzZUxpbmtzKHRleHQpXG4gICAgdGV4dCA9IEBzdGF0ZUNvbnRyb2xsZXIudGVhbS5wYXJzZUN1c3RvbUVtb2ppKHRleHQpXG4gICAgdGV4dCA9IGVtb2ppKHRleHQsIFwiaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0hlbnJpa0pvcmV0ZWcvZW1vamktaW1hZ2VzL21hc3Rlci9wbmdzL1wiKVxuICAgIHRleHRcblxuICAjIENyZWF0ZSBlbGVtZW50cyBmb3IgYSBwbGVhc2luZyBvcGVuIGdyYXBoIG1lc3NhZ2Ugdmlld1xuICBtZXRhRWxlbWVudHM6ICh1cmwsIG1ldGEpID0+XG4gICAgZWxlbWVudHMgPSBbXVxuICAgIGVsZW1lbnRzLnB1c2goXCI8aW1nIHNyYz0nI3ttZXRhLmltYWdlLnVybH0nIGNsYXNzPSdvZ19pbWFnZScgLz5cIikgaWYgbWV0YT8uaW1hZ2U/LnVybD9cbiAgICBlbGVtZW50cy5wdXNoKFwiPGEgaHJlZj0nI3t1cmx9Jz48ZGl2IGNsYXNzPSdvZ190aXRsZSc+I3ttZXRhLnRpdGxlfTwvZGl2PjwvYT5cIikgaWYgbWV0YT8udGl0bGU/XG4gICAgZWxlbWVudHMucHVzaChcIjxkaXYgY2xhc3M9J29nX2Rlc2NyaXB0aW9uJz4je21ldGEuZGVzY3JpcHRpb259PC9kaXY+XCIpIGlmIG1ldGE/LmRlc2NyaXB0aW9uP1xuICAgIGVsZW1lbnRzLmpvaW4oJycpXG5cbiAgIyBSZXRyaWV2ZSBvcGVuIGdyYXBoIGRhdGEgYW5kIHVwZGF0ZSB0aGUgbWVzc2FnZSBjb250ZW50cyBpZiBuZWNlc3NhcnlcbiAgb3BlbkdyYXBoRGF0YTogKHVybCwgaWQpID0+XG4gICAgb2cgdXJsLCAoZXJyLCBtZXRhKSA9PlxuICAgICAgb2dfZWxlbWVudHMgPSBAbWV0YUVsZW1lbnRzKHVybCwgbWV0YSlcbiAgICAgICQoXCIjI3tpZH1cIikuaHRtbChvZ19lbGVtZW50cykgdW5sZXNzIGVyclxuICAgICAgJChcIiMje2lkfVwiKS5yZW1vdmUoKSB1bmxlc3Mgb2dfZWxlbWVudHNcbiAgICAgIGltYWdlc0xvYWRlZCAkKFwiIyN7aWR9XCIpLCA9PlxuICAgICAgICBAc3RhdGVDb250cm9sbGVyLnVwZGF0ZUNoYXRWaWV3KEBjaGF0LmNoYW5uZWwuaWQpXG5cbiAgIyBUZW1wb3Jhcnkgb3BlbiBncmFwaCBlbGVtZW50LiBJdCB3aWxsIGJlIGRlbGV0ZWQgaWYgbm90aGluZyBpcyBmb3VuZCBvciBmaWxsZWRcbiAgIyB3aXRoIG9wZW4gZ3JhcGggZWxlbWVudHMgaWYgdGhleSBjYW4gYmUgcmV0cmlldmVkXG4gIG9wZW5HcmFwaEVsZW1lbnQ6ICh1cmwpID0+XG4gICAgaWQgPSBEYXRlLm5vdygpXG4gICAgQG9wZW5HcmFwaERhdGEodXJsLCBpZClcbiAgICBcIjxkaXYgaWQ9JyN7aWR9JyBjbGFzcz0nb2dfZGF0YSc+PC9kaXY+XCJcblxuICAjIFJlY2VpdmUgYSBtZXNzYWdlIGZyb20gdGhlIHJ0bSBjbGllbnRcbiAgcmVjZWl2ZU1lc3NhZ2U6IChtZXNzYWdlKSA9PlxuICAgICMgQWRkIG1lc3NhZ2UgdG8gdGhlIGxvZ3NcbiAgICBAYWRkTWVzc2FnZShtZXNzYWdlKVxuXG4gICAgdW5sZXNzIG1lc3NhZ2UudXNlciBpcyBAc3RhdGVDb250cm9sbGVyLmNsaWVudC5tZS5pZFxuICAgICAgIyBNYXJrIHRoZSBsYXN0IG1lc3NhZ2UgYXMgdW5yZWFkLiBJdCB3aWxsIHNldCBhIGhvcml6b250YWwgYmFyIHRvIGluZGljYXRlIHVucmVhZCBtZXNzYWdlc1xuICAgICAgJChcIi5tZXNzYWdlXCIsIEBtZXNzYWdlVmlld3MpLmxhc3QoKS5hZGRDbGFzcyhcIm5ldyAjeydzbGFjay1tYXJrJyBpZiAkKFwiLm5ld1wiLCBAbWVzc2FnZVZpZXdzKS5sZW5ndGggaXMgMH1cIilcblxuICAjIFBhcnNlIGFuZCBlbWJlZCBhIHZpbWVvIHZpZGVvIHVybFxuICB2aW1lb0VsZW1lbnQ6ICh1cmwpID0+XG4gICAgdXJsX3BhcnRzID0gdXJsLnNwbGl0KFwiL1wiKVxuICAgIGlkID0gdXJsX3BhcnRzW3VybF9wYXJ0cy5sZW5ndGggLSAxXVxuICAgIFwiXCJcIlxuICAgIDxkaXYgY2xhc3M9J3ZpZGVvLXdyYXBwZXInPlxuICAgICAgPGlmcmFtZSBzcmM9XCJodHRwczovL3BsYXllci52aW1lby5jb20vdmlkZW8vI3tpZH1cIiBmcmFtZWJvcmRlcj1cIjBcIj48L2lmcmFtZT5cbiAgICA8L2Rpdj5cbiAgICBcIlwiXCJcblxuICAjIFBhcnNlIGFuZCBlbWJlZCBhIHlvdXR1YmUgdmlkZW8gdXJsXG4gIHlvdXR1YmVFbGVtZW50OiAodXJsKSA9PlxuICAgIGlkID0gQGdldFVSTFBhcmFtKHVybCwgJ3YnKVxuICAgIFwiXCJcIlxuICAgIDxkaXYgY2xhc3M9J3ZpZGVvLXdyYXBwZXInPlxuICAgICAgPGlmcmFtZSB3aWR0aD0nNTYwJyBoZWlnaHQ9JzMxNScgc3JjPSdodHRwczovL3d3dy55b3V0dWJlLmNvbS9lbWJlZC8je2lkfScgZnJhbWVib3JkZXI9JzAnPjwvaWZyYW1lPlxuICAgIDwvZGl2PlxuICAgIFwiXCJcIlxuIl19
