import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const url = import.meta.env.VITE_URL;
  const authCode = import.meta.env.VITE_AUTHCODE;

  const [showData, setShowData] = useState([]);
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [email, setEmail] = useState("");
  const [comName, setComName] = useState("");
  const [comment, setComment] = useState("");
  const [user, setUser] = useState("");
  const [flag, setFlag] = useState(true);
  const [image, setImage] = useState("");
  const [id, setId] = useState("");

  useEffect(() => {
    handleShowPost();
  }, []);

  const handleShowPost = () => {
    fetch(url, {
      method: "POST",
      headers: {
        signature: "p0m76",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        UserID: "-1",
        Flag: "S",
        AuthCode: `${authCode}`,
      }),
    })
      .then((res) => res.json())
      .then((data) => setShowData(data.Values));
  };

  const handleEdit = (id) => {
    // console.log(editData)
    const filteredData = showData.filter((data) => data.TestimonialID === id);
    // console.log(filteredData);
    setName(filteredData[0].FullName);
    setPosition(filteredData[0].Position);
    setEmail(filteredData[0].Email);
    setComName(filteredData[0].ComName);
    setComment(filteredData[0].Comment);
    setId(filteredData[0].TestimonialID);
    setFlag(false);
  };

  const handleUpdate = async () => {
    if(user === ''){
      toast.error("Enter your User ID");
      return;
    }
    const api = await fetch(url, {
      method: "POST",
      headers: {
        signature: "p0m76",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        UserID: user,
        Flag: "U",
        TestimonialID: `${id}`,
        FullName: name,
        Position: position,
        Email: email,
        UserImage: image,
        ComName: comName,
        Comment: comment,
        AuthCode: authCode,
      }),
    });
    const apiData = await api.json();
    handleShowPost();
    handleClear();
    toast.success("Updated Successfully");
  };
  const handleAdd = async () => {
    if(user === ''){
      toast.error("Enter your User ID");
      return;
    }
    const api = await fetch(url, {
      method: "POST",
      headers: {
        signature: "p0m76",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        UserID: user,
        Flag: "I",
        FullName: name,
        Position: position,
        Email: email,
        ComName: comName,
        Comment: comment,
        UserImage: image,
        AuthCode: authCode,
      }),
    });
    const apiData = await api.json();
    // console.log(apiData)
    handleShowPost();
    handleClear();
    toast.success("Successfully Added");
  };
  const handleDelete = async (id) => {
    const userId = prompt("Enter your User Id to delete")
    if(userId === null){
      toast.error("No User ID entered");
      return;
    }
    if(userId <= 0){
      toast.error("Incorrect User ID");
      return;
    }
  
    const filteredData = showData.filter((data) => data.TestimonialID == id);
    // setUser()
    if(window.confirm("Are you sure you want to delete this")){
      const api = await fetch(url, {
        method: "POST",
        headers: {
          signature: "p0m76",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          UserID: userId,
          Flag: "R",
          TestimonialID: `${filteredData[0].TestimonialID}`,
          AuthCode: `${authCode}`,
        }),
      });
      const apiData = await api.json();
      handleShowPost();
      toast.success("Successfully Deleted");
    }
  };
  const handleClear = () => {
    setName("");
    setPosition("");
    setEmail("");
    setComName("");
    setComment("");
    setId("");
    setImage("");
    setUser("");
    setFlag(true);
  };
  const columns = [
    {
      name: "ID",
      selector: (row) => row.TestimonialID,
    },
    {
      name: "Full Name",
      selector: (row) => row.FullName,
    },
    {
      name: "Position",
      selector: (row) => row.Position,
    },
    {
      name: "Email Address",
      selector: (row) => row.Email,
    },

    {
      name: "Name",
      selector: (row) => row.ComName,
    },
    {
      name: "Comment",
      selector: (row) => row.Comment,
    },
    {
      name: "Image",
      selector: (row) => row.UserImage,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="action">
          <button className="btn" onClick={() => handleEdit(row.TestimonialID)}>
            Edit
          </button>
          <button
            className="btn delete"
            onClick={() => handleDelete(row.TestimonialID)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="container">
      <div className="inputField">
        <div className="input">
          <label htmlFor="id">User_ID:</label>
          <input
            type="text"
            id="id"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
        </div>
        <div className="input">
          <label htmlFor="name">
            Full_Name:
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
        </div>
        <div className="input">
          <label htmlFor="position">
            Position:
            <input
              type="text"
              id="position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />
          </label>
        </div>
        <div className="input">
          <label htmlFor="email">
            E-mail:
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
        </div>
        <div className="input">
          <label htmlFor="Comname">
            Company_Name:
            <input
              type="text"
              id="Comname"
              value={comName}
              onChange={(e) => setComName(e.target.value)}
            />
          </label>
        </div>
        <div className="input">
          <label htmlFor="comment">
            Comment:
            <input
              type="text"
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </label>
        </div>
        <div className="input image">
          <label htmlFor="image">
            Image:
            <input type="text" id="image" />
          </label>
        </div>
        <div className="input clear">
          {flag ? (
            <button style={{ backgroundColor: "blue" }} onClick={handleAdd}>
              Add
            </button>
          ) : (
            <button style={{ backgroundColor: "green" }} onClick={handleUpdate}>
              Update
            </button>
          )}
          <button onClick={handleClear}>Clear</button>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={showData}
        pagination
        highlightOnHover
        selectableRows
      />
      <ToastContainer />
    </div>
  );
};

export default App;
