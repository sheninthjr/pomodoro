chrome.action.onClicked.addListener(() => {
    chrome.windows.create({
      url: "index.html",
      type: "popup",
      width: 320,   
      height: 450,  
      top: 100,
      left: 100,
      focused: true,
    });
  });