import Proton from "proton-engine";
import RAFManager from 'raf-manager';

import { useEffect, useRef } from "react";


export default function Game() {

  const canvas = useRef(null);


  useEffect(() => {

    canvas.current.width = window.innerWidth;
    canvas.current.height = window.innerHeight;

    const proton = new Proton();
    const emitter = new Proton.Emitter();

    //set Rate
    emitter.rate = new Proton.Rate(Proton.getSpan(10, 20), 0.1);

    //add Initialize
    emitter.addInitialize(new Proton.Radius(1, 1));



    //add Behaviour
    emitter.addBehaviour(new Proton.Collision(emitter, true, (a, b) => {
      a.addBehaviour(new Proton.RandomDrift(1, 1, 0, 2));
    }));

    emitter.addBehaviour(new Proton.Color("c2b280"));

    emitter.addBehaviour(new Proton.Gravity(50));
    emitter.addBehaviour(new Proton.CrossZone(new Proton.LineZone(0, canvas.current.height, canvas.current.width, canvas.current.height), 'bound'));

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
    <div style={{ width: '100vw', height: '100vh' }}>
      <canvas ref={canvas} ></canvas>
    </div>
  );
}
