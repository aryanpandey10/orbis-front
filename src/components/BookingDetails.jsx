import React from "react";
import { useLocation } from "react-router-dom";
import LeadGuestForm from "./LeadGuestForm";

function BookingDetails() {
  const location = useLocation();
  const { propertyPreBookResponse, selectedRoomData } = location.state || {};

  console.log("propertyPreBookResponse:", propertyPreBookResponse);
  console.log("selectedRoomData:", selectedRoomData);

  const { PropertyPreBookResponse } = propertyPreBookResponse || {};
  const { Cancellations, PaymentsDue, Errata, TotalPrice } = PropertyPreBookResponse || {};

  return (
    <>
      <div className="container mt-4">
        <div className="card">
          <div className="card-header">
            <h3 className="property-name">
              {selectedRoomData?.PropertyName || "Hotel Villa Franca"}
            </h3>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-3">
                <div className="room-type">
                  <label htmlFor="room-type">Selected Room Type:</label>
                  <h6>{selectedRoomData?.RoomType || "Standard"}</h6>
                </div>
              </div>
              <div className="col-md-3">
                <div className="available">
                  <label htmlFor="available">Duration:</label>
                  <h6>Checkin:{selectedRoomData?.ArrivalDate || "22"} ({selectedRoomData?.Duration || "22"} N)</h6>
                </div>
              </div>
              <div className="col-md-3">
                <div className="available">
                  <label htmlFor="available">Number of Rooms:</label>
                  <h6>{selectedRoomData?.NumberOfRoomsAvailable || "22"}</h6>
                </div>
              </div>
              <div className="col-md-3">
                <div className="meal-basis">
                  <label htmlFor="meal-basis">Board Basis:</label>
                  <h6>{selectedRoomData?.MealBasis || "BB"}</h6>
                </div>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-lg-4">
                <div className="card">
                  <div className="card-header">Cancellation</div>
                  <div className="card-body">
                    <ul>
                      {Array.isArray(Cancellations?.Cancellation) &&
                        Cancellations.Cancellation.map(
                          (cancellation, index) => (
                            <li key={index}>
                              Date: {cancellation.StartDate} Amount:{" "}
                              {cancellation.Amount}
                            </li>
                          )
                        )}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="card">
                  <div className="card-header">Payment</div>
                  <div className="card-body">
                    <h5 className="card-title">Total Amount: £ {TotalPrice}</h5>
                    <h6 className="card-text">
                      Due Date: {PaymentsDue?.DateDue}
                    </h6>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="card">
                  <div className="card-header">Errata</div>
                  <div className="card-body">
                    <ol>
                      {Errata?.Erratum.map((erratum, index) => (
                        <li key={index}>{erratum.ErratumDescription}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <LeadGuestForm propertyBookings={selectedRoomData} /> {/* Pass selectedRoomData as propertyBookings */}
    </>
  );
}

export default BookingDetails;
