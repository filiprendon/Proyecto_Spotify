const clientId = "3f1100a54f2549dcb2451025697915cd";
// const redirectUri = "http://127.0.0.1:5500/spotifyData.html";
const redirectUri = "https://filiprendon.github.io/Spotify/spotifyData.html";
let imgToFill = document.querySelector(".imgToFill");
let viewContainer = document.querySelector(".viewContainer");
let backgroungImgToFill = document.querySelector(".backgroungImgToFill");
let trackName = document.querySelector(".trackName");
let artistName = document.querySelector(".artistName");
let albumName = document.querySelector(".albumName");
let exitSong = document.querySelector(".exitSong");
let mainImgContainer = document.querySelector('.mainImgContainer');
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

  const responseData = await fetch(
    "https://api.spotify.com/v1/me/player/recently-played",
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
  const dataUser = await responseData.json();
  console.log(dataTracks);
  console.log(dataArtists);
  console.log(dataUser);

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
    infoDiv.style.display = "none";

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

    // GET ACTUAL TOP ARTIST
    // console.log(dataArtists.items[0].name)
    // if (track.artists[0].name !== dataArtists.items[0].name) {
    //   return;
    // }

    const imgElement = document.createElement("img");
    imgElement.src = track.album.images[1].url;
    imgElement.alt = track.name;
    imgElement.className = "image";

    imgElement.setAttribute("data-track", JSON.stringify(track));

    const infoDiv = document.createElement("div");
    infoDiv.style.display = "none";

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
    infoDiv.style.display = "none";
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
    const trackData = JSON.parse(img.getAttribute("data-track"));
    // console.log(trackData);
    let audio = new Audio(trackData?.preview_url);
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
      if (img.parentElement.classList.contains("artists")) {
        return;
      }
      viewContainer.style.display = "flex";

      // let mainImgContainerRect = mainImgContainer.getBoundingClientRect()
      // let imgRect = img.getBoundingClientRect();
      // console.log(mainImgContainerRect);


      // let deltaX = mainImgContainerRect.left - imgRect.left;
      // let deltaY = mainImgContainerRect.top - imgRect.top;

      // img.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      // if (e.target.classList.contains("mainImage")) {
      //   img.classList.remove("mainImage");
      //   img.classList.remove('info')

      //   document.body.style.backgroundColor = "rgb(124, 122, 122)";
      //   audio.pause();
      //   // audio.currentTime = 0;
      //   return;
      // }


      imgToFill.src = trackData.album.images[0].url;
      backgroungImgToFill.src = trackData.album.images[0].url;
      trackName.innerHTML = trackData.name;
      artistName.innerHTML = trackData.artists[0].name;
      albumName.innerHTML = trackData.album.name;

      // img.classList.add("mainImage");

      images.forEach((otherImg) => {
        if (otherImg !== img) {
          otherImg.classList.remove("mainImage");
          otherImg.classList.remove("info");
        }
      });

      if (currentAudio) {
        currentAudio.pause();
        // currentAudio.currentTime = 0;
      }

      audio.play();

      currentAudio = audio;
      let parentContainer = img.parentNode.parentNode;
      let imagesInContainer = parentContainer.querySelectorAll(".image");
      // let clickPos = Array.from(imagesInContainer).indexOf(img);
      // console.log(clickPos);
      // img.onclick = img.classList.remove("mainImage");

      var colorThief = new ColorThief();
      var imageUrl = img.src;
      var image = new Image();
      image.crossOrigin = "Anonymous";
      image.src = imageUrl;
      image.onload = function () {
        var dominantColor = colorThief.getColor(image);
        viewContainer.style.backgroundColor =
          "rgb(" +
          dominantColor[0] +
          "," +
          dominantColor[1] +
          "," +
          dominantColor[2] +
          ")";
      };

      // if (clickPos !== 2) {
      //   let elementToMove = img.parentNode;
      //   if (clickPos <= 2) {
      //     let referenceElement = imagesInContainer[3].parentNode;
      //     parentContainer.insertBefore(elementToMove, referenceElement);
      //   } else {
      //     let referenceElement = imagesInContainer[2].parentNode;
      //     parentContainer.insertBefore(elementToMove, referenceElement);
      //   }

      // let containers = document.querySelectorAll(".c");
      // containers.forEach((container) => {
      //   container.addEventListener("click", () => {
      //     let divOffsetTop = container.offsetTop;
      //     window.scrollTo({
      //       top: divOffsetTop,
      //       behavior: "instant",
      //     });
      //   });
      // });

      
    });
    exitSong.addEventListener("click", () => {
      viewContainer.style.display = "none";
      audio.pause();
      audio.currentTime = 0;
    });
  });
}

getProfileData();
