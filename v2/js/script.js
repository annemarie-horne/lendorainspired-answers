document.addEventListener("DOMContentLoaded", () => {
  const toggles = document.querySelectorAll(".js-indeterminate-toggle");

  toggles.forEach(toggle => {
    const body = toggle.closest(".question-body");
    if (!body) return;

    // initial state: orange dash, collapsed
    toggle.indeterminate = true;
    toggle.checked = false;
    body.classList.remove("is-expanded");

    // first click: indeterminate → checked
    toggle.addEventListener("click", (e) => {
      if (toggle.indeterminate) {
        e.preventDefault();          // stop native toggle
        toggle.indeterminate = false;
        toggle.checked = true;
        body.classList.add("is-expanded");
      }
    });

    // subsequent clicks: normal toggle
    toggle.addEventListener("change", () => {
      toggle.indeterminate = false;
      body.classList.toggle("is-expanded", toggle.checked);
    });
  });
});



document.addEventListener('click', function (e) {
  const button = e.target.closest('[data-expected-answer-toggle]');
  if (!button) return;

  const wrap = button.closest('.expected-answer-status-wrap');
  const panel = wrap.querySelector('.expected-answer-panel');

  if (!panel) return;

  const isHidden = panel.hasAttribute('hidden');

  if (isHidden) {
    panel.removeAttribute('hidden');
    button.classList.add('is-open');
  } else {
    panel.setAttribute('hidden', '');
    button.classList.remove('is-open');
  }
});

document.addEventListener('click', function (e) {
  const button = e.target.closest('[data-review-evidence-toggle]');
  if (!button) return;

  const answer = button.closest('.review-answer-row__answer');
  const panelId = button.getAttribute('aria-controls');
  const panel = panelId
    ? document.getElementById(panelId)
    : answer.querySelector('.review-evidence');

  if (!panel) return;

  const isHidden = panel.hasAttribute('hidden');

  if (isHidden) {
    panel.removeAttribute('hidden');
    button.classList.add('is-open');
    button.setAttribute('aria-expanded', 'true');
  } else {
    panel.setAttribute('hidden', '');
    button.classList.remove('is-open');
    button.setAttribute('aria-expanded', 'false');
  }
});

