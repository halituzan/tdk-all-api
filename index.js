const axios = require("axios");
module.exports = async function (word, uri = "https://sozluk.gov.tr/") {
  const datas = {
    word: null,
    lisan: null,
    means: null,
    compounds: null,
    proverbs: [],
    compilation: [],
    glossaryOfScienceAndArtTerms: [],
    westOpposite: [],
    guide: [],
    etymological: [],
  };
  try {
    /* Güncel Türkçe Sözlük */
    const { data } = await axios(
      `${uri}gts?ara=` + encodeURI(word.toLocaleLowerCase("tr"))
    );
    if (data.error) {
      datas.word = null;
      datas.lisan = null;
      datas.means = null;
      datas.examples = null;
      datas.compounds = null;
    }
    const [result] = data;
    if (!result) {
      datas.word = null;
      datas.lisan = null;
      datas.means = null;
      datas.examples = null;
      datas.compounds = null;
    }
    const { anlamlarListe, birlesikler, lisan = null } = result;
    const means = anlamlarListe;
    const compounds = birlesikler?.split(", ") || [];
    datas.word = result?.madde ? result?.madde : datas.word;
    datas.lisan = lisan;
    datas.means = means ? means : datas.means;
    datas.compounds = compounds ? compounds : datas.compounds;

    /* Atasözleri ve Deyimler Sözlüğü */
    const atasozu = await axios(
      `${uri}atasozu?ara=` + encodeURI(word.toLocaleLowerCase("tr"))
    );
    if (atasozu.data.error) {
      datas.proverbs = null;
    } else datas.proverbs = atasozu.data;

    /* Derleme Sözlüğü */
    const derleme = await axios(
      `${uri}derleme?ara=` + encodeURI(word.toLocaleLowerCase("tr"))
    );
    if (derleme.data.error) {
      datas.compilation = null;
    } else datas.compilation = derleme.data;

    /* Bilim ve Sanat Terimleri Sözlüğü */
    const eser_ad = await axios(
      `${uri}terim?eser_ad=t%C3%BCm%C3%BC&ara=` +
        encodeURI(word.toLocaleLowerCase("tr"))
    );
    if (eser_ad.data.error) {
      datas.glossaryOfScienceAndArtTerms = null;
    } else datas.glossaryOfScienceAndArtTerms = eser_ad.data;

    /* Türkçede Batı Kökenli Kelimeler Sözlüğü */
    const bati = await axios(
      `${uri}bati?ara=` + encodeURI(word.toLocaleLowerCase("tr"))
    );
    if (bati.data.error) {
      datas.westOpposite = null;
    } else datas.westOpposite = bati.data;

    /* Yabancı Sözlere Karşılıklar Kılavuzu */
    const kilavuz = await axios(
      `${uri}kilavuz?prm=ysk&ara=` + encodeURI(word.toLocaleLowerCase("tr"))
    );
    if (kilavuz.data.error) {
      datas.guide = null;
    } else datas.guide = kilavuz.data;

    /* Eren Türk Dilinin Etimolojik Sözlüğü */
    const etms = await axios(
      `${uri}etms?ara=` + encodeURI(word.toLocaleLowerCase("tr"))
    );
    if (etms.data.error) {
      datas.etymological = null;
    } else datas.etymological = etms.data;

    return datas;
  } catch (error) {}
};
