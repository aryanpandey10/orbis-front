import React, { useState, useEffect } from 'react';
import './ShowBooking.css';

const ShowBooking = () => {
  // State to hold booking data
  const [bookings, setBookings] = useState([]);

  // Function to fetch bookings data from API
  const fetchBookings = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/show-book', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      const bookingsData = data?.SearchBookingsResponse?.Bookings?.Booking || [];
      setBookings(bookingsData);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  // Fetch bookings data on component mount
  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="container">
      {bookings.map((booking, index) => (
        <BookingCard key={index} booking={booking} />
      ))}
    </div>
  );
};

const BookingCard = ({ booking }) => {
  return (
    <div className="card mb-3">
      <div className="card-header">
        <ul className="nav nav-tabs card-header-tabs" id={`myTab${booking.BookingReference}`}>
          <li className="nav-item" role="presentation">
            <button
              className="nav-link active"
              id={`booking-tab-${booking.BookingReference}`}
              data-bs-toggle="tab"
              data-bs-target={`#booking-tab-pane-${booking.BookingReference}`}
              type="button"
              role="tab"
              aria-controls={`booking-tab-pane-${booking.BookingReference}`}
              aria-selected="true"
            >
              Booking
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className="nav-link"
              id={`detail-tab-${booking.BookingReference}`}
              data-bs-toggle="tab"
              data-bs-target={`#detail-tab-pane-${booking.BookingReference}`}
              type="button"
              role="tab"
              aria-controls={`detail-tab-pane-${booking.BookingReference}`}
              aria-selected="false"
            >
              Detail
            </button>
          </li>
          <li className="nav-item">
            <button className="nav-link disabled d-flex g-1" aria-disabled="true">
              <div>
                <h3>Booking Reference: {booking.BookingReference}</h3>
                <h4>Status: {booking.Status}</h4>
              </div>
            </button>
          </li>
        </ul>
      </div>
      <div className="row g-0">
        <div className="card-body">
          <div className="tab-content" id={`myTabContent${booking.BookingReference}`}>
            <div
              className="tab-pane fade show active"
              id={`booking-tab-pane-${booking.BookingReference}`}
              role="tabpanel"
              aria-labelledby={`booking-tab-${booking.BookingReference}`}
              tabIndex="0"
            >
              <div className="row">
                <div className="col-lg-4 border-end">
                  <div className="info-container">
                    <div>
                      <i className="bi bi-person-circle"></i>
                      <h5>Agent:</h5>
                      <h4>Mickey {booking.TradeReference}</h4>
                    </div>
                    <div>
                      <i className="bi bi-person-fill"></i>
                      <h5>Lead Customer:</h5>
                      <h4>{booking.LeadCustomerFirstName} {booking.LeadCustomerLastName}</h4>
                    </div>
                    <div>
                      <i className="bi bi-calendar-date"></i>
                      <h5>Booking Date:</h5>
                      <h4>{new Date(booking.BookingDate).toLocaleDateString()}</h4>
                    </div>
                    <div>
                      <i className="bi bi-calendar-event"></i>
                      <h5>Arrival Date:</h5>
                      <h4>{new Date(booking.ArrivalDate).toLocaleDateString()} ({(booking.Duration)} N)</h4>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 border-end">
                  <h2 className="fw-bold">
                    <i className="bi bi-building"></i> {booking.ComponentSummary?.Component?.hlpComponentName}
                  </h2>
                </div>
                <div className="col-lg-4 d-flex-column align-items-end">
                  <div className="price">
                    <h3 className="fw-bold">
                      <i className="bi bi-currency-pound"></i> Total: {booking.CurrencySymbol} {booking.TotalPrice}
                    </h3>
                  </div>
                  <div className="cancel">
                    <button type="button" className="btn btn-warning">
                      Cancel Booking
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id={`detail-tab-pane-${booking.BookingReference}`}
              role="tabpanel"
              aria-labelledby={`detail-tab-${booking.BookingReference}`}
              tabIndex="0"
            >
              <h2>Booking Details</h2>
              <ul>
                <li>Booking Reference: {booking.BookingReference}</li>
                <li>Customer: {booking.LeadCustomerFirstName} {booking.LeadCustomerLastName}</li>
                <li>Hotel: {booking.ComponentSummary?.Component?.hlpComponentName}</li>
                <li>Check-in Date: {new Date(booking.ArrivalDate).toLocaleDateString()}</li>
                {/* Add more details as needed */}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowBooking;
