import useInput from '@hooks/useInput';
import { Success, Form, Error, Label, Input, LinkContainer, Button, Header } from '@pages/SignUp/styles';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { useCallback, useState } from 'react';
import { Redirect } from 'react-router-dom';
import useSWR from 'swr';

const LogIn = () => {
  const { data: userData, error, mutate } = useSWR('/api/users', fetcher); // 로그인 페이지 들어오면 처음에 실행됨, data는 false
  const [logInError, setLogInError] = useState(false);
  const [email, onChangeEmail] = useInput('');
  const [password, onChangePassword] = useInput('');
  const onSubmit = useCallback( // 로그인 버튼 누르면 실행됨 
    (e) => {
      e.preventDefault();
      setLogInError(false);
      axios
        .post(
          '/api/users/login',
          { email, password },
          {
            withCredentials: true,
          },
        )
        .then(() => {
          mutate();
          // data, error가 바뀌는 순간 컴포넌트는 리렌더링됨 
        })
        .catch((error) => {
          console.dir(error);
          setLogInError(error.response?.status === 401);
        });
    },
    [email, password, mutate],
  );

  console.log(error, userData);
  if (!error && userData) {
    console.log('로그인됨', userData);
    return <Redirect to="/workspace/sleact/channel/일반" />;
  }

  // 로딩 중 
  if (userData === undefined) {
    return <div>로딩 중...</div>
  }

  if (userData) { // 로그인 성공 후에 채널로 가게 됨, data에 내 정보 들어있음  
    return <Redirect to="/workspace/sleact/channel/일반" />
  }

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
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
          {logInError && <Error>이메일과 비밀번호 조합이 일치하지 않습니다.</Error>}
        </Label>
        <Button type="submit">로그인</Button>
      </Form>
      <LinkContainer>
        아직 회원이 아니신가요?&nbsp;
        <a href="/signup">회원가입 하러가기</a>
      </LinkContainer>
    </div>
  );
};

export default LogIn;