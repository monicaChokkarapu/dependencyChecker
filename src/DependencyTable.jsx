import React, {useState, useEffect} from "react";
import { DataGrid } from '@material-ui/data-grid';
import {post, getNpmPayload} from 'api';
import {getIntVersion} from 'utils';
import _ from 'lodash';

const columns = [
  { field: 'packageName', headerName: 'Package name', width: 400 },
  { field: 'current', headerName: 'Current'},
  { field: 'latest', headerName: 'Latest'},
  { field: 'outdated', headerName: 'Outdated' },
  { field: 'vulnerable', headerName: 'Vulnerable', width: 400 },
];

function DependencyTable(props) {
  const {dependencyData = [], devDependencyData = [], dependencyType, setIsLoading} = props;
  const [pageNum, setPageNum] = useState(1);
  const rowData = dependencyType === 'dependencies' ? dependencyData : devDependencyData;
  const [stateRowData, setStateRowData] = useState(rowData);

  useEffect(() => {
    const pageSize = 10;
    const recordsRange = pageNum * pageSize;
    const pageRecords = rowData.slice(recordsRange - pageSize, recordsRange);
    if (pageRecords && pageRecords.length) {
      let pkgs = [];
      let postsArr = [];

      for (const pkg of pageRecords) {
        const pkgName = pkg.packageName;
        pkgs.push(pkgName);
        postsArr.push(post({payload: getNpmPayload(pkgName, pkg.current), pkgName: pkgName}))
      }
      postsArr.push(post({payload: pkgs, dest: 'npm'}));
      Promise.all(postsArr).then((allProms) => {
        let npmData = allProms[allProms.length - 1].data;

        for (const pkg of rowData) {
          const pkgName = pkg.packageName;
          const npmPackageData = npmData[pkgName];
          const auditData = _.find(allProms, pkgName);
          const vulnerableData = auditData && auditData[pkgName].data && auditData[pkgName].data.metadata && auditData[pkgName].data.metadata.vulnerabilities;
          if (vulnerableData && (vulnerableData.moderate || vulnerableData.high || vulnerableData.critical)) {
            pkg.vulnerable = 'Yes';
          } else {
            pkg.vulnerable = 'Not Available';
          }

          if (npmPackageData) {
            pkg.latest = npmPackageData.collected.metadata.version;
            getIntVersion(pkg.latest) > getIntVersion(pkg.current) ? pkg.outdated = 'True' : pkg.outdated = 'False';
          }
        }
      });
    } 
    setStateRowData(rowData);
    setIsLoading(false);
  }, [rowData, pageNum, stateRowData, dependencyData]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid rows={stateRowData} 
          columns={columns} 
          pageSize={10} 
          onPageChange = {(pageNumObj) => setPageNum(pageNumObj.page)}
        />
    </div>
  );
}

export { DependencyTable };
