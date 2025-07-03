import { SettingsInitializer } from './components/SettingsInitializer';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Settings from './pages/Settings';
import Header from './components/Header';

export default function App() {

  return (
    <BrowserRouter>
      <SettingsInitializer />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}
