// Filename: rx2_refresh_button.js  
// Timestamp: 2016.03.05-20:30:55 (last modified)
// Author(s): bumblehead <chris@bumblehead.com>
//
// https://gist.github.com/staltz/868e7e9bc2a7b8c1f754
// https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/create.md

import superagent from 'superagent';
import superagentpromise from 'superagent-promise';
import rx from 'rxjs/Rx';
import h from 'virtual-dom/h';
import createElement from 'virtual-dom/create-element';

const USERS_SERVICE = '/users';

const setup = () => {
  const tree = h('button.refresh', 'button');
  const rootNode = createElement(tree);     // Create an initial root DOM node ...
  document.body.appendChild(rootNode);
};

//////////////////////////////////////////
//////////////////////////////////////////
const request_onclick = () => {
  var refreshButton = document.querySelector('.refresh');
  var refreshClickStream = rx.Observable.fromEvent(refreshButton, 'click');

  var requestStream = refreshClickStream
        .map(function() {
          console.log('clicked');
          var randomOffset = Math.floor(Math.random()*500);
          return USERS_SERVICE + '?since=' + randomOffset;
        });

  requestStream.subscribe(function (res) {
    console.log('response', res);
  });
};


//////////////////////////////////////////
//////////////////////////////////////////
const request_onclickandstart = () => {
  var refreshButton = document.querySelector('.refresh');
  var refreshClickStream = rx.Observable.fromEvent(refreshButton, 'click');
  var startupRequestStream = rx.Observable.of(USERS_SERVICE);
  
  var requestOnRefreshStream = refreshClickStream
        .map(function() {
          console.log('clicked');
          var randomOffset = Math.floor(Math.random()*500);
          return USERS_SERVICE + '?since=' + randomOffset;
        });

  var requestStream = rx.Observable.merge(
    requestOnRefreshStream,
    startupRequestStream
  );
  
  requestStream.subscribe(function (res) {
    console.log('response', res);
  });
};


//////////////////////////////////////////
//////////////////////////////////////////
const request_onclickandstart_compact = () => {
  var refreshButton = document.querySelector('.refresh');
  var refreshClickStream = rx.Observable.fromEvent(refreshButton, 'click');
  var requestStream = refreshClickStream.startWith('startup click')
        .map(function() {
          var randomOffset = Math.floor(Math.random()*500);
          return USERS_SERVICE + '?since=' + randomOffset;
        });

  requestStream.subscribe(function (res) {
    console.log('response', res);
  });
};

export default {
  go : () => {
    //request_onclick();
    //request_onclickandstart();
    //request_onclickandstart_compact();
  }
};
