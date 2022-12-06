import React, { useCallback, useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useParams } from "react-router";

function TodayUpdate() {
  const [updateContent1, setUpdateContent1] = useState<any>("");
  const [updateContent2, setUpdateContent2] = useState<any>("");
  const [questionId1, setQuestionId1] = useState();
  const [questionId2, setQuestionId2] = useState();
  const [question1, setQuestion1] = useState();
  const [question2, setQuestion2] = useState();
  const [postQuestions, setPostQuestions] = useState<any[]>([]);
  const [imgId, setImgId] = useState<number[]>([]);
  const [videoId, setVideoId] = useState<number[]>([]);
  const [creationDay, setCreationDay] = useState<string>("");
  const [todayFeeling, setTodayFeeling] = useState<any>("");
  const [imgFile, setimgFile] = useState<any[]>([]);
  const [videoFile, setvideoFile] = useState<any[]>([]);
  const [cookies] = useCookies(["accessToken", "password"]);
  const [visible, setVisible] = useState(true);
  const [imgFiles1, setImgFiles1] = useState();
  const [imgFiles2, setImgFiles2] = useState();
  const [videoFiles1, setVideoFiles1] = useState();
  const [videoFiles2, setVideoFiles2] = useState();

  const params = useParams();
  const todayId = params.id;
  const amazonUrl = `https://todayproject-bucket.s3.ap-northeast-2.amazonaws.com/`;

  // console.log(imgId);
  // console.log(videoId);
  // console.log(postQuestions[0]);

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
        //  console.log(res.data.result);
        const todayData = res.data.result;
        const todayPostQuestios = res.data.result.postQuestions;
        setPostQuestions(todayPostQuestios);
        setCreationDay(todayData.creationDay);
        setTodayFeeling(todayData.todayFeeling);
        setQuestionId1(todayPostQuestios[0].questionId);
        setQuestionId2(todayPostQuestios[1].questionId);
        setQuestion1(todayPostQuestios[0].question);
        setQuestion2(todayPostQuestios[1].question);
        setImgFiles1(renderImgFiles(0, todayPostQuestios));
        setImgFiles2(renderImgFiles(1, todayPostQuestios));
        setVideoFiles1(renderVideoFiles(0, todayPostQuestios));
        setVideoFiles2(renderVideoFiles(1, todayPostQuestios));
      })
      .catch((err) => {
        console.log(err);
      });
  }
  const renderImgFiles = (index: number, dataName: any) => {
    return dataName[index].postImgUrls.map((img: any) => {
      return (
        <div>
          <button
            onClick={() => {
              setImgId((imgId) => [...imgId, img.postImgUrlId]);
              setVisible(false);
            }}
          >
            X
          </button>
          {visible && <img src={`${amazonUrl}${img.postImgUrl}`} />}
        </div>
      );
    });
  };
  const renderVideoFiles = (index: number, dataName: any) => {
    return dataName[index].postVideoUrls.map((video: any) => {
      return (
        <div>
          <button
            onClick={() => {
              setVideoId((videoId) => [...videoId, video.postVideoUrlId]);
              setVisible(false);
            }}
          >
            X
          </button>
          {visible && (
            <video controls src={`${amazonUrl}${video.postVideoUrl}`} />
          )}
        </div>
      );
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      await getDetailToday();
    };
    fetchData();
  }, []);

  const handleImgFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files === null) return;
      setimgFile([...imgFile, ...e.target.files]);
    },
    []
  );

  const handleVideoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) return;
    setvideoFile([...videoFile, ...e.target.files]);
  };

  const handleTodayUpdate = async () => {
    //if (!imgFile) return;

    const formData = new FormData();
    for (let i = 0; i < imgFile.length; i++) {
      formData.append("addImgs", imgFile[i]);
    }

    for (let i = 0; i < videoFile.length; i++) {
      formData.append("addVideos", videoFile[i]);
    }

    const TodayPost = {
      postQuestions: [
        {
          questionId: questionId1,
          content: updateContent1,
          deleteImgUrlId: imgId,
          deleteVideoUrlId: videoId,
          addImgCount: imgFile.length,
          addVideoCount: videoFile.length,
        },
        {
          questionId: questionId2,
          content: updateContent2,
          deleteImgUrlId: imgId,
          deleteVideoUrlId: videoId,
          addImgCount: imgFile.length,
          addVideoCount: videoFile.length,
        },
      ],
      todayFeeling: todayFeeling,
      canPublicAccess: true,
    };

    await formData.append(
      "postUpdateDto",
      new Blob([JSON.stringify(TodayPost)], { type: "application/json" })
    );

    console.log(formData);

    return axios({
      method: "PATCH",
      url: `/post/update/${todayId}`,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${cookies.accessToken}`,
      },
    })
      .then((res) => {
        console.log("글 수정 성공!");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  //, [updateImgFile, updateVideoFile]);

  return (
    <>
      <div>
        <p>오늘의 기분을 입력하세요</p>
        <input
          type="text"
          placeholder="변경할 기분 입력하기"
          value={todayFeeling}
          onChange={(e) => setTodayFeeling(e.target.value)}
        />
      </div>
      <div>
        <p>{question1}</p>
        {/* {postQuestions[0].content} */}
        <input
          type="text"
          placeholder="내용 입력하기"
          value={updateContent1}
          onChange={(e) => setUpdateContent1(e.target.value)}
        />
        <div>
          {imgFiles1}
          {videoFiles1}
          <input type={"file"} onChange={handleImgFile} multiple />
          <input type={"file"} onChange={handleVideoFile} multiple />
        </div>
        <div>
          <p>{question2}</p>
          {/* {postQuestions[1].content} */}
          <input
            type="text"
            placeholder="내용 입력하기"
            value={updateContent2}
            onChange={(e) => setUpdateContent2(e.target.value)}
          />
          {imgFiles2}
          {videoFiles2}
          <input type={"file"} onChange={handleImgFile} multiple />
          <input type={"file"} onChange={handleVideoFile} multiple />
        </div>
      </div>
      <button onClick={handleTodayUpdate}>수정하기</button>
    </>
  );
}

export default TodayUpdate;
