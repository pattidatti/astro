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
    this._activeTab = 'robots';
    this._tabBar    = null;

    document.getElementById('tech-close-btn')
      ?.addEventListener('pointerdown', () => this.hide());

    this._overlay.addEventListener('pointerdown', (e) => {
      if (e.target === this._overlay) this.hide();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;

      if (e.key === 'T' || e.key === 't') {
        this.toggle();
        return;
      }
      // 1-4: switch tabs when open
      if (this._visible && e.key >= '1' && e.key <= '4') {
        const branch = BRANCH_ORDER[parseInt(e.key) - 1];
        if (branch) this._switchTab(branch);
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

    // Create tab bar and insert before viewport in parent
    const tabBar = document.createElement('div');
    tabBar.className = 'tech-tabs';
    BRANCH_ORDER.forEach((branch, i) => {
      const tab = document.createElement('button');
      tab.className = 'tech-tab' + (branch === this._activeTab ? ' tech-tab--active' : '');
      tab.dataset.branch = branch;
      tab.innerHTML = `<span class="tech-tab-key">${i + 1}</span>${BRANCH_LABELS[branch]}`;
      tab.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        this._switchTab(branch);
      });
      tabBar.appendChild(tab);
    });
    this._viewport.parentNode.insertBefore(tabBar, this._viewport);
    this._tabBar = tabBar;

    // Build initial branch content
    this._buildBranch(this._activeTab);
  }

  _buildBranch(branch) {
    // Remove existing branch content
    const existing = this._viewport.querySelector('.tech-branch-content');
    if (existing) existing.remove();

    // Group nodes by tier for this branch
    const byTier = {};
    for (const node of TECH_NODES) {
      if (node.branch !== branch) continue;
      if (!byTier[node.tier]) byTier[node.tier] = [];
      byTier[node.tier].push(node);
    }

    if (Object.keys(byTier).length === 0) return;
    const maxTier = Math.max(...Object.keys(byTier).map(Number));

    const content = document.createElement('div');
    content.className = 'tech-branch-content';

    for (let t = 0; t <= maxTier; t++) {
      const nodes = byTier[t];
      if (!nodes) continue; // skip tiers with no nodes in this branch
      const row = document.createElement('div');
      row.className = 'tech-tier-row';
      for (const node of nodes) {
        row.appendChild(this._createNodeCard(node));
      }
      content.appendChild(row);
    }

    this._viewport.insertBefore(content, this._svg);
  }

  _switchTab(branch) {
    if (branch === this._activeTab) return;
    this._activeTab = branch;
    // Update active tab styling
    this._tabBar.querySelectorAll('.tech-tab').forEach(tab => {
      tab.classList.toggle('tech-tab--active', tab.dataset.branch === branch);
    });
    this._buildBranch(branch);
    this._renderNodes();
    this._drawLines();
  }

  _createNodeCard(node) {
    const card = document.createElement('div');
    card.className = 'tech-node tech-node--locked';
    card.dataset.techId = node.id;

    card.innerHTML = `
      <div class="tech-node-icon">${node.icon}</div>
      <span class="tech-node-lock">🔒</span>
      <div class="tech-node-name">${node.name}</div>
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
        tipHtml += `<br><span style="color:var(--dune-text-dim);font-size: 12px">Requires: ${reqNames}</span>`;
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

    const branchNodes = TECH_NODES.filter(n => n.branch === this._activeTab);

    for (const node of branchNodes) {
      if (!node.requires?.length) continue;

      const childEl = this._modal.querySelector(`[data-tech-id="${node.id}"]`);
      if (!childEl) continue;
      const childRect = childEl.getBoundingClientRect();

      for (const reqId of node.requires) {
        const parentEl = this._modal.querySelector(`[data-tech-id="${reqId}"]`);
        if (!parentEl) continue;
        const parentRect = parentEl.getBoundingClientRect();

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        let d;

        const isBelow = childRect.top > parentRect.bottom - 5;
        if (isBelow) {
          // Vertical: parent bottom-center → child top-center
          const px = parentRect.left - svgRect.left + parentRect.width / 2;
          const py = parentRect.bottom - svgRect.top;
          const cx = childRect.left - svgRect.left + childRect.width / 2;
          const cy = childRect.top - svgRect.top;
          const midY = (py + cy) / 2;
          d = `M${px},${py} C${px},${midY} ${cx},${midY} ${cx},${cy}`;
        } else {
          // Horizontal: parent right-center → child left-center
          const px = parentRect.right  - svgRect.left;
          const py = parentRect.top    - svgRect.top  + parentRect.height / 2;
          const cx = childRect.left    - svgRect.left;
          const cy = childRect.top     - svgRect.top  + childRect.height / 2;
          const midX = (px + cx) / 2;
          d = `M${px},${py} C${midX},${py} ${midX},${cy} ${cx},${cy}`;
        }

        path.setAttribute('d', d);
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

    // Check prerequisites — shake if not met
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
