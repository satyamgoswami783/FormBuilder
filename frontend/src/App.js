import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import FormEditor from './components/FormEditor';
import FormList from './components/FormList';
import FormPreview from './components/FormPreview';
import FormFill from './components/FormFill';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/edit/:id?" component={FormEditor} />
        <Route path="/preview/:id" component={FormPreview} />
        <Route path="/fill/:formId" component={FormFill} />
        <Route path="/" component={FormList} />
      </Switch>
    </Router>
  );
}

export default App;