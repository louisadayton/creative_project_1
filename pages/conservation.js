
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
      if (familyOptions[i] == "Emydidae") {
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
          let j = 0; 
          let i = 0; 
          while (j < 15) {
            // do things 
            await getImageURL(json.Species[i].SpeciesProfileUrl).then(imgURL => {
              if(imgURL != null){
                imageURLs.push(imgURL);
                commonNames.push(json.Species[i].AcceptedCommonName);
                scientificNames.push(json.Species[i].ScientificName);
                j++; 
              }
            });
            
            if (i === json.Species.length - 1) {
              break; 
            }
            i++; 
          }
          console.log(commonNames); 
          console.log(scientificNames)
          console.log(imageURLs); 

          updateResult(commonNames, scientificNames, imageURLs);  
      });
  }
  
  async function getImageURL(speciesURL) {
    //let speciesURL = "http://apps.des.qld.gov.au/species/?op=getspeciesinformation&taxonid=716"; 
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
            }
            else if (Object.keys(json.Species.Image).includes("URL")) {
              imageURL = json.Species.Image.URL; 
              return imageURL; 
            } 
            
          }
          return null; 
      });
      return imageURL; 
  }

  function updateResult(commonNames, scientificNames, imgURLs) {
    let info = "";
    for (let i = 0; i < commonNames.length; i++) {
      info += "<div class=\"row animal\">";
      info += "<div class=\"api-column\">"
      info = info + '<img src="' + imgURLs[i] + '">';
      info += "</div>";
      info += "<div class=\"api-column\">";
      info = info + "<h1>" + commonNames[i] + "</h1>" + "<h2>" + scientificNames[i] + "</h2>";
      info += "</div>";
      info += "</div>";
    }
    document.getElementById('threatened').innerHTML = info;
  }

   

  //document.getElementById('classSubmit').addEventListener('click', onClassSelection);
  // document.getElementById('familySubmit').addEventListener('click', onFamilyClick); 
  
  