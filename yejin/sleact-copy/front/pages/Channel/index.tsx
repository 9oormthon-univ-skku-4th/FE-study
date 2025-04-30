import React, { useCallback } from "react";
import { Container, Header } from "./styles";
import ChatList from "@components/ChatList";
import ChatBox from "@components/ChatBox";
import useInput from "@hooks/useInput";

const Channel = () => {
  const [chat, onChangeChat] = useInput('');
  const onSubmitForm = useCallback((e) => {
    e.preventDefault();
  }, []);

  return (
    <Container>
      <Header>채널!</Header>
      {/* <ChatList /> */}
      {/* <ChatBox
        onSubmitForm={onSubmitForm}
        chat={chat}
        onChangeChat={onChangeChat}
        placeholder={`Message #${channel}`}
        data={channelMembersData}
      /> */}
    </Container>

  );
};

export default Channel;