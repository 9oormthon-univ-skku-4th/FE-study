import React, { useCallback, VFC } from 'react';
import Modal from '@components/Modal';
import { Button, Input, Label } from '@pages/SignUp/styles';
import useInput from '@hooks/useInput';
import { useParams } from 'react-router';
import axios from 'axios';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import { IChannel, IUser } from '@typings/db';

interface Props {
  show: boolean;
  onCloseModal: () => void;
  setShowInviteChannelModal: (flag: boolean) => void;
}

const InviteChannelModal: VFC<Props> = ({ show, onCloseModal, setShowInviteChannelModal }) => {
  const [newMember, onChangeNewMember, setNewMember] = useInput  ('');
  const {workspace, channel} = useParams<{workspace: string; channel: string}>();

  const { data: userData, error, mutate } = useSWR<IUser>('/api/users', fetcher);

//   const { data: channelData, mutate: mutateChannel } = useSWR<IChannel[]>(
//     userData ? `/api/workspaces/${workspace}/channels` : null,
//     fetcher,
//   );
  const { data: memberData, mutate: mutateMember } = useSWR<IUser[]>(
    userData ? `/api/workspaces/${workspace}/channels/${channel}/members` : null,
    fetcher,
  );

  const onInviteMember = useCallback((e) => {
    e.preventDefault();
    if(!newMember || !newMember.trim()) return;
    

    axios.post(`/api/workspaces/${workspace}/channels/${channel}/members`, {
      email: newMember
    }, {
      withCredentials: true
    }).then(()=>{
      mutateMember();
      setShowInviteChannelModal(false);
      setNewMember('');
    })
    .catch((error) => {
      console.dir(error);
    });
  }, [newMember, workspace]);
  
  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onInviteMember}>
        <Label id="member-label">
          <span>이메일</span>
          <Input id="member" value={newMember} onChange={onChangeNewMember} />
        </Label>
        <Button type="submit">초대하기</Button>
      </form>
    </Modal>
  );
};

export default InviteChannelModal;
