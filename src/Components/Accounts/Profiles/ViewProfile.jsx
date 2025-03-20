import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserDataByUID } from "./../../../firebase.ts";

function ViewProfile() {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data, error } = await getUserDataByUID(id, "public", [
          "username",
          "profile_picture",
          "bio",
        ]);

        if (error) {
          console.error("Error fetching user data:", error);
        } else {
          setUserData(data);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      }
    };

    fetchUserData();
  }, [id]);

  return (
    <div id="Profile" className="page">
      {userData ? (
        <div>
          <p>Name: {userData.username}</p>
          {/* Display other user profile information */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default ViewProfile;
