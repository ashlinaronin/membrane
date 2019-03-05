# membrane

An interactive audio-visual poem using human pose detection.
Visible online at [https://ashlin.me/membrane]().

Membrane was created using Vue.js, PoseNet, TensorFlowJS, and Tone.js. For more information about PoseNet and TensorFlow see [https://medium.com/tensorflow/real-time-human-pose-estimation-in-the-browser-with-tensorflow-js-7dd0bc881cd5]().


## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Run your unit tests
```
npm run test:unit
```

### Routes --
http://localhost:8080/membrane - default. can specify ?audioDisabled=true to turn off audio
http://localhost:8080/synth-test
http://localhost:8080/composite-test
