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

  const canvas = useRef(null);


  useEffect(() => {

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

    return () => RAFManager.remove(update);
  }, [canvas]
  );

  return (
    <div style={styles.container}>
      <canvas ref={canvas} ></canvas>
    </div>
  );
}
