import React, { memo, useMemo, VFC } from "react";
import { ChatWrapper } from "./styles";
import { IDM } from "@typings/db";
import gravatar from 'gravatar';
import dayjs from "dayjs";
import regexifyString from "regexify-string";
import { Link, useParams } from "react-router-dom";
import { channel } from "diagnostics_channel";

interface Props {
  data: IDM;
}

const Chat: VFC<Props> = ({ data }) => {
  const {workspace} = useParams<{workspace: string; channel: string}>();
  const user = data.Sender;

  // @[제로초](7)
  // \d 숫자      +는 1개 이상 ?는 0개나 1가 *은 0개 이상    g는 모두 찾기 
  const result = useMemo(()=>regexifyString({
    input: data.content,
    pattern: /@\[(.+?)]\((\d+?)\)|\n/g,
    decorator(match, index) {
      const arr: string[] | null = match.match(/@\[(.+?)]\((\d+?)\)/)!;
      // id만 찾아서 id에 걸리는 게 있으면 
      if (arr) {
        return (
          <Link key={match + index} to={`/workspace/${workspace}/dm/${arr[2]}`} >
            @{arr[1]}
          </Link>
        )
      }
      return <br key={index} />; // 줄바꿈 
    },
  }), [data.content]);

  return (
    <ChatWrapper>
      <div className="chat-img">
        <img src={gravatar.url(user.email, { s: '36px', d: 'retro' })} alt={user.nickname} />
      </div>
      <div className="chat-text">
        <div className="chat-user">
          <b>{user.nickname}</b>
          <span>{dayjs(data.createdAt).format('h:mm A')}</span>
        </div>
        <p>{result}</p>
      </div>
    </ChatWrapper>
  );
};

export default memo(Chat);