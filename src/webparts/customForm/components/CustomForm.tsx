import * as React from 'react';
import styles from './CustomForm.module.scss';
import { ICustomFormProps } from './ICustomFormProps';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { escape } from '@microsoft/sp-lodash-subset';
import { Dropdown, DropdownMenuItemType, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { DefaultButton, PrimaryButton, Stack, IStackTokens } from 'office-ui-fabric-react';
import { UrlQueryParameterCollection } from '@microsoft/sp-core-library';
import commonService from "../../ServiceLayer/commonService";
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { getId } from 'office-ui-fabric-react/lib/Utilities';

export interface ICustomFormState {
  vendorName: string;
  vendorLocation: string;
  selectedCategory?: { key: string | number | undefined };
  vendorID: string;
  hideDialog: boolean;
}

export default class CustomForm extends React.Component<ICustomFormProps, ICustomFormState> {
  public commonService: any;
  constructor(props: ICustomFormProps) {
    super(props);
    this.commonService = new commonService();
    let queryParameters = new UrlQueryParameterCollection(window.location.href);
    let id: string = queryParameters.getValue("VendorId");
    if (!id) {
      id = "-1";
    } else {
      this._fetchData(id);
    }
    console.log(id);
    this.state = {
      vendorName: null,
      vendorLocation: null,
      selectedCategory: undefined,
      vendorID: id,
      hideDialog: true,
    };
  }

  private _onChangevendorName = (ev: React.FormEvent<HTMLInputElement>, newValue?: string) => {
    this.setState({ vendorName: newValue || '' });
  }

  private _onChangevendorLocation = (ev: React.FormEvent<HTMLInputElement>, newValue?: string) => {
    this.setState({ vendorLocation: newValue || '' });
  }

  private _onChangeCategory = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
    this.setState({ selectedCategory: item });
  }

  public _Save = () => {
    this.commonService.addData("VendorList",
      {
        Title: this.state.vendorName,
        VendorLocation: this.state.vendorLocation,
        VendorCategory: this.state.selectedCategory.key
      }).then((val) => {
        console.log(val);
        this.setState({
          hideDialog: false
        });
      }).catch((error) => {
        console.log(error);
      });
  }

  public _Edit = () => {
    this.commonService.updateData("VendorList",
      {
        Title: this.state.vendorName,
        VendorLocation: this.state.vendorLocation,
        VendorCategory: this.state.selectedCategory.key
      }, parseInt(this.state.vendorID)).then((val) => {
        console.log(val);
      }).catch((error) => {
        console.log(error);
      });
  }

  public _Cancel = () => {
    window.location.href = `/sites/ModernTeam/sitePages/Dashboard.aspx`;
  }

  private _closeDialog = (): void => {
    this.setState({ hideDialog: true });
    window.location.href = `/sites/ModernTeam/sitePages/Dashboard.aspx`;
  }

  public _fetchData = (id: string) => {
    this.commonService.getData("VendorList", parseInt(id)).then((val) => {
      console.log(val);
      this.setState({
        vendorName: val.Title,
        vendorLocation: val.VendorLocation,
        selectedCategory: { key: val.VendorCategory }
      });
    }).catch((error) => {
      console.log(error);
    });
  }

  private _labelId: string = getId('dialogLabel');
  private _subTextId: string = getId('subTextLabel');

  public render(): React.ReactElement<ICustomFormProps> {
    return (
      <div className={styles.customForm}>
        {this.state.vendorID === "-1" ?
          <div className={styles.container}>
            <div className={styles.row}>
              <div className={styles.column}>
                <TextField
                  label="Vendor Name"
                  value={this.state.vendorName}
                  onChange={this._onChangevendorName}
                  styles={{ fieldGroup: { width: 300 } }}
                />
              </div>
              <div className={styles.column}>
                <TextField
                  label="Vendor Location"
                  value={this.state.vendorLocation}
                  onChange={this._onChangevendorLocation}
                  styles={{ fieldGroup: { width: 300 } }}
                />
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.column}>
                <Dropdown
                  label="Vendor Category"
                  selectedKey={this.state.selectedCategory ? this.state.selectedCategory.key : undefined}
                  onChange={this._onChangeCategory}
                  placeholder="Select an option"
                  options={[
                    { key: 'Choice 1', text: 'Choice 1' },
                    { key: 'Choice 2', text: 'Choice 2' },
                    { key: 'Choice 3', text: 'Choice 3' }
                  ]}
                  styles={{ dropdown: { width: 300 } }}
                />
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.column}>
                <DefaultButton text="Save" onClick={this._Save} />
                <DefaultButton text="Cancel" onClick={this._Cancel} style={{ marginLeft: 10 }} />
              </div>
              <div className={styles.column}>

              </div>
            </div>
          </div>
          :
          <div className={styles.container}>
            <div className={styles.row}>
              <div className={styles.column}>
                <TextField
                  label="Vendor Name"
                  value={this.state.vendorName}
                  onChange={this._onChangevendorName}
                  styles={{ fieldGroup: { width: 300 } }}
                  disabled
                />
              </div>
              <div className={styles.column}>
                <TextField
                  label="Vendor Location"
                  value={this.state.vendorLocation}
                  onChange={this._onChangevendorLocation}
                  styles={{ fieldGroup: { width: 300 } }}
                  disabled
                />
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.column}>
                <Dropdown
                  label="Vendor Category"
                  selectedKey={this.state.selectedCategory ? this.state.selectedCategory.key : undefined}
                  onChange={this._onChangeCategory}
                  placeholder="Select an option"
                  options={[
                    { key: 'Choice 1', text: 'Choice 1' },
                    { key: 'Choice 2', text: 'Choice 2' },
                    { key: 'Choice 3', text: 'Choice 3' }
                  ]}
                  styles={{ dropdown: { width: 300 } }}
                />
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.column}>
                <DefaultButton text="Edit" onClick={this._Edit} />
                <DefaultButton text="Cancel" onClick={this._Cancel} style={{ marginLeft: 10 }} />
              </div>
              <div className={styles.column}>

              </div>
            </div>
          </div>
        }
        <Dialog
          hidden={this.state.hideDialog}
          onDismiss={this._closeDialog}
          dialogContentProps={{
            type: DialogType.normal,
            title: 'Vendor Saved',
            closeButtonAriaLabel: 'Close',
            subText: 'Vendor Saved Successfully'
          }}
          modalProps={{
            titleAriaId: this._labelId,
            subtitleAriaId: this._subTextId,
            isBlocking: false,
            styles: { main: { maxWidth: 450 } },
          }}
        >
          <DialogFooter>
            <DefaultButton onClick={this._closeDialog} text="Exit" />
          </DialogFooter>
        </Dialog>
      </div>
    );
  }
}
