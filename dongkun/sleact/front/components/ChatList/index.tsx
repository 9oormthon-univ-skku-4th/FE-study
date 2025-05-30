import React, { VFC } from 'react';
import { ChatZone, Section } from '@components/ChatList/styles';
import { IDM } from '@typings/db';
import Chat from '@components/Chat';

interface Props {
  chatData?: IDM[];
}

const ChatList: VFC<Props> = ({ chatData }) => {
  return (
    <ChatZone>
      <div>
        {chatData?.map((chat) => (
          <Chat key={chat.id} data={chat} />
        ))}
      </div>
    </ChatZone>
  );
};

export default ChatList;