document.addEventListener('DOMContentLoaded', function () {
  const tooltip = document.createElement('div');
  tooltip.className = 'prominent-tooltip';
  tooltip.setAttribute('role', 'tooltip');
  tooltip.hidden = true;
  document.body.appendChild(tooltip);

  function placeTooltip(target) {
    const rect = target.getBoundingClientRect();
    tooltip.classList.remove('prominent-tooltip--below');
    tooltip.hidden = false;

    const tooltipRect = tooltip.getBoundingClientRect();
    let top = rect.top - tooltipRect.height - 10;
    let left = rect.left + Math.min(18, Math.max(0, rect.width / 2 - 18));

    if (top < 8) {
      top = rect.bottom + 10;
      tooltip.classList.add('prominent-tooltip--below');
    }

    left = Math.max(8, Math.min(left, window.innerWidth - tooltipRect.width - 8));
    tooltip.style.top = top + 'px';
    tooltip.style.left = left + 'px';
  }

  function showTooltip(target) {
    const text = target.getAttribute('data-prominent-tooltip');
    if (!text) return;
    tooltip.textContent = text;
    placeTooltip(target);
  }

  function getReviewStateTooltip(questionBlock) {
    const isApproved = questionBlock.classList.contains('question-block--approved');
    const isDisapproved = questionBlock.classList.contains('question-block--disapproved');
    const isMarked = questionBlock.classList.contains('question-block--marked-for-action');
    const isActionTaken = questionBlock.classList.contains('question-block--action-required');

    if (isApproved && isMarked) return 'Approved and marked for action';
    if (isDisapproved && isMarked) return 'Disapproved and marked for action';
    if (isApproved && isActionTaken) return 'Approved and action has been taken';
    if (isDisapproved && isActionTaken) return 'Disapproved and action has been taken';
    if (isApproved) return 'Approved';
    if (isDisapproved) return 'Disapproved';
    if (isMarked) return 'Marked for action';
    if (isActionTaken) return 'Action has been taken';
    return '';
  }

  document.querySelectorAll('.question-block').forEach(function (questionBlock) {
    const tooltipText = getReviewStateTooltip(questionBlock);
    if (!tooltipText || questionBlock.querySelector('.review-state-bar-hitarea')) return;

    const hitArea = document.createElement('span');
    hitArea.className = 'review-state-bar-hitarea';
    hitArea.setAttribute('data-prominent-tooltip', tooltipText);
    hitArea.setAttribute('aria-hidden', 'true');
    questionBlock.appendChild(hitArea);
  });

  function showReviewStateTooltip(questionBlock, event) {
    const text = getReviewStateTooltip(questionBlock);
    if (!text) return;

    tooltip.textContent = text;
    tooltip.classList.remove('prominent-tooltip--below');
    tooltip.hidden = false;

    const rect = questionBlock.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    let top = event.clientY - tooltipRect.height - 12;
    let left = rect.left - 12;

    if (top < 8) {
      top = event.clientY + 12;
      tooltip.classList.add('prominent-tooltip--below');
    }

    left = Math.max(8, Math.min(left, window.innerWidth - tooltipRect.width - 8));
    tooltip.style.top = top + 'px';
    tooltip.style.left = left + 'px';
  }

  function hideTooltip() {
    tooltip.hidden = true;
  }

  document.addEventListener('pointerover', function (event) {
    const target = event.target.closest('[data-prominent-tooltip]');
    if (target) showTooltip(target);
  });

  document.addEventListener('pointerout', function (event) {
    if (event.target.closest('[data-prominent-tooltip]')) hideTooltip();
  });

  document.addEventListener('pointermove', function (event) {
    const questionBlock = event.target.closest('.question-block');
    if (!questionBlock) return;

    const rect = questionBlock.getBoundingClientRect();
    const isOverStateBar = event.clientX >= rect.left - 18 && event.clientX <= rect.left + 6;

    if (isOverStateBar) {
      showReviewStateTooltip(questionBlock, event);
    } else if (!event.target.closest('[data-prominent-tooltip]')) {
      hideTooltip();
    }
  });

  document.addEventListener('pointerleave', function (event) {
    if (event.target.closest && event.target.closest('.question-block')) hideTooltip();
  }, true);

  document.addEventListener('focusin', function (event) {
    const target = event.target.closest('[data-prominent-tooltip]');
    if (target) showTooltip(target);
  });

  document.addEventListener('focusout', function (event) {
    if (event.target.closest('[data-prominent-tooltip]')) hideTooltip();
  });

  window.addEventListener('scroll', hideTooltip, true);
  window.addEventListener('resize', hideTooltip);
});

