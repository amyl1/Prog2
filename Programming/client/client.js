
// when loaded, call the user login function
window.addEventListener('load', async function () {
  try {
    userlogin();
  } catch (error) {
    handleError(error);
  }
});

// called throughout the program. Checks if the server is running, if it is not, displays an error to user.
function checkServer () {
  var xhttp = new XMLHttpRequest();
  try {
    xhttp.onreadystatechange = function () {
      if (xhttp.readyState === 4 && xhttp.status === 0) {
        handleError('Server is not connected. Please refresh the page and try again.');
      }
    };
    xhttp.open('GET', 'http://127.0.0.1:8090/all', true);
    xhttp.send();
  } catch (error) {
    handleError(error);
  }
}

// Shows list of all user accounts created so far. Allows user to create a new account. When account selected, calls the login function
async function userlogin () {
  checkServer();
  clearAll();
  const response = await fetch('http://127.0.0.1:8090/accounts');
  const body = await response.text();
  const results = JSON.parse(body);
  results.innerHTML = body;
  const div = document.getElementById('intro');

  for (const result of results) {
    const div4 = document.createElement('div');
    div4.setAttribute('class', "'col-sm-12 col-md-6 col-lg-4 col-xl-3'");
    const div5 = document.createElement('div');
    div5.setAttribute('class', 'card mb-4 box-shadow bg-secondary text-white');
    const item = document.createElement('h5');
    const image = document.createElement('img');
    item.setAttribute('id', result.User);
    item.setAttribute('align', 'center');
    item.innerHTML = result.User;
    image.setAttribute('src', result.pic);
    image.setAttribute('height', '15%');
    image.setAttribute('width', '15%');
    image.setAttribute('align', 'middle');
    image.setAttribute('class', 'rounded-circle');
    const centre = document.createElement('center');
    centre.append(image);
    div5.append(centre);
    div5.append(item);
    div5.onclick = function () {
      var name = item.id;
      login(name);
    };
    div4.append(div5);
    div.append(div4);
  }
  const buttondiv = document.getElementById('button');
  const button = document.createElement('button');
  button.innerHTML = 'Create New Account';
  button.setAttribute('id', 'new_account');
  button.setAttribute('class', 'btn btn-outline-primary btn-block');
  buttondiv.append(button);
  button.onclick = async function () {
    event.preventDefault();
    clearAll();
    const uploadDiv = document.getElementById('upload_div');
    const title = document.createElement('h2');
    const node = document.createTextNode('Create New Account');
    title.appendChild(node);
    const form = document.createElement('form');
    form.setAttribute('action', 'http://127.0.0.1:8090/newaccount');
    form.setAttribute('method', 'post');
    form.setAttribute('id', 'newaccount');
    const button = document.createElement('button');
    button.innerHTML = 'Create Account';
    const in1 = document.createElement('input');
    in1.setAttribute('id', 'User');
    in1.setAttribute('name', 'User');
    in1.setAttribute('type', 'text');
    in1.setAttribute('placeholder', 'Enter Your Username');
    in1.setAttribute('class', 'form-control');
    const label1 = document.createElement('label');
    label1.setAttribute('for', 'User');
    label1.innerHTML = 'Enter Your Username:';
    const in2 = document.createElement('input');
    in2.setAttribute('id', 'pic');
    in2.setAttribute('name', 'pic');
    in2.setAttribute('type', 'text');
    in2.setAttribute('placeholder', 'URL for your profile picture');
    in2.setAttribute('class', 'form-control');
    const label2 = document.createElement('label');
    label2.setAttribute('for', 'pic');
    label2.innerHTML = 'Enter the URL of your profile picture:';
    const but2 = document.createElement('input');
    but2.innerHTML = 'Submit';
    but2.setAttribute('type', 'submit');
    form.append(label1);
    form.append(in1);
    form.append(label2);
    form.append(in2);
    form.append(button);
    uploadDiv.appendChild(title);
    uploadDiv.append(form);
    const newAccount = document.getElementById('newaccount');
    newAccount.addEventListener('submit', async function (event) {
      event.preventDefault();
      const User = document.getElementById('User').value;
      const pic = document.getElementById('pic').value;
      const data = { User: User, pic: pic };
      clearAll();
      fetch('http://127.0.0.1:8090/newaccount'
        , {
          method: 'POST',
          mode: 'cors',
          cache: 'no-cache',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json'
          },
          redirect: 'follow',
          referrer: 'no-referrer',
          body: JSON.stringify(data)
        });
      userlogin();
    });
  };
}
// when user account is selected, put id and pic in nav bar. When logged in, show all posts
async function login (name) {
  checkServer();
  navBar();
  const login = document.getElementById('user');
  login.innerHTML = '';
  const pic = document.createElement('img');
  const response = await fetch('http://127.0.0.1:8090/pic?name=' + name);
  const body = await response.text();
  pic.setAttribute('src', body);
  pic.setAttribute('height', 40);
  login.append(pic);
  const namediv = document.getElementById('name');
  const para = document.getElementById('username');
  para.innerHTML = name;
  namediv.append(para);
  clearAll();
  const response2 = await fetch('http://127.0.0.1:8090/all');
  const body2 = await response2.text();
  const results = JSON.parse(body2);
  results.innerHTML = body2;
  genAlbum(results);
}
// This function is use in all the try, catch statements.
// It displays a message to the user, informing them that an error has occured and what the error was.
function handleError (error) {
  checkServer();
  clearAll();
  const resultsDiv = document.getElementById('search_results');
  resultsDiv.setAttribute('class', 'jumbotron');
  const message = document.createElement('h4');
  message.setAttribute('align', 'center');
  message.innerHTML = 'Oops! An error has occured.';
  const err = document.createElement('p');
  err.setAttribute('align', 'center');
  err.innerHTML = 'The error was: ' + error;
  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.setAttribute('class', 'btn btn-primary btn-block');
  button.innerHTML = 'Return to show all posts';
  resultsDiv.append(message);
  resultsDiv.append(err);
  if (error !== 'Server is not connected. Please refresh the page and try again.') {
  resultsDiv.append(button);
  }
  // gives the user an option to return to show all posts when an error has occured
  button.addEventListener('click', async function (event) {
    event.preventDefault();
    const response = await fetch('http://127.0.0.1:8090/all');
    const body = await response.text();
    const results = JSON.parse(body);
    results.innerHTML = body;
    genAlbum(results);
  });
}

