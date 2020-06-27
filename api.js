const url = "https://api.football-data.org/v2/competitions/ELC/matches?status=SCHEDULED";

const fetchAPI = url => {
    return fetch(url, {
        headers: {
            'X-Auth-Token': 'c96e8d8571bf41bd9fe47a4ee2b50a1c'
        }
    })
    .then(status)
    .then(json)
    .catch(error)
};

function status(response) {
  if (response.status == 404) {
    console.log("Error : " + response.status);
    // Method reject() akan membuat blok catch terpanggil
    return Promise.reject(new Error(response.statusText));
  } else {
    // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
    return Promise.resolve(response);
  }
}
// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {
  return response.json();
}
// Blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
  // Parameter error berasal dari Promise.reject()
  console.log("Error : " + error);
}

// Blok kode untuk melakukan request data json
function getMatches() {
  return new Promise(function(resolve, reject) {
    if ("caches" in window) {
        caches.match(url).then(function(response) {
          if (response) {
            response.json().then(function(data) {
              let matchesHTML = "";
              data.matches.forEach(function(match) {
                matchesHTML += `
                  <div class="col s12">  
                      <div class="card hoverable">
                        <div class="card-image">
                          <img src="img/post-1.png">
                          <a class="btn-floating btn-large halfway-fab waves-effect waves-light blue darken-4" id="save" onclick="saveMatch()">
                            <i class="material-icons">save</i>
                          </a>
                        </div>
                        <div class="card-content">
                            <span class="card-title">${match.homeTeam.name} VS ${match.awayTeam.name}</span>
                            <p class="id">${match.id}</p>
                            <p>Season: ${match.season.startDate} - ${match.season.endDate}</p>
                            <p>UTC date: ${match.utcDate}</p>
                            <p>Match day: ${match.matchday}</p>
                            <p>Home Team: ${match.homeTeam.name}</p>
                            <p>Away Team: ${match.awayTeam.name}</p>
                        </div>
                      </div>
                  </div>
                    `;
              });
              // Sisipkan komponen card ke dalam elemen dengan id #content
              document.getElementById("matches").innerHTML = matchesHTML;
              resolve(data);
            });
          }
        });
    }

    fetch(url, {
            headers: {
            'X-Auth-Token': 'c96e8d8571bf41bd9fe47a4ee2b50a1c'
            }
        })
        .then(status)
        .then(json)
        .then(function(data) {
          // Objek/array JavaScript dari response.json() masuk lewat data.
          // Menyusun komponen card artikel secara dinamis
              let matchesHTML = "";
              data.matches.forEach(function(match) {
                matchesHTML += `
                  <div class="col s12">  
                    <div class="card hoverable">
                      <div class="card-image">
                        <img src="img/post-1.png">
                        <a class="btn-floating btn-large halfway-fab waves-effect waves-light blue darken-4" id="save" onclick="saveMatch()">
                          <i class="material-icons">save</i>
                        </a>
                      </div>
                      <div class="card-content">
                          <span class="card-title">${match.homeTeam.name} VS ${match.awayTeam.name}</span>
                          <p class="id">${match.id}</p>
                          <p>Season: ${match.season.startDate} - ${match.season.endDate}</p>
                          <p>UTC date: ${match.utcDate}</p>
                          <p>Match day: ${match.matchday}</p>
                          <p>Home Team: ${match.homeTeam.name}</p>
                          <p>Away Team: ${match.awayTeam.name}</p>
                      </div>
                    </div>
                  </div>
                  `;
               });
          // Sisipkan komponen card ke dalam elemen dengan id #content
          document.getElementById("matches").innerHTML = matchesHTML;
          resolve(data);
        })
        .catch(error);
  });
}

function saveMatch() {
  let item = getMatches();
  console.log("Tombol FAB di klik.");
  item.then(function (data) {
      saveForLater(data);
  });
}

function getSavedMatches() {
  getAll().then(function(matches) {
    console.log(matches);
    // Menyusun komponen card artikel secara dinamis
    let matchesHTML = "";
    matches.forEach(function(match) {
      matchesHTML += `
          <div class="col s12">  
            <div class="card hoverable">
              <div class="card-image">
                <img src="img/post-1.png">
              </div>
              <div class="card-content">
                <span class="card-title">${match.homeTeam.name} VS ${match.awayTeam.name}</span>
                <p>Season: ${match.season.startDate} - ${match.season.endDate}</p>
                <p>UTC date: ${match.utcDate}</p>
                <p>Match day: ${match.matchday}</p>
                <p>Home Team: ${match.homeTeam.name}</p>
                <p>Away Team: ${match.awayTeam.name}</p>
              </div>
            </div>
          </div>
          `;
    });
    // Sisipkan komponen card ke dalam elemen dengan id #body-content
    document.getElementById("body-content").innerHTML = matchesHTML;
  });
}
