const clientId = "3f1100a54f2549dcb2451025697915cd";
const redirectUri = "http://127.0.0.1:5500/spotifyData.html";
let dataTracks = "";
let dataArtists = "";

const urlParams = new URLSearchParams(window.location.search);
let code = urlParams.get("code");

let codeVerifier = localStorage.getItem("code_verifier");

let body = new URLSearchParams({
  grant_type: "authorization_code",
  code: code,
  redirect_uri: redirectUri,
  client_id: clientId,
  code_verifier: codeVerifier,
});

const response = fetch("https://accounts.spotify.com/api/token", {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
  body: body,
})
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok." + response.status);
    }
    return response.json();
  })
  .then((data) => {
    localStorage.setItem("access_token", data.access_token);
  })
  .catch((error) => {
    console.log("Error:", error);
  });

async function getProfileData() {
  let access_token = localStorage.getItem("access_token");
  const responseTracks = await fetch(
    "https://api.spotify.com/v1/me/top/tracks?limit=5",
    {
      headers: {
        Authorization: "Bearer " + access_token,
      },
    }
  );

  const responseArtists = await fetch(
    "https://api.spotify.com/v1/me/top/artists?limit=5",
    {
      headers: {
        Authorization: "Bearer " + access_token,
      },
    }
  );
  dataTracks = await responseTracks.json();
  dataArtists = await responseArtists.json();
  console.log(dataTracks);
  console.log(dataArtists);

  
    const imageContainer = document.querySelector(".image-container");

    imageContainer.innerHTML = "";

    dataTracks.items.forEach((track) => {
      const imgElement = document.createElement("img");
      imgElement.src = track.album.images[1].url;
      imgElement.alt = track.name;
      imgElement.className = "image";

      const infoDiv = document.createElement("div");
      infoDiv.className = "info";
      infoDiv.innerHTML = `<p>${track.name}</p>`;

      const imageWrapper = document.createElement("div");
      imageWrapper.className = "image-wrapper";
      imageWrapper.appendChild(imgElement);
      imageWrapper.appendChild(infoDiv);

      imageContainer.appendChild(imageWrapper);
  });
}

getProfileData();
