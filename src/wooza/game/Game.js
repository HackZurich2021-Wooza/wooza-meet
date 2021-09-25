import Proton from "proton-engine";
import RAFManager from 'raf-manager';
import { SlowingRectZone } from "./SlowingRectZone";

import Stats from "./Stats";

import { useEffect, useRef } from "react";

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100vw',
    height: '100vh',
    backgroundColor: 'black'

  }
}


export default function Game() {


  //particle stuff


  const canvas = useRef(null);


  useEffect(() => {

    // microphone stuff
    navigator.getUserMedia = navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;

    if (navigator.getUserMedia) {
      navigator.getUserMedia({
        audio: true
      },
        function (stream) {
          var audioContext = new AudioContext();
          var analyser = audioContext.createAnalyser();
          var microphone = audioContext.createMediaStreamSource(stream);
          var javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

          analyser.smoothingTimeConstant = 0.2;
          analyser.fftSize = 1024;

          microphone.connect(analyser);
          analyser.connect(javascriptNode);
          javascriptNode.connect(audioContext.destination);

          var timeTotal = 0;
          var timeBreathing = 0;
          var timeSilence = 0;
          var breathState = "HODL";
          var breathDirection = true;
          const volumeThreshold = 5;
          const silenceThreshold = 0.5;

          canvas.current.width = window.innerWidth / 4;
          canvas.current.height = window.innerHeight / 2;

          const proton = new Proton();
          const emitter = new Proton.Emitter();
          proton.USE_CLOCK = true;
          //set Rate
          emitter.rate = new Proton.Rate(10, 0.01);
          emitter.damping = 0.1;

          // //add Initialize
          emitter.addInitialize(new Proton.Radius(5, 5));
          emitter.addInitialize(new Proton.Mass(1));
          // emitter.addInitialize(new Proton.Velocity(new Proton.Span(3, 5), new Proton.Span(0, 20, true), 'polar'));

          // //add Behaviour
          emitter.addBehaviour(new Proton.Color("c2b280"));
          emitter.addBehaviour(new Proton.Gravity(1));
          emitter.addBehaviour(new Proton.CrossZone(new SlowingRectZone(0, 0, canvas.current.width, canvas.current.height), 'bound', Infinity));

          emitter.addInitialize(new Proton.Velocity(new Proton.Span(3, 5), new Proton.Span(0, 20, true), 'polar'));
          emitter.addBehaviour(new Proton.Collision(emitter));

          //set emitter position
          emitter.p.x = canvas.current.width / 2;
          emitter.p.y = canvas.current.height / 8;
          emitter.emit(2);

          //add emitter to the proton
          proton.addEmitter(emitter);

          // add canvas renderer
          const renderer = new Proton.CanvasRenderer(canvas.current);
          proton.addRenderer(renderer);



          const update = () => {
            proton.update();
            console.log('Particles: ', proton.getCount());
          }

          RAFManager.add(update);



          javascriptNode.onaudioprocess = function () {
            // one interval is ca. 1/20 sec
            timeTotal += 0.05;


            var array = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(array);
            var values = 0;

            var length = array.length;
            for (var i = 0; i < length; i++) {
              values += (array[i]);
            }

            var volumeLevel = values / length;


            console.log(volumeLevel);
            if (volumeLevel > volumeThreshold) {
              timeBreathing += 0.05;
              timeSilence = 0;

              if (breathState === "HODL") {
                breathState = breathDirection ? "IN" : "OUT";
                breathDirection = !breathDirection;

                ////// emitter.emit();
              }
            } else {
              timeSilence += 0.05;

            }

            if (timeSilence > silenceThreshold && breathState !== "HODL") {
              // we assume a switch of breath-in/out after 0.1 seconds
              breathState = "HODL";
              timeBreathing = 0;
              ////// emitter.stop();
            }

          } // end fn stream
        },
        function (err) {
          console.log("The following error occured: " + err.name)
        });
    } else {
      console.log("getUserMedia not supported");
    }
  }, [canvas]
  );

  return (
    <div style={styles.container}>
      <canvas ref={canvas} ></canvas>
    </div>
  );
}

