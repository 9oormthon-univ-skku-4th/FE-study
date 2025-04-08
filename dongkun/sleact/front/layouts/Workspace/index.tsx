import { Channels, Chats, Header, MenuScroll, ProfileImg, RightMenu, WorkspaceName, Workspaces, WorkspaceWrapper } from '@layouts/Workspace/styles';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { FC, useCallback } from 'react';
import { Redirect } from 'react-router';
import useSWR from 'swr';
import gravatar from 'gravatar';

const Workspace: FC = ({ children }) => {
  const { data, error, mutate } = useSWR('http://localhost:3095/api/users', fetcher);

  const onLogout = useCallback(() => {
    axios.post('http://localhost:3095/api/users/logout', null, { withCredentials: true }).then(() => {
      mutate();
    });
  }, []);

  if (data === undefined) {
    return <div>로딩중...</div>;
  }
  if (!data) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
      <Header>
        Test
        <RightMenu>
          <span>
            <ProfileImg src={gravatar.url(data.email, { size: '28px', d: 'retro' })} alt={data.nickname} />
          </span>
        </RightMenu>
      </Header>
      <button onClick={onLogout}>로그아웃</button>
      <WorkspaceWrapper>
        <Workspaces>workspaces</Workspaces>
        <Channels>
            <WorkspaceName>Sleact</WorkspaceName>
            <MenuScroll>Menu Scroll</MenuScroll>
        </Channels>
        <Chats>Chats</Chats>
      </WorkspaceWrapper>
      {children}
    </div>
  );
};

export default Workspace;
