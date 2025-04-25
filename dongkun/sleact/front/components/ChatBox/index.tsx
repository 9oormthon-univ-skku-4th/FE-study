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
            <svg
              data-fr8="true"
              data-qa="send-filled"
              aria-hidden="true"
              viewBox="0 0 20 20"
              className=""
              style={{ width: '1em', height: '1em' }}
            >
              <path
                fill="currentColor"
                d="M1.5 2.25a.755.755 0 0 1 1-.71l15.596 7.808a.73.73 0 0 1 0 1.305L2.5 18.462l-.076.018a.75.75 0 0 1-.924-.728v-4.54c0-1.21.97-2.229 2.21-2.25l6.54-.17c.27-.01.75-.24.75-.79s-.5-.79-.75-.79l-6.54-.17A2.253 2.253 0 0 1 1.5 6.79z"
              ></path>
            </svg>
          </SendButton>
        </Toolbox>
      </Form>
    </ChatArea>
  );
};

export default ChatBox;
