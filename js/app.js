/**
 * LANDSYNC AI — Application Controller
 */
'use strict';

const App = (() => {

  let currentScreen = 'dashboard';
  const screenInstances = {};

  // ── Navigation ────────────────────────────────────────────────
  function navigate(screenId) {
    // Hide all
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

    // Show target
    const target = document.getElementById('screen-' + screenId);
    if (target) target.classList.add('active');

    // Activate nav link
    const navLink = document.querySelector(`.nav-link[data-screen="${screenId}"]`);
    if (navLink) navLink.classList.add('active');

    currentScreen = screenId;

    // Init scene for that screen if not already
    requestAnimationFrame(() => initScreenScene(screenId));
  }

  function initScreenScene(screenId) {
    if (screenInstances[screenId]) return;

    switch (screenId) {
      case 'dashboard': {
        const canvas = document.getElementById('canvas-dashboard');
        if (!canvas) return;
        const inst = ThreeScenes.initDashboard(canvas);
        screenInstances.dashboard = inst;
        setupViewportControls('dashboard', inst.controls);
        break;
      }
      case 'analysis': {
        const canvas = document.getElementById('canvas-analysis');
        if (!canvas) return;
        const inst = ThreeScenes.initAnalysis(canvas);
        screenInstances.analysis = inst;
        setupViewportControls('analysis', inst.controls);
        startAnalysisProgress();
        break;
      }
      case 'verify': {
        const canvas = document.getElementById('canvas-verify');
        if (!canvas) return;
        const inst = ThreeScenes.initVerification(canvas, { showConflict: true });
        screenInstances.verify = inst;
        setupViewportControls('verify', inst.controls);
        break;
      }
      case 'conflict': {
        const c3d = document.getElementById('canvas-conflict-3d');
        const c2d = document.getElementById('canvas-conflict-2d');
        if (c3d) {
          const inst = ThreeScenes.initConflict3D(c3d);
          screenInstances.conflict = inst;
          setupViewportControls('conflict', inst.controls);
        }
        if (c2d) ThreeScenes.drawConflict2D(c2d);
        break;
      }
    }
  }

  // ── Viewport camera buttons ───────────────────────────────────
  function setupViewportControls(screenId, controls) {
    if (!controls) return;
    const views = {
      'perspective': { theta: -0.5, phi: 0.5,  radius: 42 },
      'top':         { theta: 0,    phi: 1.55,  radius: 60 },
      'north':       { theta: Math.PI, phi: 0.3, radius: 45 },
      'west':        { theta: -Math.PI/2, phi: 0.3, radius: 45 },
    };
    document.querySelectorAll(`.vp-cam-btn[data-scene="${screenId}"]`).forEach(btn => {
      btn.addEventListener('click', () => {
        const v = views[btn.dataset.view];
        if (v && controls.setView) controls.setView(v.theta, v.phi, v.radius);
        document.querySelectorAll(`.vp-cam-btn[data-scene="${screenId}"]`).forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    document.querySelectorAll(`.vp-zoom-btn[data-scene="${screenId}"]`).forEach(btn => {
      btn.addEventListener('click', () => {
        controls.zoom(btn.dataset.dir === 'in' ? 0.8 : 1.25);
      });
    });
  }

  // ── Upload screen ─────────────────────────────────────────────
  const uploadedFiles = [];

  function setupUploadZones() {
    document.querySelectorAll('.upload-zone').forEach(zone => {
      zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); });
      zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
      zone.addEventListener('drop', e => {
        e.preventDefault(); zone.classList.remove('drag-over');
        const files = Array.from(e.dataTransfer.files);
        addFiles(files, zone.dataset.type);
      });
      const input = zone.querySelector('input[type=file]');
      if (input) {
        input.addEventListener('change', e => {
          addFiles(Array.from(e.target.files), zone.dataset.type);
          input.value = '';
        });
      }
    });
  }

  const fileTypeMap = {
    documents: { label: 'Property document', icon: 'pdf' },
    cadastral:  { label: 'Cadastral data',    icon: 'geo' },
    survey:     { label: 'Survey file',        icon: 'shp' },
    building:   { label: 'Building plan',      icon: 'dxf' },
    imagery:    { label: 'Aerial imagery',     icon: 'tif' },
    survey_gcp: { label: 'Ground survey',      icon: 'csv' },
  };

  function addFiles(files, type) {
    files.forEach(file => {
      const ext = file.name.split('.').pop().toLowerCase();
      const typeInfo = fileTypeMap[type] || { label: 'Document', icon: ext };
      uploadedFiles.push({
        name: file.name,
        size: file.size,
        type: type,
        typeLabel: typeInfo.label,
        icon: typeInfo.icon,
        crs: 'EPSG:32643',
        status: 'VALIDATED',
        progress: 100,
      });
      renderFileTable();
    });
  }

  function renderFileTable() {
    const tbody = document.getElementById('files-tbody');
    if (!tbody) return;
    const countEl = document.getElementById('file-count-badge');
    if (countEl) countEl.textContent = `● ${uploadedFiles.length} FILES`;

    if (uploadedFiles.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="ft-empty">No files uploaded yet. Drop files in the zones above.</td></tr>`;
      return;
    }

    tbody.innerHTML = uploadedFiles.map((f, i) => {
      const sizeMB = (f.size / 1024 / 1024).toFixed(1);
      const statusClass = f.status === 'VALIDATED' ? 'badge-teal' :
                          f.status === 'NORMALIZED' ? 'badge-blue' :
                          f.status === 'UPLOADING' ? 'badge-gray' : 'badge-amber';
      return `
      <tr>
        <td>
          <div class="ft-filename">
            <div class="ft-file-icon ${f.icon}">${f.icon.toUpperCase()}</div>
            <span>${f.name}</span>
          </div>
        </td>
        <td style="color:var(--text-secondary)">${f.typeLabel}</td>
        <td class="ft-size">${sizeMB} MB</td>
        <td class="ft-crs">${f.crs}</td>
        <td><span class="badge ${statusClass}">${f.status}</span></td>
        <td>
          <div style="display:flex;align-items:center;gap:6px">
            <div class="ft-progress"><div class="progress-track"><div class="progress-fill" style="width:${f.progress}%"></div></div></div>
            <span class="progress-pct">${f.progress}%</span>
          </div>
        </td>
        <td>
          <div class="ft-actions">
            <button class="ft-action-btn" title="Refresh"><svg viewBox="0 0 16 16" fill="none"><path d="M2 8a6 6 0 100 0v-2M2 6l2-2-2-2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg></button>
            <button class="ft-action-btn danger" title="Remove" onclick="App.removeFile(${i})"><svg viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.2"/></svg></button>
          </div>
        </td>
      </tr>`;
    }).join('');
  }

  function removeFile(idx) {
    uploadedFiles.splice(idx, 1);
    renderFileTable();
  }

  // Pre-populate with sample files
  function populateSampleFiles() {
    const samples = [
      { name: 'title_deed_0187-22.pdf', size: 4.8*1024*1024, type:'documents', typeLabel:'Property document', icon:'pdf', crs:'Document', status:'VALIDATED', progress:100 },
      { name: 'ward4_cadastral_2026.geojson', size: 12.6*1024*1024, type:'cadastral', typeLabel:'Cadastral data', icon:'geo', crs:'EPSG:32643', status:'VALIDATED', progress:100 },
      { name: 'alder_ct_boundary_final.shp', size: 6.2*1024*1024, type:'survey', typeLabel:'Survey file', icon:'shp', crs:'EPSG:32643', status:'VALIDATED', progress:100 },
      { name: 'building_plan_revC.dxf', size: 10.4*1024*1024, type:'building', typeLabel:'Building plan', icon:'dxf', crs:'Local grid → UTM', status:'NORMALIZED', progress:100 },
      { name: 'flight_20260918_ortho.tif', size: 286.1*1024*1024, type:'imagery', typeLabel:'Aerial imagery', icon:'tif', crs:'EPSG:32643', status:'UPLOADING', progress:72 },
      { name: 'ground_control_points.csv', size: 620*1024, type:'survey_gcp', typeLabel:'Ground survey', icon:'csv', crs:'EPSG:32643', status:'WARNING', progress:100 },
    ];
    uploadedFiles.push(...samples);
  }

  // ── Analysis progress animation ───────────────────────────────
  function startAnalysisProgress() {
    const fill = document.getElementById('analysis-progress-fill');
    const pct  = document.getElementById('analysis-progress-pct');
    if (!fill || !pct) return;
    let p = 0;
    const target = 86;
    const interval = setInterval(() => {
      p = Math.min(target, p + 1);
      fill.style.width = p + '%';
      pct.textContent  = p + '%';
      if (p >= target) clearInterval(interval);
    }, 20);
  }

  // ── Transform controls (verify screen) ───────────────────────
  const transform = { x: -0.62, y: 0.14, rot: -0.8 };

  function updateTransformDisplay() {
    const el = id => document.getElementById(id);
    if (el('tx-val')) el('tx-val').textContent = transform.x.toFixed(2) + ' m';
    if (el('ty-val')) el('ty-val').textContent = '+' + transform.y.toFixed(2) + ' m';
    if (el('tr-val')) el('tr-val').textContent = transform.rot.toFixed(1) + '°';
  }

  function adjustTransform(axis, delta) {
    transform[axis] = +(transform[axis] + delta).toFixed(2);
    updateTransformDisplay();
  }

  // ── Conflict issue selection ──────────────────────────────────
  function selectConflictIssue(id) {
    document.querySelectorAll('.conflict-issue-card').forEach(c => c.classList.remove('active'));
    const el = document.querySelector(`.conflict-issue-card[data-id="${id}"]`);
    if (el) el.classList.add('active');
  }

  // ── Init all sample data ──────────────────────────────────────
  function init() {
    populateSampleFiles();
    renderFileTable();
    setupUploadZones();
    updateTransformDisplay();

    // Navigate on nav link clicks
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => navigate(link.dataset.screen));
    });

    // Init dashboard scene
    navigate('dashboard');
  }

  // Public
  return { navigate, removeFile, adjustTransform, selectConflictIssue, init };
})();

// ── Boot ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => App.init());
