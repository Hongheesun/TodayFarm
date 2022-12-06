import React, { useCallback, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { Navigate } from "react-router-dom";

const questions = [
  "오늘 먹은 음식은?",
  "오늘 기록하고 싶은 일은?",
  "오늘을 한 단어로 정리하자면?",
  "오늘 만난 사람은?",
  "오늘 나에게 하고 싶은 말이 있다면?",
];

const getRandomQuestion = (): string => {
  return questions[Math.floor(Math.random() * questions.length)];
};

function Today() {
  const [question1, setQuestion1] = useState<string>(getRandomQuestion());
  const [question2, setQuestion2] = useState<string>(getRandomQuestion());
  const [content1, setContent1] = useState<string>("");
  const [content2, setContent2] = useState<string>("");
  const [todayFeeling, setTodayFeeling] = useState<string>("");
  const [imgFile, setImgFile] = useState<any[]>([]);
  const [videoFile, setVideoFile] = useState<any[]>([]);
  const [cookies] = useCookies(["accessToken", "password"]);

  const handleImgFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files === null) return;
      setImgFile([...imgFile, ...e.target.files]);
    },
    []
  );

  const handleVideoFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files === null) return;
      setVideoFile([...videoFile, ...e.target.files]);
    },
    []
  );

  const handleToday = async () => {
    if (!imgFile) return;

    const formData = new FormData();
    for (let i = 0; i < imgFile.length; i++) {
      formData.append("uploadImgs", imgFile[i]);
    }

    for (let i = 0; i < videoFile.length; i++) {
      formData.append("uploadVideos", videoFile[i]);
    }

    const randomQuestion = getRandomQuestion();
    setQuestion1(randomQuestion);
    setQuestion2(randomQuestion);

    const TodayPost = {
      postQuestions: [
        {
          question: question1,
          content: content1,
          imgCount: imgFile.length,
          videoCount: videoFile.length,
        },
        {
          question: question2,
          content: content2,
          imgCount: imgFile.length,
          videoCount: videoFile.length,
        },
      ],
      todayFeeling: todayFeeling,
      canPublicAccess: true,
    };

    await formData.append(
      "postSaveDto",
      new Blob([JSON.stringify(TodayPost)], { type: "application/json" })
    );

    return axios({
      method: "post",
      url: `/post/save`,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${cookies.accessToken}`,
      },
    })
      .then((res) => {
        console.log("글 등록 성공!");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <div>
        <p>오늘의 기분을 입력하세요</p>
        <input
          type="text"
          placeholder="기분 입력하기"
          value={todayFeeling}
          onChange={(e) => setTodayFeeling(e.target.value)}
        />
      </div>
      <div>
        <p>{question1}</p>
        <input
          type="text"
          placeholder="내용 입력하기"
          value={content1}
          onChange={(e) => setContent1(e.target.value)}
        />
        <input type={"file"} onChange={handleImgFile} multiple />
        <input type={"file"} onChange={handleVideoFile} multiple />
      </div>
      <div>
        <p>{question2}</p>
        <input
          type="text"
          placeholder="내용 입력하기"
          value={content2}
          onChange={(e) => setContent2(e.target.value)}
        />
        <input type={"file"} onChange={handleImgFile} multiple />
        <input type={"file"} onChange={handleVideoFile} multiple />
      </div>

      <button onClick={handleToday}>등록하기</button>
    </>
  );
}

export default Today;
