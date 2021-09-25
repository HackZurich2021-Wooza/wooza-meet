import logo from './logo.svg';
import './App.css';
import Meet from './wooza/meet/Meet';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Meet />
      </header>
    </div>
  );
}

export default App;
