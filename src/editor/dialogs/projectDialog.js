
const template = document.createElement('template');
// eslint-disable-next-line no-unsanitized/property
template.innerHTML = `
  <style>
 
  #prj_dialog_content {
    margin: 10px 10px 5px 10px;
    background: #5a6162;
    overflow: auto;
    text-align: left;
    border: 1px solid #c8c8c8;
  }

  #prj_dialog_content p, #prj_dialog_content select, #prj_dialog_content label {
    margin: 10px;
    line-height: 0.3em;
  }
  
  #prj_dialog_container {
    font-family: Verdana;
    text-align: center;
    left: 50%;
    top: 50%;
    max-width: 400px;
    z-index: 50001;
    background: #5a6162;
    border: 1px outset #777;
    font-family:Verdana,Helvetica,sans-serif;
    font-size:0.8em;
  }
  
  #prj_dialog_container, #prj_dialog_content {
    border-radius: 5px;
    -moz-border-radius: 5px;
    -webkit-border-radius: 5px;
  }
  
  #prj_dialog_buttons input[type=text] {
    width: 90%;
    display: block;
    margin: 0 0 5px 11px;
  }
  
  #prj_dialog_buttons input[type=button] {
    margin: 0 1em;
  }
  .se-select{
    text-align: center;
  }
  </style>
  <elix-dialog id="project_box" aria-label="project svg" closed>
    <div class="overlay"></div>
    <div id="prj_dialog_container">
      <div id="prj_dialog_content">
        <span>projects</span>
        <p class="se-select" id="project_select"></p>
        <p class="se-select">
        <select id="se-storage-pref">
          <option value="SVG">SVG</option>
          <option value="JSON">JSON</option>
        </select> 
        </p>
      </div>
      <div id="prj_dialog_buttons">
        <button id="project_ok"></button>
        <button id="project_cancel"></button>
      </div>
    </div>
  </elix-dialog>
`;
/**
 * @class SeProjectDialog
 */
export class SeProjectDialog extends HTMLElement {
  /**
    * @function constructor
    */
  constructor () {
    super();
    // create the shadowDom and insert the template
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._shadowRoot.append(template.content.cloneNode(true));
    this.$dialog = this._shadowRoot.querySelector('#project_box');
    this.$okBtn = this._shadowRoot.querySelector('#project_ok');
    this.$cancelBtn = this._shadowRoot.querySelector('#project_cancel');
    this.$projectOption = this._shadowRoot.querySelector('#se-storage-pref');
    this.$posityCont = this._shadowRoot.querySelector('#se-posity');
   this.value = 1;
  }
  /**
   * @function init
   * @param {any} name
   * @returns {void}
   */
  init (i18next) {
    this.setAttribute('common-ok', i18next.t('common.ok'));
    this.setAttribute('common-cancel', i18next.t('common.cancel'));
    this.setAttribute('ui-posity', i18next.t('ui.posity'));
    this.setAttribute('ui-project_type_label', i18next.t('ui.project_type_label'));
  }
  /**
   * @function observedAttributes
   * @returns {any} observed
   */
  static get observedAttributes () {
    return [ 'dialog', 'common-ok', 'common-cancel', 'ui-posity', 'ui-project_type_label' ];
  }
  /**
   * @function attributeChangedCallback
   * @param {string} name
   * @param {string} oldValue
   * @param {string} newValue
   * @returns {void}
   */
  attributeChangedCallback (name, oldValue, newValue) {
    let node;
    switch (name) {
    case 'dialog':
      if (newValue === 'open') {
        this.$dialog.open();
      } else {
        this.$dialog.close();
      }
      break;
    case 'common-ok':
      this.$okBtn.textContent = newValue;
      break;
    case 'common-cancel':
      this.$cancelBtn.textContent = newValue;
      break;
    case 'ui-posity':
      node = this._shadowRoot.querySelector('#se-posity');
      node.prepend(newValue);
      break;
    case 'ui-project_type_label':
      node = this._shadowRoot.querySelector('#project_select');
      node.textContent = newValue;
      break;
    default:
      // super.attributeChangedCallback(name, oldValue, newValue);
      break;
    }
  }
  /**
   * @function get
   * @returns {any}
   */
  get dialog () {
    return this.getAttribute('dialog');
  }
  /**
   * @function set
   * @returns {void}
   */
  set dialog (value) {
    this.setAttribute('dialog', value);
  }
  /**
   * @function connectedCallback
   * @returns {void}
   */
  connectedCallback () {
    const onSubmitHandler = (e, action) => {
      if (action === 'cancel') {
        document.getElementById('se-project-dialog').setAttribute('dialog', 'close');
      } else {
        const triggerEvent = new CustomEvent('change', { detail: {
          trigger: action,
          imgType: this.$projectOption.value,
          posity: this.value
        } });
        this.dispatchEvent(triggerEvent);
        document.getElementById('se-project-dialog').setAttribute('dialog', 'close');
      }
    };
    const onChangeHandler = (e) => {
      if (e.target.value === 'PDF') {
        this.$posityCont.style.display = 'none';
      } else {
        this.$posityCont.style.display = 'block';
      }
    };
    this.$okBtn.addEventListener('click', (evt) => onSubmitHandler(evt, 'ok'));
    this.$cancelBtn.addEventListener('click', (evt) => onSubmitHandler(evt, 'cancel'));
    this.$projectOption.addEventListener('change', (evt) => onChangeHandler(evt));
  }
}

// Register
customElements.define('se-project-dialog', SeProjectDialog);
