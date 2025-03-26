import { EmployeeProvider } from './context/EmployeeContext';
import EmployeeList from './components/EmployeeList';

function App() {
  return (
    <EmployeeProvider>
      <div className="app">
        <h1>Employee Management</h1>
        <EmployeeList />
      </div>
    </EmployeeProvider>
  );
}

export default App;