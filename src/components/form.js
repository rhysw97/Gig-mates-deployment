import React, { useState, useEffect } from 'react';
import { getRequest, postRequest, formPostRequest } from "../../utils/server-queries.ts";
  import { useState, useEffect } from "react";
  import { useNavigate } from "react-router-dom";

const Form = () => {

  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [image, setImage] = useState();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("file", image);
    fetch("/profile/edit", {
      method: "POST",
      body: formData,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="file"
        name="image"
        onChange={(e) => setImage(e.target.files[0])}
      />
      <input type="submit" value="Submit" />
    </form>
  );
}

export default Form;