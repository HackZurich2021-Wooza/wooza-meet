import Proton from "proton-engine";
import RAFManager from 'raf-manager';
import { SlowingRectZone } from "./SlowingRectZone";

import { useEffect, useRef } from "react";

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100vw',
    height: '100vh'

  }
}


export default function Game() {


  //particle stuff


  const canvas = useRef(null);


  useEffect(() => {

    // <<<<<<< HEAD
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

          const proton = new Proton();
          const emitter = new Proton.Emitter();

          proton.USE_CLOCK = true;
          //set Rate
          emitter.rate = new Proton.Rate(Proton.getSpan(10, 20), 0.1);

          //add Initialize

          emitter.addInitialize(new Proton.Radius(2, 2));

          emitter.addInitialize(new Proton.Mass(1));
          //add Behaviour
          emitter.addBehaviour(new Proton.Collision(emitter, true, (a, b) => {
            a.addBehaviour(new Proton.RandomDrift(0.01, 0.01, 0, Infinity, Proton.easeOutLinear));
          }, 5, Proton.easeOutLinear));
          emitter.addBehaviour(new Proton.Color("c2b280"));
          emitter.damping = 0.1;
          emitter.addBehaviour(new Proton.Gravity(50));
          let crossZone = new Proton.CrossZone(new SlowingRectZone(0, 0, canvas.current.width, canvas.current.height), 'bound', Infinity);
          emitter.addBehaviour(crossZone);
          //set emitter position
          emitter.p.x = canvas.current.width / 2;
          emitter.p.y = 30;
          emitter.emit();

          // add canvas renderer
          const renderer = new Proton.CanvasRenderer(canvas.current);
          proton.addRenderer(renderer);

          RAFManager.add(() => { proton.update(); })

          proton.addEmitter(emitter);
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

