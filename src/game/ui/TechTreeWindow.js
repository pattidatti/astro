import { gameState } from '../GameState.js';
import { TECH_NODES, TECH_BY_ID } from '../data/techTree.js';
import { AudioManager } from '../audio/AudioManager.js';

const fmt = (n) => {
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return Math.floor(n) + '';
};

const BRANCH_ORDER = ['robots', 'defense', 'base', 'colonization'];
const BRANCH_LABELS = {
  robots:       'ROBOTS',
  defense:      'DEFENSE',
  base:         'INFRASTRUCTURE',
  colonization: 'COLONIZATION',
};

export class TechTreeWindow {
  constructor() {
    this._overlay  = document.getElementById('tech-tree-overlay');
    this._modal    = document.getElementById('tech-tree-modal');
    this._svg      = document.getElementById('tech-tree-svg');
    this._viewport = document.getElementById('tech-tree-viewport');
    this._energyEl = document.getElementById('tech-modal-energy');
    this._visible  = false;
    this._built    = false;

    document.getElementById('tech-close-btn')
      ?.addEventListener('pointerdown', () => this.hide());

    this._overlay.addEventListener('pointerdown', (e) => {
      if (e.target === this._overlay) this.hide();
    });

    // Keyboard shortcut T
    document.addEventListener('keydown', (e) => {
      if ((e.key === 'T' || e.key === 't') && !e.ctrlKey && !e.metaKey && !e.altKey) {
        // Don't trigger if focus is in an input/select
        const tag = document.activeElement?.tagName;
        if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;
        this.toggle();
      }
    });

    // Rebuild lines if window resizes
    this._resizeObserver = new ResizeObserver(() => {
      if (this._visible) this._drawLines();
    });
    this._resizeObserver.observe(this._viewport);

    // Update energy display when silo changes
    this._onSiloChanged = ({ resource }) => {
      if (resource === 'energy' && this._visible) this._updateEnergyDisplay();
    };
    gameState.on('siloChanged', this._onSiloChanged);
    gameState.on('focusedPlanet', () => {
      if (this._visible) { this._updateEnergyDisplay(); this._renderNodes(); this._drawLines(); }
    });
  }

  show() {
    if (!this._built) this._build();
    this._renderNodes();
    this._drawLines();
    this._updateEnergyDisplay();
    this._overlay.classList.add('tech-overlay--visible');
    this._visible = true;
    // Remove pulse from Research button
    document.getElementById('research-btn')?.classList.remove('research-btn--pulse');
    gameState._newTechAvailable = false;
  }

  hide() {
    this._overlay.classList.remove('tech-overlay--visible');
    this._visible = false;
  }

  toggle() {
    this._visible ? this.hide() : this.show();
  }

  // ─── Build DOM (once) ────────────────────────────────────────────────────

  _build() {
    this._built = true;

    // Group nodes: branch → tier → [nodes]
    const layout = {};
    for (const branch of BRANCH_ORDER) {
      layout[branch] = {};
    }
    for (const node of TECH_NODES) {
      const b = layout[node.branch];
      if (!b[node.tier]) b[node.tier] = [];
      b[node.tier].push(node);
    }

    // Determine max tier across all branches
    const maxTier = Math.max(...TECH_NODES.map(n => n.tier));

    // Clear viewport (keep SVG)
    Array.from(this._viewport.children).forEach(c => {
      if (c !== this._svg) c.remove();
    });

    for (const branch of BRANCH_ORDER) {
      const row = document.createElement('div');
      row.className = 'tech-branch-row';

      // Branch label
      const label = document.createElement('div');
      label.className = 'tech-branch-label';
      label.textContent = BRANCH_LABELS[branch];
      row.appendChild(label);

      // Tier columns
      for (let t = 0; t <= maxTier; t++) {
        const col = document.createElement('div');
        col.className = 'tech-tier-col';

        const nodes = layout[branch][t] || [];
        for (const node of nodes) {
          col.appendChild(this._createNodeCard(node));
        }

        // Empty placeholder to keep column widths consistent
        if (nodes.length === 0) {
          const placeholder = document.createElement('div');
          placeholder.className = 'tech-tier-placeholder';
          col.appendChild(placeholder);
        }

        row.appendChild(col);
      }

      this._viewport.insertBefore(row, this._svg);
    }
  }

