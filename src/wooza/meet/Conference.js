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
  },
  innerContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    width: '400px',
    height: '225px',
    margin: '10px',
    backgroundColor: 'gray',
  },
};


export default function Conference() {
  const { meetingId } = useParams();

  const [localTracks, remoteParticipants, remoteTracks] = useJitsiMeeting(meetingId);

  const participants = remoteParticipants.slice(-2);
  console.warn('PARTICIPANTS', remoteParticipants);

  return (
    <div style={styles.container}>
      <h1>Meeting</h1>
      <div style={styles.innerContainer}>
        <div style={styles.item}>
          <ParticipantDisplay tracks={localTracks} disableAudio={false} showHat={true} />
        </div>
        <div style={styles.item}>
          { participants.length > 0 ? <ParticipantDisplay tracks={remoteTracks[participants[0]]} /> : null }
        </div>
        <div style={styles.item}>
          { participants.length > 1 ? <ParticipantDisplay tracks={remoteTracks[participants[1]]} /> : null }
        </div>
      </div>
      <p>{ meetingId }</p>
    </div>
  );
}
