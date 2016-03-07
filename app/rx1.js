// Filename: rx1.js  
// Timestamp: 2016.03.05-21:08:15 (last modified)
// Author(s): bumblehead <chris@bumblehead.com>  

// https://gist.github.com/staltz/868e7e9bc2a7b8c1f754
// https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/create.md

import superagent from 'superagent';
import superagentpromise from 'superagent-promise';
import rx from 'rxjs/Rx';
import styles from './rx1.css';

// github service is rate-limited
//const USERS_SERVICE = 'https://api.github.com/users';
const USERS_SERVICE = '/users';


//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
const do_subscribe = () => {
  let requestStream = rx.Observable.of(USERS_SERVICE);

  requestStream.subscribe((requestUrl) => {
    superagent
      .get(requestUrl)
      .type('json')
      .end((err, res) => {
        console.log(err, 'res');
      });
  });
};

//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
const do_response = () => {
  let requestStream = rx.Observable.of(USERS_SERVICE);
  
  requestStream.subscribe(function(requestUrl) {
    var responseStream = rx.Observable.create((observer) => {
      superagent
        .get(requestUrl)
        .type('json')
        .end(function (err, res) {
          if (err) observer.error(err);
          else observer.next(res);
          observer.complete();
        });

    });

    responseStream.subscribe(
      function(response) {
        console.log('response');
      },
      function (err) {},
      function () {});
  });
};

//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
const do_flatmap = () => {
  let requestStream = rx.Observable.of(USERS_SERVICE),
      superagentp = superagentpromise(superagent, Promise);

  // flatMap returns values emitted from emitted streams
  var responseStream = requestStream
        .flatMap(function(requestUrl) {
          return rx.Observable.fromPromise(superagentp.get(requestUrl).type('json'));
        });

  responseStream.subscribe(function(response) {
    console.log('response');
  });
};


export default {
  go : () => {
    //do_subscribe();
    do_response();
    //do_flatmap();
  }
};

