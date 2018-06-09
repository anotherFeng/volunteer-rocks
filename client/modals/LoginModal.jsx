import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, NavLink, Input } from 'reactstrap';
import { GoogleLogin } from 'react-google-login';

class LoginModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  responseGoogle(response) {
    console.log(response);
  }


  render() {
    return (
      <React.Fragment>
        <NavLink onClick={this.toggle}>Login</NavLink>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>Login Into Your Account</ModalHeader>
          <ModalBody>
            <Input placeholder="User Name"/>
            <Input placeholder="Password"/>
            <Button color="primary" onClick={() => this.toggle}>Sign In</Button>{' '}

            <Button color="sucess" onClick={() => this.toggle}><a href="/auth/google">Login with Google+</a></Button>{' '}

            <GoogleLogin
              clientId="252132713642-hqchnamqrf05053vtkgd6i5fqftq529g.apps.googleusercontent.com"
              buttonText="Login"
              onSuccess={this.responseGoogle}
              onFailure={this.responseGoogle}
             />

          </ModalBody>
        </Modal>
      </React.Fragment>
    );
  }
}

export default LoginModal;