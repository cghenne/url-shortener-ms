const shortid = require('shortid');

const insertRef = async (db, url) => {
  try {
    const collection = db.collection('url-shortener-ms');
    const ref = shortid.generate();
    const data = await collection.insert({ url, ref });

    return ref;
  } catch (err) {
    throw err;
  }
};

const getUrl = async (db, ref) => {
  try {
    const collection = db.collection('url-shortener-ms');
    const data = await collection.find({ ref }).toArray();

    if (data.length === 0) {
      throw 'No result found.';
    } else if (data.length > 1) {
      throw 'More than one result for this ref.';
    }

    return data[0].url;

  } catch (err) {
    throw err;
  }
}

module.exports = {
  insertRef: insertRef,
  getUrl: getUrl,
};
