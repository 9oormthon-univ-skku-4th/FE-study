import { disconnect } from 'process';
import { useCallback } from 'react';
// import { io, Socket } from 'socket.io-client';
import io from 'socket.io-client';


// const backUrl = process.env.NODE_ENV === 'production' ? 'https://sleact.nodebird.com' : 'http://localhost:3095';
// const sockets: { [key: string]: Socket } = {};
// const useSocket = (workspace?: string): [Socket | undefined, () => void] => {
//   const disconnect = useCallback(() => {
//     if (workspace && sockets[workspace]) {
//       console.log('소켓 연결 끊음');
//       sockets[workspace].disconnect();
//       delete sockets[workspace];
//     }
//   }, [workspace]);
//   if (!workspace) {
//     return [undefined, disconnect];
//   }
//   if (!sockets[workspace]) {
//     sockets[workspace] = io(`${backUrl}/ws-${workspace}`, {
//       transports: ['websocket'],
//     });
//     console.info('create socket', workspace, sockets[workspace]);
//     sockets[workspace].on('connect_error', (err) => {
//       console.error(err);
//       console.log(`connect_error due to ${err.message}`);
//     });
//   }

//   return [sockets[workspace], disconnect];
// };

const sockets: { [key: string]: SocketIOClient.Socket } = {};
const backUrl = 'http://localhost:3095';
const useSocket = (workspace?: string): [SocketIOClient.Socket | undefined, () => void] => {
  const disconnect = useCallback(() => {
    if (workspace) {
      sockets[workspace].disconnect();
      delete sockets[workspace]; // 연결 끊을 때 지워버리기 
    }
  }, [workspace]);

  if (!workspace) {
    return [undefined, disconnect];
  }

  if (!sockets[workspace]) { // 없을 때만 만들기 
    sockets[workspace] = io.connect(`${backUrl}/ws-${workspace}`, {
      transports: ['websocket'] // polling하지 말고 웹소켓 써라 
    });
  }




  return [sockets[workspace], disconnect]
};

export default useSocket;