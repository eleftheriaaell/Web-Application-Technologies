import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import exportFromJSON from "export-from-json";

function AdminPage() {
  const [listOfUsers, setListOfUsers] = useState([]);                               
  const [listOfPosts, setListOfPosts] = useState([]);
  const [listOfCategories, setListOfCategories] = useState([]);
  const [bids, setBids] = useState([]);
  let navigate = useNavigate();

  useEffect(() => {                                                           
    axios.get("http://localhost:3001/admin/all", { headers: { accessToken: localStorage.getItem("accessToken") },
      }).then((response) => {
        setListOfUsers(response.data);
      });

    axios.get("http://localhost:3001/posts").then((response) => {
      setListOfPosts(response.data);
    });
   
    for (let i = 0; i < listOfPosts.length; i++) {
      let PostId = listOfPosts[i].id;
      
      axios.get("https://localhost:3001/category/json",{PostId})
      .then((response) => {
        setListOfCategories([listOfCategories, ...response.data]);
      });
      axios.get("https://localhost:3001/bids/json",{PostId})
      .then((response) => {
        setBids([bids, ...response.data]);
   
      });
    }
      
  }, [listOfPosts]);                                                            

  const ViewProfile = (userId) => {                           
    navigate(`/info/${userId}`);
  };

  function onClickXML() {                                       
    const data = [listOfPosts, listOfCategories, bids];
    const fileName = "PostsInformationXML";
    let fields = [];
    const exportType = "xml";
    exportFromJSON({ data, fileName, fields, exportType });
  }

  function onClickJSON() {                                      
    const data = [listOfPosts, listOfCategories, bids];
    const fileName = "PostsInformationJSON";
    let fields = [];
    const exportType = "json";
    exportFromJSON({ data, fileName, fields, exportType });
  }

  return (
    <div>
      <h1>Welcome Administrator</h1>
      <h2>List of Users:</h2>
      <div>
        {listOfUsers.map((user) => {
          return (
            <>
            <div onClick={() => { ViewProfile(user.id);}}>
              <h3>{user.username}</h3>
            </div>
            </>
          );
        })}
      </div>
      <button onClick={onClickJSON}>JSON Form</button>

      <button onClick={onClickXML}>XML Form</button>
    </div>
  );
}

export default AdminPage;