document.addEventListener('DOMContentLoaded', function () {
  function syncActionTypeSelectColor(select) {
    if (!select) return;

    select.classList.remove(
      'review-action-type-select--email',
      'review-action-type-select--pt',
      'review-action-type-select--standard-plan'
    );

    if (select.value === 'email') {
      select.classList.add('review-action-type-select--email');
    } else if (select.value === 'pt') {
      select.classList.add('review-action-type-select--pt');
    } else if (select.value === 'standard-plan') {
      select.classList.add('review-action-type-select--standard-plan');
    }
  }

  function syncGlobalActionButtons() {
    const activeTypes = new Set();

    document.querySelectorAll('label.review-action-check input[type="checkbox"]').forEach(function (checkbox) {
      const label = checkbox.closest('label.review-action-check');
      const labelText = label ? label.textContent.replace(/\s+/g, ' ').trim() : '';
      if (labelText !== 'Mark for Action' || !checkbox.checked) return;

      const select = label.nextElementSibling && label.nextElementSibling.classList.contains('review-action-type-select')
        ? label.nextElementSibling
        : null;

      if (select) {
        activeTypes.add(select.value);
      }
    });

    const emailButton = document.querySelector('.context-primary-action-btn--email');
    const ptButton = document.querySelector('.context-primary-action-btn--pt');
    const standardButton = document.querySelector('.context-primary-action-btn--standard');

    if (emailButton) emailButton.classList.toggle('is-action-active', activeTypes.has('email'));
    if (ptButton) ptButton.classList.toggle('is-action-active', activeTypes.has('pt'));
    if (standardButton) standardButton.classList.toggle('is-action-active', activeTypes.has('standard-plan'));
  }

  function syncActionTypeSelect(checkbox) {
    if (!checkbox) return;

    const label = checkbox.closest('label.review-action-check');
    const select = label && label.nextElementSibling && label.nextElementSibling.classList.contains('review-action-type-select')
      ? label.nextElementSibling
      : null;

    if (!select) return;
    select.classList.toggle('is-visible', checkbox.checked);
    syncActionTypeSelectColor(select);
  }

  document.querySelectorAll('label.review-action-check input[type="checkbox"]').forEach(function (checkbox) {
    const label = checkbox.closest('label.review-action-check');
    const labelText = label ? label.textContent.replace(/\s+/g, ' ').trim() : '';
    if (labelText !== 'Mark for Action') return;

    syncActionTypeSelect(checkbox);
    checkbox.addEventListener('change', function () {
      syncActionTypeSelect(checkbox);
      syncGlobalActionButtons();
    });
  });

  document.querySelectorAll('.review-action-type-select').forEach(function (select) {
    syncActionTypeSelectColor(select);
    select.addEventListener('change', function () {
      syncActionTypeSelectColor(select);
      syncGlobalActionButtons();
    });
  });

  syncGlobalActionButtons();
});

document.addEventListener('click', function (e) {
  const button = e.target.closest('[data-action-history-toggle]');
  if (!button) return;

  const panel = document.getElementById(button.getAttribute('aria-controls'));
  if (!panel) return;

  const isHidden = panel.hasAttribute('hidden');
  if (isHidden) {
    panel.removeAttribute('hidden');
    button.classList.add('is-open');
    button.setAttribute('aria-expanded', 'true');
  } else {
    panel.setAttribute('hidden', '');
    button.classList.remove('is-open');
    button.setAttribute('aria-expanded', 'false');
  }
});

document.addEventListener('DOMContentLoaded', function () {
  function syncContextControlHints() {
    document.querySelectorAll('.form-context-item').forEach(function (item) {
      const label = item.querySelector('.form-context-item__label');
      const select = item.querySelector('.control--context');
      const value = select
        ? select.options[select.selectedIndex] && select.options[select.selectedIndex].text
        : item.querySelector('.form-context-item__value') && item.querySelector('.form-context-item__value').textContent;

      if (!label || !value) return;

      const hint = label.textContent.replace(/\s+/g, ' ').trim() + ': ' + value.replace(/\s+/g, ' ').trim();
      const target = item.querySelector('.select-wrap--context') || item;

      target.setAttribute('data-prominent-tooltip', hint);
      target.setAttribute('title', hint);
      if (select) {
        select.setAttribute('data-prominent-tooltip', hint);
        select.setAttribute('title', hint);
      }
    });
  }

  function clearSelect(select) {
    if (!select) return;
    select.selectedIndex = 0;
    select.dispatchEvent(new Event('change', { bubbles: true }));
  }

  document.querySelectorAll('[data-clear-select]').forEach(function (button) {
    button.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      clearSelect(document.getElementById(button.getAttribute('data-clear-select')));
    });
  });

  document.querySelectorAll('[data-clear-all-filters]').forEach(function (button) {
    button.addEventListener('click', function (event) {
      event.preventDefault();
      document.querySelectorAll('.control--context').forEach(clearSelect);
    });
  });

  document.querySelectorAll('.control--context').forEach(function (select) {
    select.addEventListener('change', syncContextControlHints);
  });

  syncContextControlHints();
});

