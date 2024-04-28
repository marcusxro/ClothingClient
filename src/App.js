import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Signin from './pages/Signin';
import Register from './pages/Register';
import Menu from './pages/Menu';
import Inventory from './pages/Inventory';
import Report from './pages/Report';
import FileMain from './pages/FileMain';
import ForgotPass from './pages/ForgotPass';
import Alert from './pages/Alert';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path='/' element={<Signin />} />
          <Route path='/register' element={<Register />} />
          <Route path='/recover' element={<ForgotPass />} />
          <Route path='/menu' element={<Menu />} />
          <Route path='/inventory' element={<Inventory />} />
          <Route path='/report' element={<Report />} />
          <Route path='/file-maintenance' element={<FileMain />} />
          <Route path='/alert' element={<Alert />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
