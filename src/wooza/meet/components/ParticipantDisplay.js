import { useRef, useEffect } from 'react';

// import { ObjectTracker, tracking } from 'tracking';
// import tracking from 'tracking';
const tracking = window.tracking;


const styles = {
  video: {
    width: '400px',
    height: '225px',
  },
};


export default function ParticipantDisplay({
  tracks: inputTracks,
  disableAudio = false,
  showHat = false,
}) {
  // find video and audio tracks
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
  if (disableAudio) {
    audioTrack = undefined;
  }

  const videoRef = useRef();
  const hatRef = useRef();
  const audioRef = useRef();

  useEffect(() => {
    let trackerTask;

    if (videoTrack) {
      videoTrack.attach(videoRef.current);

      if (showHat) {
        // track face
        const tracker = tracking.ObjectTracker('face');
        tracker.setInitialScale(4);
        tracker.setStepSize(2);
        tracker.setEdgesDensity(0.1);

        // start tracking
        trackerTask = tracking.track(videoRef.current, tracker);

        // handle tracking events
        tracker.on('track', function (event) {
          event.data.forEach(function (rect) {
            const div = hatRef.current;
            div.style.position = 'absolute';
            div.style.border = '2px solid ' + (rect.color || 'magenta');
            div.style.width = rect.width + 'px';
            div.style.height = rect.height + 'px';
            div.style.left = videoRef.current.offsetLeft + rect.x + 'px';
            div.style.top = videoRef.current.offsetTop + rect.y + 'px';
          });
        });
      }
    }
    if (audioTrack) {
      audioTrack.attach(audioRef.current);
    }

    return () => {
      if (trackerTask) {
        trackerTask.stop();
      }
    };
  });

  return (
    <>
      {videoTrack ? (<video autoPlay='1' ref={videoRef} style={styles.video} />) : null}
      {videoTrack && showHat ? (<div ref={hatRef}></div>) : null}
      {audioTrack ? (<audio autoPlay='1' ref={audioRef} />) : null}
    </>
  );
}
