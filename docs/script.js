var list = document.querySelector('.masonry-layout');

firebase.database().ref('/').once('value').then(function(snapshot) {
  var fragment = document.createDocumentFragment();
  var data = snapshot.val()

  Object.values(data).forEach(function(datum) {
    var li = document.createElement('li');
    li.classList.add('masonry-layout__panel');

    var div = document.createElement('div');
    div.classList.add('masonry-layout__panel-content');
    div.classList.add('margin');
    var mySVG64 = window.btoa(datum.inline);
    var innerHTML = `
        <img class="lazyload pointer"
          alt="${datum.title}"
          src="data:image/svg+xml;base64,${mySVG64}"
          data-src="${datum.imgSrc}">
        <div class="hidden description">
          <button class='xout'>x</button>
          <h3>${datum.title}</h3>
          <div>${datum.desc}</div>`;

    if (datum.githubHref) innerHTML += `<a href="${datum.githubHref}" target="_blank" alt="link to github code">github</a>`;
    if (datum.liveHref) innerHTML += `<a href="${datum.liveHref}" target="_blank" alt="link to site">site</a>`;
    innerHTML += `</div>`;

    div.innerHTML = innerHTML;
    div.addEventListener('click', openPopup)
    li.appendChild(div);
    fragment.appendChild(li);
  })

  list.appendChild(fragment);
  lazyload();
});

function openPopup(e) {
  e.preventDefault();
  console.log('open', this)
  this.removeEventListener('click', openPopup);

  var descriptorBlock = this.querySelector('.description');
  descriptorBlock.classList.toggle('hidden');
  var xout = this.querySelector('button');
  xout.addEventListener('click', closePopup);
}

function closePopup(e) {
  e.preventDefault();
  this.removeEventListener('click', closePopup);
  this.parentElement.classList.toggle('hidden');

  var parent =  this.parentElement;
  while (!parent.classList.contains('masonry-layout__panel-content')) {
    parent = parent.parentElement;
  }
  
  setTimeout(() => {
    parent.addEventListener('click', openPopup);
  });
}
