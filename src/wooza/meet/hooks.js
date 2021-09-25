import { useEffect, useState } from 'react';

import config from './config';


const JitsiMeetJS = window.JitsiMeetJS;


export function useJitsiMeeting(meetingId) {
  const [localTracks, setLocalTracks] = useState([]);
  const [remoteParticipants, setRemoteParticipants] = useState([]);
  const [remoteTracks, setRemoteTracks] = useState({});

  const cleanedMeetingId = meetingId.toLowerCase();

  useEffect(() => {
    console.warn('JITSI: init', cleanedMeetingId);
    JitsiMeetJS.init();

    console.warn('JITSI: setup connection');
    const conn = new JitsiMeetJS.JitsiConnection(null, null, config);

    conn.addEventListener(
      JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED,
      function (evt) {
        console.warn('JITSI: connection established');

        console.warn('JITSI: setting up conference');
        const room = conn.initJitsiConference(cleanedMeetingId, {});

        room.on(
          JitsiMeetJS.events.conference.TRACK_ADDED,
          function onRemoteTrack(track) {
            console.warn('JITSI: conference TRACK_ADDED with track', track);
            if (track.isLocal()) {
              console.warn('is local!');
              return;
            }

            const participant = track.getParticipantId();
            setRemoteParticipants(prevRemoteParticipants => (
              prevRemoteParticipants.includes(participant)
                ? [...prevRemoteParticipants]
                : [...prevRemoteParticipants, participant]
            ));
            setRemoteTracks(prevRemoteTracks => ({
              ...prevRemoteTracks,
              [participant]: prevRemoteTracks[participant]
                ? [...prevRemoteTracks[participant], track]
                : [track],
            }));
          },
        );

        room.on(
          JitsiMeetJS.events.conference.CONFERENCE_JOINED,
          function onConferenceJoined() {
            console.warn('JITSI: conference CONFERENCE_JOINED');
          },
        );

        console.warn('JITSI: creating local tracks');
        JitsiMeetJS.createLocalTracks({devices: ['audio', 'video']}).then(function onLocalTracks(tracks) {
          console.warn('JITSI: onLocalTracks with tracks', tracks);
          for (let i = 0; i < tracks.length; i++) {
            const track = tracks[i];
            room.addTrack(track);
          }
          setLocalTracks(tracks);
        });

        console.warn('JITSI: joining room');
        room.join();
      },
    );

    conn.addEventListener(
      JitsiMeetJS.events.connection.CONNECTION_FAILED,
      function (evt) { console.warn('JITSI: connection failed'); },
    );
    conn.addEventListener(
      JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED,
      function (evt) { console.warn('JITSI: connection disconnect'); },
    );

    console.warn('JITSI: starting connection');
    conn.connect();

    return () => {
      // TODO: write cleanup code
      conn.disconnect();
    }
  }, [cleanedMeetingId]);

  return [localTracks, remoteParticipants, remoteTracks];
}
