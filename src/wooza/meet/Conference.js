import { useParams } from 'react-router-dom';

import ParticipantDisplay from './components/ParticipantDisplay';
import { useJitsiMeeting } from './hooks';


const styles = {
  container: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#474747'
  },
  innerContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    width: '400px',
    height: '300px',
    margin: '10px',
    backgroundColor: '#474747'
  },
  logo: {
    position: 'absolute',
    top: '10px',
    left: '10px',
    width: '180px'
  },
  header: {
    color: 'white',
    fontFamily: 'Source Sans Pro'
  },
  footer: {
    width: '100%',
    position: 'absolute',
    bottom: '0'
  }
};


export default function Conference() {
  const { meetingId } = useParams();

  const [localTracks, remoteParticipants, remoteTracks] = useJitsiMeeting(meetingId);

  const participants = remoteParticipants.slice(-2);
  console.warn('PARTICIPANTS', remoteParticipants);

  return (
    <div style={styles.container}>
      <img style={styles.logo} src="../Logo_Wooza_White.png" alt="" />
      <h1 style={styles.header}>Kickoff - Blockchain meets AI 4.0</h1>
      <div style={styles.innerContainer}>
        <div style={styles.item}>
          <ParticipantDisplay tracks={localTracks} disableAudio={true} />
        </div>
        <div style={styles.item}>
          {participants.length > 0 ? <ParticipantDisplay tracks={remoteTracks[participants[0]]} /> : null}
        </div>
        <div style={styles.item}>
          {participants.length > 1 ? <ParticipantDisplay tracks={remoteTracks[participants[1]]} /> : null}
        </div>
      </div>
      <img style={styles.footer} src="../footer.png" alt="" />
    </div>
  );
}
