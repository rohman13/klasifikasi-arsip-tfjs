const runAll = async () => {

  document.getElementById("loaded").innerHTML = "Loading model....";
  const useModel = await use.load();
  const model = await tf.loadLayersModel('./model-1c/model.json');
  const loaded = () => {
    document.getElementById("loaded").innerHTML = "Model loaded!!!";
  }
  loaded();

  document.getElementById("classify").addEventListener("click", async () => {
    const docName = document.getElementById("doc-title").value;

    const pre1 = async() => {
      const c = performance.now();
      await prediksi(docName);
      const d = performance.now();
      console.log("via client: ", (d - c));
    }
    const pre2 = async() => {
      const a = performance.now();
      await prediksi2(docName);
      const b = performance.now();
      console.log("via api: ", (b - a));
    }

    await pre2();
    pre1();
    

  });

  const category = [
    'Berita acara Pencacahan dan perajangan pita cukai rusak, sisa baik, dan pelat cetak rusak',
    'Berita acara Pencacahan Etil Alkohol (EA) dan Minuman Mengandung Etil Alkohol',
    'Dokumen Pemasukan ke Tempat Penimbunan Berikat (TPB)',
    'Dokumen Penetapan Tarif Cukai dan Golongan Perusahaan',
    'Dokumen Produksi Barang Kena Cukai (BKC)',
    'Inward manifest I outward manifest (BC 1.1) dan dokumen kelengkapannya',
    'Izin impor sementara',
    'Izin kawasan pabean',
    'Izin tempat penimbunan sementara',
    'Keputusan pembekuan NPPBKC',
    'Keputusan pemberian Nomor Pokok pengusaha barang Kena cukai (NPPBKC)',
    'Keputusan pencabutan NPPBKC',
    'Keputusan Penetapan harga Jual Eceran (HJE) dan Tarif cukai',
    'Laporan',
    'laporan kawasan Berikat',
    'Laporan Pangkalan Sarana Operasi',
    'laporan pemanfaatan Sarana operasi',
    'laporan produksi BKC',
    'Lembar pemeliharaan saran operasi lainnya',
    'Non Arsip',
    'Pemberitahuan impor barang untuk ditimbun di TPB (BC 2.3)',
    'Pemesanan pita cukai (CK-1 dan CK-1A)',
    'Persuratan',
    'Rencana Kedatangan Sarana Pengangkut / Jadwal Kedatangan Sarana Pengangkut (RKSP / JKSP) (BC 1.0)'
  ];

  async function prediksi(docName) {
    document.getElementById("load").innerHTML = `Wait...`;
    const doctitle = docName;
    const encoded = await useModel.embed(doctitle.toLowerCase());
    const prediction = await model.predict(encoded).array();

    const tensorResults = prediction[0];

    let result = tensorResults.map((tensorVal, i) => {
      let properties = {
        "category": category[i],
        "confidence": tensorVal
      }
      return properties;
    });

    result.sort((a, b) => {
      return parseFloat(b.confidence) - parseFloat(a.confidence);
    });
    const resultTable = document.querySelector("#result tbody");

    await fillTable(result, resultTable);
    document.getElementById("load").innerHTML = `Done`;
  }

  //via api
  async function prediksi2(docName) {
    data = { title: docName };
    document.getElementById("load2").innerHTML = `Wait...`;
    const url = "https://rohman13.my.id/arsip-tfjs/predict";
    //const url = "http://localhost:4000/predict";
    await fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(result => {
        const resultTable2 = document.querySelector("#result2 tbody");
        fillTable(result, resultTable2);
      })

    //await 
    document.getElementById("load2").innerHTML = `Done`;
  }


  function fillTable(result, resultTable) {

    resultTable.innerHTML = ``;

    for (i = 0; i < 5; i++) {
      const row = resultTable.insertRow(-1);
      const cell1 = row.insertCell(0);
      const cell2 = row.insertCell(1);
      cell1.innerHTML = result[i].category;
      cell2.innerHTML = (result[i].confidence * 100).toFixed(2) + "%";
    }
  }

}

runAll();