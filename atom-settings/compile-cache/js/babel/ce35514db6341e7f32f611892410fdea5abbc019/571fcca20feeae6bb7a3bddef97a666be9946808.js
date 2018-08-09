'use babel';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var File = require('atom').File;
var Fs = require('fs');
var Http = require('follow-redirects').http;
var Mkdirp = require('mkdirp');
var Path = require('path');
var Rmdir = require('rmdir');

var Resource = (function () {
  function Resource() {
    _classCallCheck(this, Resource);
  }

  _createClass(Resource, null, [{
    key: 'collectGarbage',
    value: function collectGarbage(library) {
      Fs.readdir(Resource.BASE_PATH_, function (err, files) {
        if (err) {
          return;
        }

        for (var i = 0; i < files.length; ++i) {
          if (!Fs.lstatSync(Path.join(Resource.BASE_PATH_, files[i])).isDirectory()) {
            continue;
          }

          var ext = Path.extname(files[i]);
          var version = Number.parseInt(ext.substr(1));
          var id = Path.basename(files[i], ext);
          var docset = library.get(id);

          if (!docset || docset.version != version) {
            Rmdir(Path.join(Resource.BASE_PATH_, files[i]), function () {
              return null;
            });
          }
        }
      });
    }
  }, {
    key: 'get',
    value: function get(resourceName, opt_forceReload) {
      var url = Resource.BASE_URL_ + '/' + resourceName;
      var filename = Path.join(Resource.BASE_PATH_, resourceName);

      return Resource.get_(url, opt_forceReload ? '' : filename, filename);
    }
  }, {
    key: 'getVersion',
    value: function getVersion(resourceName, version) {
      var url = Resource.BASE_VERSION_URL_ + '/' + resourceName + '?' + version;

      // Insert the version number as an extension to the directory name containing
      // the given resource.
      var switcheroo = Path.join(Path.dirname(resourceName) + '.' + version.toString(), Path.basename(resourceName));
      var filename = Path.join(Resource.BASE_PATH_, switcheroo);

      return Resource.get_(url, filename, filename);
    }
  }, {
    key: 'get_',
    value: function get_(url, readFilename, writeFilename) {
      return new File(readFilename).read().then(function (result) {
        return result ? result : Promise.reject('ReadFail');
      })['catch'](function (error) {
        return new Promise(function (resolve, reject) {
          Http.get(url, function (response) {
            response.on('error', reject);

            var buffer = '';
            response.on('data', function (chunk) {
              buffer += chunk;
            });
            response.on('end', function () {
              resolve(buffer);
            });
          }).on('error', reject);
        }).then(function (result) {
          Mkdirp(Path.dirname(writeFilename));
          new File(writeFilename).write(result);
          return result;
        })['catch'](function (error) {
          return new File(writeFilename).read().then(function (result) {
            return result ? result : Promise.reject('ReadFail');
          });
        });
      });
    }
  }, {
    key: 'BASE_URL_',
    value: 'http://devdocs.io',
    enumerable: true
  }, {
    key: 'BASE_VERSION_URL_',
    value: 'http://docs.devdocs.io',
    enumerable: true
  }, {
    key: 'BASE_PATH_',
    value: Path.join(Path.dirname(atom.config.getUserConfigPath()), 'packages', 'api-docs', 'data'),
    enumerable: true
  }]);

  return Resource;
})();

