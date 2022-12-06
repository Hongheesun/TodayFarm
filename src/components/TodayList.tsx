import React, { useCallback, useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { BrowserRouter, Navigate, Link, Route, Routes } from "react-router-dom";
// import Modal from "./Modal";
// import DetailToday from "./TodayDetail";
export interface IProps {
  detail: { postId: number };
}

export default function TodayList(props: any) {
  const [cookies] = useCookies(["accessToken", "password"]);
  const [todaies, setTodaies] = useState<string[]>([]);
  // const [modal, setModal] = useState(false);
  // const [postId1, setPostId] = useState<number>(0);
  // const [detail, setDetail] = useState<IProps["detail"]>({
  //   postId: postId1,
  // });
  // console.log(props);
  // console.log(window.location);
  let userId: string | null = localStorage.getItem("userId");
  let month = 12;
  // const openModal = () => {
  // setModal(true);
  // setPostId(postId);
  // setDetail({ postId: postId1 });
  // console.log(postId);
  // };

  // const closeModal = (): void => {
  //   setModal(false);
  // };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`post/${userId}/${month}`, {
          headers: {
            Authorization: `Bearer ${cookies.accessToken}`,
          },
        });
        setTodaies(res.data.result.postInfoDtos);
        console.log(res.data.result.postInfoDtos);
      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
  }, []);

  if (!todaies) {
    return null;
  }
  return (
    <div>
      {/* {todaies.map((today: any) => {
        return (
          <div key={today.postId}>
            <div> 나의 기분 : {today.todayFeeling}</div>
            {today.postQuestions.map((contents: any) => {
              return (
                <div>
                  <div>
                    {contents.question} {contents.content}
                  </div>
                  <div>
                    {contents.postImgUrls.map((img: any) => {
                      return <div>{img.postImgUrl}</div>;
                    })}
                  </div>
                  <div>
                    {contents.postVideoUrls.map((video: any) => {
                      return <div>{video.postVideoUrl}</div>;
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })} */}
      {todaies.map((today: any) => (
        <Link to={`/todaylist/${today.postId}`}>
          <button
            key={today.postId}
            // onClick={() => {
            //   openModal();
            // }}
          >
            {today.creationDay}
          </button>
        </Link>
      ))}

      {/* <DetailToday></DetailToday> */}
      {/* <Routes>
        <Route path="/detailtoday" element={<DetailToday {...detail} />} />
      </Routes> */}
      {/* 
      {modal && (
        <Modal
        //closeModal={closeModal}
        // {...detail}
        />
      )} */}
    </div>
  );
}
