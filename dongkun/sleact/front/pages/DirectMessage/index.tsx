import React, { useCallback, useEffect, useRef } from 'react';
import { Container, Header } from '@pages/DirectMessage/styles';
import fetcher from '@utils/fetcher';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite'
import { useParams } from 'react-router';
import { IDM, IUser } from '@typings/db';
import gravatar from 'gravatar';
import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import useInput from '@hooks/useInput';
import axios from 'axios';
import makeSection from '@utils/makeSection';
import Scrollbars from 'react-custom-scrollbars';

const DirectMessage = () => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const { data: myData } = useSWR<IUser>('/api/users', fetcher);
  const { data: userData } = useSWR<IUser>(`/api/workspaces/${workspace}/users/${id}`, fetcher);
  const { data: chatData, mutate: mutateChat, setSize } = useSWRInfinite<IDM[]>(
    (index) =>
    `/api/workspaces/${workspace}/dms/${id}/chats?perPage=${20}&page=${index+1}`,
    fetcher,
  );
  const isEmpty = chatData?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (chatData && chatData[chatData.length - 1]?.length < 20) || false;

  const [chat, onChangeChat, setChat] = useInput('');
  const scrollbarRef = useRef<Scrollbars>(null);

  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      if (chat?.trim()) {
        axios
          .post(`/api/workspaces/${workspace}/dms/${id}/chats`, {
            content: chat,
          })
          .then(() => {
            mutateChat();
            setChat('');
            scrollbarRef.current?.scrollToBottom();
          })
          .catch(console.error);
      }
      console.log(`submit: ${chat}`);
    },
    [chat],
  );

  // 로딩 시 스크롤바 제일 아래로
  useEffect(() => {
    if(chatData?.length===1){
      scrollbarRef.current?.scrollToBottom();
    }
  
  }, [chatData])
  

  if (!userData || !myData) {
    // 로딩중 또는 에러
    return null;
  }

  const chatSections = makeSection(chatData ? chatData.flat().reverse() : []);

  return (
    <Container>
      <Header>
        <img src={gravatar.url(userData.email, { size: '28px', d: 'retro' })} alt={userData.nickname} />
      </Header>
      <ChatList chatSections={chatSections} scrollRef={scrollbarRef} setSize={setSize} isEmpty={isEmpty} isReachingEnd={isReachingEnd}/>
      <ChatBox chat={chat} onSumbmitForm={onSubmitForm} onChangeChat={onChangeChat} />
    </Container>
  );
};

export default DirectMessage;