// Empties all divs so that page is cleared before new items are generated. Also resets the class of some divs so the background colour returns to white
function clearAll () {
  const resultsDiv = document.getElementById('search_results');
  resultsDiv.innerHTML = '';
  resultsDiv.setAttribute('class', 'row');
  const upload = document.getElementById('upload_div');
  upload.innerHTML = '';
  const intro = document.getElementById('intro');
  intro.setAttribute('class', 'row');
  intro.innerHTML = '';
  const successDiv = document.getElementById('success_div');
  successDiv.innerHTML = '';
  const post = document.getElementById('post');
  post.innerHTML = '';
  const comment = document.getElementById('comment');
  comment.innerHTML = '';
  comment.setAttribute('class', 'row');
  const button = document.getElementById('button');
  button.innerHTML = '';
  button.setAttribute('class', 'row');
  const jumbo = document.getElementById('jumbo');
  jumbo.innerHTML = '';
}

// Generate the nav bar which appears once the user has logged in. Also calls the required functions when the user clicks on something on the bar.
function navBar () {
  // creates navbar and makes responsive to window size.
  checkServer();
  const nav = document.getElementById('navbar');
  const home = document.createElement('a');
  home.setAttribute('class', 'navbar-brand');
  home.innerHTML = 'Travel Photos';
  const button = document.createElement('button');
  button.setAttribute('type', 'buttton');
  button.setAttribute('class', 'navbar-toggler');
  button.setAttribute('data-toggle', 'collapse');
  button.setAttribute('data-target', '#navbarCollapse');
  const span = document.createElement('span');
  span.setAttribute('class', 'navbar-toggler-icon');
  button.append(span);
  const div1 = document.createElement('div');
  div1.setAttribute('class', 'collapse navbar-collapse');
  div1.setAttribute('id', 'navbarCollapse');
  const div2 = document.createElement('div');
  div2.setAttribute('class', 'navbar-nav');
  const all = document.createElement('a');
  // creates the links on the navbar
  all.setAttribute('class', 'nav-item nav-link');
  all.setAttribute('id', 'all');
  all.innerHTML = 'Show All Posts';
  const upload = document.createElement('a');
  upload.setAttribute('class', 'nav-item nav-link');
  upload.setAttribute('id', 'upload');
  upload.innerHTML = 'Upload New Post';
  const searchUsers = document.createElement('a');
  searchUsers.setAttribute('class', 'nav-item nav-link');
  searchUsers.setAttribute('id', 'searchUsers');
  searchUsers.innerHTML = 'Search Users';
  const viewUsers = document.createElement('a');
  viewUsers.setAttribute('class', 'nav-item nav-link');
  viewUsers.setAttribute('id', 'viewUsers');
  viewUsers.innerHTML = 'All users';
  div2.append(all);
  div2.append(upload);
  div2.append(searchUsers);
  div2.append(viewUsers);
  // creates search posts form
  const form = document.createElement('form');
  form.setAttribute('id', 'search');
  form.setAttribute('action', '/search');
  form.setAttribute('class', 'form-inline d-flex justify-content-center md-form form-sm mt-0');
  const in1 = document.createElement('input');
  in1.setAttribute('class', 'form-control form-control-sm ml-3 w-75');
  in1.setAttribute('name', 'keyword');
  in1.setAttribute('type', 'text');
  in1.setAttribute('id', 'search_keyword');
  in1.setAttribute('placeholder', 'Search For:');
  form.append(in1);
  const div3 = document.createElement('div');
  const div4 = document.createElement('div');
  div4.setAttribute('class', 'profile-userpic');
  div4.setAttribute('id', 'user');
  const div5 = document.createElement('div');
  div5.setAttribute('class', 'profile-usertitle');
  const div6 = document.createElement('div');
  div6.setAttribute('class', 'profile-usertitle-name');
  div6.setAttribute('id', 'name');
  const text = document.createElement('p');
  text.setAttribute('id', 'username');
  // appends the respective sections to the navbar and the navbar to the page.
  div6.append(text);
  div1.append(div2);
  div1.append(form);
  div3.append(div4);
  div3.append(div5);
  div5.append(div6);
  nav.append(home);
  nav.append(button);
  nav.append(div1);
  nav.append(div3);

// Used for show all posts. Calls the showAll function. Event listener on nav bar link. Event listener on nav bar link.
all.addEventListener('click', async function (event) {
  try {
    event.preventDefault();
    showAll();
  } catch (error) {
    handleError(error);
  }
});

// Used for upload a new post. Calls the genUploadForm function. Event listener on nav bar link.
upload.addEventListener('click', async function (event) {
  try {
    event.preventDefault();
    clearAll();
    genUploadForm();
  } catch (error) {
    handleError(error);
  }
});
// Used for search user. Calls the userSearch function. Event listener on nav bar link.
searchUsers.addEventListener('click', async function (event) {
  try {
    event.preventDefault();
    clearAll();
    userSearch();
  } catch (error) {
    handleError(error);
  }
});
// Used for search user. Calls the viewAllUsers function. Event listener on nav bar link.
viewUsers.addEventListener('click', async function (event) {
  try {
    event.preventDefault();
    clearAll();
    viewAllUsers();
  } catch (error) {
    handleError(error);
  }
});
// Adds event listener for when the search posts form is submitted. Calls the searchPosts function.
const searchForm = document.getElementById('search');
searchForm.addEventListener('submit', async function (event) {
    try {
      event.preventDefault();
      clearAll();
      searchPosts();
    } catch (error) {
      handleError(error);
    }
  });
}

