import React, {useMemo} from 'react';
import {DependencyTable} from 'DependencyTable';
import {QueryTypeButtonGroup} from 'QueryTypeButtonGroup';
import './App.css';

function App() {
  const [dependencyData, setDependencyData] = React.useState([]);
  const [devDependencyData, setDevDependencyData] = React.useState([]);
  const [dependencyType, setDependencyType] = React.useState('devDependencies');
  
  const setDependencies = ({dependencies = [], devDependencies = []}) => {
    setDependencyData(dependencies);
    setDevDependencyData(devDependencies);
  }
  return (
    <div>
      <header className="App-header">
        <h4>Dependency Checker</h4>
      </header>
      <div className='App-components'>
        <QueryTypeButtonGroup dependencyData={dependencyData} devDependencyData={devDependencyData} setDependencies={setDependencies} setDependencyType={setDependencyType}/>
        <DependencyTable dependencyData={dependencyData} devDependencyData={devDependencyData} dependencyType={dependencyType}/>
      </div>
    </div>
  );
}

export default App;
