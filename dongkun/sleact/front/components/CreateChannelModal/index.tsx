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
  setShowCreateChannelModal: (flag: boolean) => void;
}

const CreateChannelModal: VFC<Props> = ({ show, onCloseModal, setShowCreateChannelModal }) => {
  const [newChannel, onChangeNewChannel, setNewChannel] = useInput  ('');
  const {workspace, channel} = useParams<{workspace: string; channel: string}>();

  const { data: userData, error, mutate } = useSWR<IUser>('http://localhost:3095/api/users', fetcher);

  const { data: channelData, mutate: mutateChannel } = useSWR<IChannel[]>(
    userData ? `http://localhost:3095/api/workspaces/${workspace}/channels` : null,
    fetcher,
  );

  const onCreateChannel = useCallback((e) => {
    e.preventDefault();

    axios.post(`http://localhost:3095/api/workspaces/${workspace}/channels`, {
      name: newChannel
    }, {
      withCredentials: true
    }).then(()=>{
      mutateChannel();
      setShowCreateChannelModal(false);
      setNewChannel('');
    })
    .catch((error) => {
      console.dir(error);
    });
  }, [newChannel]);
  
  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onCreateChannel}>
        <Label id="channel-label">
          <span>채널</span>
          <Input id="channel" value={newChannel} onChange={onChangeNewChannel} />
        </Label>
        <Button type="submit">생성하기</Button>
      </form>
    </Modal>
  );
};

export default CreateChannelModal;
