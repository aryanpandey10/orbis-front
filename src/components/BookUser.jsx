import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";

const BookUser = () => {
  const location = useLocation();
  const { selectedRoomData } = location.state || {};

  const [guestCount, setGuestCount] = useState(0);
  const [guests, setGuests] = useState([]);

  const addGuest = () => {
    setGuestCount(guestCount + 1);
    setGuests([
      ...guests,
      {
        id: guestCount + 1,
        type: "Adult",
        title: "Mr",
        firstName: "Test",
        lastName: "Test",
        age: 30,
      },
    ]);
  };

  const removeGuest = (id) => {
    setGuests(guests.filter((guest) => guest.id !== id));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted:", guests); // Example: Logging guests data
  };

  return (
    <Container style={{ marginTop: "20px" }}>
      <Row className="g-3">
        <Col md={12}>
          <Card>
            <Card.Header>
              <h3 className="property-name">
                {selectedRoomData?.PropertyName || "Hotel Villa Franca"}
              </h3>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={4}>
                  <div className="room-type">
                    <label>Room Type:</label>
                    <h6>{selectedRoomData?.RoomType || "Economy"}</h6>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="available">
                    <label>Number of Rooms:</label>
                    <h6>c</h6>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="meal-basis">
                    <label>Board Basis:</label>
                    <h6>{selectedRoomData?.MealBasis || "BB"}</h6>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col lg={4}>
                  <Card>
                    <Card.Header>Cancellation</Card.Header>
                    <Card.Body>
                      <ul>
                        <li>Date: 20/06/2024 Amount: 299</li>
                        <li>Date: 20/06/2024 Amount: 299</li>
                        <li>Date: 20/06/2024 Amount: 299</li>
                      </ul>
                    </Card.Body>
                  </Card>
                </Col>
                <Col lg={4}>
                  <Card>
                    <Card.Header>Payment</Card.Header>
                    <Card.Body>
                      <h5 className="card-title">Total Amount: 2999</h5>
                      <h6 className="card-text">Due Amount: 299</h6>
                    </Card.Body>
                  </Card>
                </Col>
                <Col lg={4}>
                  <Card>
                    <Card.Header>Errata</Card.Header>
                    <Card.Body>
                      <ol>
                        <li>Lorem ipsum dolor sit amet.</li>
                        <li>Lorem ipsum dolor sit amet.</li>
                        <li>Lorem ipsum dolor sit amet.</li>
                        <li>Lorem ipsum dolor sit amet.</li>
                      </ol>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Container className="mt-5">
        <Card>
          <Card.Header>Lead Guest Information</Card.Header>
          <Card.Body>
            <Form id="guest-form" onSubmit={handleSubmit}>
              <h5>Lead Guest</h5>
              <Form.Row>
                <Form.Group as={Col} md="2">
                  <Form.Label>Title</Form.Label>
                  <Form.Control as="select" defaultValue="Mr">
                    <option value="Mr">Mr</option>
                    <option value="Miss">Miss</option>
                    <option value="Ms">Ms</option>
                    <option value="Master">Master</option>
                    <option value="Dr">Dr</option>
                    <option value="Mrs">Mrs</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group as={Col} md="5">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control type="text" defaultValue="Test" />
                </Form.Group>
                <Form.Group as={Col} md="5">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control type="text" defaultValue="Test" />
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col} md="4">
                  <Form.Label>Date of Birth</Form.Label>
                  <Form.Control type="date" defaultValue="1900-01-01" />
                </Form.Group>
                <Form.Group as={Col} md="8">
                  <Form.Label>Address 1</Form.Label>
                  <Form.Control type="text" defaultValue="5 Test Road" />
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col} md="4">
                  <Form.Label>Address 2</Form.Label>
                  <Form.Control type="text" />
                </Form.Group>
                <Form.Group as={Col} md="4">
                  <Form.Label>Town/City</Form.Label>
                  <Form.Control type="text" defaultValue="Test Town" />
                </Form.Group>
                <Form.Group as={Col} md="4">
                  <Form.Label>County</Form.Label>
                  <Form.Control type="text" defaultValue="Test County" />
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col} md="4">
                  <Form.Label>Postcode</Form.Label>
                  <Form.Control type="text" defaultValue="TST 123" />
                </Form.Group>
                <Form.Group as={Col} md="4">
                  <Form.Label>Booking Country ID</Form.Label>
                  <Form.Control type="number" defaultValue="2" />
                </Form.Group>
                <Form.Group as={Col} md="4">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control type="text" defaultValue="0123456789" />
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col} md="6">
                  <Form.Label>Mobile</Form.Label>
                  <Form.Control type="text" defaultValue="0123456789" />
                </Form.Group>
                <Form.Group as={Col} md="6">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" defaultValue="test@test.com" />
                </Form.Group>
              </Form.Row>
              <hr />
              <h5>Guest Details</h5>
              {guests.map((guest) => (
                <div
                  key={guest.id}
                  className="guest-detail"
                  id={`guest-${guest.id}`}
                >
                  <Form.Row>
                    <Form.Group as={Col} md="2">
                      <Form.Label>Guest ID</Form.Label>
                      <Form.Control type="text" value={guest.id} readOnly />
                    </Form.Group>
                    <Form.Group as={Col} md="2">
                      <Form.Label>Type</Form.Label>
                      <Form.Control as="select" value={guest.type}>
                        <option value="Adult">Adult</option>
                        <option value="Child">Child</option>
                        <option value="Infant">Infant</option>
                      </Form.Control>
                    </Form.Group>
                    <Form.Group as={Col} md="2">
                      <Form.Label>Title</Form.Label>
                      <Form.Control as="select" value={guest.title}>
                        <option value="Mr">Mr</option>
                        <option value="Miss">Miss</option>
                        <option value="Ms">Ms</option>
                        <option value="Master">Master</option>
                        <option value="Dr">Dr</option>
                        <option value="Mrs">Mrs</option>
                      </Form.Control>
                    </Form.Group>
                    <Form.Group as={Col} md="3">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control type="text" value={guest.firstName} />
                    </Form.Group>
                    <Form.Group as={Col} md="3">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control type="text" value={guest.lastName} />
                    </Form.Group>
                  </Form.Row>
                  <Form.Row>
                    <Form.Group as={Col} md="2">
                      <Form.Label>Age</Form.Label>
                      <Form.Control type="number" value={guest.age} />
                    </Form.Group>
                    <Form.Group as={Col} md="2">
                      <Button
                        type="button"
                        variant="danger"
                        className="mt-4"
                        onClick={() => removeGuest(guest.id)}
                      >
                        Remove Guest
                      </Button>
                    </Form.Group>
                  </Form.Row>
                  <hr />
                </div>
              ))}
              <Button
                type="button"
                className="btn btn-primary mt-3"
                onClick={addGuest}
              >
                Add Guest
              </Button>
              <Button type="submit" className="btn btn-success mt-3 ms-3">
                Submit
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </Container>
  );
};

export default BookUser;
