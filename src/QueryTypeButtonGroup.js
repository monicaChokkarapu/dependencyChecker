import React from 'react'
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {get} from 'api';

const queryTypes = {
    URL: 'url',
    ID_RANGE: 'idRange',
};


const getDependencies = (value, callback) => {
    get({repoLocation: value, location: 'git', callback: (rsp) => {
      let processedDependencies = [];
      let processedDevDependencies = [];
      let dependencies = rsp.data.dependencies;
      let devDependencies = rsp && rsp.data.devDependencies;
  
      for (const key in devDependencies) {
        if (devDependencies[key]) {
          const element = devDependencies[key];
          processedDevDependencies.push({
            id: key,
            packageName: key,
            current: element,
          })
        }
      }

      for (const key in dependencies) {
        if (dependencies[key]) {
          const element = dependencies[key];
          processedDependencies.push({
            id: key,
            packageName: key,
            current: element,
          })
        }
      }
      callback({dependencies: processedDependencies, devDependencies: processedDevDependencies});
    }});
  };

function QueryTypeButtonGroup(props) {
    const defaultUrl = 'facebook/react';
    const [queryType, setQueryType] = React.useState('url');
    const [urlValue, setUrlValue] = React.useState(defaultUrl);
    const [idValue, setIdValue] = React.useState('');
    const [dependencyType, setDependencyType] = React.useState('devDependencies');
    const {dependencyData, devDependencyData} = props;
    const handleAlignment = (event, newAlignment) => {
        setQueryType(newAlignment);
    };

    const getData = () => {
        queryType === queryTypes.URL ? getDependencies(urlValue, props.setDependencies) : getDependencies(idValue, props.setDependencies);
    }

    const setDependency = (value) => {
        setDependencyType(value);
        props.setDependencyType(value);
    }
    return ( 
    <div className='query-fields'>
        <FormControlLabel
        value="url"
        control={<ToggleButtonGroup
                value={queryType}
                exclusive
                onChange={handleAlignment}
                className='query-field'
                aria-label="text alignment"
                size='small'>
                <ToggleButton value="url" aria-label="left aligned">
                    <text>URL</text>
                </ToggleButton>
                <ToggleButton value="idRange" aria-label="centered">
                    <text>ID Range</text>
                </ToggleButton>
            </ToggleButtonGroup>}
        label="Query Type:"
        labelPlacement="Start"/>
        <FormControlLabel
            value="devDependencies"
            control={<ToggleButtonGroup
                    value={dependencyType}
                    exclusive
                    onChange={(evt, value) => setDependency(value)}
                    className='query-field'
                    aria-label="text alignment"
                    size='small'>
                    <ToggleButton value="devDependencies" aria-label="left aligned">
                        <text>Dev Dependencies</text>
                    </ToggleButton>
                    <ToggleButton value="dependencies" aria-label="centered">
                        <text>Dependencies</text>
                    </ToggleButton>
                </ToggleButtonGroup>}
            label="Query Type:"
            labelPlacement="Start"
        />
        <div className='query-fields'>
            {queryType === queryTypes.ID_RANGE && <Autocomplete
                id="combo-box-demo"
                className='query-field'
                options={dependencyData.concat(devDependencyData)}
                getOptionLabel={(option) => option.title}
                style={{ width: 300 }}
                onChange={(value) => setIdValue(value)}
                renderInput={(params) => <TextField {...params} label="Combo box" variant="outlined" />}
            />}
            {queryType === queryTypes.URL && <TextField
                id="filled-helperText"
                label="URL"
                className='query-field'
                defaultValue={defaultUrl}
                helperText="Eg: {org}/{repo}"
                variant="filled"
                onChange={(evt) => {
                    setUrlValue(evt.target.value);
                }}
            />}
            <Button variant="contained" color="primary" className='query-field' onClick={() => getData()}>
                Submit
            </Button>
        </div>
        
    </div>
    )
}

export {QueryTypeButtonGroup};