document.addEventListener('DOMContentLoaded', function () {
  const commandCenter = document.querySelector('.review-command-center');
  const densityToggle = document.querySelector('[data-control-density-toggle]');

  if (commandCenter && densityToggle) {
    const densityToggleText = densityToggle.querySelector('.control-density-toggle__text');
    const densityToggleIcon = densityToggle.querySelector('.control-density-toggle__icon');

    function syncDensityToggle() {
      const isCompact = commandCenter.classList.contains('is-controls-compact');
      const label = isCompact ? 'Expand control filters' : 'Collapse control filters';

      densityToggle.setAttribute('aria-pressed', isCompact ? 'true' : 'false');
      densityToggle.setAttribute('aria-label', label);
      densityToggle.setAttribute('title', label);
      densityToggle.classList.toggle('is-compact', isCompact);
      if (densityToggleText) {
        densityToggleText.textContent = isCompact ? 'Full View' : 'Compact View';
      }
      if (densityToggleIcon) {
        densityToggleIcon.src = isCompact
          ? 'https://acreation.co.za/lendorainspired/Icons/collapse.svg'
          : 'https://acreation.co.za/lendorainspired/Icons/expand.svg';
      }
    }

    densityToggle.addEventListener('click', function () {
      commandCenter.classList.toggle('is-controls-compact');
      syncDensityToggle();
    });

    syncDensityToggle();
  }
});

document.addEventListener('DOMContentLoaded', function () {
  const stickyHeader = document.querySelector('.sticky-review-header');
  const stickyToggles = Array.from(document.querySelectorAll('[data-sticky-header-toggle]'));

  if (stickyHeader && stickyToggles.length) {
    function syncStickyToggle() {
      const isLocked = stickyHeader.classList.contains('is-sticky-locked');
      const label = isLocked ? 'Unlock sticky header' : 'Lock sticky header';

      stickyToggles.forEach(function (stickyToggle) {
        const stickyToggleIcon = stickyToggle.querySelector('.sticky-lock-toggle__icon');
        const isFloatingToggle = stickyToggle.classList.contains('sticky-lock-toggle--floating');

        stickyToggle.classList.toggle('is-locked', isLocked);
        stickyToggle.classList.toggle('is-hidden', isFloatingToggle && isLocked);
        stickyToggle.setAttribute('aria-pressed', isLocked ? 'true' : 'false');
        stickyToggle.setAttribute('aria-label', label);
        stickyToggle.setAttribute('title', label);

        if (stickyToggleIcon) {
          stickyToggleIcon.src = isLocked
            ? 'https://acreation.co.za/lendorainspired/Icons/locked.svg'
            : 'https://acreation.co.za/lendorainspired/Icons/lock-unlocked.svg';
        }
      });
    }

    stickyToggles.forEach(function (stickyToggle) {
      stickyToggle.addEventListener('click', function () {
        stickyHeader.classList.toggle('is-sticky-locked');
        syncStickyToggle();
      });
    });

    syncStickyToggle();
  }
});

