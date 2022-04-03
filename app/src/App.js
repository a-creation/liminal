
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import BuyPage from './IssuePage';
import SellPage from './RedeemPage';

const App = () => {
  return (
    <Router>
        <Routes>
            <Route path="/buy" element={
                <BuyPage />
            } />
            <Route path="/sell" element={
                <SellPage />
            } />
            <Route path="/" element={
                <LandingPage />
            } />
        </Routes>
    </Router>
  );
}

export default App;
