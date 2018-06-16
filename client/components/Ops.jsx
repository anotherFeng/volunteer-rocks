import React from 'react';
import {
  Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Button, Container,
  Row, Col
} from 'reactstrap';

import Comment from './Comment.jsx';
import Map from './Map.jsx';

const Ops = function (props) {
  return (
    <Card>
      <CardBody>
        <Row>
          <Col xs="6">
            <CardTitle>{props.opportunity.title}</CardTitle>
            <CardSubtitle>{props.opportunity.cause}</CardSubtitle>
            <CardText>{props.opportunity.description}</CardText>
            <CardText>{props.opportunity.formatted_address}</CardText>
          </Col>
          <Col xs="6">
            <Map op={props.opportunity} />
            {/* <CardImg top width="100%" src="https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=318&h=180" alt="Card image cap" /> */}
          </Col>
        </Row>
        <Row>
          <Col xs="2">
            <Button outline color="primary" onClick={() => props.volunteerForOpp(props.opportunity)}>Volunteer</Button>
          </Col>
          <Col xs="10">
            <Comment isLoggedIn={props.isLoggedIn} user={props.user}/>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default Ops;