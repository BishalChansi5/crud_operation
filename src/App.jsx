import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { ToastContainer , toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
  
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
  const [image , setImage] = useState("");

  useEffect(() => {
    handleShowPost();
  }, [showData]);

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
    const filteredData = showData.filter((data) => data.TestimonialID === id);
    console.log(filteredData)
    setName(filteredData[0].FullName);
    setPosition(filteredData[0].Position);
    setEmail(filteredData[0].Email);
    setComName(filteredData[0].ComName);
    setComment(filteredData[0].Comment);
    setFlag(false);
  };
  const handleUpdate = async () => {
    console.log(showData.length)
    // const api = await fetch(url, {
    //   method: "POST",
    //   headers: {
    //     "signature": "p0m76",
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     UserID: `${user}`,
    //     Flag: "U",
    //     // TestimonialID: ``
    //     FullName: `${name}`,
    //     Position: `${position}`,
    //     Email: `${email}`,
    //     ComName: `${comName}`,
    //     Comment: `${comment}`,
    //     UserImage: `${image}`,
    //     AuthCode: `${authCode}`,
      // }),
    // })
    // const apiData = await api.json()
    // console.log(apiData)
  };
  const handleAdd = async () => {
    const api = await fetch(url, {
      method: "POST",
      headers: {
        "signature": "p0m76",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        UserID: `${user}`,
        Flag: "I",
        FullName: `${name}`,
        Position: `${position}`,
        Email: `${email}`,
        ComName: `${comName}`,
        Comment: `${comment}`,
        UserImage: `${image}`,
        AuthCode: `${authCode}`,
      }),
    })
    const apiData = await api.json()
    // console.log(apiData)
    toast.success('Successfully Added')
  };
  const handleDelete = async (id) => {
    const filteredData = showData.filter(data => data.TestimonialID == id)
    // console.log(typeof(filteredData[0].TestimonialID))
    // setUser()
    const api = await fetch(url, {
      method: "POST",
      headers: {
        "signature": "p0m76",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        UserID: `1`,
        Flag: "R",
        TestimonialID: `${filteredData[0].TestimonialID}`,
        AuthCode: `${authCode}`,
      }),
    })
    const apiData = await api.json()
    toast.success('Successfully Deleted')
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
          <button className="btn delete" onClick={() =>handleDelete(row.TestimonialID)}>
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
        <div className="input">
          {flag ? (
            <button style={{ backgroundColor: "blue" }} onClick={handleAdd}>
              ADD
            </button>
          ) : (
            <button style={{ backgroundColor: "green" }} onClick={handleUpdate}>
              Update
            </button>
          )}
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
