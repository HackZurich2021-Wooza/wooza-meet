import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import './App.css';
import Meet from './wooza/meet/Meet';
import Game from './wooza/game/Game';
import Setup from './wooza/setup/Setup';

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/game">
            <Game />
          </Route>
          <Route path="/setup">
            <Setup />
          </Route>
          <Route path="/">
            <Meet />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
