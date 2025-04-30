import { ChatArea, Form, MentionsTextarea, SendButton, Toolbox, EachMention } from '@components/ChatBox/styles';
import { IUser } from '@typings/db';
import React, { FC, useCallback, useEffect, useRef, VFC } from 'react';
import { Mention, SuggestionDataItem } from 'react-mentions';
import gravatar from 'gravatar';
import autosize from 'autosize';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import { useParams } from 'react-router';

interface Props {
  chat: string;
  onSubmitForm: (e: any) => void;
  onChangeChat: (e: any) => void;
  placeholder: string;
  data?: IUser[];
}

const ChatBox: VFC<Props> = ({ chat, onSubmitForm, onChangeChat, placeholder, data }) => {
  const { workspace } = useParams<{ workspace: string }>();
  const { data: userData, error, mutate } = useSWR<IUser | false>(
    '/api/users',
    fetcher,
    { dedupingInterval: 2000, }
  );
  const { data: memberData } = useSWR<IUser[]>(userData ? `/api/workspaces/${workspace}/members` : null,
    fetcher,);
  const textareaRef = useRef<HTMLTextAreaElement>(null); // 태그에 직접 접근할 때 ref 씀 
  useEffect(() => {
    if (textareaRef.current) {
      autosize(textareaRef.current);
    }
  }, []);
  //   const onSubmitForm = useCallback(() => {
  // // DM 보내기 ? 채널 메시지 보내기 ? -> 여기서 하면 안됨, 구체적인 작업은 props로 올려주기 
  //   }, []);
  const onKeydownChat = useCallback(
    (e) => {
      if (!e.nativeEvent.isComposing && e.key === 'Enter') {
        if (!e.shiftKey) {
          e.preventDefault();
          onSubmitForm(e);
        }
      }
    },
    [onSubmitForm],
  );

  const renderUserSuggestion: (
    suggestion: SuggestionDataItem,
    search: string,
    highlightedDisplay: React.ReactNode,
    index: number,
    focused: boolean,
  ) => React.ReactNode = useCallback(
    (member, search, highlightedDisplay, index, focus) => {
      if (!memberData) {
        return null;
      }
      return (
        <EachMention focus={focus}>
          <img src={gravatar.url(memberData[index].email, { s: '20px', d: 'retro' })} alt={memberData[index].nickname} />
          <span>{highlightedDisplay}</span>
        </EachMention>
      );
    },
    [memberData],
  );


  return (
    <ChatArea>
      <Form onSubmit={onSubmitForm}>
        {/* <MentionsTextarea >
          <input value={chat} onChange={onChangeChat}/>
        </MentionsTextarea> */}
        <MentionsTextarea
          id="editor-chat"
          value={chat}
          onChange={onChangeChat}
          onKeyPress={onKeydownChat}
          placeholder={placeholder}
          inputRef={textareaRef}
          forceSuggestionsAboveCursor
        >
          <Mention
            appendSpaceOnAdd
            trigger="@"
            data={memberData?.map((v) => ({ id: v.id, display: v.nickname })) || []}
            renderSuggestion={renderUserSuggestion}
          />
        </MentionsTextarea>
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