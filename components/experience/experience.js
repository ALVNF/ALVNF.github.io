const experience = document.createElement('template');
experience.innerHTML = `
  <link rel="stylesheet" href="./components/experience/experience.css">
  <div class="experienceContainer">
    <div class="four-pointed-star"></div>
    <hgroup id="experiencePlace">
        <h1 class="spacegrotesk-bold" id="work-place">T-Systems Iberia</h1>
        <h2 class="spacegrotesk-regular" id="work-type">Intern</h2>
        <h3 class="spacegrotesk-regular" id="work-time">Mar 2022 - Jun 2022</h3>
    </hgroup>
    <ul class="descriptionContainer" id="descriptions"></ul>
  </div>
`;

class ExperienceTime extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(experience.content.cloneNode(true));

    this.redraw = this.redraw.bind(this);
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

    // Dibujar la línea al cargar
    requestAnimationFrame(() => this.drawLineToPrevious());

    // Escuchar redibujado en scroll y resize
    window.addEventListener("resize", this.redraw);
    window.addEventListener("scroll", this.redraw);
  }

  disconnectedCallback() {
    window.removeEventListener("resize", this.redraw);
    window.removeEventListener("scroll", this.redraw);
  }

  redraw() {
    this.clearLines();
    document.querySelectorAll("experience-time").forEach(el => el.drawLineToPrevious?.());
  }

  render() {
    const workPlace = this.getAttribute('work-place') || 'Unnamed Company';
    const workType = this.getAttribute('work-type') || 'Role';
    const workTime = this.getAttribute('work-time') || '';
    const descriptionElements = (this.getAttribute('descriptions') || '')
      .split('\n')
      .map(d => d.trim())
      .filter(Boolean);

    this.shadowRoot.querySelector('#work-place').textContent = workPlace;
    this.shadowRoot.querySelector('#work-type').textContent = workType;
    this.shadowRoot.querySelector('#work-time').textContent = workTime;

    const list = this.shadowRoot.querySelector('#descriptions');
    list.innerHTML = descriptionElements.map(desc =>
      `<li class="spacegrotesk-regular">${desc}</li>`
    ).join('');
  }

  clearLines() {
    document.querySelectorAll(".experience-connector-line").forEach(line => line.remove());
  }

  drawLineToPrevious() {
    const previous = this.previousElementSibling;
    if (!previous || previous.tagName !== "EXPERIENCE-TIME") return;

    const previousStar = previous.shadowRoot.querySelector(".four-pointed-star");
    const currentStar = this.shadowRoot.querySelector(".four-pointed-star");

    if (!previousStar || !currentStar) return;

    const prevRect = previousStar.getBoundingClientRect();
    const currRect = currentStar.getBoundingClientRect();
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    const startX = prevRect.left + prevRect.width / 2 + scrollX;
    const startY = prevRect.top + prevRect.height / 2 + scrollY;
    const endX = currRect.left + currRect.width / 2 + scrollX;
    const endY = currRect.top + currRect.height / 2 + scrollY;

    const distance = Math.hypot(endX - startX, endY - startY);
    const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);

    const line = document.createElement("div");
    line.className = "experience-connector-line";
    line.style.position = "absolute";
    line.style.width = `${distance}px`;
    line.style.height = "2px";
    line.style.borderTop = "2px dashed rgba(255,255,255,0.15)";
    line.style.transformOrigin = "0 0";
    line.style.transform = `rotate(${angle}deg)`;
    line.style.left = `${startX}px`;
    line.style.top = `${startY}px`;
    line.style.zIndex = "-1";
    line.style.pointerEvents = "none";

    document.body.appendChild(line);
  }
}

customElements.define('experience-time', ExperienceTime);
