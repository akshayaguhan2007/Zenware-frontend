import logo from './logo.svg';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import Approutes from './Routers/Approutes';

function App() {
  return (
    <BrowserRouter>
      <Approutes />
    </BrowserRouter>
  );
}

export default App;
