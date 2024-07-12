import React, { useState } from "react";
import { Form, Button, Accordion, Card } from "react-bootstrap";
import { BiSearch } from "react-icons/bi";
import { Circles } from "react-loader-spinner"; // Import the loader
import "./SearchForm.css";

const SearchForm = ({ onPropertySearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [regions, setRegions] = useState([]);
  const [resorts, setResorts] = useState([]);
  const [selectedResorts, setSelectedResorts] = useState([]);
  const [properties, setProperties] = useState([]);
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [selectAllResorts, setSelectAllResorts] = useState(false);
  const [selectAllProperties, setSelectAllProperties] = useState(false);
  const [arrivalDate, setArrivalDate] = useState("");
  const [duration, setDuration] = useState("");
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [childAges, setChildAges] = useState("");
  const [infant, setInfant] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state

  const backendURL = "http://localhost:5000";

  const fetchRegions = async () => {
    try {
      const response = await fetch(
        `${backendURL}/api/regions?searchQuery=${searchQuery}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch regions");
      }
      const data = await response.json();
      setRegions(data);
    } catch (error) {
      setError("Error fetching regions: " + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    // Prepare form data
    const formData = {
      arrivalDate,
      duration,
      propertyReferenceIDs: selectedProperties,
      adults,
      children,
      childAges,
      infant,
    };

    console.log("Form Data Submitted:", formData);

    try {
      // Make POST request to fetch properties
      const response = await fetch(`${backendURL}/api/property-search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to search properties");
      }

      // Parse JSON response
      const result = await response.json();
      console.log("Search Response:", result);

      // Extract bookingToken from the first PropertyResult
      const bookingToken =
        result.PropertySearchResponse.PropertyResults.PropertyResult[0]
          ?.BookingToken;
      console.log("Booking Token:", bookingToken);

      // Pass relevant data to parent component via onPropertySearch callback
      onPropertySearch({
        properties:
          result.PropertySearchResponse.PropertyResults.PropertyResult,
        searchDetails: {
          arrivalDate,
          duration,
          adults,
          children,
          childAges,
          infant,
        },
        propertySearchResponse: result.PropertySearchResponse,
        bookingToken: bookingToken, // Include bookingToken in the callback data
      });

      setLoading(false); // Stop loading
    } catch (error) {
      setError("Error searching properties: " + error.message);
      setLoading(false); // Stop loading
    }
  };

  const handleRegionSelect = async (regionId) => {
    try {
      const response = await fetch(
        `${backendURL}/api/resorts?regionId=${regionId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch resorts");
      }
      const data = await response.json();
      setResorts(data);
    } catch (error) {
      setError("Error fetching resorts: " + error.message);
    }
  };

  const handleResortSelectAll = () => {
    setSelectAllResorts(!selectAllResorts);
    const allResortIds = resorts.map((resort) => resort.ResortID);
    if (!selectAllResorts) {
      setSelectedResorts(allResortIds);
      fetchProperties(allResortIds);
    } else {
      setSelectedResorts([]);
      setProperties([]);
    }
  };

  const handleResortSelect = async (resortId) => {
    let updatedSelectedResorts;
    if (selectedResorts.includes(resortId)) {
      updatedSelectedResorts = selectedResorts.filter((id) => id !== resortId);
    } else {
      updatedSelectedResorts = [...selectedResorts, resortId];
    }
    setSelectedResorts(updatedSelectedResorts);
    fetchProperties(updatedSelectedResorts);
  };

  const fetchProperties = async (resortIds) => {
    try {
      const selectedResortIds = resortIds.join(",");
      const response = await fetch(
        `${backendURL}/api/properties?resorts=${selectedResortIds}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch properties");
      }
      const data = await response.json();
      setProperties(data);
    } catch (error) {
      setError("Error fetching properties: " + error.message);
    }
  };

  const handlePropertiesSelectAll = () => {
    setSelectAllProperties(!selectAllProperties);
    if (!selectAllProperties) {
      setSelectedProperties(
        properties.map((property) => property.PropertyReferenceID)
      );
    } else {
      setSelectedProperties([]);
    }
  };

  const handlePropertySelect = (propertyId) => {
    if (selectedProperties.includes(propertyId)) {
      setSelectedProperties(
        selectedProperties.filter((id) => id !== propertyId)
      );
    } else {
      setSelectedProperties([...selectedProperties, propertyId]);
    }
  };

  const handleSearchButtonClick = async (e) => {
    e.preventDefault();
    await fetchRegions();
  };

  return (
    <div className="container mt-4 p-4 bg-white rounded shadow">
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
        <Form onSubmit={handleSubmit} className="row g-3">
          {/* Line 1 */}
          <div className="col-md-6">
            <Form.Group controlId="searchQuery">
              <Form.Label className="fw-bold text-secondary">
                Search Country
              </Form.Label>
              <div className="input-group">
                <Form.Control
                  type="text"
                  aria-describedby="searchIcon"
                  className="form-control"
                  placeholder="Search Country"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  className="input-group-text"
                  id="searchIcon"
                  onClick={handleSearchButtonClick}
                >
                  <BiSearch />
                </button>
              </div>
            </Form.Group>
          </div>
          <div className="col-md-6">
            <Form.Group controlId="inputRegion">
              <Form.Label className="fw-bold text-secondary">Region</Form.Label>
              <Form.Select onChange={(e) => handleRegionSelect(e.target.value)}>
                <option value="">Select Region</option>
                {regions.map((region) => (
                  <option key={region.RegionID} value={region.RegionID}>
                    {region.Region}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </div>

          {/* Line 2 */}
          <div className="col-md-6">
            <Form.Group controlId="inputResort">
              <Form.Label className="fw-bold text-secondary">
                Resorts
              </Form.Label>
              <Accordion defaultActiveKey="1">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Choose Resorts</Accordion.Header>
                  <Accordion.Body>
                    <Form.Check
                      type="checkbox"
                      label="Select All"
                      checked={selectAllResorts}
                      onChange={handleResortSelectAll}
                    />
                    {resorts.map((resort) => (
                      <div key={resort.ResortID}>
                        <Form.Check
                          type="checkbox"
                          label={resort.Resort}
                          value={resort.ResortID}
                          checked={selectedResorts.includes(resort.ResortID)}
                          onChange={() => handleResortSelect(resort.ResortID)}
                        />
                      </div>
                    ))}
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Form.Group>
          </div>

          <div className="col-md-6">
            <Form.Group controlId="inputProperty">
              <Form.Label className="fw-bold text-secondary">
                Property
              </Form.Label>
              <Accordion defaultActiveKey="1">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Choose Properties</Accordion.Header>
                  <Accordion.Body>
                    <Form.Check
                      type="checkbox"
                      label="Select All"
                      checked={selectAllProperties}
                      onChange={handlePropertiesSelectAll}
                    />
                    {properties.map((property) => (
                      <div key={property.PropertyReferenceID}>
                        <Form.Check
                          type="checkbox"
                          label={property.Name}
                          value={property.PropertyReferenceID}
                          checked={selectedProperties.includes(
                            property.PropertyReferenceID
                          )}
                          onChange={() =>
                            handlePropertySelect(property.PropertyReferenceID)
                          }
                        />
                      </div>
                    ))}
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Form.Group>
          </div>

          {/* Line 3 */}
          <div className="col-md-3">
            <Form.Group controlId="arrivalDate">
              <Form.Label className="fw-bold text-secondary">
                Arrival Date
              </Form.Label>
              <Form.Control
                type="date"
                value={arrivalDate}
                onChange={(e) => setArrivalDate(e.target.value)}
              />
            </Form.Group>
          </div>

          <div className="col-md-3">
            <Form.Group controlId="duration">
              <Form.Label className="fw-bold text-secondary">
                Duration
              </Form.Label>
              <Form.Control
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </Form.Group>
          </div>

          <div className="col-md-6">
            <Form.Group controlId="guestAccordion">
              <Form.Label className="fw-bold text-secondary">Guest</Form.Label>
              <Card>
                <Card.Header>Guest Details</Card.Header>
                <Card.Body className="row">
                  <div className="col-3">
                    <Form.Group controlId="adults">
                      <Form.Label className="fw-bold text-secondary">
                        Adults
                      </Form.Label>
                      <Form.Control
                        type="number"
                        value={adults}
                        onChange={(e) => setAdults(e.target.value)}
                      />
                    </Form.Group>
                  </div>
                  <div className="col-3">
                    <Form.Group controlId="children">
                      <Form.Label className="fw-bold text-secondary">
                        Children
                      </Form.Label>
                      <Form.Control
                        type="number"
                        value={children}
                        onChange={(e) => setChildren(e.target.value)}
                      />
                    </Form.Group>
                  </div>
                  <div className="col-3">
                    <Form.Group controlId="childAges">
                      <Form.Label className="fw-bold text-secondary">
                        Child Ages
                      </Form.Label>
                      <Form.Control
                        type="number"
                        value={childAges}
                        onChange={(e) => setChildAges(e.target.value)}
                      />
                    </Form.Group>
                  </div>
                  <div className="col-3">
                    <Form.Group controlId="infant">
                      <Form.Label className="fw-bold text-secondary">
                        Infant
                      </Form.Label>
                      <Form.Control
                        type="number"
                        value={infant}
                        onChange={(e) => setInfant(e.target.value)}
                      />
                    </Form.Group>
                  </div>
                </Card.Body>
              </Card>
            </Form.Group>
          </div>

          <div className="mt-4">
            <Button className="mt-2" type="submit">
              Submit
            </Button>
            {error && <p className="text-danger">{error}</p>}
          </div>
        </Form>
      )}
    </div>
  );
};

export default SearchForm;
