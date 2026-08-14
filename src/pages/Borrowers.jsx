import { useState, useEffect } from "react";

import {
  getBorrowers,
  addBorrower,
  updateBorrower,
  deleteBorrower
} from "../services/borrowerService";

function Borrowers() {

  // Form State

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [nationality, setNationality] = useState("");
  const [phone, setPhone] = useState("");

  // Borrowers List

  const [borrowers, setBorrowers] = useState([]);

  // Search

  const [searchTerm, setSearchTerm] = useState("");

  /*
    Load Borrowers
  */
  async function loadBorrowers() {

    const { data, error } =
      await getBorrowers();

    if (error) {
      console.error(
        "Error loading borrowers:",
        error
      );
      return;
    }

    setBorrowers(data);
  }

  /*
    Add Borrower
  */
  async function handleAddBorrower() {

    if (!fullName.trim()) {
      alert("Please enter borrower name.");
      return;
    }

    const { error } =
      await addBorrower({
        full_name: fullName.trim(),
        email: email.trim(),
        nationality: nationality.trim(),
        phone: phone.trim()
      });

    if (error) {
      console.error(error);
      alert("Unable to save borrower.");
      return;
    }

    // Clear form

    setFullName("");
    setEmail("");
    setNationality("");
    setPhone("");

    // Refresh list

    loadBorrowers();
  }

  /*
    Edit Borrower
  */
  async function handleEditBorrower(
    borrower
  ) {

    const newName =
      prompt(
        "Edit Full Name",
        borrower.full_name
      );

    if (newName === null) return;

    const newEmail =
      prompt(
        "Edit Email",
        borrower.email || ""
      );

    if (newEmail === null) return;

    const newNationality =
      prompt(
        "Edit Nationality",
        borrower.nationality || ""
      );

    if (newNationality === null) return;

    const newPhone =
      prompt(
        "Edit Phone",
        borrower.phone || ""
      );

    if (newPhone === null) return;

    const { error } =
      await updateBorrower(
        borrower.id,
        {
          full_name: newName,
          email: newEmail,
          nationality: newNationality,
          phone: newPhone
        }
      );

    if (error) {
      console.error(error);
      return;
    }

    loadBorrowers();
  }

  /*
    Delete Borrower
  */
  async function handleDeleteBorrower(
    id
  ) {

    const confirmed =
      window.confirm(
        "Delete borrower?"
      );

    if (!confirmed) return;

    const { error } =
      await deleteBorrower(id);

    if (error) {
      console.error(error);
      return;
    }

    loadBorrowers();
  }

  /*
    Load when page opens
  */
  useEffect(() => {
    loadBorrowers();
  }, []);

  /*
    Search Filter
  */
  const filteredBorrowers =
    borrowers.filter((borrower) => {

      const search =
        searchTerm.toLowerCase();

      return (
        borrower.full_name
          ?.toLowerCase()
          .includes(search)

        ||

        borrower.email
          ?.toLowerCase()
          .includes(search)

        ||

        borrower.nationality
          ?.toLowerCase()
          .includes(search)

        ||

        borrower.phone
          ?.toLowerCase()
          .includes(search)
      );
    });

// Button styles
  const primaryButton = {
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    padding: "10px 16px",
    borderRadius: "6px",
    cursor: "pointer"
  };



  return (
    <div
      style={{
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "20px"
      }}
    >
      
      {/* Add Borrower */}

      <section
        style={{
          border: "1px solid #ccc",
          padding: "16px",
          borderRadius: "8px",
          marginBottom: "20px"
        }}
      >

        <h3>新增借閱使用者</h3>

        <div style={{ marginBottom: "10px" }}>
          <label>Full Name</label>

          <br />

          <input
            type="text"
            placeholder="Enter full name"
            value={fullName}
            onChange={(e) =>
              setFullName(e.target.value)
            }
            style={{
              width: "300px",
              padding: "6px"
            }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Email</label>

          <br />

          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            style={{
              width: "300px",
              padding: "6px"
            }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Nationality</label>

          <br />

          <input
            type="text"
            placeholder="Enter nationality"
            value={nationality}
            onChange={(e) =>
              setNationality(e.target.value)
            }
            style={{
              width: "300px",
              padding: "6px"
            }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Phone</label>

          <br />

          <input
            type="text"
            placeholder="Enter phone number"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value)
            }
            style={{
              width: "300px",
              padding: "6px"
            }}
          />
        </div>

        <button onClick={handleAddBorrower} style={primaryButton}>
          Add Borrower
        </button>

      </section>

      {/* Borrower List */}

      <section>

        <h3>借閱使用者清單</h3>

        <input
          type="text"
          placeholder="Search borrower..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
          style={{
            width: "400px",
            padding: "8px",
            marginBottom: "20px"
          }}
        />

        {filteredBorrowers.length === 0 ? (

          <p>No borrowers found.</p>

        ) : (

          filteredBorrowers.map((borrower) => (

            <div
              key={borrower.id}
              style={{
                border: "1px solid #ddd",
                padding: "12px",
                marginBottom: "10px",
                borderRadius: "8px",
                backgroundColor: "#fafafa"
              }}
            >

              <h4>
                {borrower.full_name}
              </h4>

              <p>
                <strong>Email:</strong>{" "}
                {borrower.email || "N/A"}
              </p>

              <p>
                <strong>Nationality:</strong>{" "}
                {borrower.nationality || "N/A"}
              </p>

              <p>
                <strong>Phone:</strong>{" "}
                {borrower.phone || "N/A"}
              </p>

              <button
                onClick={() =>
                  handleEditBorrower(
                    borrower
                  )
                }
                style={primaryButton}
              >
                Edit
              </button>

              <button
                onClick={() =>
                  handleDeleteBorrower(
                    borrower.id
                  )
                }
                style={primaryButton}
              >
                Delete
              </button>

            </div>

          ))

        )}

      </section>

    </div>
  );
}

export default Borrowers;