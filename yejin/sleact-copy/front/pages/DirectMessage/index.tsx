import React, { useCallback } from "react";
import { Container, Header } from "./styles";
import gravatar from 'gravatar'
import useSWR from "swr";
import { useParams } from "react-router";
import fetcher from "@utils/fetcher";
import ChatBox from "@components/ChatBox";
import ChatList from "@components/ChatList";
import useInput from "@hooks/useInput";

const DirectMessage = () => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const { data: userData } = useSWR(`/api/workspaces/${workspace}/users/${id}`, fetcher); // 상대방 데이터
  const { data: myData } = useSWR('/api/users', fetcher);
  const [chat, onChangeChat] = useInput('');

  // hooks는 return보다 올려서 
  const onSubmitForm = useCallback((e) => {
    e.preventDefault();
    console.log('submit');
  }, []);

  // 로딩 중 or error 일 때 화면 띄우지 않기 
  if (!userData || !myData) {
    return null;
  }
  return (
    <Container>
      <Header>
        <img src={gravatar.url(userData.email, { s: '24px', d: 'retro' })} alt={userData.nickname} />
        <span>{userData.nickname}</span>
      </Header>
      <ChatList />
      <ChatBox
        onSubmitForm={onSubmitForm}
        chat={chat}
        onChangeChat={onChangeChat}
        placeholder={`Message ${userData.nickname}`}
        data={[]}
      />



    </Container>
  );
};

export default DirectMessage;