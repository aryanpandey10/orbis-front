import React, { useState } from "react";
import GuestDetail from "./GuestDetail";
import { useLocation } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { Circles } from "react-loader-spinner"; // Import the loader

const LeadGuestForm = () => {
  const location = useLocation();
  const propertyBookings = location.state?.propertyBookings || [];

  const [guestCount, setGuestCount] = useState(0);
  const [guestDetails, setGuestDetails] = useState([]);
  const [leadCustomer, setLeadCustomer] = useState({
    customerTitle: "",
    customerFirstName: "",
    customerLastName: "",
    dateOfBirth: "",
    customerAddress1: "",
    customerAddress2: "",
    customerTownCity: "",
    customerCounty: "",
    customerPostcode: "",
    customerBookingCountryID: 2,
    customerPhone: "",
    customerMobile: "",
    customerEmail: "",
    customerPassportNumber: "",
    customerRequest: "",
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", body: "" });
  const [loading, setLoading] = useState(false); // Add loading state

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setLeadCustomer({ ...leadCustomer, [id]: value });
  };

  const addGuest = () => {
    setGuestCount(guestCount + 1);
    const newGuest = {
      id: guestCount + 1,
      firstName: "",
      lastName: "",
      age: 0,
      type: "",
      title: "",
    };
    setGuestDetails([...guestDetails, newGuest]);
  };

  const updateGuestDetails = (id, field, value) => {
    setGuestDetails(
      guestDetails.map((guest) =>
        guest.id === id ? { ...guest, [field]: value } : guest
      )
    );
  };

  const removeGuest = (id) => {
    const updatedGuests = guestDetails.filter((guest) => guest.id !== id);
    setGuestDetails(updatedGuests);
  };

  const handleSubmit = async (e) => {
    console.log("Hello Orbis:", propertyBookings);
    e.preventDefault();
    setLoading(true); // Start loading

    const requestData = {
      leadCustomer,
      guestDetails,
      propertyBookings,
    };

    try {
      const response = await fetch("http://localhost:5000/api/basket-book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit guest details");
      }

      const result = await response.json();
      console.log("Response:", result);

      if (result.BasketBookResponse.ReturnStatus.Success === "true") {
        setModalContent({
          title: "Booking Confirmed",
          body: `Booking Reference: ${result.BasketBookResponse.BookingReference}`,
        });
      } else {
        setModalContent({
          title: "Booking Failed",
          body: `Exceptions: ${result.BasketBookResponse.ReturnStatus.Exceptions}`,
        });
      }
      setModalVisible(true);
    } catch (error) {
      console.error("Error submitting guest details:", error);
      setModalContent({
        title: "Error",
        body: "There was an error submitting the form. Please try again.",
      });
      setModalVisible(true);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="container mt-5">
      {loading && (
        <div
          className="loader-container"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Circles height="80" width="80" color="#4fa94d" ariaLabel="loading" />
        </div>
      )}
      {!loading && (
        <div className="card">
          <div className="card-header">Lead Guest Information</div>
          <div className="card-body">
            <form id="guest-form" onSubmit={handleSubmit}>
              <div id="lead-guest">
                <h5>Lead Guest</h5>
                <div className="row">
                  <div className="form-group col-md-2">
                    <label htmlFor="customerTitle">Title</label>
                    <select
                      className="form-control"
                      id="customerTitle"
                      value={leadCustomer.customerTitle}
                      onChange={handleInputChange}
                    >
                      <option value="Mr">Mr</option>
                      <option value="Miss">Miss</option>
                      <option value="Ms">Ms</option>
                      <option value="Master">Master</option>
                      <option value="Dr">Dr</option>
                      <option value="Mrs">Mrs</option>
                    </select>
                  </div>
                  <div className="form-group col-md-5">
                    <label htmlFor="customerFirstName">First Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="customerFirstName"
                      value={leadCustomer.customerFirstName}
                      onChange={handleInputChange}
                      placeholder="First Name"
                    />
                  </div>
                  <div className="form-group col-md-5">
                    <label htmlFor="customerLastName">Last Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="customerLastName"
                      value={leadCustomer.customerLastName}
                      onChange={handleInputChange}
                      placeholder="Last Name"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="form-group col-md-4">
                    <label htmlFor="dateOfBirth">Date of Birth</label>
                    <input
                      type="date"
                      className="form-control"
                      id="dateOfBirth"
                      value={leadCustomer.dateOfBirth}
                      onChange={handleInputChange}
                      placeholder="1900-01-01"
                    />
                  </div>
                  <div className="form-group col-md-8">
                    <label htmlFor="customerAddress1">Address 1</label>
                    <input
                      type="text"
                      className="form-control"
                      id="customerAddress1"
                      value={leadCustomer.customerAddress1}
                      onChange={handleInputChange}
                      placeholder="5 Test Road"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="form-group col-md-4">
                    <label htmlFor="customerAddress2">Address 2</label>
                    <input
                      type="text"
                      className="form-control"
                      id="customerAddress2"
                      value={leadCustomer.customerAddress2}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group col-md-4">
                    <label htmlFor="customerTownCity">Town/City</label>
                    <input
                      type="text"
                      className="form-control"
                      id="customerTownCity"
                      placeholder="Test Town"
                      value={leadCustomer.customerTownCity}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group col-md-4">
                    <label htmlFor="customerCounty">County</label>
                    <input
                      type="text"
                      className="form-control"
                      id="customerCounty"
                      placeholder="Test County"
                      value={leadCustomer.customerCounty}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="form-group col-md-4">
                    <label htmlFor="customerPostcode">Postcode</label>
                    <input
                      type="text"
                      className="form-control"
                      id="customerPostcode"
                      placeholder="TST 123"
                      value={leadCustomer.customerPostcode}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group col-md-4">
                    <label htmlFor="customerBookingCountryID">
                      Booking Country ID
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="customerBookingCountryID"
                      placeholder="2"
                      value={leadCustomer.customerBookingCountryID}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group col-md-4">
                    <label htmlFor="customerPhone">Phone</label>
                    <input
                      type="text"
                      className="form-control"
                      id="customerPhone"
                      placeholder="0123456789"
                      value={leadCustomer.customerPhone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="form-group col-md-6">
                    <label htmlFor="customerMobile">Mobile</label>
                    <input
                      type="text"
                      className="form-control"
                      id="customerMobile"
                      placeholder="0123456789"
                      value={leadCustomer.customerMobile}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group col-md-6">
                    <label htmlFor="customerEmail">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="customerEmail"
                      placeholder="test@test.com"
                      value={leadCustomer.customerEmail}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="form-group col-md-12">
                    <label htmlFor="customerRequest">Special Request</label>
                    <input
                      type="text"
                      className="form-control"
                      id="customerRequest"
                      placeholder="Special Request"
                      value={leadCustomer.customerRequest}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              <hr />
              <div id="guest-details">
                <h5>Guest Details</h5>
                {guestDetails.map((guest) => (
                  <GuestDetail
                    key={guest.id}
                    guest={guest}
                    updateGuestDetails={updateGuestDetails}
                    removeGuest={removeGuest}
                  />
                ))}
              </div>
              <div className="agentInfo">
                <div className="row mt-4 mb-4">
                  <div className="form-group col-md-6">
                    <label htmlFor="agentRef">Agent Name:</label>
                    <input
                      type="text"
                      placeholder="Agent Name"
                      className="form-control"
                    />
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-primary mt-3"
                onClick={addGuest}
              >
                Add Guest
              </button>
              <button type="submit" className="btn btn-success mt-3">
                Submit
              </button>
            </form>
          </div>
        </div>
      )}

      <Modal show={modalVisible} onHide={() => setModalVisible(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{modalContent.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalContent.body}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalVisible(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LeadGuestForm;
