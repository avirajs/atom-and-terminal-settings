'use babel';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Path = require('path');
var Resource = require('./resource');

var DocSet = (function () {
  function DocSet(item) {
    _classCallCheck(this, DocSet);

    this.id_ = item.slug;
    this.name_ = item.name;
    this.type_ = item.type;
    this.version_ = item.version;
    this.indexPath_ = item.slug + '/index.json';
    this.dbPath_ = item.slug + '/db.json';
    this.version_ = item.mtime;
    this.sizeBytes_ = item.db_size;
    this.index_ = null;
    this.database_ = null;

    // TODO: dispose the returned disposable...
    atom.config.observe('api-docs.' + this.id_, this.setEnabled_.bind(this));
  }

  _createClass(DocSet, [{
    key: 'setEnabled_',
    value: function setEnabled_(enabled) {
      var _this = this;

      if (!enabled) {
        this.index_ = null;
        this.database_ = null;
        return;
      }

      var indexPromise = Resource.getVersion(this.indexPath_, this.version_);
      var dbPromise = Resource.getVersion(this.dbPath_, this.version_);

      Promise.all([indexPromise, dbPromise]).then(function (results) {
        _this.index_ = JSON.parse(results[0]);
        _this.database_ = JSON.parse(results[1]);

        // Fix up the paths to include the docset name.
        for (var i = 0; i < _this.index_.entries.length; ++i) {
          _this.index_.entries[i].id = _this.id_;
          _this.index_.entries[i].url = 'api-docs://' + _this.id_ + '/' + _this.index_.entries[i].path;
        }
      });
    }
  }, {
    key: 'getTitle',
    value: function getTitle(path) {
      for (var i = 0; i < this.index_.entries.length; ++i) {
        if (this.index_.entries[i].path == path) {
          return this.index_.entries[i].name;
        }
      }
      return '';
    }
  }, {
    key: 'getContent',
    value: function getContent(path) {
      return this.database_[path];
    }
  }, {
    key: 'queryAll',
    value: function queryAll() {
      if (!this.index_) {
        return [];
      }

      return this.index_.entries;
    }
  }, {
    key: 'type',
    get: function get() {
      return this.type_;
    }
  }, {
    key: 'name',
    get: function get() {
      return this.name_;
    }
  }, {
    key: 'classNames',
    get: function get() {
      return '_content _page _' + this.type_;
    }
  }, {
    key: 'version',
    get: function get() {
      return this.version_;
    }
  }]);

  return DocSet;
})();

