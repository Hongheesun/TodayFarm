//JSON 데이터와 File 데이터를 함께 보내기 위해선 Multipart/form-data를 이용하면 될 것!

import React, { useCallback, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

// import { useCookies } from "react-cookie";

interface User {
  email: string;
  password: string;
  nickname: string;
}

function Signup() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [isJoinSuccess, setJoinSuccess] = useState<boolean>(false);

  // catch error // file type 정해주기 - catch error
  const [file, setFile] = useState<File | null>(null);

  //e의 타입 React.ChangeEvent<HTMLInputElement>
  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) return;
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  }, []);

  const handleSignup = useCallback(async () => {
    if (!file) return;
    const formData = new FormData();

    // {
    //   await formData.append("profileImg", fol);
    // }
    await formData.append("profileImg", file);
    // for (let i = 0; i < 1; i++) {
    //   if(!file)
    //   formData.append("profileImg", file);
    // }

    const User: User = {
      email: email,
      password: password,
      nickname: nickname,
    };

    // catch error // 블랍과 뒤에 type 명시해주어야함!!!!!!
    await formData.append(
      "signUpRequestDto",
      new Blob([JSON.stringify(User)], { type: "application/json" })
    );

    return axios({
      method: "post",
      url: `/sign-up`,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        console.log(res.data);
        console.log("서버로 회원가입하기");
        // let userId = res.data.result.userId;
        // console.log(userId);
        // localStorage.setItem("userId", userId);
        setJoinSuccess(true);
      })
      .catch((err) => {
        console.log(err.res);
      });
  }, [file]);

  return (
    <div>
      {!isJoinSuccess && (
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
          <input
            type="nickname"
            placeholder="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          <input type={"file"} onChange={handleFile} />
          <button onClick={handleSignup}>회원가입</button>
        </>
      )}
      {isJoinSuccess && (
        <>
          <p>회원가입을 축하합니다!</p>
          <Link to="/login">로그인</Link>
        </>
      )}
    </div>
  );
}
export default Signup;
