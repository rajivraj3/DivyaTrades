import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../../../dashboard/src/components/Home";

const DashboardShell = () => {
  return (
    <BrowserRouter basename="/dashboard">
      <Routes>
        <Route path="/*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};

export default DashboardShell;
