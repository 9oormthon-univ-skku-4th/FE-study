import React, { useCallback } from 'react';
import { Container, Header } from '@pages/Channel/styles';
import ChatList from '@components/ChatList';
import ChatBox from '@components/ChatBox';
import fetcher from '@utils/fetcher';
import { useParams } from 'react-router';
import useSWR from 'swr';
import { IUser } from '@typings/db';
import useInput from '@hooks/useInput';

const Channel = () => {
  const { workspace, channel } = useParams<{ workspace: string; channel: string }>();
  const { data: myData } = useSWR<IUser>('/api/users', fetcher);
  const { data: userData } = useSWR<IUser[]>(`/api/workspaces/${workspace}/channels/${channel}/members`, fetcher);

  const [chat, onChangeChat, setChat] = useInput('');

  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      console.log(`submit: ${chat}`);
      setChat('');
    },
    [chat],
  );

  if (!userData || !myData) {
    // 로딩중 또는 에러
    return null;
  }

  return (
    <Container>
      <Header>채널!</Header>
      <ChatList />
      <ChatBox chat={chat} onSumbmitForm={onSubmitForm} onChangeChat={onChangeChat} />
    </Container>
  );
};

export default Channel;
