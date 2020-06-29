const url = "https://api.football-data.org/v2/competitions/ELC/matches?status=SCHEDULED";
const url_s = "https://api.football-data.org/v2/competitions/ELC/scorers";
const url_id = "https://api.football-data.org/v2/matches/";

const fetchAPI = url => {
    return fetch(url, url_s, url_id, {
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

function getMatches() {
    if ("caches" in window) {
        caches.match(url).then(function(response) {
          if (response) {
            response.json().then(function(data) {
              let matchesHTML = "";
              data.matches.forEach(function(match) {
                let getDate = JSON.parse(`\"${match.utcDate}\"`);
                let date = new Date(getDate);
                let formattedDate = moment(date).format('LLL');
                matchesHTML += `
                  <div class="col s12 m6 l6">  
                      <div class="card hoverable">
                      <a href="./match.html?id=${match.id}">
                        <div class="card-image">
                          <img src="img/post-1.png">
                        </div>
                      </a>
                        <div class="card-content">
                          <span class="card-title">${match.homeTeam.name} VS ${match.awayTeam.name}</span>
                          <p>Date: ${formattedDate}</p>
                        </div>
                      </div>
                  </div>
                    `;
              });
              // Sisipkan komponen card ke dalam elemen dengan id #content
              document.getElementById("matches").innerHTML = matchesHTML;
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
                let getDate = JSON.parse(`\"${match.utcDate}\"`);
                let date = new Date(getDate);
                let formattedDate = moment(date).format('LLL');
                matchesHTML += `
                  <div class="col s12 m6 l6">  
                    <div class="card hoverable">
                    <a href="./match.html?id=${match.id}">
                      <div class="card-image">
                        <img src="img/post-1.png">
                      </div>
                    </a>
                      <div class="card-content">
                          <span class="card-title">${match.homeTeam.name} VS ${match.awayTeam.name}</span>
                          <p>Date: ${formattedDate}</p>
                      </div>
                    </div>
                  </div>
                  `;
               });
          // Sisipkan komponen card ke dalam elemen dengan id #content
          document.getElementById("matches").innerHTML = matchesHTML;
        })
        .catch(error);
}

function getMatchById() {
  return new Promise(function(resolve, reject) {
    // Ambil nilai query parameter (?id=)
    let urlParams = new URLSearchParams(window.location.search);
    const idParam = urlParams.get("id");
    if ("caches" in window) {
        caches.match(url_id + idParam).then(function(response) {
          if (response) {
            response.json().then(function(data) {
              let getDate = JSON.parse(`\"${data.match.utcDate}\"`);
              let date = new Date(getDate);
              let formattedDate = moment(date).format('LLL');
              let matchHTML = `
              <div class="col s12 m6 l6">  
              <div class="card hoverable">
                <div class="card-image">
                  <img src="img/post-1.png">
                </div>
                <div class="card-content">
                    <span class="card-title">${data.match.homeTeam.name} VS ${data.match.awayTeam.name}</span>
                    <p>Season: ${data.match.season.startDate} - ${data.match.season.endDate}</p>
                    <p>Date: ${formattedDate}</p>
                    <p>Home Team: ${data.match.homeTeam.name}</p>
                    <p>Away Team: ${data.match.awayTeam.name}</p>
                </div>
              </div>
            </div>
              `;
              // Sisipkan komponen card ke dalam elemen dengan id #content
              document.getElementById("body-content").innerHTML = matchHTML;
              // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
              resolve(data);
            });
          }
        });
      }
    
      fetch(url_id + idParam, {
        headers: {
        'X-Auth-Token': 'c96e8d8571bf41bd9fe47a4ee2b50a1c'
        }
      })
        .then(status)
        .then(json)
        .then(function(data) {
          // Objek JavaScript dari response.json() masuk lewat variabel data.
          // Menyusun komponen card artikel secara dinamis
              let getDate = JSON.parse(`\"${data.match.utcDate}\"`);
              let date = new Date(getDate);
              let formattedDate = moment(date).format('LLL');
              let matchHTML = `
              <div class="col s12 m6 l6">  
              <div class="card hoverable">
                <div class="card-image">
                  <img src="img/post-1.png">
                </div>
                <div class="card-content">
                    <span class="card-title">${data.match.homeTeam.name} VS ${data.match.awayTeam.name}</span>
                    <p>Season: ${data.match.season.startDate} - ${data.match.season.endDate}</p>
                    <p>Date: ${formattedDate}</p>
                    <p>Home Team: ${data.match.homeTeam.name}</p>
                    <p>Away Team: ${data.match.awayTeam.name}</p>
                </div>
              </div>
            </div>
              `;
              // Sisipkan komponen card ke dalam elemen dengan id #content
              document.getElementById("body-content").innerHTML = matchHTML;
              // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
              resolve(data);
        });
  });
}

function getSavedMatches() {
  getAll().then(function(matches) {
    console.log(matches);
    // Menyusun komponen card artikel secara dinamis
    let matchesHTML = "";
    matches.forEach(function(match) {
      let getDate = JSON.parse(`\"${match.utcDate}\"`);
      let date = new Date(getDate);
      let formattedDate = moment(date).format('LLL');
      matchesHTML += `
          <div class="col s12">  
            <div class="card hoverable">
              <div class="card-image">
                <img src="img/post-1.png">
              </div>
              <div class="card-content">
                <span class="card-title">${match.homeTeam.name} VS ${match.awayTeam.name}</span>
                <p>Season: ${match.season.startDate} - ${match.season.endDate}</p>
                <p>Date: ${formattedDate}</p>
                <p>Home Team: ${match.homeTeam.name}</p>
                <p>Away Team: ${match.awayTeam.name}</p>
              </div>
            </div>
          </div>
          `;
    });
    // Sisipkan komponen card ke dalam elemen dengan id #body-content
    document.getElementById("savedmatch").innerHTML = matchesHTML;
  });
}

function getScorers() {
    if ("caches" in window) {
        caches.match(url_s).then(function(response) {
          if (response) {
            response.json().then(function(data) {
              let scorersHTML = "";
              data.scorers.forEach(function(scorer) {
                scorersHTML += `
                  <tr>
                    <td>${scorer.player.name}</td>
                    <td>${scorer.player.shirtNumber}</td>
                    <td>${scorer.player.position}</td>
                    <td>${scorer.team.name}</td>
                    <td>${scorer.numberOfGoals}</td>
                  </tr>
                  `;
              });
              // Sisipkan komponen card ke dalam elemen dengan id #content
              document.getElementById("scorers").innerHTML = scorersHTML;
            });
          }
        });
    }

    fetch(url_s, {
            headers: {
            'X-Auth-Token': 'c96e8d8571bf41bd9fe47a4ee2b50a1c'
            }
        })
        .then(status)
        .then(json)
        .then(function(data) {
          // Objek/array JavaScript dari response.json() masuk lewat data.
          // Menyusun komponen card artikel secara dinamis
              let scorersHTML = "";
              data.scorers.forEach(function(scorer) {
                scorersHTML += `
                  <tr>
                    <td>${scorer.player.name}</td>
                    <td>${scorer.player.shirtNumber}</td>
                    <td>${scorer.player.position}</td>
                    <td>${scorer.team.name}</td>
                    <td>${scorer.numberOfGoals}</td>
                  </tr>
                  `;
              });
              // Sisipkan komponen card ke dalam elemen dengan id #content
              document.getElementById("scorers").innerHTML = scorersHTML;
          })
        .catch(error);
}
