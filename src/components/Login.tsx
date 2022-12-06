import React, { useState } from "react";
import axios, { AxiosRequestConfig } from "axios";
import { useCookies } from "react-cookie";
import { Navigate } from "react-router-dom";
import mem from "mem";

function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoginSuccess, setLoginSuccess] = useState<boolean>(false);
  const [cookies, setCookie, getCookie] = useCookies<string>(["accessToken"]);

  const handleLogin = () => {
    return axios({
      method: "post",
      url: `/login`,
      data: {
        email,
        password,
      },
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        console.log("로그인 성공!");
        console.log(res);
        // refreshToken 추가했음
        let refreshToken: string = res.headers["authorization-refresh"]!;
        let accessToken = res.headers.authorization;
        setCookie("accessToken", accessToken);
        // setCookie("refreshToken", refreshToken);
        localStorage.setItem("refreshToken", refreshToken);
        let userId = res.data.userId;
        localStorage.setItem("userId", userId);
        setLoginSuccess(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      {!isLoginSuccess && (
        <>
          <input
            type="text"
            placeholder="Email-ID"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin}>로그인</button>
        </>
      )}
      {isLoginSuccess && <Navigate to="/" />}
    </>
  );
}

export default Login;
