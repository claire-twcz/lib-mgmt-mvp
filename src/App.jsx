import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import Borrowers from "./pages/Borrowers";
import Transactions from "./pages/Transactions";
import Overdue from "./pages/Overdue";

function App() {
  return (
    <BrowserRouter>

      <h1>捷克繁體中文圖書館借閱系統</h1>

      <nav style={{ marginBottom: "20px" }}>
        <Link to="/">📊總覽</Link> |{" "}
        <Link to="/books">📚館藏</Link> |{" "}
        <Link to="/borrowers">👥借閱使用者</Link> |{" "}
        <Link to="/transactions">🔄借閱流程</Link> |{" "}
        <Link to="/overdue">⏰逾期書籍</Link>
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