import { Channels, Chats, Header, LogOutButton, MenuScroll, ProfileImg, ProfileModal, RightMenu, WorkspaceName, Workspaces, WorkspaceWrapper } from '@layouts/Workspace/styles';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { FC, useCallback, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router';
import useSWR from 'swr';
import gravatar from 'gravatar';
import loadable from '@loadable/component';
import Menu from '@components/Menu';

const Channel = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));

const Workspace: FC = ({children}) => {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { data, error, mutate } = useSWR('http://localhost:3095/api/users', fetcher);
    
    const onLogout = useCallback(() => {
        axios
            .post('http://localhost:3095/api/users/logout', null, {
                withCredentials: true,
            })
            .then(() => {
                mutate(false, false);
            });
    }, []);

    const onClickUserProfile = useCallback(() => {
        setShowUserMenu((prev) => (!prev));
    }, []);

    if (!data) {
        return <Redirect to="/login" />;
    }

    return (
        <div>
            <Header>
                <RightMenu>
                    <span onClick={onClickUserProfile}>
                        <ProfileImg src={gravatar.url(data.email, {s: '28px', d: 'retro'})} alt={data.email} />
                        {showUserMenu && <Menu style={{ right: 0, top: 38 }} show={showUserMenu} onCloseModal={onClickUserProfile}>프로필메뉴
                           <ProfileModal>
                            <img src={gravatar.url(data.email, {s: '36px', d: 'retro'})} alt={data.email} />
                            <div>
                                <span id="profile-name">{data.email}</span>
                                <span id="profile-active">Active</span>
                            </div>
                           </ProfileModal>
                           <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
                            </Menu>}
                    </span>
                </RightMenu>
            </Header>
            <WorkspaceWrapper>
                <Workspaces>test</Workspaces>
                <Channels>
                    <WorkspaceName>Sleact</WorkspaceName>
                    <MenuScroll>
                        
                    </MenuScroll>
                </Channels>
                <Chats>
                    <Switch>
                        <Route path="/workspace/channel" component={Channel} />
                        <Route path="/workspace/dm" component={DirectMessage} />
                    </Switch>
                </Chats>
            </WorkspaceWrapper>
            {children} 
        </div>
        /*index에서 workspace 태그의 자식이 children*/
    )


}

export default Workspace;