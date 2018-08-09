'use babel';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var DocSet = require('./docset');
var Resource = require('./resource');

var Library = (function () {
  _createClass(Library, null, [{
    key: 'RESOURCE_NAME_',
    value: 'docs.json',
    enumerable: true
  }, {
    key: 'REFRESH_PERIOD_MS_',
    value: 6 * 60 * 60 * 1000,
    enumerable: true
  }, {
    key: 'DEFAULT_DOCSETS_',
    value: new Set(['css', 'dom', 'dom_events', 'html', 'http', 'javascript']),
    enumerable: true
  }]);

  function Library() {
    var _this = this;

    _classCallCheck(this, Library);

    this.eventQueue_ = Promise.resolve();
    this.catalog_ = null;

    this.fetchLibrary_();
    setInterval(function () {
      _this.fetchLibrary_();
    }, Library.REFRESH_PERIOD_MS_);
  }

  _createClass(Library, [{
    key: 'get',
    value: function get(id) {
      return this.catalog_[id];
    }
  }, {
    key: 'queryAll',
    value: function queryAll() {
      var ret = [];
      for (var id in this.catalog_) {
        ret = ret.concat(this.catalog_[id].queryAll());
      }
      return ret;
    }
  }, {
    key: 'fetchLibrary_',
    value: function fetchLibrary_() {
      var _this2 = this;

      this.eventQueue_ = this.eventQueue_.then(function () {
        return Resource.get(Library.RESOURCE_NAME_, true);
      }).then(function (text) {
        _this2.buildCatalog_(JSON.parse(text));
        Resource.collectGarbage(_this2);
      });
    }
  }, {
    key: 'buildCatalog_',
    value: function buildCatalog_(items) {
      var catalog = {};

      var slugs = [];
      for (var i = 0; i < items.length; ++i) {
        var item = items[i];
        catalog[item.slug] = new DocSet(item);

        slugs.push(item.slug);
      }

      for (var i = 0; i < items.length; ++i) {
        var item = items[i];

        var title = item.name;
        if ('version' in item && item.version) {
          title += ' ' + item.version;
        }
        var schema = {
          title: title,
          type: 'boolean',
          'default': Library.DEFAULT_DOCSETS_.has(item.slug)
        };

        // add explicit group with better title
        var base_key = item.slug;
        if (base_key.indexOf('.') != -1) {
          base_key = base_key.substring(0, base_key.indexOf('.'));
        }
        if (slugs.indexOf(base_key) == -1 && base_key.indexOf('~') != -1) {
          var group_title = item.name + ' ' + base_key.substring(base_key.indexOf('~') + 1);
          var props = {};
          props[item.slug.substring(base_key.length + 1)] = schema;
          schema = {
            title: group_title,
            type: 'object',
            properties: props
          };

          atom.config.setSchema('api-docs.' + base_key, schema);
          // only insert the group for the first item in the group
          slugs.push(base_key);
          continue;
        }

        atom.config.setSchema('api-docs.' + item.slug, schema);
      }

      this.catalog_ = catalog;
    }
  }]);

  return Library;
})();

