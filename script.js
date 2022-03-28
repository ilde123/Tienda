Quagga.init({
    inputStream: {
        name: "Live",
        type: "LiveStream",
        constraints: {
              width: 640,
              height: 480,
              facing: "environment"
          }
    },
    locator: {
      patchSize: "medium",
      halfSample: true
    },
    numOfWorkers: 4,
    locate: true,
    decoder : {
        readers: ["code_128_reader", "ean_reader"]
    }
  }, function() {
    Quagga.start();
  });
  Quagga.onDetected(function(result) {
    var code = result.codeResult.code;
    document.querySelector(".found").innerHTML = code;
  });