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

  const canvas = useRef(null);


  useEffect(() => {

    canvas.current.width = window.innerWidth / 2;
    canvas.current.height = window.innerHeight / 2;

    const proton = new Proton();
    const emitter = new Proton.Emitter();
    proton.USE_CLOCK = true;
    //set Rate
    emitter.rate = new Proton.Rate(Proton.getSpan(1, 1), 0.01);

    //add Initialize
    emitter.addInitialize(new Proton.Radius(2, 2));

    emitter.addInitialize(new Proton.Mass(1));

    //add Behaviour
    emitter.addBehaviour(new Proton.Collision(emitter, true, (a, b) => {
      a.addBehaviour(new Proton.RandomDrift(0.01, 0.01, 0, Infinity, Proton.easeOutLinear));
      // a.addBehaviour(new Proton.Force(0,0));
      // b.addBehaviour(new Proton.RandomDrift(-0.5, -0.5, 0, Infinity));
      // b.addBehaviour(new Proton.Force(0,0));
    }, 5, Proton.easeOutLinear));

    emitter.addBehaviour(new Proton.Color("c2b280"));
    emitter.damping = 0.1;
    emitter.addBehaviour(new Proton.Gravity(50));
    let crossZone = new Proton.CrossZone(new SlowingRectZone(0, 0, canvas.current.width, canvas.current.height), 'bound', Infinity);
    // crossZone.addBehaviour(new Proton.Collision(emitter, true, (a, b) => {
    //   a.addBehaviour(new Proton.RandomDrift(-0.5, -0.5, 0, Infinity));
    //   a.addBehaviour(new Proton.Force(0,0));
    //   b.addBehaviour(new Proton.RandomDrift(-0.5, -0.5, 0, Infinity));
    //   b.addBehaviour(new Proton.Force(0,0));
    // })
    emitter.addBehaviour(crossZone);

    //set emitter position
    emitter.p.x = canvas.current.width / 2;
    emitter.p.y = 0;
    emitter.emit();

    //add emitter to the proton
    proton.addEmitter(emitter);

    // add canvas renderer
    const renderer = new Proton.CanvasRenderer(canvas.current);
    proton.addRenderer(renderer);

    RAFManager.add(() => { proton.update(); })
  }, [canvas]
  );

  return (
    <div style={styles.container}>
      <canvas ref={canvas} ></canvas>
    </div>
  );
}
