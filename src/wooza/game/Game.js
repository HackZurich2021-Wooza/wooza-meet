import Proton from "proton-engine";
import RAFManager from 'raf-manager';

import { useEffect, useRef } from "react";


export default function Game() {

  const canvas = useRef(null);


  useEffect(() => {

    const proton = new Proton();
    const emitter = new Proton.Emitter();

    //set Rate
    emitter.rate = new Proton.Rate(Proton.getSpan(10, 20), 0.1);

    //add Initialize
    emitter.addInitialize(new Proton.Radius(0.1, 0.1));

    //add Behaviour
    emitter.addBehaviour(new Proton.Color("c2b280"));

    emitter.addBehaviour(new Proton.Gravity(1));

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
      <canvas style={{ width: '100vw', height: '100vh' }} ref={canvas} ></canvas>
    </div>
  );
}
