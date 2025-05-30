import React, { useCallback, useEffect, useRef, VFC } from 'react';
import { ChatArea, Form, MentionsTextarea, SendButton, Toolbox } from '@components/ChatBox/styles';
import autosize from 'autosize';

interface Props {
  chat: string;
  onSumbmitForm: (e: any) => void;
  onChangeChat: (e: any) => void;
  placeholder?: string;
}

const ChatBox: VFC<Props> = ({ chat, onSumbmitForm, onChangeChat, placeholder }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if(textareaRef.current){
      autosize(textareaRef.current); 
    }
  }, [])
  
  const onKeyDown = useCallback((e) => {
    if (e.key == 'Enter' && !e.shiftKey) {
      onSumbmitForm(e);
    }
  }, [chat]);

  return (
    <ChatArea>
      <Form onSubmit={onSumbmitForm}>
        <MentionsTextarea 
        id='editor-chat'
        onKeyDown={onKeyDown} 
        onChange={onChangeChat} 
        value={chat}
        placeholder={placeholder}
        ref={textareaRef}
        />
        <Toolbox>
          <SendButton
            className={
              'c-button-unstyled c-icon_button c-icon_button--light c-icon_button--size_medium c-texty_input__button c-texty_input__button--send' +
              (chat?.trim() ? '' : ' c-texty_input__button--disabled')
            }
            data-qa="texty_send_button"
            aria-label="Send message"
            data-sk="tooltip_parent"
            type="submit"
            disabled={!chat?.trim()}
          >
          <i className="c-icon c-icon--paperplane-filled" aria-hidden="true" />
          </SendButton>
        </Toolbox>
      </Form>
    </ChatArea>
  );
};

export default ChatBox;