document.addEventListener('DOMContentLoaded', function () {
  const evaluationToggle = document.querySelector('[data-evaluation-layer-toggle]');

  if (evaluationToggle) {
    const evaluationToggleIcon = evaluationToggle.querySelector('.evaluation-layer-toggle__icon');

    function syncEvaluationToggle() {
      const isHidden = document.body.classList.contains('is-evaluation-hidden');
      const label = isHidden ? 'Show evaluation markings' : 'Hide evaluation markings';

      evaluationToggle.classList.toggle('is-evaluation-hidden', isHidden);
      evaluationToggle.setAttribute('aria-pressed', isHidden ? 'true' : 'false');
      evaluationToggle.setAttribute('aria-label', label);
      evaluationToggle.setAttribute('title', label);
      if (evaluationToggleIcon) {
        evaluationToggleIcon.src = isHidden
          ? 'https://acreation.co.za/lendorainspired/Icons/noview.svg'
          : 'https://acreation.co.za/lendorainspired/Icons/view.svg';
      }
    }

    evaluationToggle.addEventListener('click', function () {
      document.body.classList.toggle('is-evaluation-hidden');
      syncEvaluationToggle();
    });

    syncEvaluationToggle();
  }
});

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('[data-expected-answer-toggle]').forEach(function (button) {
    const isMismatch = button.classList.contains('expected-answer-toggle-btn--mismatch');
    const title = isMismatch
      ? 'View expected answer configuration for this incorrect answer'
      : 'View expected answer configuration for this correct answer';

    if (!button.hasAttribute('data-prominent-tooltip')) {
      button.setAttribute('title', title);
    }
    button.setAttribute('aria-label', title);
  });

  document.querySelectorAll('[data-review-evidence-toggle]').forEach(function (button) {
    const hasContent = button.classList.contains('review-evidence-toggle-btn--has-content');
    const title = hasContent
      ? 'View comment and attachments'
      : 'Add comment or attachments';

    if (!button.hasAttribute('data-prominent-tooltip')) {
      button.setAttribute('title', title);
    }
    button.setAttribute('aria-label', title);
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const actionModal = document.getElementById('actionModal');
  const actionModalTitle = document.getElementById('actionModalTitle');

  function isTakeActionButton(button) {
    if (!button) return false;
    const label = button.textContent.replace(/\s+/g, ' ').trim();
    return label === 'Take Action'
      || label === 'Take Action on Question'
      || label.startsWith('Take Action:')
      || label.startsWith('Take Global Action');
  }

  function openActionModal(button) {
    if (!actionModal) return;

    const label = button ? button.textContent.replace(/\s+/g, ' ').trim() : '';
    if (actionModalTitle) {
      actionModalTitle.textContent = (label.startsWith('Take Action:') || label.startsWith('Take Global Action')) ? 'Edit Global Actions' : 'Edit Actions';
    }

    actionModal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeActionModal() {
    if (!actionModal) return;

    actionModal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  document.addEventListener('click', function (e) {
    const closeTrigger = e.target.closest('[data-action-modal-close]');
    if (closeTrigger) {
      closeActionModal();
      return;
    }

    const button = e.target.closest('button');
    if (!isTakeActionButton(button)) return;

    e.preventDefault();
    openActionModal(button);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && actionModal && !actionModal.hasAttribute('hidden')) {
      closeActionModal();
    }
  });
});

document.addEventListener('change', function (e) {
  const bulkDecision = e.target.closest('[data-bulk-review-decision]');
  const bulkMark = e.target.closest('[data-bulk-review-mark]');
  const itemDecision = e.target.closest('.multi-answer-review-item .review-actions input[type="radio"]');
  const itemMark = e.target.closest('.multi-answer-review-item .review-actions input[type="checkbox"]');

  if (!bulkDecision && !bulkMark && !itemDecision && !itemMark) return;

  const toolbar = e.target.closest('[data-bulk-review-toolbar]');
  const changedItem = e.target.closest('.multi-answer-review-item');
  const questionBlock = toolbar
    ? toolbar.closest('.question-block')
    : changedItem && changedItem.closest('.question-block');

  if (!questionBlock || !questionBlock.querySelector('[data-bulk-review-toolbar]')) return;

  function getReviewItems() {
    return Array.from(questionBlock.querySelectorAll('.multi-answer-review-list--modern > .multi-answer-review-item'));
  }

  function updateItemReviewState(item) {
    const checkedDecision = item.querySelector('.review-actions input[type="radio"]:checked');
    const checkedMark = item.querySelector('.review-actions input[type="checkbox"]:checked');

    item.classList.remove(
      'multi-answer-review-item--review-approved',
      'multi-answer-review-item--review-disapproved',
      'multi-answer-review-item--review-marked'
    );

    if (checkedDecision && checkedDecision.value === 'approve') {
      item.classList.add('multi-answer-review-item--review-approved');
    }

    if (checkedDecision && checkedDecision.value === 'disapprove') {
      item.classList.add('multi-answer-review-item--review-disapproved');
    }

    if (checkedMark) {
      item.classList.add('multi-answer-review-item--review-marked');
    }
  }

  function updateAllItemReviewStates() {
    getReviewItems().forEach(updateItemReviewState);
  }

  function setQuestionReviewState(decision) {
    questionBlock.classList.remove('question-block--approved', 'question-block--disapproved');

    if (decision === 'approve') {
      questionBlock.classList.add('question-block--approved');
    }

    if (decision === 'disapprove') {
      questionBlock.classList.add('question-block--disapproved');
    }
  }

  function syncQuestionAggregateState() {
    const items = getReviewItems();
    const decisions = items.map(function (item) {
      const checkedDecision = item.querySelector('.review-actions input[type="radio"]:checked');
      return checkedDecision ? checkedDecision.value : '';
    });
    const allApproved = decisions.length > 0 && decisions.every(function (decision) {
      return decision === 'approve';
    });
    const allDisapproved = decisions.length > 0 && decisions.every(function (decision) {
      return decision === 'disapprove';
    });
    const bulkApprove = questionBlock.querySelector('[data-bulk-review-decision][value="approve"]');
    const bulkDisapprove = questionBlock.querySelector('[data-bulk-review-decision][value="disapprove"]');

    if (allApproved) {
      if (bulkApprove) bulkApprove.checked = true;
      setQuestionReviewState('approve');
      return;
    }

    if (allDisapproved) {
      if (bulkDisapprove) bulkDisapprove.checked = true;
      setQuestionReviewState('disapprove');
      return;
    }

    if (bulkApprove) bulkApprove.checked = false;
    if (bulkDisapprove) bulkDisapprove.checked = false;
    questionBlock.classList.remove('question-block--approved', 'question-block--disapproved');
  }

  if (bulkDecision) {
    const decision = bulkDecision.value;

    questionBlock
      .querySelectorAll('.review-actions input[type="radio"][value="' + decision + '"]')
      .forEach(function (radio) {
        radio.checked = true;
      });

    updateAllItemReviewStates();
    setQuestionReviewState(decision);
    return;
  }

  if (bulkMark) {
    questionBlock.classList.toggle('question-block--marked-for-action', bulkMark.checked);
    return;
  }

  if (changedItem) {
    updateItemReviewState(changedItem);
    syncQuestionAggregateState();
  }
});

function syncReviewEvidenceToggleState(panel) {
  if (!panel || !panel.id) return;

  const button = document.querySelector('[data-review-evidence-toggle][aria-controls="' + panel.id + '"]');
  if (!button) return;

  const hasComment = Array.from(panel.querySelectorAll('textarea')).some(function (textarea) {
    return textarea.value.trim().length > 0;
  });
  const hasAttachedFiles = Array.from(panel.querySelectorAll('input[type="file"]')).some(function (input) {
    return input.files && input.files.length > 0;
  });
  const hasRenderedFiles = Array.from(panel.querySelectorAll('.upload-list')).some(function (list) {
    return list.children.length > 0;
  });
  const hasContent = hasComment || hasAttachedFiles || hasRenderedFiles;

  button.classList.toggle('review-evidence-toggle-btn--has-content', hasContent);
  button.setAttribute(
    'aria-label',
    hasContent ? 'Show comment and attachments' : 'Add comment or attachments'
  );
  button.setAttribute(
    'title',
    hasContent ? 'View comment and attachments' : 'Add comment or attachments'
  );
}

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.review-evidence').forEach(syncReviewEvidenceToggleState);
});

