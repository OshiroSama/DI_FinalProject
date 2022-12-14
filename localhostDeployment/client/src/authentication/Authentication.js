import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Authentication = (props) => {
  const [redirect, setRedirect] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await axios.get("/token", {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        });
        if (response.status === 200) setRedirect(true);
      } catch (error) {
        console.log(error);
        navigate("/login");
      }
    };
    verify();
  }, [navigate]);

  return redirect ? props.children : <h1>Unauthorized</h1>;
};

export default Authentication;
