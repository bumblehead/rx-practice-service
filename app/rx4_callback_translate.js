// Filename: rx4_callback_translate.js  
// Timestamp: 2016.03.06-01:10:37 (last modified)
// Author(s): bumblehead <chris@bumblehead.com>  

import rx from 'rxjs/Rx';

const single_callback = () => {
  const doasync = (val, fn) => fn(null, val),
        doasyncO = rx.Observable.bindNodeCallback(doasync),
        source$ = doasyncO('file1.txt');
  
  source$.subscribe(function (val) {
    console.log('single_callback?', val === 'file1.txt');
  });
};

const sequential_callback = () => {
  const asyncop1 = (a, fn) => fn(null, a + '>'),
        asyncop2 = (a, fn) => fn(null, '<' + a),
        datalist = ['data1','data2','data3','data4'];

  function callbackstyle (datalist, fn) {
    const seedthing = 'seed';
    
    (function next (datalist, length, seedthing) {
      if (!length--) return fn(null, seedthing);

      let data = datalist[length];
      
      asyncop1(data, function (err, data1) {
        if (err) return fn(err);

        asyncop2(data1, function (err, data2) {
          if (err) return fn(err);

          next(datalist, length, seedthing + data2);
        });
      });
    }(datalist, datalist.length, seedthing));
  };

  callbackstyle(datalist, function (err, res) {
    console.log(res); // seed<data4><data3><data2><data1>
  });
};

// https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/reduce.md
const sequential_observable = () => {
  const asyncop1 = (a, fn) => fn(null, a + '>'),
        asyncop2 = (a, fn) => fn(null, '<' + a),
        datalist = ['data1','data2','data3','data4'];

  function observerstyle () {
    var asyncop1ob = rx.Observable.bindNodeCallback(asyncop1);
    var asyncop2ob = rx.Observable.bindNodeCallback(asyncop2);

    // not in rx5
    rx.Observable.from(datalist).concatMapObserver(function (x, i) {
      return asyncop1ob(datalist[0])
      .flatMap(function (res) {
        return asyncop2ob(res);
      }).subscribe(function (result){
        console.log(result); // <data1>
      });
    }).subscribe(function (concres) {
      console.log('concatmap', concres);
    });
    /*
    rx.Observable.from(datalist).reduce(function (acc, x, idx, source) {
      return acc += x;
    }, 'seed').subscribe(function (acc) {
      console.log(acc); // seeddata1data2data3data4
    });
    
    asyncop1ob(datalist[0])
      .flatMap(function (res) {
        return asyncop2ob(res);
      }).subscribe(function (result){
        console.log(result); // <data1>
      });
     */

    // concatMapObserver
    // flatMapObserver
    //
    // https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/concatmapobserver.md
    // https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/flatmapobserver.md
  }

  observerstyle(datalist, function (err, res) {

  });
};


export default {
  go : () => {
    //single_callback();
    //sequential_callback();
    sequential_observable();    
    
    //do_subscribe();
    //do_response();
    //do_flatmap();
  }
};
