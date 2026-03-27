// Kanban Board — drag-and-drop card management

let draggedCard = null;
let nextId = 100;

// ── Modal state ───────────────────────────────────────────────────────────────
let targetColumn = null;

// ── Drag & Drop ──────────────────────────────────────────────────────────────

function dragStart(event) {
    draggedCard = event.currentTarget;
    draggedCard.classList.add('dragging');
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', draggedCard.dataset.id);
}

function allowDrop(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    const list = event.currentTarget;
    if (!list.classList.contains('drag-over')) {
        clearDragOver();
        list.classList.add('drag-over');
    }
}

function drop(event) {
    event.preventDefault();
    const list = event.currentTarget;
    if (draggedCard && list) {
        list.appendChild(draggedCard);
    }
    clearDragOver();
    updateCounts();
}

function clearDragOver() {
    document.querySelectorAll('.card-list.drag-over').forEach(el => {
        el.classList.remove('drag-over');
    });
}

document.addEventListener('dragend', () => {
    if (draggedCard) {
        draggedCard.classList.remove('dragging');
        draggedCard = null;
    }
    clearDragOver();
});

// ── Card Count ────────────────────────────────────────────────────────────────

function updateCounts() {
    const columns = ['todo', 'inprogress', 'review', 'done'];
    columns.forEach(col => {
        const list = document.getElementById(`list-${col}`);
        const countEl = document.getElementById(`count-${col}`);
        if (list && countEl) {
            countEl.textContent = list.querySelectorAll('.card').length;
        }
    });
}

// ── Modal ─────────────────────────────────────────────────────────────────────

function openModal(column) {
    targetColumn = column;
    const modal = document.getElementById('modal');
    const overlay = document.getElementById('modal-overlay');
    const input = document.getElementById('card-text');
    input.value = '';
    modal.classList.add('visible');
    overlay.classList.add('visible');
    input.focus();
}

function closeModal() {
    document.getElementById('modal').classList.remove('visible');
    document.getElementById('modal-overlay').classList.remove('visible');
    targetColumn = null;
}

function addCard() {
    const text = document.getElementById('card-text').value.trim();
    const tagClass = document.getElementById('card-tag').value;
    const tagName = tagClass.replace('tag-', '');
    const tagLabel = tagName.charAt(0).toUpperCase() + tagName.slice(1);

    if (!text) {
        document.getElementById('card-text').focus();
        return;
    }

    const card = document.createElement('div');
    card.className = 'card';
    card.draggable = true;
    card.dataset.id = nextId++;
    card.ondragstart = dragStart;
    card.innerHTML = `<p>${escapeHtml(text)}</p><span class="card-tag ${tagClass}">${tagLabel}</span>`;

    const list = document.getElementById(`list-${targetColumn}`);
    if (list) {
        list.appendChild(card);
    }

    closeModal();
    updateCounts();
}

// Allow submitting the modal with Enter key
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('card-text').addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            addCard();
        }
    });
    updateCounts();
});

// ── Utilities ─────────────────────────────────────────────────────────────────

function escapeHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