document.addEventListener('input', function (e) {
  const panel = e.target.closest('.review-evidence');
  if (panel) {
    syncReviewEvidenceToggleState(panel);
  }
});

document.addEventListener('change', function (e) {
  const panel = e.target.closest('.review-evidence');
  if (panel) {
    syncReviewEvidenceToggleState(panel);
  }
});



/* ---------------------------------------------------
   Uploaded File Functionality
--------------------------------------------------- */

document.addEventListener('DOMContentLoaded', function () {
  const modal = document.getElementById('filePreviewModal');
  const modalTitle = document.getElementById('filePreviewModalTitle');
  const modalBody = document.getElementById('filePreviewModalBody');
  const modalDescription = document.getElementById('filePreviewModalDescription');


  function openModal(title, description, content) {
    if (!modal || !modalTitle || !modalBody) return;

    modalTitle.textContent = title;
    modalDescription.textContent = description || '';
    modalBody.innerHTML = content;
    modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modal || !modalBody) return;

    modal.setAttribute('hidden', '');
    modalBody.innerHTML = '';
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-modal-preview]').forEach(function (button) {
    button.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();

      const title = button.getAttribute('data-file-title') || 'Preview';
      const description = button.getAttribute('data-file-description') || '';
      const content = button.getAttribute('data-file-preview-content') || 'Preview area';

      openModal(title, description, content);
    });
  });

  document.querySelectorAll('[data-modal-close]').forEach(function (element) {
    element.addEventListener('click', function () {
      closeModal();
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal && !modal.hasAttribute('hidden')) {
      closeModal();
    }
  });

  document.querySelectorAll('[data-attachment-viewer]').forEach(function (viewer) {
    const trigger = viewer.querySelector('[data-attachment-trigger]');
    const panel = viewer.querySelector('[data-attachment-panel]');
    const modeButtons = viewer.querySelectorAll('[data-view-mode]');
    const modePanels = viewer.querySelectorAll('[data-mode-panel]');
    const tabs = viewer.querySelectorAll('.attachment-tab');
    const tabPanels = viewer.querySelectorAll('.attachment-tab-panel');

    if (trigger && panel) {
      trigger.addEventListener('click', function () {
        const isHidden = panel.hasAttribute('hidden');

        if (isHidden) {
          panel.removeAttribute('hidden');
          trigger.classList.add('is-open');
          trigger.setAttribute('aria-expanded', 'true');
        } else {
          panel.setAttribute('hidden', '');
          trigger.classList.remove('is-open');
          trigger.setAttribute('aria-expanded', 'false');
        }
      });
    }

    modeButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        const mode = button.getAttribute('data-view-mode');

        modeButtons.forEach(function (btn) {
          btn.classList.remove('is-active');
        });

        modePanels.forEach(function (panelItem) {
          panelItem.classList.remove('is-active');
        });

        button.classList.add('is-active');

        const activePanel = viewer.querySelector('[data-mode-panel="' + mode + '"]');
        if (activePanel) {
          activePanel.classList.add('is-active');
        }
      });
    });

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        const tabId = tab.getAttribute('data-tab');

        tabs.forEach(function (tabItem) {
          tabItem.classList.remove('is-active');
        });

        tabPanels.forEach(function (panelItem) {
          panelItem.classList.remove('is-active');
        });

        tab.classList.add('is-active');

        const activeTabPanel = viewer.querySelector('[data-tab-panel="' + tabId + '"]');
        if (activeTabPanel) {
          activeTabPanel.classList.add('is-active');
        }
      });
    });
  });
});







