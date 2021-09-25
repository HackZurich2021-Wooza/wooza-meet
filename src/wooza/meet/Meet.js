import config from './config';

const JitsiMeetJS = window.JitsiMeetJS;

function joinMeeting(meetingStr) {
  console.log('init Jitsi');
  JitsiMeetJS.init();

  console.log('setup connection');
  const conn = new JitsiMeetJS.JitsiConnection(
    null,
    null,
    config,
  );

  conn.addEventListener(
    JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED,
    (evt) => console.log('connection succes with args', arguments),
  );
  conn.addEventListener(
    JitsiMeetJS.events.connection.CONNECTION_FAILED,
    (evt) => console.log('connection failed with args', arguments),
  );
  conn.addEventListener(
    JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED,
    (evt) => console.log('connection disconnect with args', arguments),
  );

  console.log('start connection');
  conn.connect();
}


export default function Meet() {
  return (
    <>
      <h1>Meet</h1>
      <button onClick={joinMeeting.bind('ClassicDecembersRetainEventually')}>JOINNNNNN</button>
    </>
  );
}
