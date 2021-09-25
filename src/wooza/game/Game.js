import Proton from "proton-engine";
import RAFManager from 'raf-manager';

import { useEffect, useRef } from "react";


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

          // canvasContext = $("#canvas")[0].getContext("2d");
          var timeTotal = 0;
          var timeBreathing = 0;
          var timeSilence = 0;
          var breathState = "HODL";
          var breathDirection = true;
          const volumeThreshold = 5;
          const silenceThreshold = 0.5;

          // volumeMeterLabel = $("#volumeMeter")[0];
          // volumeGoodLabel = $("#volumeGood")[0];
          // timeBreathingLabel = $("#timeBreathing")[0];
          // timeHoldingLabel = $("#timeHolding")[0];
          // breathDirectionLabel = $("#breathDirection")[0];
          // timeTotalLabel = $("#timeTotal")[0];

          // breathDirectionLabel.innerHTML = "<<<<<<<<";


          const proton = new Proton();
          const emitter = new Proton.Emitter();

          //set Rate
          emitter.rate = new Proton.Rate(Proton.getSpan(10, 20), 0.1);

          //add Initialize
          emitter.addInitialize(new Proton.Radius(1, 12));
          emitter.addInitialize(new Proton.Life(0, 1));
          emitter.addInitialize(new Proton.Velocity(1, Proton.getSpan(0, 360), "polar"));

          //add Behaviour
          emitter.addBehaviour(new Proton.Color("ff0000", "random"));
          emitter.addBehaviour(new Proton.Alpha(1, 0));

          //set emitter position
          emitter.p.x = canvas.current.width / 2;
          emitter.p.y = canvas.current.height / 2;
          // emitter.emit();

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


            // volumeMeterLabel.innerHTML = Math.round(volumeLevel);

            // console.log(volumeLevel);
            if (volumeLevel > volumeThreshold) {
              // volumeGoodLabel.innerHTML = "Breathing";
              timeBreathing += 0.05;
              timeSilence = 0;

              if (breathState === "HODL") {
                breathState = breathDirection ? "IN" : "OUT";
                breathDirection = !breathDirection;

                emitter.emit();
                //add emitter to the proton

              }
            } else {
              // volumeGoodLabel.innerHTML = "Not Breathing";
              timeSilence += 0.05;

            }

            if (timeSilence > silenceThreshold && breathState !== "HODL") {
              // we assume a switch of breath-in/out after 0.1 seconds
              breathState = "HODL";
              timeBreathing = 0;
              emitter.stop();
              //add emitter to the proton
              // proton.addEmitter(emitter);
            }



            // breathDirectionLabel.innerHTML = breathState;
            // timeTotalLabel.innerHTML = parseFloat(timeTotal).toFixed(2);
            // timeBreathingLabel.innerHTML = parseFloat(timeBreathing).toFixed(2);
            // timeHoldingLabel.innerHTML = parseFloat(timeSilence).toFixed(2);


            // canvasContext.clearRect(0, 0, 150, 300);
            // canvasContext.fillStyle = '#FF0A55'; //was BadA55 (very cute)
            // canvasContext.fillRect(0, 300 - average, 150, 300);
            // canvasContext.fillStyle = '#F62626';
            // canvasContext.font = "24px impact";
            // canvasContext.fillText(Math.round(average - 40), 2, 30);
            // console.log (average);
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
    <>
      <canvas ref={canvas} width="500px" height="500px"></canvas>
    </>
  );
}

