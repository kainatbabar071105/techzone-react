import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function CustomerLayout({ cartItems }) {
  return (
    <>
      <Navbar cartItems={cartItems} />

      <main>
        <Outlet />
      </main>
    </>
  );
}

export default CustomerLayout;