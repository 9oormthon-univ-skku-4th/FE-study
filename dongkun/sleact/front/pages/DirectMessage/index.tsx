import React, { useCallback } from 'react';
import { Container, Header } from '@pages/DirectMessage/styles';
import fetcher from '@utils/fetcher';
import useSWR from 'swr';
import { useParams } from 'react-router';
import { IUser } from '@typings/db';
import gravatar from 'gravatar';
import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import useInput from '@hooks/useInput';

const DirectMessage = () => {
  const { workspace, id: dmid } = useParams<{ workspace: string; id: string }>();
  const { data: myData } = useSWR<IUser>('/api/users', fetcher);
  const { data: userData } = useSWR<IUser>(`/api/workspaces/${workspace}/users/${dmid}`, fetcher);

  const [chat, onChangeChat] = useInput('');

  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      console.log(`submit: ${chat}`);
    },
    [chat],
  );

  if (!userData || !myData) {
    // 로딩중 또는 에러
    return null;
  }

  return (
    <Container>
      <Header>
        <img src={gravatar.url(userData.email, { size: '28px', d: 'retro' })} alt={userData.nickname} />
      </Header>
      <ChatList />
      <ChatBox chat={chat} onSumbmitForm={onSubmitForm} onChangeChat={onChangeChat} />
    </Container>
  );
};

export default DirectMessage;