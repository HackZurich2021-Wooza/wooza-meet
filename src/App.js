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
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">Meet</Link>
              </li>
              <li>
                <Link to="/game">Game</Link>
              </li>
              <li>
                <Link to="/setup">Setup</Link>
              </li>
            </ul>
          </nav>

          {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
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
        </div>
      </Router>
    </div>
  );
}

export default App;