module.exports = Resource;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2F2aXJhanMvLmF0b20vcGFja2FnZXMvYXBpLWRvY3Mvc3JjL3Jlc291cmNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQzs7Ozs7O0FBRVosSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQztBQUNsQyxJQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDekIsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUMsSUFBSSxDQUFDO0FBQzlDLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNqQyxJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDN0IsSUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDOztJQUV6QixRQUFRO1dBQVIsUUFBUTswQkFBUixRQUFROzs7ZUFBUixRQUFROztXQUtTLHdCQUFDLE9BQU8sRUFBRTtBQUM3QixRQUFFLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsVUFBQyxHQUFHLEVBQUUsS0FBSyxFQUFLO0FBQzlDLFlBQUksR0FBRyxFQUFFO0FBQ1AsaUJBQU87U0FDUjs7QUFFRCxhQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRTtBQUNyQyxjQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsRUFBRTtBQUN6RSxxQkFBUztXQUNWOztBQUVELGNBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbkMsY0FB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QWEsQ0FBQyxDQUFDLENBQUM7QUFDcEMsY0FBSSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3RDLGlCQUFPLE1BQU0sQ0FBQztTQUNmLENBQUMsU0FBTSxDQUFDLFVBQUEsS0FBSyxFQUFJO0FBQ2hCLGlCQUFPLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUNoQyxJQUFJLENBQUMsVUFBQSxNQUFNO21CQUFJLE1BQU0sR0FBRyxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUM7V0FBQSxDQUFDLENBQUM7U0FDbkUsQ0FBQyxDQUFDO09BQ0osQ0FBQyxDQUFDO0tBQ1I7OztXQWxFa0IsbUJBQW1COzs7O1dBQ1gsd0JBQXdCOzs7O1dBQy9CLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLGlCQUFpQixFQUFFLENBQUMsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLE1BQU0sQ0FBQzs7OztTQUh4RyxRQUFROzs7QUFzRWQsTUFBTSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMiLCJmaWxlIjoiL2hvbWUvYXZpcmFqcy8uYXRvbS9wYWNrYWdlcy9hcGktZG9jcy9zcmMvcmVzb3VyY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuY29uc3QgRmlsZSA9IHJlcXVpcmUoJ2F0b20nKS5GaWxlO1xuY29uc3QgRnMgPSByZXF1aXJlKCdmcycpO1xuY29uc3QgSHR0cCA9IHJlcXVpcmUoJ2ZvbGxvdy1yZWRpcmVjdHMnKS5odHRwO1xuY29uc3QgTWtkaXJwID0gcmVxdWlyZSgnbWtkaXJwJyk7XG5jb25zdCBQYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuY29uc3QgUm1kaXIgPSByZXF1aXJlKCdybWRpcicpO1xuXG5jbGFzcyBSZXNvdXJjZSB7XG4gIHN0YXRpYyBCQVNFX1VSTF8gPSAnaHR0cDovL2RldmRvY3MuaW8nO1xuICBzdGF0aWMgQkFTRV9WRVJTSU9OX1VSTF8gPSAnaHR0cDovL2RvY3MuZGV2ZG9jcy5pbyc7XG4gIHN0YXRpYyBCQVNFX1BBVEhfID0gUGF0aC5qb2luKFBhdGguZGlybmFtZShhdG9tLmNvbmZpZy5nZXRVc2VyQ29uZmlnUGF0aCgpKSwgJ3BhY2thZ2VzJywgJ2FwaS1kb2NzJywgJ2RhdGEnKTtcblxuICBzdGF0aWMgY29sbGVjdEdhcmJhZ2UobGlicmFyeSkge1xuICAgIEZzLnJlYWRkaXIoUmVzb3VyY2UuQkFTRV9QQVRIXywgKGVyciwgZmlsZXMpID0+IHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZpbGVzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIGlmICghRnMubHN0YXRTeW5jKFBhdGguam9pbihSZXNvdXJjZS5CQVNFX1BBVEhfLCBmaWxlc1tpXSkpLmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGV4dCA9IFBhdGguZXh0bmFtZShmaWxlc1tpXSk7XG4gICAgICAgIGNvbnN0IHZlcnNpb24gPSBOdW1iZXIucGFyc2VJbnQoZXh0LnN1YnN0cigxKSk7XG4gICAgICAgIGNvbnN0IGlkID0gUGF0aC5iYXNlbmFtZShmaWxlc1tpXSwgZXh0KTtcbiAgICAgICAgY29uc3QgZG9jc2V0ID0gbGlicmFyeS5nZXQoaWQpO1xuXG4gICAgICAgIGlmICghZG9jc2V0IHx8IGRvY3NldC52ZXJzaW9uICE9IHZlcnNpb24pIHtcbiAgICAgICAgICBSbWRpcihQYXRoLmpvaW4oUmVzb3VyY2UuQkFTRV9QQVRIXywgZmlsZXNbaV0pLCAoKSA9PiBudWxsKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgc3RhdGljIGdldChyZXNvdXJjZU5hbWUsIG9wdF9mb3JjZVJlbG9hZCkge1xuICAgIGNvbnN0IHVybCA9IFJlc291cmNlLkJBU0VfVVJMXyArICcvJyArIHJlc291cmNlTmFtZTtcbiAgICBjb25zdCBmaWxlbmFtZSA9IFBhdGguam9pbihSZXNvdXJjZS5CQVNFX1BBVEhfLCByZXNvdXJjZU5hbWUpO1xuXG4gICAgcmV0dXJuIFJlc291cmNlLmdldF8odXJsLCBvcHRfZm9yY2VSZWxvYWQgPyAnJyA6IGZpbGVuYW1lLCBmaWxlbmFtZSk7XG4gIH1cblxuICBzdGF0aWMgZ2V0VmVyc2lvbihyZXNvdXJjZU5hbWUsIHZlcnNpb24pIHtcbiAgICBjb25zdCB1cmwgPSBSZXNvdXJjZS5CQVNFX1ZFUlNJT05fVVJMXyArICcvJyArIHJlc291cmNlTmFtZSArICc/JyArIHZlcnNpb247XG5cbiAgICAvLyBJbnNlcnQgdGhlIHZlcnNpb24gbnVtYmVyIGFzIGFuIGV4dGVuc2lvbiB0byB0aGUgZGlyZWN0b3J5IG5hbWUgY29udGFpbmluZ1xuICAgIC8vIHRoZSBnaXZlbiByZXNvdXJjZS5cbiAgICBjb25zdCBzd2l0Y2hlcm9vID0gUGF0aC5qb2luKFBhdGguZGlybmFtZShyZXNvdXJjZU5hbWUpICsgJy4nICsgdmVyc2lvbi50b1N0cmluZygpLCBQYXRoLmJhc2VuYW1lKHJlc291cmNlTmFtZSkpO1xuICAgIGNvbnN0IGZpbGVuYW1lID0gUGF0aC5qb2luKFJlc291cmNlLkJBU0VfUEFUSF8sIHN3aXRjaGVyb28pO1xuXG4gICAgcmV0dXJuIFJlc291cmNlLmdldF8odXJsLCBmaWxlbmFtZSwgZmlsZW5hbWUpO1xuICB9XG5cbiAgc3RhdGljIGdldF8odXJsLCByZWFkRmlsZW5hbWUsIHdyaXRlRmlsZW5hbWUpIHtcbiAgICByZXR1cm4gbmV3IEZpbGUocmVhZEZpbGVuYW1lKS5yZWFkKClcbiAgICAgICAgLnRoZW4ocmVzdWx0ID0+IHJlc3VsdCA/IHJlc3VsdCA6IFByb21pc2UucmVqZWN0KCdSZWFkRmFpbCcpKVxuICAgICAgICAuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBIdHRwLmdldCh1cmwsIHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgICAgcmVzcG9uc2Uub24oJ2Vycm9yJywgcmVqZWN0KTtcblxuICAgICAgICAgICAgICB2YXIgYnVmZmVyID0gJyc7XG4gICAgICAgICAgICAgIHJlc3BvbnNlLm9uKCdkYXRhJywgY2h1bmsgPT4geyBidWZmZXIgKz0gY2h1bms7IH0pO1xuICAgICAgICAgICAgICByZXNwb25zZS5vbignZW5kJywgKCkgPT4geyByZXNvbHZlKGJ1ZmZlcik7IH0pO1xuICAgICAgICAgICAgfSkub24oJ2Vycm9yJywgcmVqZWN0KTtcbiAgICAgICAgICB9KS50aGVuKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICBNa2RpcnAoUGF0aC5kaXJuYW1lKHdyaXRlRmlsZW5hbWUpKTtcbiAgICAgICAgICAgIG5ldyBGaWxlKHdyaXRlRmlsZW5hbWUpLndyaXRlKHJlc3VsdCk7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgIH0pLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgRmlsZSh3cml0ZUZpbGVuYW1lKS5yZWFkKClcbiAgICAgICAgICAgICAgICAudGhlbihyZXN1bHQgPT4gcmVzdWx0ID8gcmVzdWx0IDogUHJvbWlzZS5yZWplY3QoJ1JlYWRGYWlsJykpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFJlc291cmNlO1xuIl19