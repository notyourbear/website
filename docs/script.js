let list = document.querySelector('.masonry-layout');

firebase.database().ref('/').once('value').then(function(snapshot) {
  let fragment = document.createDocumentFragment();
  let data = snapshot.val()

  Object.values(data).forEach(function(datum, i) {
    let li = document.createElement('li');
    li.classList.add('masonry-layout__panel');

    let div = document.createElement('div');
    div.setAttribute('tabindex', 0);
    div.classList.add('masonry-layout__panel-content');
    div.classList.add('pointer');
    div.classList.add('margin');
    let mySVG64 = window.btoa(datum.inline);
    let innerHTML = `
        <img class="lazyload"
          alt="${datum.title}"
          src="data:image/svg+xml;base64,${mySVG64}"
          data-src="${datum.imgSrc}">
        <div class="hidden description">
          <button class='xout' alt="close description"><i class="far fa-times-circle"></i></button>
          <h3>${datum.title}</h3>`;

    if (datum.desc) innerHTML += `<div>${datum.desc}</div>`;
    if (datum.githubHref) innerHTML += `<a href="${datum.githubHref}" target="_blank" alt="link to github code"><i class="fab fa-github-square"></i></a>`;
    if (datum.liveHref) innerHTML += `<a href="${datum.liveHref}" target="_blank" alt="link to site"><i class="fas fa-caret-square-right"></i></a>`;
    innerHTML += `</div>`;

    div.innerHTML = innerHTML;
    div.keydownlistenerbind = onKeyDown.bind(div, openPopup); //bind sets new function reference. trés annoying.
    div.addEventListener('click', openPopup)
    div.addEventListener('keydown', div.keydownlistenerbind);
    li.appendChild(div);
    fragment.appendChild(li);
  })

  list.appendChild(fragment);
  lazyload();
});

function onKeyDown(cb, e) {
  if (e.keyCode === 13) {
    e.preventDefault();
    cb.call(this, e, cb);
  }
}

function openPopup(e) {
  e.preventDefault();
  this.removeEventListener('click', openPopup);
  this.removeEventListener('keydown', this.keydownlistenerbind);
  this.classList.toggle('pointer');
  let descriptorBlock = this.querySelector('.description');
  descriptorBlock.classList.toggle('hidden');
  let xout = this.querySelector('button');
  xout.addEventListener('click', closePopup);
}

function closePopup(e) {
  e.preventDefault();
  this.removeEventListener('click', closePopup);
  this.parentElement.classList.toggle('hidden');

  let parent =  this.parentElement;
  while (!parent.classList.contains('masonry-layout__panel-content')) {
    parent = parent.parentElement;
  }

  // without this timeout the click will fire immediately on active click.. crazy.
  setTimeout(() => {
    parent.addEventListener('click', openPopup);
    parent.addEventListener('keydown', parent.keydownlistenerbind);
    parent.classList.toggle('pointer');
  });
}
