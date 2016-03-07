// Filename: main.js  
// Timestamp: 2016.03.05-21:15:04 (last modified)
// Author(s):

// https://gist.github.com/staltz/868e7e9bc2a7b8c1f754

import rx1 from './rx1';
import rx2 from './rx2_refresh_button';
import rx3 from './rx3_modelling_3_suggestions';
import rx4 from './rx4_callback_translate';
import rx from 'rxjs/Rx';

window.rx = rx;

rx1.go();
rx2.go();
rx3.go();
rx4.go();

