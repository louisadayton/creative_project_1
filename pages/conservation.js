function onClassSelection() {
  //e.preventDefault();

  let className = document.getElementById("classInput").value;

  // setup URL
  const url = "https://apps.des.qld.gov.au/species/?op=getfamilynames&kingdom=animals&class=" + className + "&f=json";

  // call API
  fetch(url)
    .then(function(response) {
      // make sure the request was successful
      if (response.status != 200) {
        console.log(response);
        return {
          text: "Error calling the Numbers API service: " + response.statusText
        }
      }
      return response.json();
    }).then(function(json) {

      console.log(json);
      let familyOptions = [];
      for (let i = 0; i < json.Family.length; i++) {
        familyOptions.push(json.Family[i].FamilyName);
      }
      updateFamilyOptions(familyOptions);

    });
}

function updateFamilyOptions(familyOptions) {
  //This function should update the options for family names
  let options = "<option> ---Choose a family--- </option>";
  for (let i = 0; i < familyOptions.length; i++) {
    if (familyOptions[i] === "Emydidae" || familyOptions[i] === "Bufonidae") {
      continue;
    }
    options = options + "<option value=" + familyOptions[i].toLowerCase() + "> " + familyOptions[i] + "</option>"
  }

  document.getElementById("familyInput").innerHTML = options;
}

function onFamilySelection() {
  //e.preventDefault();

  let familyName = document.getElementById("familyInput").value;
  // setup URL
  const url = "https://apps.des.qld.gov.au/species/?op=getspecies&family=" + familyName + "&f=json";
  // call API
  fetch(url)
    .then(function(response) {
      // make sure the request was successful
      if (response.status != 200) {
        console.log(response);
        return {
          text: "Error calling the Numbers API service: " + response.statusText
        }
      }
      return response.json();
    }).then(async function(json) {

      console.log(json);

      let commonNames = [];
      let imageURLs = [];
      let scientificNames = [];
      let animals = [];
      let j = 0;
      let i = 0;
      while (j < 5) {
        // do things
        await getImageURL(json.Species[i].SpeciesProfileUrl).then(imgURL => {
          if (imgURL != null && json.Species[i].AcceptedCommonName != null && json.Species[i].ScientificName != null && json.Species[i].ConservationStatus.NCAStatus != null) {
            let aml = {
              imageURL: imgURL,
              commonName: json.Species[i].AcceptedCommonName,
              scientificName: json.Species[i].ScientificName,
              conservation: json.Species[i].ConservationStatus.NCAStatus
            }
            animals.push(aml);
            imageURLs.push(imgURL);
            // commonNames.push(json.Species[i].AcceptedCommonName);
            // scientificNames.push(json.Species[i].ScientificName);
            j++;
          }
        });

        if (i === json.Species.length - 1) {
          break;
        }
        i++;
      }

      console.log(animals);

      updateResult(animals);
    });
}

async function getImageURL(speciesURL) {
  let url = speciesURL.replace("http", "https");
  let imageURL = "";
  imageURL = await fetch(url)
    .then(function(response) {
      // make sure the request was successful
      if (response.status != 200) {
        console.log(response);
        return {
          text: "Error calling the Numbers API service: " + response.statusText
        }
      }
      return response.json();
    }).then(function(json) {
      if (Object.keys(json.Species).includes("Image")) {

        if (Object.keys(json.Species.Image).includes("0")) {
          imageURL = json.Species.Image[0].URL;
          return imageURL;
        } else if (Object.keys(json.Species.Image).includes("URL")) {
          imageURL = json.Species.Image.URL;
          return imageURL;
        }

      }
      return null;
    });
  return imageURL;
}

function updateResult(animals) {
  let info = "";
  animals.forEach((aml) => {
    info += "<div class=\"row animal\">";
    info += "<div class=\"api-column\">"
    info = info + `<img src="${aml.imageURL}">`;
    info += "</div>";
    info += "<div class=\"api-column\">";
    info += "<h1><u>" + aml.commonName + "</u></h1>" + "<h3>" + aml.scientificName + "</h3>";
    info += "<p><em>Conservation Status: <u>" + aml.conservation + "</u></em></p>";
    info += "</div>";
    info += "</div>";
    info += "<hr style=\"width: 50%\"/>";
  });
  document.getElementById('threatened').innerHTML = info;
}