document.querySelectorAll('[data-comment-attachment-viewer]').forEach(function(viewer) {
  const trigger = viewer.querySelector('[data-comment-attachment-trigger]');
  const panel = viewer.querySelector('[data-comment-attachment-panel]');
  const modeButtons = viewer.querySelectorAll('[data-comment-view-mode]');
  const modePanels = viewer.querySelectorAll('[data-comment-mode-panel]');
  const tabs = viewer.querySelectorAll('[data-comment-tab]');
  const tabPanels = viewer.querySelectorAll('[data-comment-tab-panel]');

  if (trigger && panel) {
    trigger.addEventListener('click', function() {
      const isHidden = panel.hasAttribute('hidden');

      if (isHidden) {
        panel.removeAttribute('hidden');
        trigger.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      } else {
        panel.setAttribute('hidden', '');
        trigger.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  modeButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      const mode = button.getAttribute('data-comment-view-mode');

      modeButtons.forEach(function(btn) {
        btn.classList.remove('is-active');
      });

      modePanels.forEach(function(panelItem) {
        panelItem.classList.remove('is-active');
      });

      button.classList.add('is-active');

      const activePanel = viewer.querySelector('[data-comment-mode-panel="' + mode + '"]');
      if (activePanel) {
        activePanel.classList.add('is-active');
      }
    });
  });

  tabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      const tabId = tab.getAttribute('data-comment-tab');

      tabs.forEach(function(tabItem) {
        tabItem.classList.remove('is-active');
      });

      tabPanels.forEach(function(panelItem) {
        panelItem.classList.remove('is-active');
      });

      tab.classList.add('is-active');

      const activeTabPanel = viewer.querySelector('[data-comment-tab-panel="' + tabId + '"]');
      if (activeTabPanel) {
        activeTabPanel.classList.add('is-active');
      }
    });
  });
});


