import { Route, Routes } from 'react-router-dom';
import './App.css';
import { StepMasterData } from './page/input';
import RenderSchedule from './page/result';

function App() {
  return (
    <Routes>
      <Route path="/" element={<StepMasterData />} />
      <Route path="/result" element={<RenderSchedule />} />
    </Routes>
  );
}

export default App;
