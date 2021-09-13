import React, { ChangeEvent } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Col, Container, Form, FormControl, InputGroup, Navbar, Row, Table, Button, Modal } from 'react-bootstrap';
import { IDevice } from './constants/device';

type State = {
  devices?: IDevice[],
  filteredDevices?: IDevice[],
  activeFilters?: {
    filterName: string,
    filterValue: string,
  }[] | [],
  selectedDevice?: IDevice,
}

class App extends React.Component<any, State> {

  constructor(props: any) {
    super(props);
    this.state = {
      devices: [],
      filteredDevices: [],
      activeFilters: [],
      selectedDevice: undefined
    };
  }

  componentDidMount() {
    fetch('http://localhost:3000/devices').then(response => response.json())
      .then(devicesResponse => this.setState({ devices: devicesResponse, filteredDevices: devicesResponse }));
  }

  filterByLocation = (location: ChangeEvent<any>) => {
    const value = location.target.value === '' ? -1 : +location.target.value;
    this.setFilter('location', value)!.then(
      () => this.filterDevices()
    )
  }

  filterByParentLocation = (parentLocation: ChangeEvent<any>) => {
    const value = parentLocation.target.value === '' ? -1 : +parentLocation.target.value;
    this.setFilter('parent_location', value)!.then(
      () => this.filterDevices()
    )
  }

  toggleConnected = (toggleConnected: ChangeEvent<any>) => {
    this.setFilter('connected', toggleConnected.target.checked)!.then(
      () => this.filterDevices()
    )
  }

  setFilter = (filterName: string, filterValue: any) => {
    const prevActiveFilters = this.state.activeFilters;
    const filterIndex = prevActiveFilters!.findIndex(prevFilter => prevFilter.filterName === filterName);
    if (filterIndex === -1)
      return this.promiseSetState(
        {
          activeFilters: [
            ...this.state.activeFilters!,
            {
              filterName,
              filterValue,
            }
          ]
        }
      );
    else {
      const updatedFilters = prevActiveFilters!;
      updatedFilters[filterIndex] = {
        filterName,
        filterValue
      };
      return this.promiseSetState({ activeFilters: updatedFilters });
    }
  }

  promiseSetState = (newState: State) => {
    return new Promise((resolve) =>
      this.setState(
        newState,
        () => resolve(this.state)
      )
    );
  }

  filterDevices = () => {
    const notEmptyFilters = this.state.activeFilters?.filter(activeFilter => (typeof activeFilter.filterValue === 'number' && activeFilter.filterValue != -1) || typeof activeFilter.filterValue === 'boolean' && !!activeFilter.filterValue);
    let filteredDevices = this.state.devices;
    notEmptyFilters?.map(notEmptyFilter => {
      filteredDevices = filteredDevices!.filter((device: { [key: string]: any }) => device[notEmptyFilter.filterName] === notEmptyFilter.filterValue);
    })
    this.setState({ filteredDevices })
  }

  setSelectedDevice = (device: IDevice) => {
    this.setState({ selectedDevice: device })
  }

  getKeyValue = (key: string) => (obj: Record<string, any>) => obj[key];

  render() {
    return (
      <>
        <Navbar bg="dark" variant="dark">
          <Container>
            <Navbar.Brand>Cima Tech Test</Navbar.Brand>
          </Container>
        </Navbar>
        <br />
        <Container fluid>
          <Row>
            <Col className="text-center"><h1>Devices Information</h1></Col>
          </Row>
          <br />
          <Row>
            <Col md="auto" lg="3">
              <h2>Filter</h2>
              <InputGroup className="mb-3">
                <InputGroup.Text id="inputGroup-location">Location</InputGroup.Text>
                <FormControl aria-label="Small" aria-describedby="inputGroup-location" onChange={this.filterByLocation} />
              </InputGroup>
              <InputGroup className="mb-3">
                <InputGroup.Text id="inputGroup-parent-location">Parent location</InputGroup.Text>
                <FormControl aria-label="Small" aria-describedby="inputGroup-parent-location" onChange={this.filterByParentLocation} />
              </InputGroup>
              <Form.Check
                type="checkbox"
                id="show-active"
                label="Show only connected devices"
                onChange={this.toggleConnected}
              />
            </Col>
            <Col>
              <Table striped bordered hover variant="dark">
                <thead>
                  <tr>
                    <th>Connection Status</th>
                    <th>Location Name</th>
                    <th>Updated at</th>
                    <th>Select</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.filteredDevices!.map((device) => (
                    <tr key={device.id}>
                      <td>{device.connected ? 'connected' : 'disconnected'}</td>
                      <td>{device.location}</td>
                      <td>{(new Date(device.updated_at)).toDateString()}</td>
                      <td>
                        <Button variant="primary" onClick={() => { this.setSelectedDevice(device) }}>View details</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Container>
        <Modal show={this.state.selectedDevice != undefined}>
          <Modal.Header closeButton onClick={() => { this.setState({ selectedDevice: undefined }) }}>
            <Modal.Title>Device information</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.state.selectedDevice != undefined && deviceInfo({ device: this.state.selectedDevice! })}
            <br />
            <h4>Related devices</h4>
            {this.state.selectedDevice != undefined
              &&
              this.state.devices?.filter(device => device.location === this.state.selectedDevice?.location && device.id != this.state.selectedDevice.id).map(relatedDevice => (
                <>
                  {deviceInfo({ device: relatedDevice })}
                  <br />
                </>
              ))
            }
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

export default App;


const deviceInfo = ({ device }: { device: IDevice }) => (
  <div className="device-info">
    <b>Id: </b> {device.id}
    <br />
    <b>Location: </b> {device.location}
    <br />
    <b>Mac address: </b> {device.mac_address}
    <br />
    <b>Parent location: </b> {device.parent_location}
    <br />
    <b>Updated at: </b> {device.updated_at}
    <br />
    <b>Signal: </b> <b className={device.connected ? 'text-success' : 'text-danger'}>{`${device.signal} ${device.connected ? '(connected)' : 'disconnected'}`}</b>
  </div>
)
