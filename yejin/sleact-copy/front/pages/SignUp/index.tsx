import React, { useCallback, useState } from "react";
import { Form, Error,  Label, Input, LinkContainer, Button, Header } from './styles';
import useInput from "@hooks/useinput";

const SignUp = () => {
  const [email, onChangeEmail] = useInput('');
  const [nickname, onChangeNickname] = useInput('');

  const [password, , setPassword] = useInput(''); // 커스터마이징도 가능 
  const [passwordCheck, , setPasswordCheck] = useInput('');

  const [mismatchError, setMismatchError] = useState(false);

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

    if(!mismatchError){
      console.log('서버로 회원가입하기')
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
          {/* {signUpError && <Error>{signUpError}</Error>} */}
          {/* {signUpSuccess && <Success>회원가입되었습니다! 로그인해주세요.</Success>} */}
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