import React from 'react';
import ReactDOM from 'react-dom';
import './app.scss';

const App = () => (
    <h1>Helper Solutions Backoffice</h1>
);

if (document.getElementById('root')) {
    ReactDOM.render(<App />, document.getElementById('root'));
}