var list = document.querySelector('.masonry-layout');

firebase.database().ref('/').once('value').then(function(snapshot) {
  var fragment = document.createDocumentFragment();
  var data = snapshot.val()

  Object.values(data).forEach(function(datum) {
    var li = document.createElement('div');
    li.classList.add('masonry-layout__panel');

    var div = document.createElement('div');
    div.classList.add('masonry-layout__panel-content');
    div.classList.add('margin');
    var mySVG64 = window.btoa(datum.inline);
    var innerHTML = `<img class="lazyload pointer"
          alt="${datum.title}"
          src="data:image/svg+xml;base64,${mySVG64}"
          data-src="${datum.imgSrc}">
        <div class="hidden description">
          <h3>${datum.title}</h3>
          <div>${datum.desc}</div>`;

    if (datum.githubHref) innerHTML += `<a href="${datum.githubHref}" target="_blank" alt="link to github code">github</a>`;
    if (datum.liveHref) innerHTML += `<a href="${datum.liveHref}" target="_blank" alt="link to site">site</a>`;
    innerHTML += `</div>`;

    div.innerHTML = innerHTML;
    li.appendChild(div);
    div.addEventListener('click', onClick)
    fragment.appendChild(li);
  })

  list.appendChild(fragment);
  lazyload();
});

function onClick(e) {
  e.preventDefault();
  var descriptorBlock = this.querySelector('.description');
  descriptorBlock.classList.toggle('hidden');
}
