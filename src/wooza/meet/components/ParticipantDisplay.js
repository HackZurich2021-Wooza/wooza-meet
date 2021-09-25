import { useRef, useEffect } from 'react';


const styles = {
  video: {
    width: '400px',
    height: '300px',
  },
};


export default function ParticipantDisplay({ tracks: inputTracks  }) {
  const tracks = inputTracks ?? [];
  let videoTrack, audioTrack;
  for (let i = 0; i < tracks.length; i++) {
    const track = tracks[i];
    if (track.getType() === 'video') {
      videoTrack = track;
    } else {
      audioTrack = track;
    }
  }

  const videoRef = useRef();
  const audioRef = useRef();

  useEffect(() => {
    if (videoTrack) {
      videoTrack.attach(videoRef.current);
    }
    if (audioTrack) {
      audioTrack.attach(audioRef.current);
    }
  });

  return (
    <>
      {videoTrack ? (<video autoPlay='1' ref={videoRef} style={styles.video} />) : null}
      {audioTrack ? (<audio autoPlay='1' ref={audioRef} />) : null}
    </>
  );
}
