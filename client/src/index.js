import React from 'react';
import ReactDOM from 'react-dom';

import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { MainRouter } from './containers/MainRouter';

ReactDOM.render(<MainRouter />, document.getElementById('root'));
serviceWorker.unregister();