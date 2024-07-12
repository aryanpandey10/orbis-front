import React, { useState } from "react";
import { Accordion, Button, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Circles } from "react-loader-spinner"; // Import the loader
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./DisplayCard.css";
import mealBasis from "../data/mealBasis";

const formatDate = (date) => {
  const options = { day: "2-digit", month: "long", year: "numeric" };
  return new Date(date).toLocaleDateString("en-GB", options);
};

const calculateCheckoutDate = (arrivalDate, duration) => {
  const date = new Date(arrivalDate);
  date.setDate(date.getDate() + duration);
  return date;
};

const DisplayCard = ({
  property = {},
  searchDetails = {},
  propertySearchResponse = {},
  guestDetails = [],
  specialRequest = "",
}) => {
  const navigate = useNavigate();
  const [propertyBookings, setPropertyBookings] = useState([]);
  const [loading, setLoading] = useState(false); // Add loading state
  const roomTypes = property.RoomTypes?.RoomType || [];

  const mainImage = property.SearchResponseXML?.Property?.MainImage;
  const rating = property.SearchResponseXML?.Property?.Rating;
  const propertyName = property.SearchResponseXML?.Property?.PropertyName;

  const handleBookingRequest = async (roomType) => {
    setLoading(true); // Start loading
    const { arrivalDate, duration, adults, children, childAges, infant } =
      searchDetails;

    let selectedPropertyResult;
    propertySearchResponse.PropertyResults.PropertyResult.forEach(
      (propertyResult) => {
        const roomTypesArray = Array.isArray(propertyResult.RoomTypes?.RoomType)
          ? propertyResult.RoomTypes.RoomType
          : [propertyResult.RoomTypes?.RoomType];
        const foundRoomType = roomTypesArray.find(
          (rt) => rt.RoomBookingToken === roomType.RoomBookingToken
        );
        if (foundRoomType) {
          selectedPropertyResult = propertyResult;
        }
      }
    );

    if (!selectedPropertyResult) {
      console.error(
        "Could not find PropertyResult for selected RoomBookingToken:",
        roomType.RoomBookingToken
      );
      setLoading(false); // Stop loading if error occurs
      return;
    }

    const parentBookingToken = selectedPropertyResult.BookingToken;

    const bookingRequestData = {
      propertyReferenceID: property.PropertyReferenceID,
      arrivalDate,
      duration,
      roomBookings: [
        {
          roomBookingToken: roomType.RoomBookingToken,
          adults,
          children,
          childAges,
          infant,
        },
      ],
      bookingToken: parentBookingToken,
      request: specialRequest,
      expectedTotal: roomType.SubTotal,
      guestDetails,
    };

    const formattedArrivalDate = formatDate(arrivalDate);
    const checkoutDate = calculateCheckoutDate(arrivalDate, duration);
    const formattedCheckoutDate = formatDate(checkoutDate);

    const selectedRoomData = {
      ArrivalDate: formattedArrivalDate,
      Duration: duration,
      RoomType: roomType.RoomType,
      PropertyName: propertyName,
      MealBasis: getMealBasis(roomType.MealBasisID),
      NumberOfRoomsAvailable: roomType.AvailableRooms,
      CheckoutDate: formattedCheckoutDate,
    };

    try {
      const response = await fetch("http://localhost:5000/api/property-book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingRequestData),
      });

      if (!response.ok) {
        throw new Error("Failed to book property");
      }

      const result = await response.json();
      const bookingToken = result.PropertyPreBookResponse.BookingToken;
      console.log("Booking Token consy:", bookingToken);

      const propertyBookings = [
        {
          bookingToken: bookingToken,
          arrivalDate,
          duration,
          request: specialRequest,
          expectedTotal: roomType.SubTotal,
          roomBookings: [
            {
              roomBookingToken: roomType.RoomBookingToken,
              guestIDs: guestDetails.map((guest) => guest.id),
            },
          ],
        },
      ];

      setPropertyBookings(propertyBookings);

      setLoading(false); // Stop loading

      navigate("/home/book", {
        state: {
          propertyPreBookResponse: result,
          selectedRoomData,
          propertyBookings,
        },
      });
    } catch (error) {
      console.error("Error booking property:", error);
      setLoading(false); // Stop loading if error occurs
    }
  };

  const getMealBasis = (id) => {
    const meal = mealBasis.find((item) => item.MealBasisID === Number(id));
    return meal ? meal.MealBasis : "Unknown";
  };

  return (
    <div className="container mt-2">
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
        <div className="card mb-3">
          <div className="row g-0">
            <div className="col-md-4">
              {mainImage ? (
                <img
                  src={mainImage}
                  className="img-fluid rounded-start"
                  alt={propertyName || "Property"}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/path/to/placeholder.jpg";
                  }}
                />
              ) : (
                <div className="img-placeholder rounded-start">
                  No Image Available
                </div>
              )}
            </div>
            <div className="col-md-8">
              <div className="card-body">
                <div className="prop_head d-flex align-items-center justify-content-between">
                  <h2 className="card-title">{propertyName}</h2>
                  <h4>
                    {rating} <i className="bi bi-star"></i>
                  </h4>
                </div>

                <Accordion defaultActiveKey="1">
                  {roomTypes.length > 0 ? (
                    <Accordion.Item eventKey="0">
                      <Accordion.Header>Room Types</Accordion.Header>
                      <Accordion.Body>
                        <Table striped bordered hover>
                          <thead>
                            <tr>
                              <th>Room Type</th>
                              <th>Meal Basis</th>
                              <th>Available</th>
                              <th>Subtotal</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {roomTypes.map((roomType, index) => (
                              <tr key={index}>
                                <td>{roomType.RoomType}</td>
                                <td>{getMealBasis(roomType.MealBasisID)}</td>
                                <td>{roomType.AvailableRooms}</td>
                                <td>
                                  £{parseFloat(roomType.SubTotal).toFixed(2)}
                                </td>
                                <td>
                                  <Button
                                    variant="primary"
                                    onClick={() =>
                                      handleBookingRequest(roomType)
                                    }
                                  >
                                    Book
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </Accordion.Body>
                    </Accordion.Item>
                  ) : (
                    <p>No room types available.</p>
                  )}
                </Accordion>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisplayCard;
