let dbPromised = idb.open("football-app", 1, function(upgradeDb) {
    let matchesObjectStore = upgradeDb.createObjectStore("matches", {
      keyPath: "ID"
    });
    matchesObjectStore.createIndex("match_vs", "match_vs", { unique: false });
});

function saveForLater(data) {
    dbPromised
      .then(function(db) {
        let tx = db.transaction("matches", "readwrite");
        let store = tx.objectStore("matches");
        console.log(data);
        store.add(data.matches);
        return tx.complete;
      })
      .then(function() {
        console.log("Match schedule has been saved.");
      });
}

function getAll() {
    return new Promise(function(resolve, reject) {
      dbPromised
        .then(function(db) {
          let tx = db.transaction("matches", "readonly");
          let store = tx.objectStore("matches");
          return store.getAll();
        })
        .then(function(matches) {
          resolve(matches);
        });
    });
}