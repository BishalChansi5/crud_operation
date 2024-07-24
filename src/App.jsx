import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const url = import.meta.env.VITE_URL;
  const authCode = import.meta.env.VITE_AUTHCODE;

  const [showData, setShowData] = useState([]);
  const [editData, setEditData] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    email: "",
    comName: "",
    comment: "",
    image: "",
    id: "",
  });
  const [flag, setFlag] = useState(true);
  const [userId, setUserId] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    handleShowPost();
  }, []);

  // useEffect(() =>{
  //   if(editData.length === 0){
  //   setEditData(showData)
  //   }
  // },[showData])

  const handleShowPost = () => {
    try {
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
        .then((data) => {
          setShowData(data.Values);
          setEditData(data.Values);
        });
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch data from API");
    }
  };

  const handleEdit = (id) => {
    const filteredData = editData.find((data) => data.TestimonialID === id);
    setFormData({
      name: filteredData.FullName,
      position: filteredData.Position,
      email: filteredData.Email,
      comName: filteredData.ComName,
      comment: filteredData.Comment,
      id: filteredData.TestimonialID,
      image:
        filteredData.UserImage === null
          ? (filteredData.UserImage = "")
          : filteredData.UserImage,
    });
    setFlag(false);
    setIsVisible(true);
  };

  const handleSave = async (flag) => {
    const { name, position, email, comName, comment, image, id } = formData;
    if (!userId) {
      toast.error("Enter your User ID");
      return;
    }
    const requestBody = {
      UserID: userId,
      Flag: flag === "I" ? "I" : "U",
      FullName: name,
      Position: position,
      Email: email,
      ComName: comName,
      Comment: comment,
      UserImage: image,
      AuthCode: authCode,
    };
    if (flag === "U") requestBody.TestimonialID = `${id}`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          signature: "p0m76",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      await res.json();
      handleShowPost();
      handleClear();
      toast.success(`Successfully ${flag === "I" ? "Added" : "Updated"}`);
    } catch (error) {
      toast.error("Failed to save data");
    }
    document.getElementsByClassName("inputField")[0].style.display = "none";
  };

  const handleDelete = async (id) => {
    const userId = prompt("Enter your User Id to delete");
    if (userId === null) {
      toast.error("No User ID entered");
      return;
    }
    if (userId <= 0) {
      toast.error("Incorrect User ID");
      return;
    }

    const filteredData = editData.find((data) => data.TestimonialID == id);

    if (window.confirm("Are you sure you want to delete this")) {
      try {
        const api = await fetch(url, {
          method: "POST",
          headers: {
            signature: "p0m76",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            UserID: userId,
            Flag: "R",
            TestimonialID: `${filteredData.TestimonialID}`,
            AuthCode: authCode,
          }),
        });
        await api.json();
        handleShowPost();
        toast.success("Successfully Deleted");
      } catch (error) {
        toast.error("Failed to delete data");
      }
    }
  };

  const handleClear = () => {
    setFormData({
      name: "",
      position: "",
      email: "",
      comName: "",
      comment: "",
      Userid: "",
      image: "",
      id: "",
    });
    setFlag(true);
    setUserId("");
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
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
            Update
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

  const handleSearch = (e) => {
    const filteredData = editData.filter((item) =>
      item.FullName.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setShowData(filteredData);
  };

  return (
    <div className="container">

      
      {/* visibility code */}

      {isVisible && (
        <div className="inputField">
          <div className="input">
            <label htmlFor="Userid">User_ID:</label>
            <input
              type="text"
              id="Userid"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </div>
          <div className="input">
            <label htmlFor="name">
              Full_Name:
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div className="input">
            <label htmlFor="position">
              Position:
              <input
                type="text"
                id="position"
                value={formData.position}
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div className="input">
            <label htmlFor="email">
              E-mail:
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div className="input">
            <label htmlFor="comName">
              Company_Name:
              <input
                type="text"
                id="comName"
                value={formData.comName}
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div className="input">
            <label htmlFor="comment">
              Comment:
              <input
                type="text"
                id="comment"
                value={formData.comment}
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div className="input image">
            <label htmlFor="image">
              Image:
              <input
                type="text"
                id="image"
                value={formData.image}
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div className="input clear">
            <button
              style={{ backgroundColor: flag ? "blue" : "green" }}
              onClick={() => handleSave(flag ? "I" : "U")}
            >
              {flag ? "Add" : "Update"}
            </button>
            <button onClick={handleClear}>Clear</button>
            <button onClick={() => setIsVisible(false)}>Back</button>
          </div>
        </div>
      )}
      <div className="add">
        <button
          style={{ backgroundColor: "blue" }}
          onClick={() => setIsVisible(true)}
        >
          Add New Data
        </button>
      </div>

      <div className="search">
        <input
          type="text"
          placeholder="Search here..."
          onChange={handleSearch}
        />
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
