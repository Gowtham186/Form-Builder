import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './Home';
import FormComponent from './FormComponent';

function App() {
  return (
    <div className="App">
     

      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/form/create' element={<FormComponent mode="create"/>}/>
        <Route path='/form/edit/:id' element={<FormComponent mode="edit"/>}/>
        <Route path='/form/:id' element={<FormComponent mode="view"/>}/>
      </Routes>
    </div>
  );
}

export default App;