module.exports = Library;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2F2aXJhanMvLmF0b20vcGFja2FnZXMvYXBpLWRvY3Mvc3JjL2xpYnJhcnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFDOzs7Ozs7QUFFWixJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDbkMsSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDOztJQUVqQyxPQUFPO2VBQVAsT0FBTzs7V0FDYSxXQUFXOzs7O1dBQ1AsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBSTs7OztXQUNwQixJQUFJLEdBQUcsQ0FBQyxDQUNoQyxLQUFLLEVBQ0wsS0FBSyxFQUNMLFlBQVksRUFDWixNQUFNLEVBQ04sTUFBTSxFQUNOLFlBQVksQ0FDYixDQUFDOzs7O0FBRVMsV0FaUCxPQUFPLEdBWUc7OzswQkFaVixPQUFPOztBQWFULFFBQUksQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ3JDLFFBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDOztBQUVyQixRQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7QUFDckIsZUFBVyxDQUFDLFlBQU07QUFBRSxZQUFLLGFBQWEsRUFBRSxDQUFDO0tBQUUsRUFBRSxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQztHQUMxRTs7ZUFsQkcsT0FBTzs7V0FvQlIsYUFBQyxFQUFFLEVBQUU7QUFDTixhQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDMUI7OztXQUVPLG9CQUFHO0FBQ1QsVUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDO0FBQ2IsV0FBSyxJQUFNLEVBQUUsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO0FBQzlCLFdBQUcsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztPQUNoRDtB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Q0FBQyxDQUFDO0FBQ3JCLG1CQUFTO1NBQ1Y7O0FBRUQsWUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7T0FDeEQ7O0FBRUQsVUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7S0FDekI7OztTQTNGRyxPQUFPOzs7QUE4RmIsTUFBTSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMiLCJmaWxlIjoiL2hvbWUvYXZpcmFqcy8uYXRvbS9wYWNrYWdlcy9hcGktZG9jcy9zcmMvbGlicmFyeS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5jb25zdCBEb2NTZXQgPSByZXF1aXJlKCcuL2RvY3NldCcpO1xuY29uc3QgUmVzb3VyY2UgPSByZXF1aXJlKCcuL3Jlc291cmNlJyk7XG5cbmNsYXNzIExpYnJhcnkge1xuICBzdGF0aWMgUkVTT1VSQ0VfTkFNRV8gPSAnZG9jcy5qc29uJztcbiAgc3RhdGljIFJFRlJFU0hfUEVSSU9EX01TXyA9IDYgKiA2MCAqIDYwICogMTAwMDtcbiAgc3RhdGljIERFRkFVTFRfRE9DU0VUU18gPSBuZXcgU2V0KFtcbiAgICAnY3NzJyxcbiAgICAnZG9tJyxcbiAgICAnZG9tX2V2ZW50cycsXG4gICAgJ2h0bWwnLFxuICAgICdodHRwJyxcbiAgICAnamF2YXNjcmlwdCdcbiAgXSk7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5ldmVudFF1ZXVlXyA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIHRoaXMuY2F0YWxvZ18gPSBudWxsO1xuXG4gICAgdGhpcy5mZXRjaExpYnJhcnlfKCk7XG4gICAgc2V0SW50ZXJ2YWwoKCkgPT4geyB0aGlzLmZldGNoTGlicmFyeV8oKTsgfSwgTGlicmFyeS5SRUZSRVNIX1BFUklPRF9NU18pO1xuICB9XG5cbiAgZ2V0KGlkKSB7XG4gICAgcmV0dXJuIHRoaXMuY2F0YWxvZ19baWRdO1xuICB9XG5cbiAgcXVlcnlBbGwoKSB7XG4gICAgdmFyIHJldCA9IFtdO1xuICAgIGZvciAoY29uc3QgaWQgaW4gdGhpcy5jYXRhbG9nXykge1xuICAgICAgcmV0ID0gcmV0LmNvbmNhdCh0aGlzLmNhdGFsb2dfW2lkXS5xdWVyeUFsbCgpKTtcbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIGZldGNoTGlicmFyeV8oKSB7XG4gICAgdGhpcy5ldmVudFF1ZXVlXyA9IHRoaXMuZXZlbnRRdWV1ZV9cbiAgICAgICAgLnRoZW4oKCkgPT4gUmVzb3VyY2UuZ2V0KExpYnJhcnkuUkVTT1VSQ0VfTkFNRV8sIHRydWUpKVxuICAgICAgICAudGhlbih0ZXh0ID0+IHtcbiAgICAgICAgICB0aGlzLmJ1aWxkQ2F0YWxvZ18oSlNPTi5wYXJzZSh0ZXh0KSk7XG4gICAgICAgICAgUmVzb3VyY2UuY29sbGVjdEdhcmJhZ2UodGhpcyk7XG4gICAgICAgIH0pO1xuICB9XG5cbiAgYnVpbGRDYXRhbG9nXyhpdGVtcykge1xuICAgIGNvbnN0IGNhdGFsb2cgPSB7fTtcblxuICAgIHZhciBzbHVncyA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyArK2kpIHtcbiAgICAgIGNvbnN0IGl0ZW0gPSBpdGVtc1tpXTtcbiAgICAgIGNhdGFsb2dbaXRlbS5zbHVnXSA9IG5ldyBEb2NTZXQoaXRlbSk7XG5cbiAgICAgIHNsdWdzLnB1c2goaXRlbS5zbHVnKTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgKytpKSB7XG4gICAgICBjb25zdCBpdGVtID0gaXRlbXNbaV07XG5cbiAgICAgIHZhciB0aXRsZSA9IGl0ZW0ubmFtZVxuICAgICAgaWYgKCd2ZXJzaW9uJyBpbiBpdGVtICYmIGl0ZW0udmVyc2lvbikge1xuICAgICAgICB0aXRsZSArPSAnICcgKyBpdGVtLnZlcnNpb25cbiAgICAgIH1cbiAgICAgIHZhciBzY2hlbWEgPSB7XG4gICAgICAgIHRpdGxlOiB0aXRsZSxcbiAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICBkZWZhdWx0OiBMaWJyYXJ5LkRFRkFVTFRfRE9DU0VUU18uaGFzKGl0ZW0uc2x1ZylcbiAgICAgIH07XG5cbiAgICAgIC8vIGFkZCBleHBsaWNpdCBncm91cCB3aXRoIGJldHRlciB0aXRsZVxuICAgICAgdmFyIGJhc2Vfa2V5ID0gaXRlbS5zbHVnO1xuICAgICAgaWYgKGJhc2Vfa2V5LmluZGV4T2YoJy4nKSAhPSAtMSkge1xuICAgICAgICBiYXNlX2tleSA9IGJhc2Vfa2V5LnN1YnN0cmluZygwLCBiYXNlX2tleS5pbmRleE9mKCcuJykpO1xuICAgICAgfVxuICAgICAgaWYgKHNsdWdzLmluZGV4T2YoYmFzZV9rZXkpID09IC0xICYmIGJhc2Vfa2V5LmluZGV4T2YoJ34nKSAhPSAtMSkge1xuICAgICAgICB2YXIgZ3JvdXBfdGl0bGUgPSBpdGVtLm5hbWUgKyAnICcgK1xuICAgICAgICAgIGJhc2Vfa2V5LnN1YnN0cmluZyhiYXNlX2tleS5pbmRleE9mKCd+JykgKyAxKTtcbiAgICAgICAgdmFyIHByb3BzID0ge31cbiAgICAgICAgcHJvcHNbaXRlbS5zbHVnLnN1YnN0cmluZyhiYXNlX2tleS5sZW5ndGggKyAxKV0gPSBzY2hlbWE7XG4gICAgICAgIHNjaGVtYSA9IHtcbiAgICAgICAgICB0aXRsZTogZ3JvdXBfdGl0bGUsXG4gICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgcHJvcGVydGllczogcHJvcHNcbiAgICAgICAgfTtcblxuICAgICAgICBhdG9tLmNvbmZpZy5zZXRTY2hlbWEoJ2FwaS1kb2NzLicgKyBiYXNlX2tleSwgc2NoZW1hKTtcbiAgICAgICAgLy8gb25seSBpbnNlcnQgdGhlIGdyb3VwIGZvciB0aGUgZmlyc3QgaXRlbSBpbiB0aGUgZ3JvdXBcbiAgICAgICAgc2x1Z3MucHVzaChiYXNlX2tleSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBhdG9tLmNvbmZpZy5zZXRTY2hlbWEoJ2FwaS1kb2NzLicgKyBpdGVtLnNsdWcsIHNjaGVtYSk7XG4gICAgfVxuXG4gICAgdGhpcy5jYXRhbG9nXyA9IGNhdGFsb2c7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBMaWJyYXJ5O1xuIl19