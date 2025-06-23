
const skillsPlanet = document.createElement('template');
skillsPlanet.innerHTML=`
  <link rel="stylesheet" href="./components/skillsPlanet/skillsPlanet.css">
  <script src="./gsap.min.js"></script>
  <div class="dial" style="align-self: center; --n:5">
      <video class="core" id="videoBG" autoplay muted loop>
      </video>
      <ul id="iconsList">
      </ul>
  </div>
`
class SkillsPlanet extends HTMLElement {
  static observedAttributes = ['icons-src', 'video-name'];
  constructor(){
    super();
    this.attachShadow({mode:'open'});
    this.shadowRoot.appendChild(skillsPlanet.content.cloneNode(true));
    this._iconsSrc  = '';
    this._videoName = '';

  }

  get iconsFolder(){
    return this._iconsSrc;
  }
  set iconsFolder(JSONPath){
    this.setAttribute('icons-src',JSONPath);
  }

  get videoName(){
    return this._videoName;
  }
  set videoName(name){
    this.setAttribute('icons-src',name);
  }

  attributeChangedCallback(name, oldVal, newVal){
    if (name === 'icons-src' && oldVal !== newVal) {
      this._iconsSrc = newVal;
      if (this.isConnected) this.render();
    }

    if(name === 'video-name' && oldVal !== newVal){
      this._videoName = newVal;
      if (this.isConnected) this.render();
    }
}

  connectedCallback() {
    if (!this._iconsSrc) this._iconsSrc = this.getAttribute('icons-src') || '';
    if(!this._videoName) this._videoName = this.getAttribute('video-name') || '';
    if (this._iconsSrc && this._videoName)  this.render();

    this.dial = this.shadowRoot.querySelector('.dial');
  }

  async render(){
    const iconsList = this.shadowRoot.getElementById("iconsList");
    const video  = this.shadowRoot.getElementById('videoBG');
    try{
      const res = await fetch(this._iconsSrc);
      const icons = await res.json();
      
      video.src = `./assets/videos/${this._videoName}`

      iconsList.innerHTML = '';
      icons.forEach(({src, name}, i) => {
        const li = document.createElement('li');
        li.style.setProperty('--i',i);
        const img = document.createElement('img');
        img.src = src;
        li.append(img);
        const spanName = document.createElement('span');
        spanName.innerHTML = name;
        li.append(spanName);
        iconsList.append(li);
      });

      iconsList.parentElement.style.setProperty('--n', icons.length);
      this.initRotation();

    } catch(err){
      console.error('No se pudo cargar el JSON de iconos:', err);
      
      iconsList.innerHTML = '<li>Error al cargar iconos</li>';
    }
  }

  initRotation() {
    if (this.tl) return;
    const gsap = window.gsap;            // <- obtenido del global que cargaste
    if (!gsap) {
      console.error('GSAP no está cargado todavía');
      return;
    }

    this.tl = gsap.to(this.dial, {
      "--rot"  : "1turn",   // gira 360° en sentido horario
      duration : 100,       // segundos por vuelta
      ease     : "none",
      repeat   : -1
    });
  }

  
}

customElements.define('skills-planet', SkillsPlanet);