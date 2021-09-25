import Matter from 'matter-js';

import { useEffect, useRef } from "react";


const Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Bodies = Matter.Bodies,
  Composite = Matter.Composite;


const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100vw',
    height: '100vh',
    backgroundColor: 'black'
  },
};

// eslint-disable-next-line
function useBreathingAnalyzer() {
  // microphone stuff
  navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia;

  function getUserMediaCallback(stream) {
    var audioContext = new AudioContext();
    var analyser = audioContext.createAnalyser();
    var microphone = audioContext.createMediaStreamSource(stream);
    var javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

    analyser.smoothingTimeConstant = 0.2;
    analyser.fftSize = 1024;

    microphone.connect(analyser);
    analyser.connect(javascriptNode);
    javascriptNode.connect(audioContext.destination);

    // eslint-disable-next-line
    let timeTotal = 0;
    // eslint-disable-next-line
    let timeBreathing = 0;
    var timeSilence = 0;
    var breathState = "HODL";
    var breathDirection = true;
    const volumeThreshold = 5;
    const silenceThreshold = 0.5;

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
    };
  } // end fn stream

  // TODO: useEffect
  if (navigator.getUserMedia) {
    navigator.getUserMedia({
      audio: true,
    }).then(getUserMediaCallback);
  } else {
    console.log("getUserMedia not supported");
  }

  return () => {/*TODO*/};
}


export default function Game() {
  const canvas = useRef(null);
  const container = useRef();

  useEffect(() => {
    // canvas.current.width = window.innerWidth / 4;
    // canvas.current.height = window.innerHeight / 2;

    // create an engine
    const engine = Engine.create();

    const width = window.innerWidth / 4;
    const height = window.innerHeight / 2;

    // create a renderer
    const render = Render.create({
      element: container.current,
      engine: engine,
      options: {
        width,
        height,
        wireframes: false,
      },
    });

    // create barriers
    const barrierThickness = 10
    const ground = Bodies.rectangle(
      width/2, height-barrierThickness/2, width, barrierThickness,
      { isStatic: true },
    );
    const left = Bodies.rectangle(
      barrierThickness/2, height/2, barrierThickness, height,
      { isStatic: true },
    );
    const right = Bodies.rectangle(
      width-barrierThickness/2, height/2, barrierThickness, height,
      { isStatic: true },
    );

    // add all of the bodies to the world
    Composite.add(engine.world, [left, right, ground]);

    // run the renderer
    Render.run(render);

    // create runner
    var runner = Runner.create();

    // run the engine
    Runner.run(runner, engine);

    return () => Runner.stop(runner);


    /*
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
    */
  }, [canvas]);

  return (
    <div style={styles.container} ref={container}>
      {/* <canvas ref={canvas} ></canvas> */}
    </div>
  );
}

