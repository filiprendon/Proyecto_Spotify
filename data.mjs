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
    "https://api.spotify.com/v1/me/top/tracks?limit=15",
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
  const dataTracks = await responseTracks.json();
  const dataArtists = await responseArtists.json();
  console.log(dataTracks);
  console.log(dataArtists);

  let imageContainerTracks = document.querySelector(".image-container-tracks");
  let imageContainerArtists = document.querySelector(
    ".image-container-artists"
  );
  let imageContainerFavtrack = document.querySelector(
    ".image-container-favtracks"
  );

  // imageContainerTracks.innerHTML = "";

  dataTracks.items.forEach((track) => {
    if (
      document.querySelectorAll(".image-container-tracks .image").length >= 5
    ) {
      return;
    }
    const imgElement = document.createElement("img");
    imgElement.src = track.album.images[1].url;
    imgElement.alt = track.name;
    imgElement.className = "image";

    imgElement.setAttribute("data-track", JSON.stringify(track));

    const infoDiv = document.createElement("div");
    infoDiv.className = "info";
    infoDiv.innerHTML = `<p>${track.name}</p>`;

    const imageWrapper = document.createElement("div");
    imageWrapper.className = "image-wrapper tracks";
    imageWrapper.appendChild(imgElement);
    imageWrapper.appendChild(infoDiv);

    imageContainerTracks.appendChild(imageWrapper);
  });

  dataTracks.items.forEach((track) => {
    // console.log(track.artists[0].name)
    if (track.artists[0].name !== "Travis Scott") {
      return;
    }
    const imgElement = document.createElement("img");
    imgElement.src = track.album.images[1].url;
    imgElement.alt = track.name;
    imgElement.className = "image";

    imgElement.setAttribute("data-track", JSON.stringify(track));

    const infoDiv = document.createElement("div");
    infoDiv.className = "info";
    infoDiv.innerHTML = `<p>${track.name}</p>`;

    const imageWrapper = document.createElement("div");
    imageWrapper.className = "image-wrapper tracks";
    imageWrapper.appendChild(imgElement);
    imageWrapper.appendChild(infoDiv);

    imageContainerFavtrack.appendChild(imageWrapper);
  });

  dataArtists.items.forEach((artist) => {
    const imgElement = document.createElement("img");
    imgElement.src = artist.images[1].url;
    imgElement.alt = artist.name;
    imgElement.className = "image";

    const infoDiv = document.createElement("div");
    infoDiv.className = "info";
    infoDiv.innerHTML = `<p>${artist.name}</p>`;

    const imageWrapper = document.createElement("div");
    imageWrapper.className = "image-wrapper artists";
    imageWrapper.appendChild(imgElement);
    imageWrapper.appendChild(infoDiv);

    imageContainerArtists.appendChild(imageWrapper);
  });

  let images = document.querySelectorAll(".image");
  let currentAudio = null;
  images.forEach((img) => {
    img.addEventListener("mouseover", () => {
      images.forEach((otherImg) => {
        if (otherImg !== img) {
          otherImg.classList.add("blur");
        }
      });
    });
    img.addEventListener("mouseout", () => {
      images.forEach((otherImg) => {
        otherImg.classList.remove("blur");
      });
    });
    img.addEventListener("click", (e) => {
      if(img.parentElement.classList.contains('artists')){
        return;
      }
      
      if(e.target.classList.contains('mainImage')){
        return;
      }
      img.classList.add("mainImage");
      images.forEach((otherImg) => {
        if (otherImg !== img) {
          otherImg.classList.remove("mainImage");
        }
      });
      const trackData = JSON.parse(img.getAttribute("data-track"));
      console.log(trackData);
      let audio = new Audio(trackData?.preview_url);
      if (currentAudio) {
        currentAudio.pause();
      }

      audio.play();
      currentAudio = audio;
      let parentContainer = img.parentNode.parentNode;
      let imagesInContainer = parentContainer.querySelectorAll(".image");
      let clickPos = Array.from(imagesInContainer).indexOf(img);
      console.log(clickPos);
      // img.onclick = img.classList.remove("mainImage");

      if (clickPos !== 2) {
        let elementToMove = img.parentNode;
        if (clickPos <= 2) {
          let referenceElement = imagesInContainer[3].parentNode;
          parentContainer.insertBefore(elementToMove, referenceElement);
        } else {
          let referenceElement = imagesInContainer[2].parentNode;
          parentContainer.insertBefore(elementToMove, referenceElement);
        }
      }
    });
  });
}

getProfileData();