  _createNodeCard(node) {
    const card = document.createElement('div');
    card.className = 'tech-node tech-node--locked';
    card.dataset.techId = node.id;

    // Cross-branch requirements can't be shown with SVG lines, so show them inline
    const crossReqs = (node.requires || []).filter(
      reqId => TECH_BY_ID[reqId]?.branch !== node.branch
    );
    const crossReqTag = crossReqs.length > 0
      ? `<div class="tech-node-crossreq">${crossReqs.map(id => TECH_BY_ID[id]?.name || id).join(', ')}</div>`
      : '';

    card.innerHTML = `
      <div class="tech-node-icon">${node.icon}</div>
      <div class="tech-node-name">${node.name}</div>
      ${crossReqTag}
      ${node.free
        ? '<div class="tech-node-cost tech-node-free">FREE</div>'
        : `<div class="tech-node-cost">⚡ ${fmt(node.cost)}</div>`}
      <div class="tech-node-badge"></div>
    `;

    // Tooltip on hover
    card.addEventListener('mouseenter', () => {
      const reqNames = (node.requires || []).map(id => TECH_BY_ID[id]?.name || id).join(', ');
      let tipHtml = `<strong>${node.name}</strong><br>${node.desc}`;
      if (!node.free && node.requires.length > 0) {
        tipHtml += `<br><span style="color:var(--dune-text-dim);font-size:10px">Requires: ${reqNames}</span>`;
      }
      if (!node.free) {
        tipHtml += `<br><span style="color:#4af0ff">⚡ ${fmt(node.cost)} energy</span>`;
      }
      this._showTooltip(card, tipHtml);
    });
    card.addEventListener('mouseleave', () => this._hideTooltip());

    if (!node.free) {
      card.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        this._onNodeClick(node.id);
      });
    }

    return card;
  }

  // ─── Render node states ───────────────────────────────────────────────────

  _renderNodes() {
    for (const node of TECH_NODES) {
      const card = this._modal.querySelector(`[data-tech-id="${node.id}"]`);
      if (!card) continue;

      const state = this._nodeState(node);
      card.classList.remove('tech-node--locked', 'tech-node--available', 'tech-node--unlocked');
      card.classList.add(`tech-node--${state}`);

      const badge = card.querySelector('.tech-node-badge');
      if (badge) badge.textContent = state === 'unlocked' ? '✓' : '';

      // Update cost display (reflects whether we can afford)
      const costEl = card.querySelector('.tech-node-cost');
      if (costEl && !node.free) {
        const canAfford = gameState.siloHas(gameState.focusedPlanet, 'energy', node.cost);
        costEl.classList.toggle('tech-node-cost--cant', state === 'available' && !canAfford);
      }
    }
  }

  _nodeState(node) {
    if (gameState.isTechUnlocked(node.id)) return 'unlocked';
    if (node.requires.every(r => gameState.isTechUnlocked(r))) return 'available';
    return 'locked';
  }

  // ─── SVG connector lines ──────────────────────────────────────────────────

  _drawLines() {
    this._svg.innerHTML = '';

    const svgRect = this._svg.getBoundingClientRect();
    if (!svgRect.width) return;

    for (const node of TECH_NODES) {
      if (!node.requires?.length) continue;

      const childEl = this._modal.querySelector(`[data-tech-id="${node.id}"]`);
      if (!childEl) continue;
      const childRect = childEl.getBoundingClientRect();

      for (const reqId of node.requires) {
        // Skip cross-branch connections — shown as inline text tag on the node instead
        if (TECH_BY_ID[reqId]?.branch !== node.branch) continue;

        const parentEl = this._modal.querySelector(`[data-tech-id="${reqId}"]`);
        if (!parentEl) continue;
        const parentRect = parentEl.getBoundingClientRect();

        // Coordinates relative to SVG element
        const px = parentRect.right  - svgRect.left;
        const py = parentRect.top    - svgRect.top  + parentRect.height / 2;
        const cx = childRect.left    - svgRect.left;
        const cy = childRect.top     - svgRect.top  + childRect.height / 2;
        const midX = (px + cx) / 2;

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', `M${px},${py} C${midX},${py} ${midX},${cy} ${cx},${cy}`);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', this._lineColor(reqId, node.id));
        path.setAttribute('stroke-width', '2');
        path.setAttribute('stroke-linecap', 'round');
        this._svg.appendChild(path);
      }
    }
  }

  _lineColor(parentId, childId) {
    const parentUnlocked = gameState.isTechUnlocked(parentId);
    const childUnlocked  = gameState.isTechUnlocked(childId);
    if (parentUnlocked && childUnlocked)  return '#8aaa5a';  // both unlocked — green
    if (parentUnlocked)                   return '#d4a843';  // parent ok — gold
    return 'rgba(212,168,67,0.18)';                          // locked — dim
  }

  // ─── Click handler ────────────────────────────────────────────────────────

  _onNodeClick(nodeId) {
    if (gameState.isTechUnlocked(nodeId)) return;

    const node = TECH_BY_ID[nodeId];
    if (!node) return;

    // Check prerequisites shown — shake if not met
    if (!node.requires.every(r => gameState.isTechUnlocked(r))) {
      this._shakeNode(nodeId);
      AudioManager.play('UI_CLICK_DENIED');
      return;
    }

    // Check afford
    if (!gameState.siloHas(gameState.focusedPlanet, 'energy', node.cost)) {
      this._shakeNode(nodeId);
      AudioManager.play('UI_CLICK_DENIED');
      return;
    }

    const ok = gameState.unlockTech(nodeId);
    if (ok) {
      AudioManager.play('BASE_UPGRADED');
      this._playUnlockAnim(nodeId);
      this._renderNodes();
      this._drawLines();
      this._updateEnergyDisplay();
    }
  }

  _shakeNode(nodeId) {
    const card = this._modal.querySelector(`[data-tech-id="${nodeId}"]`);
    if (!card) return;
    card.classList.add('tech-node--shake');
    card.addEventListener('animationend', () => card.classList.remove('tech-node--shake'), { once: true });
  }

  _playUnlockAnim(nodeId) {
    const card = this._modal.querySelector(`[data-tech-id="${nodeId}"]`);
    if (!card) return;
    card.classList.add('tech-node--just-unlocked');
    card.addEventListener('animationend', () => card.classList.remove('tech-node--just-unlocked'), { once: true });
  }

  // ─── Energy display ───────────────────────────────────────────────────────

  _updateEnergyDisplay() {
    const ps = gameState.getPlanetState(gameState.focusedPlanet);
    const energy = ps?.silos?.energy?.amount ?? 0;
    if (this._energyEl) this._energyEl.textContent = `⚡ ${fmt(energy)}`;
  }

  // ─── Tooltip ──────────────────────────────────────────────────────────────

  _showTooltip(anchorEl, html) {
    let tt = document.getElementById('tech-node-tooltip');
    if (!tt) {
      tt = document.createElement('div');
      tt.id = 'tech-node-tooltip';
      tt.className = 'tech-node-tooltip';
      document.body.appendChild(tt);
    }
    tt.innerHTML = html;
    tt.style.display = 'block';

    const rect = anchorEl.getBoundingClientRect();
    let left = rect.right + 8;
    let top  = rect.top;
    // Clamp to viewport
    if (left + 210 > window.innerWidth)  left = rect.left - 218;
    if (top  + 100 > window.innerHeight) top  = window.innerHeight - 108;
    if (left < 4) left = 4;
    if (top  < 4) top  = 4;
    tt.style.left = left + 'px';
    tt.style.top  = top  + 'px';
  }

  _hideTooltip() {
    const tt = document.getElementById('tech-node-tooltip');
    if (tt) tt.style.display = 'none';
  }
}
