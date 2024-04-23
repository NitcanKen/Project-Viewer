let currentFiles = [];

async function fetchAndDisplayFiles(type) {
  try {
    if (type === 'allfiles') {
      // Fetch files from both folders
      const notebookResponse = await fetch(`./notebook/index.json`);
      const documentResponse = await fetch(`./document/index.json`);

      // Combine the files into one array and add a 'filetype' property to each file
      const notebookFiles = await notebookResponse.json();
      notebookFiles.forEach(file => file.filetype = 'notebook');
      const documentFiles = await documentResponse.json();
      documentFiles.forEach(file => file.filetype = 'document');
      currentFiles = [...notebookFiles, ...documentFiles];
    } else {
      // Fetch files from one folder
      const response = await fetch(`./${type}/index.json`);
      currentFiles = await response.json();
      // Add 'filetype' property to each file
      currentFiles.forEach(file => file.filetype = type);
    }

    // Display the files
    currentType = type;
    displayFiles(currentFiles);
  } catch (error) {
    console.error('Error fetching files:', error);
  }
}


function searchFiles(type, searchString) {
  const filteredFiles = currentFiles.filter((file) => {
    return file.title.toLowerCase().includes(searchString) && (type === 'allfiles' || file.filetype === type);
  });
  displayFiles(filteredFiles);
}


function displayFiles(files) {
  const filesList = document.getElementById('files-list');
  filesList.innerHTML = '';

  files.forEach((file) => {
    const listItem = document.createElement('div');
    listItem.classList.add('file-item');
    listItem.innerHTML = `<a href="./${file.filetype}/${file.filename}" target="_blank">${file.title}</a> <span class="file-type">${capitalizeFirstLetter(file.filetype)}</span>`;
    filesList.appendChild(listItem);
  });
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}



const tabs = document.querySelectorAll('.tab');
tabs.forEach((tab) => {
  tab.addEventListener('click', (event) => {
    const fileType = event.currentTarget.dataset.type;
    fetchAndDisplayFiles(fileType);
  });
});

fetchAndDisplayFiles('allfiles');

document.getElementById('notebook-tab').addEventListener('click', () => {
  fetchAndDisplayFiles('notebook');
});

document.getElementById('document-tab').addEventListener('click', () => {
  fetchAndDisplayFiles('document');
});

document.getElementById('allfiles-tab').addEventListener('click', () => {
  fetchAndDisplayFiles('allfiles');
});


const searchBar = document.getElementById('search-bar');
searchBar.addEventListener('keyup', (event) => {
  const searchString = event.target.value.toLowerCase();
  searchFiles(currentType, searchString);
});



// Dark mode functionality
const darkmodeToggle = document.getElementById("darkmode-toggle");
darkmodeToggle.addEventListener("change", function () {
  document.body.classList.toggle("dark-mode");
});