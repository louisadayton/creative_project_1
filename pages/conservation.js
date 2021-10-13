function onClick(e) {
  e.preventDefault();

  let regionID = document.getElementById("regionInput").value;
  console.log(regionID);
  let token = "9bb4facb6d23f48efbf424bb05c0c1ef1cf6f468393bc745d42179ac4aca5fee";
  // setup URL
  let url = "http://apiv3.iucnredlist.org/api/v3/species/region/" + regionID + "/page/0?token=" + token;
  //let url = "http://apiv3.iucnredlist.org/api/v3/species/region/europe/page/0?token=9bb4facb6d23f48efbf424bb05c0c1ef1cf6f468393bc745d42179ac4aca5fee"
  // call API
  fetch(url)
    .then(function(response) {
      // make sure the request was successful
      if (response.status != 200) {
        return {
          text: "Error calling the Numbers API service: " + response.statusText
        }
      }
      return response.json();
    }).then(function(json) {
      // update DOM with response
      let commonNames = [];
      let scientificNames = [];
      let i = 0;
      let j = -1;
      while (i < 5) {
        j++;
        if (json.result[j].class_name !== "AMPHIBIA" && json.result[j].class_name !== "REPTILIA") {
          //console.log(json.result[i].class_name);
          continue;
        }
        console.log(json.result[j].main_common_name);
        //console.log(json.result[j].scientific_name);
        //console.log(json.result[j].class_name);
        commonNames.push(json.result[j].main_common_name);
        scientificNames.push(json.result[j].scientific_name);
        i++;
      }

      updateResult(commonNames, scientificNames);
    });
}

function updateResult(commonNames, scientificNames) {
  let info = "";
  for (let i = 0; i < commonNames.length; i++) {
    info += "<div class=\"row animal\">";
    info += "<div class=\"api-column\">"
    info = info + '<img src="/images/' + commonNames[i] + '.jpg" style="height:150px; width:200px;">';
    info += "</div>";
    info += "<div class=\"api-column\">";
    info = info + "<h1>" + commonNames[i] + "</h1>" + "<h2>" + scientificNames[i] + "</h2>";
    info += "</div>";
    info += "</div>";
  }
  document.getElementById('threatened').innerHTML = info;
}

document.getElementById('regionSubmit').addEventListener('click', onClick);