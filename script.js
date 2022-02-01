let count = 0; // Number of levels to display
let levels; // Array to store the level details from the data
let isInverted = false; // Boolean to check if the content is to be displayed on the right side

// Function to get the data from the levelinfo.json file
async function populate() {
    let requestURL = "levelinfo.json";
    const request = new Request(requestURL);
    const response = await fetch(request);
    levels = await response.json();
    showLevels(levels);
}

populate();

// Method to check if the user has reached the end of the page
document.addEventListener("scroll", function () {
    const {
        scrollTop,
        scrollHeight,
        clientHeight
    } = document.documentElement;
    console.log({
        scrollTop,
        scrollHeight,
        clientHeight
    });
    if (scrollTop + clientHeight >= scrollHeight - 15) {
        console.log("called");
        count += 5;
        showLevels(levels);
    }
})

// Function to update the progress bar
function progressHandler(resources) {

    let tot = 0;
    for (let i = 0; i < resources.length; i++) {
        tot += resources[i]["isCompleted"] ? 1 : 0;
    }
    console.log("Called" + tot);
    let completed = Math.floor(tot * 100 / resources.length) + "%";
    let progress = document.getElementsByClassName("progress-bar")[0];
    progress.innerHTML = completed;
    progress.style.width = completed;
}

// Function to add elements to the page
function showLevels(obj) {
    const resources = obj['resources'];
    let list = document.querySelector('ul');
    for (let i = count; i < count + 5 && i < resources.length; i++) {
        let listItem = document.createElement('li');
        
        let title = document.createElement('h4');
        
        // title-label
        title.textContent = resources[i]['title'];
        title.classList.add('topic');
        title.classList.add('topic-right')
        listItem.appendChild(title);

        if (isInverted) {
            listItem.className = 'timeline-inverted';
            title.classList.replace('topic-right', 'topic-left');
        }
        
        
        // To display level number
        let imgContainer = document.createElement('div');
        imgContainer.classList = "timeline-image timeline-image-red";
        let level = document.createElement('div');
        level.className = "num";
        level.textContent = resources[i]["level-no"];
        let circleImg = document.createElement('img');
        circleImg.classList = 'img-circle img-responsive';

        imgContainer.appendChild(level);
        imgContainer.appendChild(circleImg);

        listItem.appendChild(imgContainer);


        // Panel that displays the resources
        let timelinePanel = document.createElement('div');
        timelinePanel.classList = "timeline-panel";

        let timelinePanelHeading = document.createElement('div');
        timelinePanelHeading.className = "timeline-heading";
        let timelinePanelMainHeading = document.createElement('h4');
        let timelinePanelSubHeading = document.createElement('h4');
        timelinePanelSubHeading.className = "subheading";

        timelinePanelSubHeading.textContent = resources[i]["title"];
        let isCompleted = document.createElement('input');
        isCompleted.className = "form-check-input";
        isCompleted.id = "flexCheckDefault";
        isCompleted.type = "checkbox";

        // To change the colour of the level to green if its completed
        isCompleted.onclick = function () {
            if (isCompleted.checked) {
                imgContainer.classList = "timeline-image timeline-image-green";
                resources[i]["isCompleted"] = true;
            } else {
                imgContainer.classList = "timeline-image timeline-image-red";
                resources[i]["isCompleted"] = false;
            }
            progressHandler(resources);
        }

        timelinePanelMainHeading.appendChild(isCompleted);
        timelinePanelMainHeading.append("Part-" + resources[i]["part-no"]);

        let tagContainer = document.createElement('div');
        let tag = document.createElement('span');
        let blockchainTag = document.createElement('span');
        tag.className = "badge bg-dark";
        tag.textContent = resources[i]["tag"];
        blockchainTag.className = "badge bg-light text-dark";
        blockchainTag.textContent = resources[i]["blockchain-tag"];
        tagContainer.appendChild(tag);
        tagContainer.appendChild(blockchainTag);

        timelinePanelHeading.appendChild(timelinePanelMainHeading);
        timelinePanelHeading.appendChild(timelinePanelSubHeading);
        timelinePanelHeading.appendChild(tagContainer);
        timelinePanel.appendChild(timelinePanelHeading);

        let timelinePanelBody = document.createElement('div');
        timelinePanelBody.classList = "timeline-body";

        let timelinePanelBodyContents = document.createElement('p');
        timelinePanelBodyContents.textContent = resources[i]["description"];

        let timelinePanelBodyBtns = document.createElement('div');
        let videoButton = document.createElement('button');
        videoButton.className = "btn btn-secondary";
        videoButton.textContent = "Watch Video";
        videoButton.onclick = function () {
            window.open(resources[i]["video"]);
        }
        let blogButton = document.createElement('button');
        blogButton.className = "btn btn-outline-light";
        blogButton.textContent = "Read Blog";
        blogButton.onclick = function () {
            window.open(resources[i]["blog"]);
        }
        timelinePanelBodyBtns.appendChild(videoButton);
        timelinePanelBodyBtns.appendChild(blogButton);

        timelinePanelBody.appendChild(timelinePanelBodyContents);
        timelinePanelBody.appendChild(timelinePanelBodyBtns);
        timelinePanel.appendChild(timelinePanelBody);

        let timelinePanelTriangle = document.createElement('div');
        if (isInverted) {
            timelinePanelTriangle.className = "triangle-inverted";
        } else
            timelinePanelTriangle.className = "triangle";

        timelinePanel.appendChild(timelinePanelTriangle);

        listItem.appendChild(timelinePanel);

        // Line that connects 2 levels
        let line = document.createElement('div');
        if (i != resources.length - 1 )
            line.className = "line";

        listItem.appendChild(line);

        list.appendChild(listItem);

        isInverted = !isInverted;
    }
}