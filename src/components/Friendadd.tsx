import React, { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { Navigate } from "react-router-dom";

function FriendAdd() {
  const [friend_ID, setfriend_ID] = useState<any>();
  const [cookies, setCookie, getCookie] = useCookies<string>(["accessToken"]);

  const friend_add = () => {
    console.log("친구 추가 시도");

    axios({
      method: "post",
      url: `add/${friend_ID}`, //받은 입력값으로 url요청 보내기1
      headers: {
        Authorization: `Bearer ${cookies.accessToken}`,
      },
    }).then(function (res) {
      console.log("친구 추가 성공");
      let refreshToken: string = res.headers["authorization-refresh"]!;
      let accessToken = res.headers.authorization;
      setCookie("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    });
  };

  return (
    <>
      <input
        type="text"
        placeholder="추가하고 싶은 친구의 ID"
        value={friend_ID}
        onChange={(e) => setfriend_ID(e.target.value)}
      />
      <button onClick={friend_add} className="friend-add">
        추가
      </button>
    </>
  );
}

export default FriendAdd;
