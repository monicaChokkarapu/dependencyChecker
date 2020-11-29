import React, {useMemo} from 'react';
import {DependencyTable} from 'DependencyTable';
import {QueryFields} from 'QueryFields';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import './App.css';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

function App() {
  const [dependencyData, setDependencyData] = React.useState([]);
  const [devDependencyData, setDevDependencyData] = React.useState([]);
  const [dependencyType, setDependencyType] = React.useState('devDependencies');
  const [showError, setShowError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const classes = useStyles();
  const setDependencies = ({dependencies = [], devDependencies = [], isError = false}) => {
    if (isError) {
      setShowError(true);
      setIsLoading(false);
      return;
    }
    setDependencyData(dependencies);
    setDevDependencyData(devDependencies);
  }

  return (
    <div>
      <header className="App-header">
        <h4>Dependency Checker</h4>
      </header>
      <div className='App-components'>
        <QueryFields dependencyData={dependencyData} devDependencyData={devDependencyData} setDependencies={setDependencies} setDependencyType={setDependencyType} setIsLoading={setIsLoading}/>
        {showError && <Snackbar open={showError} autoHideDuration={6000} onClose={() => setShowError(false)}>
          <Alert elevation={6} variant="filled" onClose={() => setShowError(false)} severity="error">
            Repository not found.
          </Alert>
      </Snackbar>}
      {isLoading && <Backdrop className={classes.backdrop} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>}
      <DependencyTable dependencyData={dependencyData} devDependencyData={devDependencyData} dependencyType={dependencyType} setIsLoading={setIsLoading}/>
      </div>
    </div>
  );
}

export default App;
