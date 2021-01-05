const runAll = async () => {

  document.getElementById("loaded").innerHTML = "Loading model....";
  const useModel = await use.load();
  const model = await tf.loadLayersModel('./model-1c/model.json');
  const loaded = () => {
    document.getElementById("loaded").innerHTML = "Model loaded!!!";
  }
  loaded();

  document.getElementById("classify").addEventListener("click", function () {
    const docName = document.getElementById("doc-title").value;
    prediksi(docName);
  });



  async function prediksi(docName) {
    const doctitle = docName;
    const encoded = await useModel.embed(doctitle.toLowerCase());
    const prediction = await model.predict(encoded).array();

    const tensorResults = prediction[0]
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

    console.log(result);
    const resultTable = document.querySelector("#result tbody");
    resultTable.innerHTML=``;
   
    for (i = 0; i < 5; i++) {
      const row = resultTable.insertRow(-1);
      const cell1 = row.insertCell(0);
      const cell2 = row.insertCell(1);
      cell1.innerHTML = result[i].category;
      cell2.innerHTML = (result[i].confidence*100).toFixed(2)+"%";
    }

  }
}

runAll();