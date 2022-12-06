import React, { useState, useEffect } from "react";
import { IProps } from "./TodayList";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
// import TodayUpdate from "./TodayUpdate";

export default function TodayDetail(): JSX.Element {
  const [cookies] = useCookies(["accessToken", "password"]);
  const [postQuestions, setPostQuestions] = useState<string[]>([]);
  const [creationDay, setCreationDay] = useState("");
  const [todayFeeling, setTodayFeeling] = useState("");
  const params = useParams();
  const todayId = params.id;
  const amazonUrl = `https://todayproject-bucket.s3.ap-northeast-2.amazonaws.com/`;

  async function getDetailToday() {
    return axios({
      method: "get",
      url: `/post/${todayId}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.accessToken}`,
      },
    })
      .then((res) => {
        console.log(res.data.result);
        setPostQuestions(res.data.result.postQuestions);
        setCreationDay(res.data.result.creationDay);
        setTodayFeeling(res.data.result.todayFeeling);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    const fetchData = async () => {
      await getDetailToday();
    };
    fetchData();
  }, []);

  async function deleteToday() {
    // try {
    //   const res = await axios.delete(`post/delete/${todayId}`, {
    //     headers: {
    //       Authorization: `Bearer ${cookies.accessToken}`,
    //     },
    //   });
    //   console.log(res);
    //   alert("정상적으로 삭제되었습니다.");
    // } catch (e) {
    //   console.log(e);
    // }
    return axios({
      method: "delete",
      url: `/post/delete/${todayId}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.accessToken}`,
      },
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div>
      <div>날짜 : {creationDay}</div>
      <div>나의 기분 : {todayFeeling}</div>
      {postQuestions.map((today: any) => {
        return (
          <div>
            <div>{today.question}</div>
            <div>{today.content}</div>
            {today.postImgUrls.map((img: any) => {
              return <img src={`${amazonUrl}${img.postImgUrl}`} />;
            })}
            {today.postVideoUrls.map((video: any) => {
              return (
                <video controls src={`${amazonUrl}${video.postVideoUrl}`} />
              );
            })}
          </div>
        );
      })}
      <Link to={`/todaylist/update/${todayId}`}>
        {/* <TodayUpdate></TodayUpdate> */}
        <button>수정하기</button>
      </Link>

      <button onClick={deleteToday}>삭제하기</button>
    </div>
  );
}
