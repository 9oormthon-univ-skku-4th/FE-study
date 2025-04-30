import React, { forwardRef, memo, RefObject, useCallback, useRef, VFC } from 'react';
import { ChatZone, Section, StickyHeader } from '@components/ChatList/styles';
import { IDM } from '@typings/db';
import Chat from '@components/Chat';
import { Scrollbars } from 'react-custom-scrollbars';

interface Props {
  chatSections: { [key: string]: IDM[] };
  setSize: (f: (index: number) => number) => Promise<IDM[][] | undefined>;
  isEmpty: boolean;
  isReachingEnd: boolean;
  scrollRef: RefObject<Scrollbars>;
}

const ChatList: VFC<Props> = ({ chatSections, setSize, isEmpty, isReachingEnd, scrollRef }) => {
  const onScroll = useCallback(
    (values) => {
      if (values.scrollTop === 0 && !isReachingEnd && !isEmpty) {
        console.log('top', values.scrollHeight);

        setSize((prevSize) => prevSize + 1).then(() => {
          setTimeout(() => {
            if (scrollRef.current) {
              // keep scroll position
              // console.log(values.scrollHeight);
              // console.log(scrollRef.current?.getScrollHeight());
              scrollRef.current.scrollTop(scrollRef.current.getScrollHeight() - values.scrollHeight);
            }
          }, 50);
        });
      }
    },
    [setSize, scrollRef, isReachingEnd, isEmpty],
  );

  console.log(Object.entries(chatSections));
  return (
    <ChatZone>
      <Scrollbars autoHide ref={scrollRef} onScrollFrame={onScroll}>
        {Object.entries(chatSections).map(([date, chats]) => (
          <Section key={date}>
            <StickyHeader>
              <button>{date}</button>
            </StickyHeader>
            {chats.map((chat) => (
              <Chat key={chat.id} data={chat} />
            ))}
          </Section>
        ))}
      </Scrollbars>
    </ChatZone>
  );
};

export default memo(ChatList);
