// Filename: rx3_modelling_3_suggestions.js  
// Timestamp: 2016.03.05-21:05:02 (last modified)
// Author(s): bumblehead <chris@bumblehead.com>  

import superagent from 'superagent';
import superagentpromise from 'superagent-promise';
import rx from 'rxjs/Rx';
import h from 'virtual-dom/h';
import createElement from 'virtual-dom/create-element';

const USERS_SERVICE = '/users';

const setup = () => {
  const tree = h('button.refresh', 'button');
  const rootNode = createElement(tree);
  document.body.appendChild(rootNode);
};

const clicknullrefresh = () => {
  var refreshButton = document.querySelector('.refresh');
  var refreshClickStream = rx.Observable.fromEvent(refreshButton, 'click');
  
  var requestOnRefreshStream = refreshClickStream
        .map(function() {
          console.log('clicked');
          var randomOffset = Math.floor(Math.random()*500);
          return USERS_SERVICE + '?since=' + randomOffset;
        });

  var superagentp = superagentpromise(superagent, Promise);

  var responseStream = requestOnRefreshStream
        .flatMap(function(requestUrl) {
          return rx.Observable.fromPromise(superagentp.get(requestUrl).type('json'));
        }).map(xhr => JSON.parse(xhr.text));
  
  var suggestion1Stream = responseStream
        .map(function(listUsers) {
          return listUsers[Math.floor(Math.random()*listUsers.length)];
        }).merge(
          // identical stream used to null and populate
          refreshClickStream.map(function () { return null; })
        );

  suggestion1Stream.subscribe(function (res) {
    console.log('response', res);
  });  
};

export default {
  go : () => {
    setup();
    clicknullrefresh();
  }
};
