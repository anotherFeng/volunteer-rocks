import React, {Component} from 'react';
import axios from 'axios';
import {Form, Col ,FormGroup, Label, NavLink, Button,
  Modal, ModalHeader, ModalBody} from 'reactstrap';
import OrganizationsEntry from './OrganizationsEntry.jsx';

class OrganizationsJoin extends Component{
  constructor(props){
    super(props);
    this.state = {
      isOpen: false,
      selected: '',
      orgId: '',
    }
    this.toggle = this.toggle.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  handleSelect(event){
    const index = event.target.selectedIndex;
    const selectedElement = event.target.childNodes[index];
    const orgId = selectedElement.getAttribute('id');
    this.setState({
      orgId: orgId,
      selected: event.target.value
    })
  }

  render(){
    return(
      <React.Fragment>
        <NavLink href="#" onClick={this.toggle}>Join an Organization</NavLink>
        <Modal size="lg" isOpen={this.state.isOpen} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>Join an organization</ModalHeader>
          <ModalBody>
            <Form onSubmit={this.handleSubmit}>
              <FormGroup row>
                <Label for="orgs">{this.state.selected === '' ? false : `You have selected ${this.state.selected}`}</Label>
                <div className="container">
                  <div className="row">
                    {
                      this.props.orgs.map(org=>
                        <div className="col-xs-3">
                        <OrganizationsEntry joinOrganization={this.props.joinOrganization} 
                        org={org} key={org._id}/>
                        </div>
                      )
                    }
                  </div>
                </div>
              </FormGroup>
            </Form>
          </ModalBody>
        </Modal>
      </React.Fragment>
    )
  }
}

export default OrganizationsJoin;