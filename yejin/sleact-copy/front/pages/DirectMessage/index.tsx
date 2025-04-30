import React, { useCallback } from "react";
import { Container, Header } from "./styles";
import gravatar from 'gravatar'
import useSWR from "swr";
import { useParams } from "react-router";
import fetcher from "@utils/fetcher";
import ChatBox from "@components/ChatBox";
import ChatList from "@components/ChatList";
import useInput from "@hooks/useInput";
import axios from "axios";
import { IDM } from "@typings/db";
import makeSection from "@utils/makeSection";

const DirectMessage = () => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const { data: userData } = useSWR(`/api/workspaces/${workspace}/users/${id}`, fetcher); // 상대방 데이터
  const { data: myData } = useSWR('/api/users', fetcher);
  const [chat, onChangeChat, setChat] = useInput('');

  const { data: chatData, mutate: mutateChat } = useSWR<IDM[]>( // 채팅 받아오기 
    `/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=1`,
    fetcher,
  );

  // hooks는 return보다 올려서 
  const onSubmitForm = useCallback((e) => {
    e.preventDefault();
    console.log('submit');
    if (chat?.trim()) {
      axios
        .post(`/api/workspaces/${workspace}/dms/${id}/chats`, {
          content: chat,
        })
        .then(() => {
          setChat(''); // 채팅창에 있던 글자 지우기 
        })
        .catch(console.error);
    }
  }, [chat, workspace, id]);
  
  // const onSubmitForm = useCallback(
  //   (e) => {
  //     e.preventDefault();
  //     if (chat?.trim() && chatData) {
  //       const savedChat = chat;
  //       mutateChat((prevChatData) => {
  //         prevChatData?.[0].unshift({
  //           id: (chatData[0][0]?.id || 0) + 1,
  //           content: savedChat,
  //           SenderId: myData.id,
  //           Sender: myData,
  //           ReceiverId: userData.id,
  //           Receiver: userData,
  //           createdAt: new Date(),
  //         });
  //         return prevChatData;
  //       }, false).then(() => {
  //         localStorage.setItem(`${workspace}-${id}`, new Date().getTime().toString());
  //         setChat('');
  //         if (scrollbarRef.current) {
  //           console.log('scrollToBottom!', scrollbarRef.current?.getValues());
  //           scrollbarRef.current.scrollToBottom();
  //         }
  //       });
  //       axios
  //         .post(`/api/workspaces/${workspace}/dms/${id}/chats`, {
  //           content: chat,
  //         })
  //         .catch(console.error);
  //     }
  //   },
  //   [chat, workspace, id, myData, userData, chatData, mutateChat, setChat],
  // );

  // 로딩 중 or error 일 때 화면 띄우지 않기 
  if (!userData || !myData) {
    return null;
  }

  const chatSections = makeSection(chatData ? [...chatData].reverse() : [])

  return (
    <Container>
      <Header>
        <img src={gravatar.url(userData.email, { s: '24px', d: 'retro' })} alt={userData.nickname} />
        <span>{userData.nickname}</span>
      </Header>
      <ChatList chatSections={chatSections} />
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