import React, { useCallback, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";

//유저 정보 변경
function EditAccount() {
  const [changePassword, setchangePassword] = useState<string>("");
  const [changeNickname, setchangeNickname] = useState<string>("");
  interface User {
    changeNickname: string;
    changePassword: string;
  }
  const [cookies] = useCookies(["accessToken", "password"]);
  const [file, setFile] = useState<File | null>(null);
  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) return;
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  }, []);
  const handleSubmit = useCallback(async () => {
    if (!file) return;
    const formData = new FormData();

    formData.append("profileImg", file);
    const User: User = {
      changeNickname: changeNickname,
      changePassword: changePassword,
    };
    formData.append(
      "userUpdateRequestDto",
      new Blob([JSON.stringify(User)], { type: "application/json" })
    );
    return axios({
      method: "patch",
      url: `/user/update`,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${cookies.accessToken}`,
      },
    })
      .then((res) => {
        console.log("수정 성공!");
        console.log(res.data);
        console.log(file);

        // navigator("/");
      })
      .catch((err) => {
        console.log(err);
      });
  }, [file]);
  console.log(file);
  return (
    <>
      <input
        type="newPassword"
        placeholder="password"
        value={changePassword}
        onChange={(e) => setchangePassword(e.target.value)}
      />
      <input
        type="newNickname"
        placeholder="newNickname"
        value={changeNickname}
        onChange={(e) => setchangeNickname(e.target.value)}
      />
      <input type={"file"} onChange={handleFile} />
      <button onClick={handleSubmit}>수정하기</button>
    </>
  );
}
export default EditAccount;
