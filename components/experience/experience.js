const experience = document.createElement('template');
experience.innerHTML=`
  <link rel="stylesheet" href="./components/experience/experience.css">
  <div class="experienceContainer">
    <div class="four-pointed-star"></div>
    <hgroup id="experiencePlace">
        <h1 class="spacegrotesk-bold" id="work-place">T-Systems Iberia</h1>
        <h2 class="spacegrotesk-regular" id="work-type">Intern</h2>
        <h3 class="spacegrotesk-regular" id="work-time">Mar 2022 - Jun 2022</h3>
    </hgroup>

    <ul class="descriptionContainer" id="descriptions">
        <li class="spacegrotesk-regular">Developed an internal web application for seat reservation in the work environment.</li>
        <li class="spacegrotesk-regular">Used computer vision with the OpenCV library for auto generating reservable places.</li>
        <li class="spacegrotesk-regular">Collaborated with the engineering team.</li>
        <li class="spacegrotesk-regular">Trained in the use of frontend and backend technologies.</li>
    </ul>

  </div>
`
class ExperienceTime extends HTMLElement {
  constructor(){
    super();
    this.attachShadow({mode:'open'});
    this.shadowRoot.appendChild(experience.content.cloneNode(true));

  }

  static get observedAttributes() {
    return ['work-place', 'work-type', 'work-time', 'descriptions'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this[name.replace(/-/g, '')] = newValue;
      this.render();
    }
  }

  connectedCallback() {
    this.render();
    // Dibujar las líneas solo después de que todos los elementos estén en el DOM
    // Timeout para asegurarse de que todos los elementos estén en el DOM
    setTimeout(() => requestAnimationFrame(() => this.drawLineToPrevious()), 100);
    
  }

  render() {
    const workPlace = this.getAttribute('work-place') || '00';
    const workType = this.getAttribute('work-type') || 'Unnamed Project';
    const workTime = (this.getAttribute('work-time') || '').split(',').map((tech) => tech.trim());
    const descriptionElements = (this.getAttribute('descriptions')|| 'No description provided').split('\n').map((jobDescription) => jobDescription.trim());

    // Actualizar el contenido dinámico
    this.shadowRoot.querySelector('#work-place').textContent = workPlace;
    this.shadowRoot.querySelector('#work-type').textContent = workType;
    this.shadowRoot.querySelector('#work-time').textContent = workTime;

    // Renderizar las tecnologías
    const descriptions = this.shadowRoot.querySelector('#descriptions');
    descriptions.innerHTML = descriptionElements.map((descriptionElement) => `<li class="spacegrotesk-regular">${descriptionElement}</li>`).join('');

      
  }

  drawLineToPrevious() {
    const previous = this.previousElementSibling;

    // Si no hay un elemento anterior, no se dibuja la línea
    if (!previous || previous.tagName !== "EXPERIENCE-TIME") return;
  
    // Obtener las estrellas del elemento actual y el anterior
    const previousStar = previous.shadowRoot.querySelector(".four-pointed-star");
    const currentStar = this.shadowRoot.querySelector(".four-pointed-star");
  
    if (!previousStar || !currentStar) return;
  
    // Obtener posiciones absolutas de las estrellas
    const previousStarRect = previousStar.getBoundingClientRect();
    const currentStarRect = currentStar.getBoundingClientRect();
  
    // Ajustar las coordenadas considerando el desplazamiento de la página
    const startX = previousStarRect.left + previousStarRect.width / 2 + window.scrollX;
    const startY = previousStarRect.top + previousStarRect.height / 2 + window.scrollY;
  
    const endX = currentStarRect.left + currentStarRect.width / 2 + window.scrollX;
    const endY = currentStarRect.top + currentStarRect.height / 2 + window.scrollY;
  
    // Calcular distancia y ángulo entre las estrellas
    const distance = Math.hypot(endX - startX, endY - startY);
    const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);
  

    // Crear la línea
    const line = document.createElement("div");
    line.style.position = "absolute";
    line.style.width = `${distance}px`; // La longitud de la línea es la distancia entre las estrellas
    line.style.height = "2px"; // Ancho de la línea
    line.style.borderTop = "2px dashed rgba(255,255,255,0.15)"; // Estilo de línea discontinua
    line.style.transformOrigin = "0 0"; // Establece el origen de la transformación
    line.style.transform = `rotate(${angle}deg)`; // Rota la línea según el ángulo calculado
    line.style.left = `${startX+2}px`; // Posición inicial en X
    line.style.top = `${startY}px`; // Posición inicial en Y
    line.style.zIndex = "-1";

    // Adjuntar la línea al body
    document.body.appendChild(line);
  }

  
}

customElements.define('experience-time', ExperienceTime);