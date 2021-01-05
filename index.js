
const tf = require('@tensorflow/tfjs-node');
const use = require('@tensorflow-models/universal-sentence-encoder');

const klasifikasiTrain = require('./data-train-all.json');
const klasifikasiTest = require('./data-test.json');
const mapTrainData = require('./klasTrainmapping');

//mapping json data and return encoded data
const encodeData = (data) => {
  const klas = data.map(jenisDokumen => jenisDokumen.Dokumen.toLowerCase());
  return encode(klas);
}
const encodeDataTest = (data) => {
  const klas = data.map(jenisDokumen => jenisDokumen.Dokumen.toLowerCase());
  return encode(klas);
}

//function to encode using USE
const encode = (klas) => {
  const encodedData = use.load()
    .then(model => {
      return model.embed(klas)
        .then(embeddings => {
          return embeddings;
        })
    })
    .catch(err => console.error('Fit Error', err));
  return encodedData;
}

//creating outputData
const outputData = tf.tensor2d(mapTrainData.mapped);

//new model
const model = tf.sequential();

// Add layers to the model
model.add(tf.layers.dense({
  inputShape: [512],
  activation: 'sigmoid',
  units: 24,
}));

//compile model
model.compile({
  loss: 'meanSquaredError',
  optimizer: tf.train.adam(.06), // This is a standard compile config
});

//main function
function run() {
  //promise all encode data
  Promise.all([
    encodeData(klasifikasiTrain),
    encodeDataTest(klasifikasiTest)
  ])
  //data[0]=encoded klasifikasitrain, data[1] = encoded klasifikasitest
    .then(data => {
      const {
        0: training_data,
        1: testing_data,
      } = data;
      
      //train model
      
      model.fit(training_data, outputData, { epochs: 500 })
        .then(history => {
          //predict model
          model.predict(testing_data).print();
          model.save('file://./model-1c');
        });
         
    })
    .catch(err => console.log('Prom Err:', err));
};

// Call function
run();






