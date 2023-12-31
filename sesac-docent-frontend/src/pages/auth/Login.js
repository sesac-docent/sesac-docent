import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { validateEmail, validatePassword } from "utils/validate-input";
import { useInput } from "hooks/use-input";
import api from "apis/api";

import { SignInput } from "pages/auth/components/SignInput";
import { SignError } from "pages/auth/components/SignError";
import LoginImage from "assets/i_am_ground_wide.jpeg";
import { useDispatch } from "react-redux";
import { login } from "store/features/auth-slice";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const email = useInput(validateEmail);
  const password = useInput(validatePassword);
  const [isValid, setIsValid] = useState(true);
  const dispatch = useDispatch();

  const submitHandler = async (event) => {
    event.preventDefault();
    const valid = email.isValid && password.isValid;
    setIsValid(valid);

    if (!valid) {
      return;
    }

    const response = await axios.post("/user/login", {
      email: email.value,
      password: password.value,
    });

    const sessionIdCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("JSESSIONID"));

    console.log(document.cookie);

    if (sessionIdCookie) {
      console.log("세션 쿠키가 설정되었습니다.", sessionIdCookie);
    } else {
      console.log("세션 쿠키를 찾을 수 없습니다.");
    }

    const { username: name, authority: role, userId } = response.data;
    console.log({ username: name, authority: role, userId });
    dispatch(login({ email: email.value, name, role, userId }));
    if (!response?.error) {
      navigate("/");
    } else {
      console.log("Login Failed.");
      setIsValid(false);
    }
  };

  return (
    <div className="flex justify-center mt-24 mb-16">
      <div className="max-w-[1300px] flex justify-between">
        <div className="w-fit py-16 flex flex-col justify-center gap-8 mx-10">
          <p className="text-7xl font-bold">로그인</p>
          <p className="text-xl">
            더 현대 전시관을 방문해주셔서 감사합니다.
            <br />
            로그인하시면 홈페이지를 보다 편리하게 이용하실 수 있습니다.
          </p>
          <form className="flex flex-col gap-4 w-fit sm:w-[350px] md:w-[400px] lg:w-[450px] xl:w-[500px] 2xl:w-[560px]">
            <SignInput
              type="email"
              label="이메일"
              inputState={email}
              errorMessage="이메일 형식이 올바르지 않습니다."
            />
            <SignInput
              type="password"
              label="비밀번호"
              inputState={password}
              errorMessage="8~16자의 영문 대/소문자, 숫자, 특수문자를 사용해 주세요."
            />
            {!isValid && (
              <SignError message="아이디 또는 비밀번호를 다시 입력해주세요." />
            )}
            <div className="mt-3 w-full flex gap-4">
              <Link to="/findPassword" className="hover:underline">
                비밀번호 찾기
              </Link>
            </div>
            <div className="flex gap-4">
              <button
                onClick={submitHandler}
                className="w-fit h-fit px-4 py-2 border border-black text-lg font-bold hover:bg-black hover:text-white transition"
              >
                로그인
              </button>
              <Link
                to="/register"
                className="w-fit h-fit px-4 py-2 border border-black text-lg font-bold hover:bg-black hover:text-white transition"
              >
                회원가입
              </Link>
            </div>
          </form>
        </div>
        <div className="flex justify-center items-center">
          <div className="ml-24" style={{ aspectRatio: "20/13" }}>
            <img
              src={LoginImage}
              alt="I am Ground, ALT.1"
              className="h-auto object-cover w-[850px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
