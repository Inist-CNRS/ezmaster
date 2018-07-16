const UNITS = ["B", "kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

module.exports.prettyBytes = num => {
  if (!Number.isFinite(num)) {
    throw new TypeError(`Expected a finite number, got ${typeof num}: ${num}`);
  }

  const neg = num < 0;

  if (neg) {
    num = -num;
  }

  if (num < 1) {
    return (neg ? "-" : "") + num + " B";
  }

  const exponent = Math.min(Math.floor(Math.log10(num) / 3), UNITS.length - 1);
  const numStr = Number((num / Math.pow(1000, exponent)).toPrecision(3));
  const unit = UNITS[exponent];

  return (neg ? "-" : "") + numStr + " " + unit;
};

/*eslint no-control-regex: "off"*/
/**
 * Function used to parse the markdown content on this page
 * https://github.com/Inist-CNRS/ezmaster/blob/reactjs/EZMASTERIZED.md
 */
module.exports.parseEzMasterizedAppsMD = rawMD => {
  let myArray;
  let appList = {};
  let myRe = new RegExp("^### (.*)\n+[*] (.*)\n[*] (.*)$", "mg");
  while ((myArray = myRe.exec(rawMD)) !== null) {
    var docker = new RegExp("registry.hub.docker.com/u/([^/]+)/([^/)]+)").exec(
      myArray[3]
    );
    docker = docker[1] + "/" + docker[2];
    var github = new RegExp("github.com/([^/]+)/([^/)]+)").exec(myArray[3]);
    github = github[1] + "/" + github[2];

    appList[myArray[1]] = {
      description: myArray[2],
      docker: docker,
      github: github
    };
  }
  return appList;
};

/**
 * Parse docker pull result stream to %
 */
module.exports.parseDockerPullToPerCent = txt => {
  // Extracting: 34.54MB/62.64MB
  if (!txt) return 0;
  let parsed = txt
    .replace("Extracting: ", "")
    .replace("Downloading: ", "")
    .replace(/MB/g, "", "g")
    .split("/")
    .map(parseFloat);
  return parsed[0] / parsed[1] * 100;
};
