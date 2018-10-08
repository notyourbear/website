const list = document.querySelector('.masonry-layout');

firebase.database().ref('/').once('value').then(function(snapshot) {
  const fragment = document.createDocumentFragment();
  var data = snapshot.val()

  Object.values(data).forEach(function(datum) {
    var li = document.createElement('div');
    li.classList.add('masonry-layout__panel');

    var div = document.createElement('div');
    div.classList.add('masonry-layout__panel-content')
    var mySVG64 = window.btoa(datum.inline);
    div.innerHTML = `
      <a href="${datum.liveHref}" target="_blank" alt="${datum.title}">
        <img class="lazyload"
          alt="${datum.title}"
          src="data:image/svg+xml;base64,${mySVG64}"
          data-src="${datum.imgSrc}">
      </a>`

    li.appendChild(div);
    fragment.appendChild(li);
  })

  list.appendChild(fragment);
  lazyload();
});
