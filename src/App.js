import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import SearchForm from "./components/SearchForm";
import DisplayCard from "./components/DisplayCard";
import BookingDetails from "./components/BookingDetails";
import Header from "./components/Header";
import Login from "./components/Login";
import ShowBooking from "./components/ShowBooking";
import { Circles } from "react-loader-spinner"; // Correct import

const App = () => {
  const [properties, setProperties] = useState([]);
  const [searchDetails, setSearchDetails] = useState({});
  const [propertySearchResponse, setPropertySearchResponse] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setIsAuthenticated(true);
      setUserName(user.name);
    }
  }, []);

  const handlePropertySearch = ({
    properties,
    searchDetails,
    propertySearchResponse,
  }) => {
    setLoading(true); // Start loading
    // Simulate an async operation to fetch properties
    setTimeout(() => {
      console.log("Search Results:", properties);
      console.log("Search Details:", searchDetails);
      console.log("Property Search Response:", propertySearchResponse);
      setProperties(properties || []);
      setSearchDetails(searchDetails);
      setPropertySearchResponse(propertySearchResponse);
      setLoading(false); // Stop loading
    }, 2000); // Simulate a delay
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUserName("");
    console.log("Logout clicked");
  };

  return (
    <Router>
      <MainContent
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
        userName={userName}
        setUserName={setUserName}
        properties={properties}
        searchDetails={searchDetails}
        propertySearchResponse={propertySearchResponse}
        handlePropertySearch={handlePropertySearch}
        handleLogout={handleLogout}
        loading={loading} // Pass loading state as a prop
      />
    </Router>
  );
};

const MainContent = ({
  isAuthenticated,
  setIsAuthenticated,
  userName,
  setUserName,
  properties,
  searchDetails,
  propertySearchResponse,
  handlePropertySearch,
  handleLogout,
  loading, // Receive loading state as a prop
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleShowBookings = () => {
    console.log("Show Bookings clicked");
    navigate("/home/show-booking");
  };

  const handleLogin = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setIsAuthenticated(true);
      setUserName(user.name);
      navigate("/home");
    }
  };

  return (
    <>
      {location.pathname !== "/login" && isAuthenticated && (
        <Header
          name={userName}
          onLogout={handleLogout}
          onShowBookings={handleShowBookings}
        />
      )}
      <Routes>
        <Route
          path="/"
          element={
            !isAuthenticated ? (
              <Login onLogin={handleLogin} />
            ) : (
              <Navigate to="/home" />
            )
          }
        />
        <Route
          path="/home"
          element={
            isAuthenticated ? (
              <div>
                <SearchForm onPropertySearch={handlePropertySearch} />
                {loading ? ( // Show loader if loading
                  <div
                    className="loader-container"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100vh",
                    }}
                  >
                    <Circles
                      height="80"
                      width="80"
                      color="#4fa94d"
                      ariaLabel="loading"
                    />
                  </div>
                ) : properties.length > 0 ? (
                  properties.map((property, index) => (
                    <DisplayCard
                      key={index}
                      property={property}
                      searchDetails={searchDetails}
                      propertySearchResponse={propertySearchResponse}
                    />
                  ))
                ) : (
                  <p>No properties found</p>
                )}
              </div>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/home/book"
          element={isAuthenticated ? <BookingDetails /> : <Navigate to="/" />}
        />
        <Route
          path="/home/show-booking"
          element={isAuthenticated ? <ShowBooking /> : <Navigate to="/" />}
        />
      </Routes>
    </>
  );
};

export default App;
