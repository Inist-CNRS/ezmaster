'use strict';

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('castor:route:' + basename)
  , bodyParser = require('body-parser')
  , moment = require('moment')
  , util = require('util')
  , fs = require('fs')
  , getSize = require('get-folder-size')
  , filesize = require('filesize')
  , Docker = require('dockerode')
  , docker = new Docker({ socketPath: '/var/run/docker.sock'})
  , exec = require('child_process').exec;

module.exports = function (router, core) {

  var config = core.config
    , mongodb = core.connect();

  router.route('/').get(function (req, res, next) {
      return res.render("template.html");
  });

  router.route('/-/v1/instances').get(function (req, res, next) {
    var instancesArray = fs.readdirSync(path.join(__dirname, '../instances/'));
    docker.listContainers({all : true}, function (err, containers) {

      var container = {}
        , arrayObject = [];

      (function check() {

        const elements = containers.pop();
        
        if (!elements) { return res.send(arrayObject); }

        var splittedName = elements.Names[0].split('/');

        if (instancesArray.indexOf(splittedName[1]) === -1) { return check(); }
        else { 
          var img = docker.getImage(elements.Image)
          , jsonData = require(path.join(__dirname, '../manifests/', splittedName[1] + '.json'));

          img.inspect(function (err, data) {
            if (err) { throw err; }
            else {
              if (elements.State === 'running') { 
                container['status'] = true;
                container['address'] = 'http://127.0.0.1:' + elements.Ports[0].PublicPort;
                container['target'] = 'ezmaster';
              }
              else if (elements.State === 'exited') {
                container['status'] = false;
                container['address'] = '';
                container['target'] = '';
              }

              elements.Image = data.RepoTags[0];
              elements.Names[0] = splittedName[1];
              elements.Created = moment.unix(elements.Created).format("YYYY/MM/DD");
                    
              container['title'] = jsonData.title;
              container['description'] = elements;

              arrayObject.push(container);

              check();
            }
          });
        }
      }) ();
    });
  });

  router.route('/-/v1/instances/:containerId').put(bodyParser(), function (req, res, next) {
    var container = docker.getContainer(req.params.containerId);

    container.inspect(function (err, data) {
      if (err) { throw err; }
      else if (req.body.action == 'start' && data.State.Running == false) {
        container.start(function (err, datas, container) {
          if (err) { throw (err); }
          else { res.send(200); }
        });
      }
      else if (req.body.action == 'stop' && data.State.Running == true) {
        container.stop(function (err, datas, container) {
          if (err) { throw (err); }
          else { res.send(200); console.info('STOP') }
        });
      };
    });
  });

  router.route('/-/v1/instances/:containerId').get(function (req, res, next) {
    var container = docker.getContainer(req.params.containerId);

    container.inspect(function (err, data) {
      if (err) { throw err; }
      else {
        var splittedName = data.Name.split('/')
          , directoryDatas = path.join(__dirname, '../instances/', splittedName[1], '/data/')
          , configDatas = require(path.join(__dirname, '../instances/', splittedName[1], '/config/data.json'))
          , result = {};

        getSize(directoryDatas, function (err, size) {
          if (err) { throw err; }
          else {
            result['title'] = configDatas.title
            result['size'] = filesize(size);
            res.send(result);
          }
        });
      }
    });
  });

  router.route('/-/v1/instances/:containerId').delete(function (req, res, next) {
    var container = docker.getContainer(req.params.containerId);

    container.inspect(function (err, data) {
      if (err) { throw err; }
      else if (data.State.Running == true) {
        container.stop(function (err, datas, cont) {
          if (err) { throw (err); }
          else {
            container.remove(function (err, datas, cont) {
              if (err) { throw (err); }
              else { res.send(200) }
            });
          }
        });
      }
      else if (data.State.Running == false) {
        container.remove(function (err, datas, cont) {
          if (err) { throw (err); }
          else { res.send(200); }
        });
      }
    });
  });

  router.route('/-/v1/instances').post(function (req, res, next) {
    docker.pull('inistcnrs/ezvis:latest', function (err, stream) {
      if(err) { throw err; }

      docker.modem.followProgress(stream, onFinished, onProgress);

      function onFinished(err, output) {
        if(err) { throw err; }
        else {
          var cmd = 'docker run -d -p 3001:3000 -e http_proxy -e https_proxy --net=ezmaster_default --link ezmaster_db:ezvis_db -v '+process.env.EZMASTER_PATH+'/instances/inistcnrs-ezvis/config/data.json:/root/data.json -v '+process.env.EZMASTER_PATH+'/instances/inistcnrs-ezvis/data/:/root/data/ --name inistcnrs-ezvis inistcnrs/ezvis:latest';

          var child = exec(cmd, function (err, stdout, stderr) {
            if(err) { throw err; }
            else { res.send(200); }
          });
        }
      }

      function onProgress(event) {
        console.info(event);
      }
    });
  });

}