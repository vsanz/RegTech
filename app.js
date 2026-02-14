const STORAGE_KEY = "regtech.controls";

const form = document.getElementById("control-form");
const controlsList = document.getElementById("controls-list");
const clearControlsButton = document.getElementById("clear-controls");
const statsContainer = document.getElementById("stats");
const itemTemplate = document.getElementById("control-item-template");

/** @type {Array<{id:string,name:string,owner:string,status:string,notes:string,createdAt:string}>} */
let controls = readControls();

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const newControl = {
    id: String(formData.get("id") || "").trim(),
    name: String(formData.get("name") || "").trim(),
    owner: String(formData.get("owner") || "").trim(),
    status: String(formData.get("status") || "Compliant"),
    notes: String(formData.get("notes") || "").trim(),
    createdAt: new Date().toISOString(),
  };

  if (!newControl.id || !newControl.name || !newControl.owner) {
    return;
  }

  controls.unshift(newControl);
  persistControls();
  render();
  form.reset();
});

clearControlsButton.addEventListener("click", () => {
  controls = [];
  persistControls();
  render();
});

function readControls() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistControls() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(controls));
}

function deleteControl(index) {
  controls.splice(index, 1);
  persistControls();
  render();
}

function normalizeStatusClass(status) {
  return status.toLowerCase().replace(/\s+/g, "-");
}

function renderStats() {
  const totals = {
    compliant: controls.filter((c) => c.status === "Compliant").length,
    atRisk: controls.filter((c) => c.status === "At Risk").length,
    nonCompliant: controls.filter((c) => c.status === "Non-Compliant").length,
  };

  statsContainer.innerHTML = `
    <div class="stat"><strong>${totals.compliant}</strong><span>Compliant</span></div>
    <div class="stat"><strong>${totals.atRisk}</strong><span>At Risk</span></div>
    <div class="stat"><strong>${totals.nonCompliant}</strong><span>Non-Compliant</span></div>
  `;
}

function render() {
  renderStats();
  controlsList.innerHTML = "";

  controls.forEach((control, index) => {
    const fragment = itemTemplate.content.cloneNode(true);
    const item = fragment.querySelector(".control-item");
    const title = fragment.querySelector(".control-title");
    const meta = fragment.querySelector(".control-meta");
    const notes = fragment.querySelector(".control-notes");
    const pill = fragment.querySelector(".pill");
    const removeButton = fragment.querySelector("button");

    title.textContent = `${control.id} — ${control.name}`;
    meta.textContent = `Owner: ${control.owner} • Added: ${new Date(control.createdAt).toLocaleString()}`;
    notes.textContent = control.notes || "No notes provided.";

    pill.textContent = control.status;
    pill.classList.add(normalizeStatusClass(control.status));

    removeButton.addEventListener("click", () => deleteControl(index));

    controlsList.append(item);
  });
}

render();
