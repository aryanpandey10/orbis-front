import React from 'react';

const GuestDetail = ({ guest, updateGuestDetails, removeGuest }) => {
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    updateGuestDetails(guest.id, id, value);
  };

  return (
    <div className="guest-detail">
      <div className="row">
        <div className="col-md-2">
          <div className="form-group">
            <label htmlFor={`guest${guest.id}ID`}>Guest ID</label>
            <input
              type="text"
              className="form-control"
              id={`guest${guest.id}ID`}
              value={guest.id}
              readOnly
            />
          </div>
        </div>
        <div className="col-md-2">
          <div className="form-group">
            <label htmlFor={`guest${guest.id}Type`}>Type</label>
            <select
              className="form-control"
              id={`type`}
              value={guest.type}
              onChange={handleInputChange}
            >
              <option value="Adult">Adult</option>
              <option value="Child">Child</option>
              <option value="Infant">Infant</option>
            </select>
          </div>
        </div>
        <div className="col-md-2">
          <div className="form-group">
            <label htmlFor={`guest${guest.id}Title`}>Title</label>
            <select
              className="form-control"
              id={`title`}
              value={guest.title}
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
        </div>
        <div className="col-md-3">
          <div className="form-group">
            <label htmlFor={`guest${guest.id}FirstName`}>First Name</label>
            <input
              type="text"
              className="form-control"
              id={`firstName`}
              value={guest.firstName}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group">
            <label htmlFor={`guest${guest.id}LastName`}>Last Name</label>
            <input
              type="text"
              className="form-control"
              id={`lastName`}
              value={guest.lastName}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="col-md-2">
          <div className="form-group">
            <label htmlFor={`guest${guest.id}Age`}>Age</label>
            <input
              type="number"
              className="form-control"
              id={`age`}
              value={guest.age}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="col-md-2">
          <div className="form-group">
            <label></label>
            <button
              type="button"
              className="btn btn-danger mt-4 btn-block"
              onClick={() => removeGuest(guest.id)}
            >
              Remove Guest
            </button>
          </div>
        </div>
      </div>
      <hr />
    </div>
  );
};

export default GuestDetail;