/* ---------------------------------------------------
   Uploaded File Functionality
--------------------------------------------------- */






/* ---------------------------------------------------
   Flatpickr
--------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {

  // Date only
  flatpickr(".js-date", {
    dateFormat: "d M Y",
    allowInput: true
  });

  // Date + Time
  flatpickr(".js-datetime", {
    enableTime: true,
    dateFormat: "d M Y H:i",
    time_24hr: true,
    allowInput: true
  });

  // Time only
  flatpickr(".js-time", {
    enableTime: true,
    noCalendar: true,
    dateFormat: "H:i",
    time_24hr: true,
    allowInput: true
  });

});





/* ---------------------------------------------------
   Upload: append files + show list + remove + badge
--------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  const inputs = document.querySelectorAll(".js-upload");

  const formatBytes = (bytes) => {
    if (!Number.isFinite(bytes) || bytes <= 0) return "";
    const units = ["B", "KB", "MB", "GB"];
    let i = 0;
    let n = bytes;
    while (n >= 1024 && i < units.length - 1) {
      n /= 1024;
      i++;
    }
    return `${n.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
  };

  const fileKey = (f) => `${f.name}__${f.size}__${f.lastModified}`;

  inputs.forEach((input) => {
    const id = input.dataset.uploadId || input.id;
    if (!id) return;

    const list = document.querySelector(`[data-upload-list="${id}"]`);
    if (!list) return;

    const badge = document.querySelector(`[data-upload-badge="${id}"]`);

    let filesState = [];

    const updateBadge = () => {
      if (!badge) return;
      const count = filesState.length;
      badge.textContent = String(count);
      badge.classList.toggle("is-hidden", count === 0);
    };

    const syncInputFiles = () => {
      const dt = new DataTransfer();
      filesState.forEach((f) => dt.items.add(f));
      input.files = dt.files;
    };

    const render = () => {
      list.innerHTML = "";

      if (filesState.length === 0) {
        updateBadge();
        return;
      }

      filesState.forEach((file, index) => {
        const li = document.createElement("li");
        li.className = "upload-item";

        const name = document.createElement("span");
        name.className = "upload-item__name";
        name.textContent = file.name;

        const meta = document.createElement("span");
        meta.className = "upload-item__meta";
        meta.textContent = formatBytes(file.size);

        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "upload-remove";
        btn.setAttribute("aria-label", `Remove ${file.name}`);
        btn.textContent = "×";

        btn.addEventListener("click", () => {
          filesState.splice(index, 1);
          syncInputFiles();
          render();
        });

        li.appendChild(name);
        if (meta.textContent) li.appendChild(meta);
        li.appendChild(btn);

        list.appendChild(li);
      });

      updateBadge();
    };

    input.addEventListener("change", () => {
      const newlyPicked = input.files ? Array.from(input.files) : [];
      if (newlyPicked.length === 0) return;

      const existingKeys = new Set(filesState.map(fileKey));

      newlyPicked.forEach((f) => {
        const k = fileKey(f);
        if (!existingKeys.has(k)) {
          filesState.push(f);
          existingKeys.add(k);
        }
      });

      syncInputFiles();
      render();

      // allow selecting the same file again later (still fires change)
      input.value = "";
    });

    render();
  });
});