module.exports = DocSet;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2F2aXJhanMvLmF0b20vcGFja2FnZXMvYXBpLWRvY3Mvc3JjL2RvY3NldC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7Ozs7OztBQUVaLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM3QixJQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7O0lBRWpDLE1BQU07QUFDRyxXQURULE1BQU0sQ0FDSSxJQUFJLEVBQUU7MEJBRGhCLE1BQU07O0FBRVIsUUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQ3JCLFFBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztBQUN2QixRQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7QUFDdkIsUUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO0FBQzdCLFFBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxhQUFhLENBQUM7QUFDNUMsUUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQztBQUN0QyxRQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7QUFDM0IsUUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO0FBQy9CLFFBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0FBQ25CLFFBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDOzs7QUFHdEIsUUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztHQUMxRTs7ZUFmRyxNQUFNOztXQWlDQyxxQkFBQyxPQUFpQixFQUFFOzs7QUFDN0IsVUFBSSxDQUFDLE9BQU8sRUFBRTtBQUNaLFlBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0FBQ25CLFlBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO0FBQ3RCLGVBQU87T0FDUjs7QUFFRCxVQUFNLFlBQVksR0FBRyxRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3pFLFVBQU0sU0FBUyxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRW5FLGFBQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxZQUFZLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FDakMsSUFBSSxDQUFDLFVBQUEsT0FBTyxFQUFJO0FBQ2YsY0FBSyxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNyQyxjQUFLLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7QUFHeEMsYUFBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUcsQ0FBQyxHQUFHLE1BQUssTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUU7QUFDcEQsZ0JBQUssTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsTUFBSyxHQUFHLENBQUM7QUFDckMsZ0JBQUssTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLG1CQUFpQixNQUFLLEdBQUcsU0FBSSxNQUFLLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxBQUFFLENBQUM7U0FDdEY7T0FDRixDQUFDLENBQUM7S0FDUjs7O1dBRU8sa0JBQUMsSUFBSSxFQUFFO0FBQ2IsV0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRTtBQUNuRCxZQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLEVBQUU7QUFDdkMsaUJBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1NBQ3BDO09BQ0Y7QUFDRCxhQUFPLEVBQUUsQ0FBQztLQUNYOzs7V0FFUyxvQkFBQyxJQUFJLEVBQUU7QUFDZixhQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDN0I7OztXQUVPLG9CQUFtQjtBQUN6QixVQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtBQUNoQixlQUFPLEVBQUUsQ0FBQztPQUNYOztBQUVELGFBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7S0FDNUI7OztTQTFETyxlQUFHO0FBQ1QsYUFBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0tBQ25COzs7U0FFTyxlQUFHO0FBQ1QsYUFBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0tBQ25COzs7U0FFYSxlQUFHO0FBQ2YsYUFBTyxrQkFBa0IsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO0tBQ3hDOzs7U0FFVSxlQUFHO0FBQ1osYUFBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0tBQ3RCOzs7U0EvQkcsTUFBTTs7O0FBOEVaLE1BQU0sQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDIiwiZmlsZSI6Ii9ob21lL2F2aXJhanMvLmF0b20vcGFja2FnZXMvYXBpLWRvY3Mvc3JjL2RvY3NldC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5jb25zdCBQYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuY29uc3QgUmVzb3VyY2UgPSByZXF1aXJlKCcuL3Jlc291cmNlJyk7XG5cbmNsYXNzIERvY1NldCB7XG4gICAgY29uc3RydWN0b3IoaXRlbSkge1xuICAgIHRoaXMuaWRfID0gaXRlbS5zbHVnO1xuICAgIHRoaXMubmFtZV8gPSBpdGVtLm5hbWU7XG4gICAgdGhpcy50eXBlXyA9IGl0ZW0udHlwZTtcbiAgICB0aGlzLnZlcnNpb25fID0gaXRlbS52ZXJzaW9uO1xuICAgIHRoaXMuaW5kZXhQYXRoXyA9IGl0ZW0uc2x1ZyArICcvaW5kZXguanNvbic7XG4gICAgdGhpcy5kYlBhdGhfID0gaXRlbS5zbHVnICsgJy9kYi5qc29uJztcbiAgICB0aGlzLnZlcnNpb25fID0gaXRlbS5tdGltZTtcbiAgICB0aGlzLnNpemVCeXRlc18gPSBpdGVtLmRiX3NpemU7XG4gICAgdGhpcy5pbmRleF8gPSBudWxsO1xuICAgIHRoaXMuZGF0YWJhc2VfID0gbnVsbDtcblxuICAgIC8vIFRPRE86IGRpc3Bvc2UgdGhlIHJldHVybmVkIGRpc3Bvc2FibGUuLi5cbiAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdhcGktZG9jcy4nICsgdGhpcy5pZF8sIHRoaXMuc2V0RW5hYmxlZF8uYmluZCh0aGlzKSk7XG4gIH1cblxuICBnZXQgdHlwZSgpIHtcbiAgICByZXR1cm4gdGhpcy50eXBlXztcbiAgfVxuXG4gIGdldCBuYW1lKCkge1xuICAgIHJldHVybiB0aGlzLm5hbWVfO1xuICB9XG5cbiAgZ2V0IGNsYXNzTmFtZXMoKSB7XG4gICAgcmV0dXJuICdfY29udGVudCBfcGFnZSBfJyArIHRoaXMudHlwZV87XG4gIH1cblxuICBnZXQgdmVyc2lvbigpIHtcbiAgICByZXR1cm4gdGhpcy52ZXJzaW9uXztcbiAgfVxuXG4gIHNldEVuYWJsZWRfKGVuYWJsZWQgOiBib29sZWFuKSB7XG4gICAgaWYgKCFlbmFibGVkKSB7XG4gICAgICB0aGlzLmluZGV4XyA9IG51bGw7XG4gICAgICB0aGlzLmRhdGFiYXNlXyA9IG51bGw7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgaW5kZXhQcm9taXNlID0gUmVzb3VyY2UuZ2V0VmVyc2lvbih0aGlzLmluZGV4UGF0aF8sIHRoaXMudmVyc2lvbl8pO1xuICAgIGNvbnN0IGRiUHJvbWlzZSA9IFJlc291cmNlLmdldFZlcnNpb24odGhpcy5kYlBhdGhfLCB0aGlzLnZlcnNpb25fKTtcblxuICAgIFByb21pc2UuYWxsKFtpbmRleFByb21pc2UsIGRiUHJvbWlzZV0pXG4gICAgICAgIC50aGVuKHJlc3VsdHMgPT4ge1xuICAgICAgICAgIHRoaXMuaW5kZXhfID0gSlNPTi5wYXJzZShyZXN1bHRzWzBdKTtcbiAgICAgICAgICB0aGlzLmRhdGFiYXNlXyA9IEpTT04ucGFyc2UocmVzdWx0c1sxXSk7XG5cbiAgICAgICAgICAvLyBGaXggdXAgdGhlIHBhdGhzIHRvIGluY2x1ZGUgdGhlIGRvY3NldCBuYW1lLlxuICAgICAgICAgIGZvciAodmFyIGkgPSAwIDsgaSA8IHRoaXMuaW5kZXhfLmVudHJpZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIHRoaXMuaW5kZXhfLmVudHJpZXNbaV0uaWQgPSB0aGlzLmlkXztcbiAgICAgICAgICAgIHRoaXMuaW5kZXhfLmVudHJpZXNbaV0udXJsID0gYGFwaS1kb2NzOi8vJHt0aGlzLmlkX30vJHt0aGlzLmluZGV4Xy5lbnRyaWVzW2ldLnBhdGh9YDtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICB9XG5cbiAgZ2V0VGl0bGUocGF0aCkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5pbmRleF8uZW50cmllcy5sZW5ndGg7ICsraSkge1xuICAgICAgaWYgKHRoaXMuaW5kZXhfLmVudHJpZXNbaV0ucGF0aCA9PSBwYXRoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmluZGV4Xy5lbnRyaWVzW2ldLm5hbWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiAnJztcbiAgfVxuXG4gIGdldENvbnRlbnQocGF0aCkge1xuICAgIHJldHVybiB0aGlzLmRhdGFiYXNlX1twYXRoXTtcbiAgfVxuXG4gIHF1ZXJ5QWxsKCkgOiBBcnJheTxPYmplY3Q+IHtcbiAgICBpZiAoIXRoaXMuaW5kZXhfKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaW5kZXhfLmVudHJpZXM7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBEb2NTZXQ7XG4iXX0=