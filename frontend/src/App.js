import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/login/login";
import Signup from "./pages/signup/signup";
import Dashboard from "./pages/dashboard/dashboard";
import QRScanner from "./pages/scanQR/scanner";
import VerifyProduct from "./pages/verifyProduct/verifyProduct";
import ViewCoupon from "./pages/view coupons customer/viewCoupon";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/supplier" element={<Login welcomeText="Supplier" />} />

        <Route path="/signup" element={<Signup />} />
        <Route path="/supplier/signup" element={<Signup />} />

        <Route
          path="/dashboard/:userType/:userId/:userName"
          element={<Dashboard />}
        />

        <Route
          path="/scan/:userId/:userName/:userType"
          element={<QRScanner />}
        />

        <Route
          path="/verify/:productId/:randomNumber/:customerId/:userName/:userType"
          element={<VerifyProduct />}
        />

        <Route
          path="/view-coupons/:customerId/:userName/:userType"
          element={<ViewCoupon />}
        />
      </Routes>
    </div>
  );
}

export default App;
