import * as React from 'react';
import styles from './Dashboard.module.scss';
import { IDashboardProps } from './IDashboardProps';
import { escape, times } from '@microsoft/sp-lodash-subset';
import { ChartControl, ChartType } from '@pnp/spfx-controls-react/lib/ChartControl';
import { ListView, IViewField, SelectionMode, GroupOrder, IGrouping } from "@pnp/spfx-controls-react/lib/ListView";
import commonService from '../../ServiceLayer/commonService';
import { CommandBarButton, IContextualMenuProps, IIconProps, Stack, IStackStyles, BaseButton, Button } from 'office-ui-fabric-react';
// set the data
const data: Chart.ChartData = {
  labels:
    [
      'Choice 1', 'Choice 2', 'Choice 3'
    ],
  datasets: [
    {
      label: 'My First Dataset',
      data:
        [
          10, 50, 20
        ]
    }
  ]
};

// set the options
const options: Chart.ChartOptions = {
  legend: {
    display: true,
    position: "left"
  },
  title: {
    display: true,
    text: "My First Pie"
  }
};

const viewFields: IViewField[] = [{ name: "Title", displayName: "vendorName", maxWidth: 100, isResizable: true, sorting: true },
{ name: "VendorLocation", displayName: "VendorLocation", maxWidth: 100, isResizable: true, sorting: true }, { name: "VendorCategory", displayName: "VendorCategory", maxWidth: 100, isResizable: true, sorting: true }];

interface IDashboardState {
  items: any;
  selectedItem: any;
}

export default class Dashboard extends React.Component<IDashboardProps, IDashboardState> {
  public commonService: any;
  constructor(props: IDashboardProps, state: IDashboardState) {
    super(props);
    this.commonService = new commonService();
    this.state = {
      items: null,
      selectedItem: null
    };
    this.commonService.getAllData('VendorList').then((val) => {
      this.setState({
        items: val
      });
    }).catch((error) => {

    });
  }

  private _getSelection = (items: any[]) => {
    this.setState({
      selectedItem: items
    });
  }

  private _openPage = (event: any) => {
    if (this.state.selectedItem) {
      if (this.state.selectedItem.length > 0) {
        window.location.href = `/sites/ModernTeam/sitePages/AddEditVendor.aspx?VendorId=${this.state.selectedItem[0].Id}`;
      } else {
        window.location.href = `/sites/ModernTeam/sitePages/AddEditVendor.aspx`;
      }
    } else {
      window.location.href = `/sites/ModernTeam/sitePages/AddEditVendor.aspx`;
    }
  }

  public render(): React.ReactElement<IDashboardProps> {
    return (
      <div className={styles.dashboard}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.column}>
              <ChartControl
                type={ChartType.Pie}
                data={data}
                options={options}
              />
            </div>
            <div className={styles.column4}>

            </div>
          </div>
          <div className={styles.row}>
            <CommandBarButton
              iconProps={{ iconName: 'Add' }}
              text="New item"
              style={{ height: 45, marginRight: 10 }}
              onClick={this._openPage}
            />
            <CommandBarButton
              iconProps={{ iconName: 'Edit' }}
              text="Edit item"
              style={{ height: 45 }}
              onClick={this._openPage}
            />
            <ListView
              items={this.state.items}
              viewFields={viewFields}
              iconFieldName="ServerRelativeUrl"
              compact={true}
              selectionMode={SelectionMode.single}
              selection={this._getSelection}
              showFilter={true}
              filterPlaceHolder="Search..." />
          </div>
        </div>
      </div>
    );
  }
}
