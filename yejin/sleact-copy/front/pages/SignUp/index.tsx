import React, { useCallback, useState } from "react";
import { Success, Form, Error, Label, Input, LinkContainer, Button, Header } from './styles';
import useInput from "@hooks/useinput";
import axios from "axios";

const SignUp = () => {
  const [email, onChangeEmail] = useInput('');
  const [nickname, onChangeNickname] = useInput('');

  const [password, , setPassword] = useInput(''); // 커스터마이징도 가능 
  const [passwordCheck, , setPasswordCheck] = useInput('');

  const [mismatchError, setMismatchError] = useState(false);
  const [signUpError, setSignUpError] = useState('');

  const [signUpSuccess, setSignUpSuccess] = useState(false);

  const onChangePassword = useCallback((e) => {
    setPassword(e.target.value);
    setMismatchError(e.target.value !== passwordCheck);
  }, [passwordCheck]);

  const onChangePasswordCheck = useCallback((e) => {
    setPasswordCheck(e.target.value);
    setMismatchError(e.target.value !== password);
  }, [password]);

  const onSubmit = useCallback((e) => { // useCallback이 있어야 값 기억, 바뀔 때 함수 재생성 할 수 있음 
    e.preventDefault();
    console.log(email, nickname, password, passwordCheck);

    if (!mismatchError) {
      console.log('서버로 회원가입하기')
      setSignUpError('');
      setSignUpSuccess(false);
      axios.post('http://localhost:3095/api/users', { // 포트 번호 유의 (3090이 3095'로' 보내는 것)
        email,
        nickname,
        password,
      }) // 요청을 어디로? -> 백엔드 API리스트 참고 (모든 주소들 앞에는 API 생략되어있는거임)
        // Promise
        .then((response) => {
          console.log(response);
          setSignUpSuccess(true);
        }) // 성공 
        .catch((error) => {
          console.log(error.response); // 콘솔에 data만 표시 ... 
          setSignUpError(error.response.data); // 에러 메세지를 화면에 표시하기 위함 
        }) // 실패 error는 axios에 담겨 있음 
        .finally(() => { }); // 항상 
    }

  }, [email, nickname, password, passwordCheck, mismatchError]);

  return (
    <div id="container">
      <Header>Sleact</Header>
      <Form onSubmit={onSubmit}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
          </div>
        </Label>
        <Label id="nickname-label">
          <span>닉네임</span>
          <div>
            <Input type="text" id="nickname" name="nickname" value={nickname} onChange={onChangeNickname} />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
        </Label>
        <Label id="password-check-label">
          <span>비밀번호 확인</span>
          <div>
            <Input
              type="password"
              id="password-check"
              name="password-check"
              value={passwordCheck}
              onChange={onChangePasswordCheck}
            />
          </div>
          {mismatchError && <Error>비밀번호가 일치하지 않습니다.</Error>}
          {!nickname && <Error>닉네임을 입력해주세요.</Error>}
          {signUpError && <Error>{signUpError}</Error>}
          {signUpSuccess && <Success>회원가입되었습니다! 로그인해주세요.</Success>}
        </Label>
        <Button type="submit">회원가입</Button>
      </Form>
      <LinkContainer>
        이미 회원이신가요?&nbsp;
        <a href="./login">로그인 하러가기</a>
        {/* <Link to="/login">로그인 하러가기</Link> */}
      </LinkContainer>
    </div>
  );
};

export default SignUp;