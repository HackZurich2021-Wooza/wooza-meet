
export default function analyze(cb) {
  console.log("starting...");

  navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia;

  if (!navigator.getUserMedia) {
    console.warn('no getusermedia');
    return;
  }

  navigator.getUserMedia(
    {
      audio: true,
    },
    function (stream) {
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      const javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

      analyser.smoothingTimeConstant = 0.2;
      analyser.fftSize = 1024;

      microphone.connect(analyser);
      analyser.connect(javascriptNode);
      javascriptNode.connect(audioContext.destination);

      var timeSilence = 0;
      var breathState = "HODL";
      var breathDirection = true;
      const volumeThreshold = 3;
      const silenceThreshold = 0.5;

      javascriptNode.onaudioprocess = function () {
        // one interval is ca. 1/20 sec
        var array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        var values = 0;

        var length = array.length;
        for (var i = 0; i < length; i++) {
          values += array[i];
        }

        const volumeLevel = values / length;
        // console.log('volume is', volumeLevel);
        if (volumeLevel > volumeThreshold) {
          timeSilence = 0;

          if (breathState === "HODL") {
            breathState = breathDirection ? "IN" : "OUT";
            cb(breathState);
            breathDirection = !breathDirection;
          }
        } else {
          timeSilence += 0.05;
        }

        if (timeSilence > silenceThreshold && breathState !== "HODL") {
          // we assume a switch of breath-in/out after 0.1 seconds
          breathState = "HODL";
          cb(breathState);
        }
      };
    },
    function (err) {
      console.log("The following error occured: " + err.name);
    }
  );
}
