import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/Home/HomePage";
import ReservationPage from "./pages/Reservation/ReservationPage";
import ReservationDetailsPage from "./pages/ViewReservation/ReservationDetailsPage";

const App: React.FC = () => (
<Router>
  <Routes>
    {/* Parent route with common layout */}
    <Route path="/" element={<Layout />}>
      {/* Default (index) child route: "/" */}
      <Route index element={<HomePage />} />
      {/* "/reservation" child route */}
      <Route path="reservation" element={<ReservationPage />} />
      {/* "/view-reservation" child route */}
      <Route path="view-reservation" element={<ReservationDetailsPage />} />

    </Route>
  </Routes>
</Router>
);

export default App;
