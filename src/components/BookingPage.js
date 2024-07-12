import React, { useState } from 'react';
import DisplayCard from './DisplayCard';
import LeadGuestForm from './LeadGuestForm';

const BookingPage = ({ property, searchDetails, propertySearchResponse }) => {
  const [guestDetails, setGuestDetails] = useState([]);
  const [specialRequest, setSpecialRequest] = useState('');

  const handleFormSubmit = (guests, request) => {
    setGuestDetails(guests);
    setSpecialRequest(request);
  };

  return (
    <div>
      <LeadGuestForm onSubmit={handleFormSubmit} propertyBookings={[]} />
      <DisplayCard
        property={property}
        searchDetails={searchDetails}
        propertySearchResponse={propertySearchResponse}
        guestDetails={guestDetails}
        specialRequest={specialRequest}
      />
    </div>
  );
};

export default BookingPage;
