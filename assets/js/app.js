let cl = console.log;

let baseUrl = "https://jsonplaceholder.typicode.com/posts";
let info = document.getElementById("info");
let postForm = document.getElementById("postForm");
let title = document.getElementById("title");
let body = document.getElementById("body");
let submitBTn = document.getElementById("submitBTn");
let updateBtn = document.getElementById("updateBtn");
let postArr = [];

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}

function makeHTTPCall(method, url, body) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.onload = function () {
      if ((xhr.status === 200 || xhr.status === 201) && xhr.readyState === 4) {
        // cl(xhr.response);
        // let data = JSON.parse(xhr.response);
        // cl(data);
        // templeting(data);
        resolve(xhr.response);
      } else {
        reject("something went wrong");
        // cl("URL is not found");
      }
    };
    xhr.send(body);
  });
}

makeHTTPCall("GET", baseUrl)
  .then((resp) => {
    // cl(resp);
    postArr = JSON.parse(resp);
    templeting(postArr);
    cl(postArr);
  })
  .catch((err) => cl(err));

function onSubmitHandler(eve){
    eve.preventDefault();
    let obj ={
        title : title.value,
        body : body.value,
        id : uuidv4(),
    }
    cl(obj);
    postArr.push(obj);
    templeting(postArr);
    postForm.reset();
    makeHTTPCall('POST',baseUrl,JSON.stringify(obj));
}

function onEditHandler(ele){
    let getId = +ele.dataset.id;
    cl(getId);
    localStorage.setItem('setId',getId);
    let getObj = postArr.find(ele => ele.id === getId);
    cl(getObj);
    title.value = getObj.title;
    body.value = getObj.body;
    updateBtn.classList.toggle('d-none');
    submitBTn.classList.toggle('d-none');
}


function onUpdateHandler(){
    let obj ={
        title : title.value,
        body : body.value,
    }
    let updateID = +localStorage.getItem('setId');
    cl(updateID);
    let updatedUrl = `${baseUrl}/${updateID}`;
    postArr.forEach(ele =>{
        if(ele.id === updateID){
            ele.title = title.value;
            ele.body = body.value;
        }
    })
    templeting(postArr);
    makeHTTPCall('PATCH',updatedUrl,JSON.stringify(obj));
    updateBtn.classList.toggle('d-none');
    submitBTn.classList.toggle('d-none');
    postForm.reset();
}

function onDeleteHandler(eve){
    let deletedId = eve.dataset.id;
    let deletedUrl =`${baseUrl}/${deletedId}`;
    let newPostArr = postArr.filter((ele) => ele.id != deletedId);
    templeting(newPostArr);
    makeHTTPCall('DELETE',deletedUrl);
}

function templeting(arr) {
  let result = "";
  arr.forEach((ele) => {
    result += `
        <div class="card mb-4">
            <div class="card-body">
                <h3>${ele.title}</h3>
                <p>${ele.body}</p>
                <p class="text-right">
                    <button class="btn btn-success" data-id="${ele.id}" onclick="onEditHandler(this)">Edit</button>
                    <button class="btn btn-danger" data-id="${ele.id}" onclick="onDeleteHandler(this)">Delete</button>
                </p>
             </div>
        </div>
        `;
  });
  info.innerHTML = result;
}

postForm.addEventListener('submit',onSubmitHandler);
updateBtn.addEventListener('click',onUpdateHandler);
















