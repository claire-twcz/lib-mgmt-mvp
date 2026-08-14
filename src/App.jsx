import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import Borrowers from "./pages/Borrowers";
import Transactions from "./pages/Transactions";
import Overdue from "./pages/Overdue";

function App() {
  return (
    <BrowserRouter>

      <h1>Library Management MVP</h1>

      <nav style={{ marginBottom: "20px" }}>
        <Link to="/">Dashboard</Link> |{" "}
        <Link to="/books">Books</Link> |{" "}
        <Link to="/borrowers">Borrowers</Link> |{" "}
        <Link to="/transactions">Transactions</Link> |{" "}
        <Link to="/overdue">Overdue</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/books" element={<Books />} />
        <Route path="/borrowers" element={<Borrowers />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/overdue" element={<Overdue />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;