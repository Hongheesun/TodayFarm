import { useState } from "react";
import styled from "styled-components";
import axios, { AxiosError } from "axios"; // import express = require("express");
import { useCookies } from "react-cookie";

function DeleteAccount() {
  const [isOk, setIsOk] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");

  // const COOKIE_KEY = window.LOGIN_KEY;
  const [cookies, setCookie, removeCookie] = useCookies([
    "email",
    "accessToken",
    "password",
  ]);

  const handleIsOk = () => {
    setIsOk((curr) => !curr);
  };

  const handleSubmit = () => {
    return axios({
      method: "post",
      url: `/user/withdraw`,
      data: {
        // email,
        currentPassword: password,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.accessToken}`,
      },
    })
      .then((res) => {
        removeCookie("accessToken");
        removeCookie("email");
        removeCookie("password");
        localStorage.removeItem("refresh-token");
        console.log("탈퇴 성공!");
        console.log(res);
        // navigator("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      {!isOk ? (
        <>
          <p>탈퇴 후 복구할 수 없습니다.</p>
          <p>탈퇴 하시겠습니까?</p>
          <button onClick={handleIsOk}>탈퇴하기</button>
        </>
      ) : (
        <>
          <p>회원 탈퇴를 위해서 비밀번호를 입력해주세요.</p>
          <input
            id="userPassword"
            placeholder="비밀번호를 입력해주세요"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleIsOk}>취소하기</button>
          <button onClick={handleSubmit}>탈퇴하기</button>
        </>
      )}
    </>
  );
}

export default DeleteAccount;

// import React, { useState } from "react";
// import axios, { AxiosError } from "axios";
// import { useCookies } from "react-cookie";

// function Login() {
//   const [email, setEmail] = useState("");
//   const [currentPassword, setCurrentPassword] = useState("");
//   const [cookies, setCookie, removeCookie] = useCookies([
//     "email",
//     "access-token",
//     "password",
//   ]);

//   const handleLogin = () => {
//     return axios({
//       method: "post",
//       url: `/user/withdraw`,
//       data: {
//         currentPassword,
//       },
//     })
//       .then((res) => {
//         console.log("로그인 성공!");
//         localStorage.removeItem("refresh_token");
//         removeCookie("access-token");
//         removeCookie("email");
//         removeCookie("password");
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   };
//   return (
//     <>
//       {/* <input
//         type="text"
//         placeholder="Email-ID"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       /> */}
//       <input
//         type="password"
//         placeholder="Password"
//         value={currentPassword}
//         onChange={(e) => setCurrentPassword(e.target.value)}
//       />
//       <button onClick={handleLogin}>탈퇴</button>
//     </>
//   );
// }

// export default Login;
