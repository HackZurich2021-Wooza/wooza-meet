import config from './config';


const JitsiMeetJS = window.JitsiMeetJS;


let localTracks = [];
let remoteTracks = {};


function joinMeeting(meetingStr) {
  localTracks = [];
  remoteTracks = {};

  console.warn('init Jitsi for meeting', meetingStr);
  JitsiMeetJS.init();

  console.warn('setup connection');
  const conn = new JitsiMeetJS.JitsiConnection(null, null, config);

  conn.addEventListener(
    JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED,
    function (evt) {
      console.warn('connection established with args', arguments);

      console.warn('setup room');
      const room = conn.initJitsiConference(meetingStr, {});
      room.on(
        JitsiMeetJS.events.conference.TRACK_ADDED,
        function onRemoteTrack(track) {
          console.warn('conference TRACK_ADDED with track', track);
          if (track.isLocal()) {
            console.warn('is local!');
            return;
          }

          const participant = track.getParticipantId();
          if (!remoteTracks[participant]) {
            remoteTracks[participant] = [];
          }
          const idx = remoteTracks[participant].push(track);

          const id = participant + track.getType() + idx;
          if (track.getType() === 'video') {
            window.$('body').append(`<video autoplay='1' id='${participant}video${idx}' />`);
          } else {
            window.$('body').append(`<audio autoplay='1' id='${participant}audio${idx}' />`);
          }
          track.attach(window.$(`#${id}`)[0]);
        },
      );
      room.on(
        JitsiMeetJS.events.conference.CONFERENCE_JOINED,
        function onConferenceJoined() {
          console.warn('conference CONFERENCE_JOINED with args', arguments);

          console.warn('room is', room);
        },
      );

      console.warn('add local tracks');
      JitsiMeetJS.createLocalTracks({devices: ['audio', 'video']}).then(function onLocalTracks(tracks) {
        console.warn('Jitsi onLocalTracks with tracks', tracks);
        for (let i = 0; i < tracks.length; i++) {
          const track = tracks[i];

          localTracks.push(track);
          room.addTrack(track);

          if (track.getType() === 'video') {
            window.$('body').append(`<video autoplay='1' id='localVideo${i}' />`);
            track.attach(window.$(`#localVideo${i}`)[0]);
          } else {
            window.$('body').append(`<audio autoplay='1' muted='true' id='localAudio${i}' />`);
            track.attach(window.$(`#localAudio${i}`)[0]);
          }
        }
      });

      console.warn('join room');
      room.join();
    },
  );

  conn.addEventListener(
    JitsiMeetJS.events.connection.CONNECTION_FAILED,
    function (evt) { console.warn('connection failed with args', arguments); },
  );
  conn.addEventListener(
    JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED,
    function (evt) { console.warn('connection disconnect with args', arguments); },
  );

  console.warn('start connection');
  conn.connect();
}


export default function Meet() {
  return (
    <>
      <h1>Meet</h1>
      <button onClick={
        () => joinMeeting('ClassicDecembersRetainEventually'.toLowerCase())
      }>JOINNNNNN</button>
    </>
  );
}