// creates album items for the posts returned as the result from app.js
function genAlbum (results) {
  try {
    checkServer();
    clearAll();
    const resultsDiv = document.getElementById('search_results');
    // create one div for each item in the result.
    for (const result of results) {
      const div1 = document.createElement('div');
      div1.setAttribute('class', 'col-sm-12 col-md-6 col-lg-4 col-xl-3');
      const h = document.createElement('h4');
      h.innerHTML = 'Title: ' + result.title;
      const img = document.createElement('img');
      img.setAttribute('src', result.image);
      img.setAttribute('alt', result.title);
      img.setAttribute('width', '90%');
      const p = document.createElement('p');
      p.innerHTML = result.des;
      const bt1 = document.createElement('button');
      bt1.innerHTML = 'View Post';
      bt1.setAttribute('id', result.title);
      bt1.onclick = function () {
        var title = bt1.id;
        viewpost(title);
      };
      const bt2 = document.createElement('button');
      bt2.setAttribute('id', result.title);
      bt2.onclick = function () {
        var title = bt1.id;
        comment(title);
      };
      bt2.innerHTML = 'Comment';
      const bt3 = document.createElement('button');
      bt3.innerHTML = 'Delete Post';
      bt3.setAttribute('id', result.title);
      bt3.onclick = function () {
        var title = bt3.id;
        deletepost(title);
      };
      const small = document.createElement('small');
      small.setAttribute('class', 'text-muted');
      small.innerHTML = result.user;
      div1.append(h);
      div1.append(img);
      div1.append(p);
      div1.append(bt1);
      div1.append(bt2);
      div1.append(bt3);
      div1.append(small);
      const heading = document.createElement('h5');
      heading.innerHTML = 'Comments:';
      div1.append(heading);
      const comments = result.comments;
      // if no comments, display this to the user.
      if (comments.length === 0) {
        const message = document.createElement('p');
        message.innerHTML = 'No comments yet';
        div1.append(message);
      } else {
        // display all the comments added to a post.
        for (const comment in comments) {
          const p = document.createElement('p');
          const node = document.createTextNode(comments[comment]);
          p.append(node);
          div1.append(p);
        }
      }
      resultsDiv.append(div1);
    }
  } catch (error) {
    handleError(error);
  }
}
// When view post button is clicked, load post full screen.
async function viewpost (title) {
  checkServer();
  clearAll();
  const resultsDiv = document.getElementById('post');
  const response = await fetch('http://127.0.0.1:8090/post?title=' + title);
  const body = await response.text();
  const result = JSON.parse(body);
  result.innerHTML = body;
  const div1 = document.createElement('div');
  const img = document.createElement('img');
  img.setAttribute('src', result.image);
  img.setAttribute('alt', result.title);
  img.setAttribute('class', 'img-fluid rounded border border-dark');
  img.setAttribute('align', 'middle');
  const centre = document.createElement('center');
  centre.append(img);
  const div2 = document.createElement('div');
  div2.setAttribute('class', 'card-body');
  const div3 = document.createElement('div');
  div3.setAttribute('class', 'card-text');
  const postTitle = document.createElement('h3');
  postTitle.setAttribute('class', 'text-primary');
  postTitle.innerHTML = 'Post Title: ' + result.title;
  const heading1 = document.createElement('h4');
  heading1.innerHTML = 'Description:';
  heading1.setAttribute('class', 'text-primary');
  const para = document.createElement('p');
  para.innerHTML = result.des;
  const bt1 = document.createElement('button');
  bt1.setAttribute('id', result.title);
  bt1.setAttribute('class', 'btn btn-secondary border border-light');
  bt1.onclick = function () {
    var title = bt1.id;
    comment(title);
  };
  bt1.innerHTML = 'Comment';
  const bt2 = document.createElement('button');
  bt2.innerHTML = 'Delete Post';
  bt2.setAttribute('id', result.title);
  bt2.setAttribute('class', 'btn btn-secondary border border-light');
  bt2.onclick = function () {
    var title = bt2.id;
    deletepost(title);
  };
  div1.append(postTitle);
  div1.append(centre);
  div3.append(heading1);
  div3.append(para);

  const heading2 = document.createElement('h4');
  heading2.innerHTML = 'Comments:';
  heading2.setAttribute('class', 'text-primary');
  div3.append(heading2);
  const comments = result.comments;
  if (comments.length === 0) {
    const message = document.createElement('p');
    message.innerHTML = 'No comments yet';
    div3.append(message);
  } else {
    for (const comment in comments) {
      const p = document.createElement('p');
      const node = document.createTextNode(comments[comment]);
      p.append(node);
      div3.append(p);
    }
  }
  const button = document.createElement('button');
      button.setAttribute('type', 'button');
      button.setAttribute('class', 'btn btn-primary btn-block');
      button.innerHTML = 'Return to show all posts';
      button.addEventListener('click', async function (event) {
        event.preventDefault();
        const response = await fetch('http://127.0.0.1:8090/all');
        const body = await response.text();
        const results = JSON.parse(body);
        results.innerHTML = body;
        genAlbum(results);
      });
  const centre2 = document.createElement('center');
  centre2.append(bt1);
  centre2.append(bt2);
  div3.append(centre2);
  div3.append(button);
  div2.append(div3);
  div1.append(div2);
  resultsDiv.append(div1);
}
// when a user profile is selected from either userSearch or viewAllUsers, show all posts uploaded by that user
async function view (user) {
  checkServer();
  const response = await fetch('http://127.0.0.1:8090/viewProfile?name=' + user);
  const body = await response.text();
  const results = JSON.parse(body);
  results.innerHTML = body;
  // if no posts by selected user, display a message to the user.
  if (results === undefined || results.length === 0) {
    clearAll();
    const resultsDiv = document.getElementById('search_results');
    resultsDiv.setAttribute('class', 'jumbotron');
    const message = document.createElement('h4');
    message.setAttribute('align', 'center');
    message.innerHTML = 'No posts by this user';
    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.setAttribute('class', 'btn btn-primary btn-block');
    button.innerHTML = 'Return to show all posts';
    resultsDiv.append(message);
    resultsDiv.append(button);
    button.addEventListener('click', async function (event) {
      event.preventDefault();
      const response = await fetch('http://127.0.0.1:8090/all');
      const body = await response.text();
      const results = JSON.parse(body);
      results.innerHTML = body;
      genAlbum(results);
    });
  } else {
      genAlbum(results);
    }
}
// Allows the user to add a comment to a post that already exists. Called from comment button when posts are displayed.
async function comment (title) {
  try {
    checkServer();
    clearAll();
    const div = document.getElementById('comment');
    div.setAttribute('class', 'jumbotron');
    const form = document.createElement('form');
    form.setAttribute('method', 'post');
    form.setAttribute('action', 'http://127.0.0.1:8090/comment');
    const h = document.createElement('h3');
    h.setAttribute('align', 'justify');
    h.innerHTML = 'Enter your comment:';
    const input = document.createElement('input');
    input.setAttribute('id', 'new_comment');
    input.setAttribute('type', 'text');
    input.setAttribute('placeholder', 'Comment');
    input.setAttribute('class', 'form-control');
    const button = document.createElement('button');
    button.innerHTML = 'Post';
    button.setAttribute('type', 'submit');
    button.setAttribute('class', 'btn btn-primary btn-block');
    form.append(input);
    form.append(button);
    div.append(h);
    div.append(form);
    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      const comment = document.getElementById('new_comment').value;
      const data = { comment: comment, title: title };
      fetch('http://127.0.0.1:8090/comment'
        , {
          method: 'POST',
          mode: 'cors',
          cache: 'no-cache',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json'
          },
          redirect: 'follow',
          referrer: 'no-referrer',
          body: JSON.stringify(data)
        });

      clearAll();
      const main = document.getElementById('jumbo');
      const div = document.createElement('div');
      div.setAttribute('class', 'jumbotron');
      const heading = document.createElement('h1');
      heading.setAttribute('align', 'center');
      heading.innerHTML = 'Comment Successful';
      const text = document.createElement('p');
      text.setAttribute('class', 'lead');
      text.setAttribute('align', 'center');
      text.innerHTML = 'Your comment has been successfully posted.';
      const button2 = document.createElement('button');
      button2.setAttribute('type', 'button');
      button2.setAttribute('class', 'btn btn-primary btn-block');
      button2.innerHTML = 'Return to show all posts';
      button2.addEventListener('click', async function (event) {
        event.preventDefault();
        const response = await fetch('http://127.0.0.1:8090/all');
        const body = await response.text();
        const results = JSON.parse(body);
        results.innerHTML = body;
        genAlbum(results);
      });
      div.append(heading);
      div.append(text);
      div.append(button2);
      main.append(div);
    });
  } catch (error) {
    handleError(error);
  }
}
// The user can request to delete a post. Authentication is included so that you can only delete posts that you have uploaded. Called from delete button when posts are displayed.
async function deletepost (title) {
  try {
    checkServer();
    clearAll();
    // gets the username of the person who is logged in from the profile in the navbar.
    const loggedin = document.getElementById('username').textContent;
    const data = { title: title, loggedin: loggedin };
    const response = await fetch('http://127.0.0.1:8090/delete'
      , {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrer: 'no-referrer',
        body: JSON.stringify(data)
      });
    // if response from the server is okay, the post will have been deleted so display success message to the user.
    if (response.ok) {
      clearAll();
      const main = document.getElementById('jumbo');
      const div = document.createElement('div');
      div.setAttribute('class', 'jumbotron');
      const heading = document.createElement('h1');
      heading.setAttribute('align', 'center');
      heading.innerHTML = 'Deleted';
      const text = document.createElement('p');
      text.setAttribute('class', 'lead');
      text.setAttribute('align', 'center');
      text.innerHTML = 'Post Successfully Deleted.';
      // give user option to return to show all posts.
      const button2 = document.createElement('button');
      button2.setAttribute('type', 'button');
      button2.setAttribute('class', 'btn btn-primary btn-block');
      button2.innerHTML = 'Return to show all posts';
      button2.addEventListener('click', async function (event) {
        event.preventDefault();
        const response = await fetch('http://127.0.0.1:8090/all');
        const body = await response.text();
        const results = JSON.parse(body);
        results.innerHTML = body;
        genAlbum(results);
      });
      div.append(heading);
      div.append(text);
      div.append(button2);
      main.append(div);
    } else {
      // if error occurs, the user will be forbidden from deleting this item. Therefore, call error handling function.
      handleError('You are not permitted to perform this action');
    }
  } catch (error) {
    handleError(error);
  }
}
// called from show all posts on navbar. Generates album for all posts in the posts.json file.
async function showAll () {
  checkServer();
    const response = await fetch('http://127.0.0.1:8090/all');
    const body = await response.text();
    const results = JSON.parse(body);
    results.innerHTML = body;
    genAlbum(results);
}
// called from upload new posts on navbar. Authentication to check a post with the same title doesn't already exist.
async function genUploadForm () {
  checkServer();
  const uploadDiv = document.getElementById('upload_div');
    const h = document.createElement('h2');
    h.innerHTML = 'Upload New Post';
    const form = document.createElement('form');
    form.setAttribute('action', 'http://127.0.0.1:8090/newpost');
    form.setAttribute('method', 'post');
    form.setAttribute('id', 'newupload');
    form.setAttribute('enctype', 'multipart/form-data');
    const in1 = document.createElement('input');
    in1.setAttribute('name', 'title');
    in1.setAttribute('id', 'title');
    in1.setAttribute('type', 'text');
    in1.setAttribute('placeholder', 'Post Title');
    in1.setAttribute('class', 'form-control');
    const l1 = document.createElement('label');
    l1.setAttribute('for', 'title');
    l1.innerHTML = 'Post Title:';
    const in2 = document.createElement('input');
    in2.setAttribute('name', 'image');
    in2.setAttribute('id', 'image');
    in2.setAttribute('type', 'text');
    in2.setAttribute('placeholder', 'Image URL');
    in2.setAttribute('class', 'form-control');
    const l2 = document.createElement('label');
    l2.setAttribute('for', 'image');
    l2.innerHTML = 'The URL of your image:';
    const in3 = document.createElement('input');
    in3.setAttribute('name', 'des');
    in3.setAttribute('id', 'des');
    in3.setAttribute('type', 'text');
    in3.setAttribute('placeholder', 'Description');
    in3.setAttribute('class', 'form-control');
    const l3 = document.createElement('label');
    l3.setAttribute('for', 'des');
    l3.innerHTML = 'Post Description:';
    const button = document.createElement('button');
    button.setAttribute('type', 'submit');
    button.setAttribute('class', 'btn btn-primary btn-block');
    button.innerHTML = 'Post';
    form.append(l1);
    form.append(in1);
    form.append(l2);
    form.append(in2);
    form.append(l3);
    form.append(in3);
    form.append(button);
    uploadDiv.appendChild(h);
    uploadDiv.append(form);
    const uploadForm = document.getElementById('newupload');
    uploadForm.addEventListener('submit', async function (event) {
      event.preventDefault();
      const title = document.getElementById('title').value;
      const image = document.getElementById('image').value;
      const user = document.getElementById('username').textContent;
      const des = document.getElementById('des').value;
      const data = { user: user, title: title, image: image, des: des };
      console.log(data);
      clearAll();
      const response = await fetch('http://127.0.0.1:8090/newpost'
        , {
          method: 'POST',
          mode: 'cors',
          cache: 'no-cache',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json'
          },
          redirect: 'follow',
          referrer: 'no-referrer',
          body: JSON.stringify(data)
        });

        // if no error occurs, show the user a message saying that the post has been uploaded.
      if (response.ok) {
        const main = document.getElementById('jumbo');
        const div = document.createElement('div');
        div.setAttribute('class', 'jumbotron');
        const heading = document.createElement('h1');
        heading.setAttribute('align', 'center');
        heading.innerHTML = 'Post Successful';
        const text = document.createElement('p');
        text.setAttribute('class', 'lead');
        text.setAttribute('align', 'center');
        text.innerHTML = 'Your post has been successfully uploaded.';
        // Gives the user the option to return to show all posts
        const button2 = document.createElement('button');
        button2.setAttribute('type', 'button');
        button2.setAttribute('class', 'btn btn-primary btn-block');
        button2.innerHTML = 'Return to show all posts';
        button2.addEventListener('click', async function (event) {
          event.preventDefault();
          const response = await fetch('http://127.0.0.1:8090/all');
          const body = await response.text();
          const results = JSON.parse(body);
          results.innerHTML = body;
          genAlbum(results);
        });
        div.append(heading);
        div.append(text);
        div.append(button2);
        main.append(div);
      } else {
        handleError('A post with that title already exists');
    };
    });
}
// called when search for a user is pressed on the navbar.
async function userSearch () {
  checkServer();
    const div = document.getElementById('intro');
      div.setAttribute('class', 'jumbotron');
      // generates a search form
      var uSearch = document.createElement('form');
      uSearch.setAttribute('id', 'search');
      uSearch.setAttribute('action', '/searchUser');
      uSearch.setAttribute('class', 'form-inline d-flex justify-content-center md-form form-sm mt-0');
      const i = document.createElement('input');
      i.setAttribute('class', 'form-control form-control-sm ml-3 w-100');
      i.setAttribute('name', 'name');
      i.setAttribute('type', 'text');
      i.setAttribute('id', 'user');
      i.setAttribute('placeholder', 'Search For:');
      const l = document.createElement('label');
      l.setAttribute('for', 'name');
      l.innerHTML = 'Enter the name of the user you wish to search for:';
      const c = document.createElement('center');
      const b = document.createElement('button');
      b.setAttribute('type', 'submit');
      b.setAttribute('class', 'btn btn-primary');
      b.innerHTML = 'Search';
      c.append(b);
      uSearch.append(l);
      uSearch.append(i);
      uSearch.append(c);
      div.append(uSearch);
      // when search form is submitted
      uSearch.addEventListener('submit', async function (event) {
        event.preventDefault();
        const name = i.value;
        const resultsDiv = document.getElementById('search_results');
      clearAll();
      // if search term is entered
      if (name) {
        const response = await fetch('http://127.0.0.1:8090/searchUser?name=' + name);
        const body = await response.text();
        const results = JSON.parse(body);
        results.innerHTML = body;
        // if no matching results, display a message to the user
        if (results === undefined || results.length === 0) {
          const resultsDiv = document.getElementById('search_results');
          resultsDiv.setAttribute('class', 'jumbotron');
          const message = document.createElement('h4');
          message.setAttribute('align', 'center');
          message.innerHTML = 'No matching users';
          resultsDiv.append(message);
        } else {
          // generate a profile for each of the matching users
          const div = document.getElementById('intro');
    for (const result of results) {
      const div4 = document.createElement('div');
      div4.setAttribute('class', "'col-sm-12 col-md-6 col-lg-4 col-xl-3'");
      const div5 = document.createElement('div');
      div5.setAttribute('class', 'card mb-4 box-shadow bg-secondary text-white');
      const item = document.createElement('h5');
      const image = document.createElement('img');
      item.setAttribute('id', result.User);
      item.setAttribute('align', 'center');
      item.innerHTML = result.User;
      image.setAttribute('src', result.pic);
      image.setAttribute('height', '15%');
      image.setAttribute('width', '15%');
      image.setAttribute('align', 'middle');
      image.setAttribute('class', 'rounded-circle');
      const centre = document.createElement('center');
      centre.append(image);
      div5.append(centre);
      div5.append(item);
      // if user clicks on a user, call the view user fuction
      div5.onclick = function () {
        var name = item.id;
        view(name);
      };
      div4.append(div5);
      div.append(div4);
    }
        }
      } else {
        // if no search term entered, display a message to the user
        resultsDiv.setAttribute('class', 'jumbotron');
        const message = document.createElement('h4');
        message.setAttribute('align', 'center');
        message.innerHTML = 'No Search Term Entered';
        resultsDiv.append(message);
      }
      // gives the user an option to return to show all postw
      const button = document.createElement('button');
      button.setAttribute('type', 'button');
      button.setAttribute('class', 'btn btn-primary btn-block');
      button.innerHTML = 'Return to show all posts';
      resultsDiv.append(button);
      button.addEventListener('click', async function (event) {
        event.preventDefault();
        const response = await fetch('http://127.0.0.1:8090/all');
        const body = await response.text();
        const results = JSON.parse(body);
        results.innerHTML = body;
        genAlbum(results);
    });
  });
};
// called when search for a user is pressed on the navbar.
async function viewAllUsers () {
  checkServer();
  const response = await fetch('http://127.0.0.1:8090/accounts');
  const body = await response.text();
  const results = JSON.parse(body);
  results.innerHTML = body;
  const div = document.getElementById('intro');
  // generates a profile for all the user accounts in the accounts.json profile
  for (const result of results) {
    const div4 = document.createElement('div');
    div4.setAttribute('class', "'col-sm-12 col-md-6 col-lg-4 col-xl-3'");
    const div5 = document.createElement('div');
    div5.setAttribute('class', 'card mb-4 box-shadow bg-secondary text-white');
    const item = document.createElement('h5');
    const image = document.createElement('img');
    item.setAttribute('id', result.User);
    item.setAttribute('align', 'center');
    item.innerHTML = result.User;
    image.setAttribute('src', result.pic);
    image.setAttribute('height', '15%');
    image.setAttribute('width', '15%');
    image.setAttribute('align', 'middle');
    image.setAttribute('class', 'rounded-circle');
    const centre = document.createElement('center');
    centre.append(image);
    div5.append(centre);
    div5.append(item);
    div5.onclick = function () {
      var name = item.id;
      view(name);
    };
    div4.append(div5);
    div.append(div4);
  }
}
// Allows user to search all posts. Called when search form in nav bar is submitted.
async function searchPosts () {
  checkServer();
  const keyword = document.getElementById('search_keyword').value;
  const resultsDiv = document.getElementById('search_results');
          resultsDiv.setAttribute('class', 'jumbotron');
      // if a search term is entered
          if (keyword) {
        const response = await fetch('http://127.0.0.1:8090/search?keyword=' + keyword);
        const body = await response.text();
        const results = JSON.parse(body);
        results.innerHTML = body;
        // if no matching posts are found, display a message to the user
        if (results === undefined || results.length === 0) {
          const message = document.createElement('h4');
          message.setAttribute('align', 'center');
          message.innerHTML = 'No matching posts';
          resultsDiv.append(message);
        } else {
          // call genAlbum function on the matching posts returned from the server.
          genAlbum(results);
        }
      } else {
        // if no search term is entered, display a message to the user
        const message = document.createElement('h4');
        message.setAttribute('align', 'center');
        message.innerHTML = 'No Search Term Entered';
        resultsDiv.append(message);
      }
      // gives user the option to return to all posts
      const button = document.createElement('button');
      button.setAttribute('type', 'button');
      button.setAttribute('class', 'btn btn-primary btn-block');
      button.innerHTML = 'Return to show all posts';
      resultsDiv.append(button);
        button.addEventListener('click', async function (event) {
          event.preventDefault();
          const response = await fetch('http://127.0.0.1:8090/all');
          const body = await response.text();
          const results = JSON.parse(body);
          results.innerHTML = body;
          genAlbum(results);
        });
}
