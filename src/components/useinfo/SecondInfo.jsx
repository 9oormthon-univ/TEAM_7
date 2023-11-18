import React, { useState, useEffect } from "react";
import axios from "axios";
import { S } from "./Style";
import { apiClient } from "../../api/ApiClient";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/esm/locale";
import { BsCalendarHeart, BsCalendarWeek } from "react-icons/bs"
import { useCookies } from "react-cookie";

export default function Second() {
  /*const [cookies] = useCookies(["accessCookie", "refreshCookie"]);
  const accessCookie = cookies.accessCookie;
  const refreshCookie = cookies.refreshCookie;


//   localStorage.setItem("accessCookie", accessCookie);
//   localStorage.setItem("refreshCookie", refreshCookie);

  localStorage.setItem("accessCookie", cookies.accessCookie);
  localStorage.setItem("refreshCookie", cookies.refreshCookie);*/

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  // 더미데이터
  const DummyDate = {
    nickname: "KangSeungJun",
    birth: "1999-09-01",
    gender: "Y",
    dateOfIssue: "1999-09-01",
    barcodeCount: 4,
    profileImage: "https://www.example.com/profile.jpg",
    recentBarcodeImg: "https://www.example.com/barcode.jpg",
    recentBarcodeTitleList: ["Title 1", "Title 2", "Title 3"],
    modalActive: false,
  };

 // const dispatch = useDispatch();

  const getAccessCookie = localStorage.getItem("accessCookie");
  const getRefreshCookie = localStorage.getItem("refreshCookie");

  // 리덕스(userData 대신 사용)
  // const userInfo = useSelector((state) => state.userdata);
   // console.log("userInfo: ", userInfo);

  const [edit, setEdit] = useState(false);
  const [fileState, setFileState] = useState("");

  const [loading, setLoading] = useState(true);
  console.log("user", user);

  // 유저 데이터 실시간 수정
  const handleInfoChange = (e, field) => {
    const updatedUser = { ...user, [field]: e.target.value };
    setUser(updatedUser);
    console.log(updatedUser);

    // userinfo로
    // dispatch(userData(updatedUser));
  };

  // 로컬 상태 초기화
  const [user, setUser] = useState({
    nickname: "", // KangSeungJun
    birth: "", // 1999-09-01
    gender: "", // M or Y
    dateOfIssue: "", // 1999-09-01
    barcodeCount: "", //4
    profileImage: "", //https://www.ahdsfadsfafd~~~~ (url로 넘어갑니다!)
    recentBarcodeImg: "", // https://www.ahdsfadsfafd~~~~ (url로 넘어갑니다!)
    recentBarcodeTitleList: [], // String의 List로 넘어갑니다. 없으면 null
    modalActive: false,
  });

  // 유저 정보 get 메서드
  const getUserInfo = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_SERVER_HOST}/api/v1/user/user-info`,
        {
          headers: {
            // 쿠키 보냄
            Authorization: `Bearer ${getAccessCookie}`,
          },
        }
      );
      console.log("성공 : ", response.data);
      setUser(response.data);
      // dispatch(userInfoSlice.actions.userData(response.data));
      // setUser(response.data);

      // return하면 상태에 저장했던 데이터가 생길거죠
      return response.data;

      // 데이터 재세팅

 /*  if (response.data.modalActive === false) {
        alert("정보를 입력해주세요 !");
      }
      */
    } catch (error) {
      console.log(error);
    }
  };

   // redux와 user 동기화
   useEffect(() => {
      const { data } = getUserInfo();
// 데이터를 메서드로 따로 받은 후 세팅한다.
      setUser(data);
  }, []);

  // 프로필 이미지 핸들러
  const handleProfileImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setFileState(file);

      // 미리보기
      const objectUrl = URL.createObjectURL(file);

      setUser((user) => ({ ...user, profileImage: objectUrl }));

      console.log("image url: ", objectUrl);
      // console.log(user.profileImage);
    }
  };

  // 401
  // formData 전송, 편집 버튼 클릭 시
  const postUserInfo = async () => {
    const formData = new FormData();

    // 파일을 formdata로 전송
    formData.append("profileImage", fileState);

    formData.append("nickname", user.nickname);
    formData.append("birth", user.birth);
    formData.append("gender", user.gender);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_SERVER_HOST}/api/v1/user/user-info`,
        formData,
        // 서버에서 body로 요청을 했는지 확인해야함
        {
          headers: {
            // 쿠키 보냄, axios가 자동으로 Content-type 설정해줌.
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${getAccessCookie}`,
          },
        }
      );
      console.log("성공 formData : ", response.data);

      if (response.data.accessToken && response.data.refreshToken) {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
      }
    } catch (error) {
      console.error("실패 error : ", error);
    }
  };

  // 데이터 전송
  function handleEditUserInfo() {
    postUserInfo();
    setEdit(!edit);
  }

  function handleEdit() {
    setEdit(true);
  }

  return (
    <S.Book2Container>
      {!edit ? (
        <>
          <S.EditButton onClick={handleEdit} />
        </>
      ) : (
        <></>
      )}

      <S.ProfileBox>
        {
          user.profileImage &&  <S.Images src={user.profileImage} />
        }
      </S.ProfileBox>
      {edit ? (
        <>
          <S.ProfileLabel htmlFor="profileImage">
            프로필 사진
            <br />
            변경
          </S.ProfileLabel>
        </>
      ) : (
        <></>
      )}
      <S.InputProfile
        type="file"
        id="profileImage"
        name="profileImage"
        onChange={handleProfileImageChange}
        disabled={!edit}
      />
      <S.NickName>
        <S.Question>닉네임/Nick name</S.Question>
        <S.Answer
          type="text"
          value={user.nickname}
          id="nickname"
          name="nickname"
          onChange={(e) => handleInfoChange(e, "nickname")}
          readOnly={!edit}
          edit={edit}
          maxLength={8}
        />
      </S.NickName>
      <S.Date>
        <S.Question>생일/Date of birth</S.Question>
        
        <DatePicker
          className="input"
          dateFormat="yyyy-MM-dd"
          onChange={(date) => setStartDate(date)}
          locale={ko}
          selectsStart
          startDate={user.birth}
          endDate={endDate}
          readOnly={!edit}
          edit={edit}
        />
        <BsCalendarHeart />
      </S.Date>
      <S.Sex>
        <S.Question>성별</S.Question>
        {edit ? (
          <>
            <input
              type="radio"
              value="M"
              id="gender"
              name="gender"
              onChange={(e) => handleInfoChange(e, "gender")}
            />
            M
            <input
              type="radio"
              id="gender"
              value="Y"
              name="gender"
              onChange={(e) => handleInfoChange(e, "gender")}
            />
            Y
          </>
        ) : (
          <>
            <S.Answer
              type="text"
              value={
                user.gender === "M" ? "남성" : user.gender === "Y" ? "여성" : ""
              }
              readOnly
              edit={edit}
            />
          </>
        )}
      </S.Sex>
      <S.DateOfIssue>
        <S.Question readOnly>발급일/Date of issue</S.Question>
        {user.dateOfIssue}
      </S.DateOfIssue>
      <S.NunberBarcord>
        <S.Question readOnly>보유 바코드 수/Number</S.Question>
        {user.barcodeCount}
      </S.NunberBarcord>
      <S.UserBarcord>
        <S.Images src={user.recentBarcodeImg} />
      </S.UserBarcord>
      {edit ? (
        <>
          <S.SendButton type="submit" onClick={handleEditUserInfo}>
            저장
          </S.SendButton>
        </>
      ) : (
        <></>
      )}
    </S.Book2Container>
  );
}
