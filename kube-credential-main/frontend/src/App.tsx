import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { IssuePage } from './pages/IssuePage';
import { VerifyPage } from './pages/VerifyPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/issue" replace />} />
          <Route path="/issue" element={<IssuePage />} />
          <Route path="/verify" element={<VerifyPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
