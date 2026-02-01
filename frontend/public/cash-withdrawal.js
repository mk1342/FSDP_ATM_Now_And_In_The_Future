document.addEventListener('DOMContentLoaded', function() {
    console.log('Cash Withdrawal page loaded');
    
    // Withdrawal data
    let withdrawalData = {
        amount: 0,
        account: 'savings',
        noteType: 'mixed',
        selectedDenominations: [],
        noteBreakdown: {
            100: 0,
            50: 0,
            10: 0,
            5: 0,
            2: 0
        },
        transactionId: generateTransactionId(),
        availableNotes: {
            100: 20, // ATM has up to 20 of each note type
            50: 30,
            10: 50,
            5: 50,
            2: 50
        },
        accountBalances: {
            savings: 12450.75,
            current: 8230.20
        }
    };
    
    // Available note denominations
    const denominations = [100, 50, 10, 5, 2];
    
    // Initialize the page
    initializePage();
    
    function initializePage() {
        // Initialize selected denominations with all denominations
        withdrawalData.selectedDenominations = [...denominations];
        
        setupEventListeners();
        setupQuickAmounts();
        updateStepDisplay();
    }
    
    function setupEventListeners() {
        // Quick amount buttons
        document.querySelectorAll('.amount-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const amount = parseInt(this.dataset.amount);
                setWithdrawalAmount(amount);
            });
        });
        
        // Custom amount input
        const customAmountInput = document.getElementById('custom-amount-input');
        customAmountInput.addEventListener('input', function() {
            const amount = parseInt(this.value) || 0;
            setWithdrawalAmount(amount);
        });
        
        // Account selection
        document.querySelectorAll('.account-option').forEach(option => {
            option.addEventListener('click', function() {
                document.querySelectorAll('.account-option').forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
                withdrawalData.account = this.dataset.account;
            });
        });
        
        // Note type selection
        document.querySelectorAll('.note-type-option').forEach(option => {
            option.addEventListener('click', function() {
                document.querySelectorAll('.note-type-option').forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
                withdrawalData.noteType = this.dataset.type;
                
                // Show/hide appropriate controls
                const customBreakdown = document.getElementById('custom-breakdown');
                const mixedSelection = document.getElementById('mixed-selection');
                
                if (withdrawalData.noteType === 'custom') {
                    customBreakdown.style.display = 'block';
                    mixedSelection.style.display = 'none';
                    resetCustomBreakdown();
                } else if (withdrawalData.noteType === 'mixed') {
                    customBreakdown.style.display = 'none';
                    mixedSelection.style.display = 'block';
                    resetMixedSelection();
                    calculateAutomaticBreakdown();
                } else {
                    customBreakdown.style.display = 'none';
                    mixedSelection.style.display = 'none';
                    calculateAutomaticBreakdown();
                }
                
                updatePreview();
            });
        });
        
        // Mixed note checkbox selection
        denominations.forEach(denomination => {
            const checkbox = document.getElementById(`mix-${denomination}`);
            if (checkbox) {
                checkbox.addEventListener('change', function() {
                    updateSelectedDenominations();
                });
            }
        });
        
        // Note control buttons
        denominations.forEach(denomination => {
            document.querySelectorAll(`.note-btn[data-note="${denomination}"]`).forEach(btn => {
                btn.addEventListener('click', function() {
                    const isPlus = this.classList.contains('plus');
                    adjustNoteCount(denomination, isPlus);
                });
            });
        });
        
        // Auto-fill button
        document.getElementById('auto-fill-btn').addEventListener('click', autoFillRemaining);
        
        // Step navigation buttons
        document.getElementById('next-to-note-type').addEventListener('click', goToNoteType);
        document.getElementById('next-to-confirm').addEventListener('click', goToConfirm);
        document.getElementById('confirm-withdrawal').addEventListener('click', processWithdrawal);
        document.getElementById('back-to-amount').addEventListener('click', goToAmount);
        document.getElementById('back-to-note-type').addEventListener('click', goToNoteTypeFromConfirm);
        document.getElementById('new-withdrawal').addEventListener('click', resetWithdrawal);
        
        // Prevent invalid amounts
        customAmountInput.addEventListener('change', function() {
            const amount = parseInt(this.value) || 0;
            if (amount < 10) this.value = 10;
            if (amount > 2000) this.value = 2000;
            if (amount % 10 !== 0) this.value = Math.floor(amount / 10) * 10;
            setWithdrawalAmount(this.value);
        });
    }
    
    function updateSelectedDenominations() {
        const selected = [];
        denominations.forEach(denomination => {
            const checkbox = document.getElementById(`mix-${denomination}`);
            if (checkbox && checkbox.checked) {
                selected.push(denomination);
            }
        });
        withdrawalData.selectedDenominations = selected;
        
        // Recalculate breakdown if we're on mixed notes
        if (withdrawalData.noteType === 'mixed') {
            calculateAutomaticBreakdown();
        }
    }
    
    function resetMixedSelection() {
        // Reset all checkboxes to checked by default
        denominations.forEach(denomination => {
            const checkbox = document.getElementById(`mix-${denomination}`);
            if (checkbox) {
                checkbox.checked = true;
            }
        });
        withdrawalData.selectedDenominations = [...denominations];
    }
    
    function setupQuickAmounts() {
    }
    
    function setWithdrawalAmount(amount) {
        withdrawalData.amount = amount;
        document.getElementById('custom-amount-input').value = amount;
        
        // Clear note breakdown when amount changes
        resetNoteBreakdown();
        
        // Calculate automatic breakdown if not custom
        if (withdrawalData.noteType !== 'custom') {
            calculateAutomaticBreakdown();
        } else {
            resetCustomBreakdown();
        }
    }
    
    function resetNoteBreakdown() {
        withdrawalData.noteBreakdown = {100: 0, 50: 0, 10: 0, 5: 0, 2: 0};
        updateNoteCountsDisplay();
    }
    
    function calculateAutomaticBreakdown() {
        let remaining = withdrawalData.amount;
        const breakdown = {100: 0, 50: 0, 10: 0, 5: 0, 2: 0};
        
        if (withdrawalData.noteType === 'mixed') {
            // Only use selected denominations for mixed notes
            const selectedDenoms = withdrawalData.selectedDenominations || denominations;
            
            if (selectedDenoms.length === 0) {
                // No denominations selected, don't calculate
                withdrawalData.noteBreakdown = breakdown;
                updateNoteCountsDisplay();
                return;
            }
            
            // Sort selected denominations from highest to lowest
            const sortedDenoms = [...selectedDenoms].sort((a, b) => b - a);
            
            // Use a greedy algorithm to distribute notes
            for (const denom of sortedDenoms) {
                if (remaining >= denom) {
                    // Try to use about 30% of remaining amount for this denomination
                    const targetAmount = remaining * 0.3;
                    const maxNotesByAmount = Math.floor(targetAmount / denom);
                    const maxNotesByAvailable = withdrawalData.availableNotes[denom];
                    const notes = Math.min(maxNotesByAmount, maxNotesByAvailable, Math.floor(remaining / denom));
                    
                    if (notes > 0) {
                        breakdown[denom] = notes;
                        remaining -= notes * denom;
                    }
                }
            }
            
            // Distribute any remaining amount
            while (remaining > 0) {
                let distributed = false;
                
                for (const denom of sortedDenoms) {
                    if (remaining >= denom && breakdown[denom] < withdrawalData.availableNotes[denom]) {
                        breakdown[denom]++;
                        remaining -= denom;
                        distributed = true;
                        break;
                    }
                }
                
                if (!distributed) break; // Cannot break down further
            }
            
        } else { // custom - handled separately
            return;
        }
        
        withdrawalData.noteBreakdown = breakdown;
        updateNoteCountsDisplay();
    }
    
    function resetCustomBreakdown() {
        withdrawalData.noteBreakdown = {100: 0, 50: 0, 10: 0, 5: 0, 2: 0};
        updateNoteCountsDisplay();
        updateCustomBreakdownSummary();
    }
    
    function adjustNoteCount(denomination, isPlus) {
        const current = withdrawalData.noteBreakdown[denomination];
        const available = withdrawalData.availableNotes[denomination];
        const remainingAmount = getRemainingAmount();
        
        if (isPlus) {
            // Check if adding this note would exceed available notes or total amount
            if (current < available && (denomination <= remainingAmount || remainingAmount === 0)) {
                withdrawalData.noteBreakdown[denomination]++;
            }
        } else {
            if (current > 0) {
                withdrawalData.noteBreakdown[denomination]--;
            }
        }
        
        updateNoteCountDisplay(denomination);
        updateCustomBreakdownSummary();
    }
    
    function updateNoteCountsDisplay() {
        denominations.forEach(denomination => {
            updateNoteCountDisplay(denomination);
        });
    }
    
    function updateNoteCountDisplay(denomination) {
        const count = withdrawalData.noteBreakdown[denomination];
        const total = count * denomination;
        
        document.getElementById(`count-${denomination}`).textContent = count;
        document.getElementById(`total-${denomination}`).textContent = `$${total}`;
    }
    
    function updateCustomBreakdownSummary() {
        const totalSelected = getTotalSelected();
        const remaining = withdrawalData.amount - totalSelected;
        
        document.getElementById('selected-total').textContent = `$${totalSelected}`;
        document.getElementById('remaining-amount').textContent = `$${remaining}`;
        
        // Update button state
        const autoFillBtn = document.getElementById('auto-fill-btn');
        if (remaining > 0) {
            autoFillBtn.disabled = false;
            autoFillBtn.textContent = 'Auto Fill Remaining';
        } else {
            autoFillBtn.disabled = true;
            autoFillBtn.textContent = 'Perfect Amount!';
        }
    }
    
    function getTotalSelected() {
        return denominations.reduce((total, denomination) => {
            return total + (withdrawalData.noteBreakdown[denomination] * denomination);
        }, 0);
    }
    
    function getRemainingAmount() {
        return withdrawalData.amount - getTotalSelected();
    }
    
    function autoFillRemaining() {
        let remaining = getRemainingAmount();
        
        // Try to fill with largest notes first
        denominations.sort((a, b) => b - a).forEach(denomination => {
            while (remaining >= denomination && 
                   withdrawalData.noteBreakdown[denomination] < withdrawalData.availableNotes[denomination]) {
                withdrawalData.noteBreakdown[denomination]++;
                remaining -= denomination;
            }
        });
        
        updateNoteCountsDisplay();
        updateCustomBreakdownSummary();
    }
    
    function goToNoteType() {
        if (withdrawalData.amount < 10) {
            showErrorModal('Please enter an amount of at least $10.');
            return;
        }
        
        if (withdrawalData.amount > 2000) {
            showErrorModal('Maximum withdrawal amount is $2,000.');
            return;
        }
        
        if (withdrawalData.amount % 10 !== 0) {
            showErrorModal('Amount must be in multiples of $10.');
            return;
        }
        
        if (withdrawalData.amount > withdrawalData.accountBalances[withdrawalData.account]) {
            showErrorModal('Insufficient funds in selected account.');
            return;
        }
        
        // Calculate initial breakdown based on selected note type
        if (withdrawalData.noteType !== 'custom') {
            calculateAutomaticBreakdown();
        }
        
        updateStep('step-note-type');
    }
    
    function goToConfirm() {
        const totalSelected = getTotalSelected();
        
        if (withdrawalData.noteType === 'custom' && totalSelected !== withdrawalData.amount) {
            showErrorModal(`Selected notes total $${totalSelected}. Please adjust to match withdrawal amount of $${withdrawalData.amount}.`);
            return;
        }
        
        // Validate mixed selection has at least one denomination selected
        if (withdrawalData.noteType === 'mixed') {
            const selectedDenoms = withdrawalData.selectedDenominations || [];
            if (selectedDenoms.length === 0) {
                showErrorModal('Please select at least one note denomination for mixed notes.');
                return;
            }
        }
        
        updateSummary();
        updatePreview();
        updateStep('step-confirm');
    }
    
    function goToAmount() {
        updateStep('step-amount');
    }
    
    function goToNoteTypeFromConfirm() {
        updateStep('step-note-type');
    }
    
    function updateStep(stepId) {
        // Hide all steps
        document.querySelectorAll('.step-section').forEach(step => {
            step.classList.remove('active');
        });
        
        // Show target step
        document.getElementById(stepId).classList.add('active');
    }
    
    function updateStepDisplay() {
        // Initial step is amount selection
        updateStep('step-amount');
    }
    
    function updateSummary() {
        document.getElementById('summary-amount').textContent = `$${withdrawalData.amount}`;
        document.getElementById('summary-account').textContent = 
            withdrawalData.account === 'savings' ? 'Savings Account' : 'Current Account';
        document.getElementById('summary-note-type').textContent = 
            getNoteTypeDisplayName(withdrawalData.noteType);
    }
    
    function getNoteTypeDisplayName(type) {
        const names = {
            'mixed': 'Mixed Notes',
            'custom': 'Custom Breakdown'
        };
        return names[type] || type;
    }
    
    function updatePreview() {
        const previewGrid = document.getElementById('preview-grid');
        previewGrid.innerHTML = '';
        
        denominations.forEach(denomination => {
            const count = withdrawalData.noteBreakdown[denomination];
            if (count > 0) {
                const previewItem = document.createElement('div');
                previewItem.className = 'preview-item';
                previewItem.innerHTML = `
                    <span class="preview-denomination">$${denomination}</span>
                    <span class="preview-count">${count}</span>
                `;
                previewGrid.appendChild(previewItem);
            }
        });
        
        // If no notes selected, show message
        if (previewGrid.children.length === 0) {
            previewGrid.innerHTML = '<div class="preview-item" style="grid-column: 1 / -1; padding: 20px; color: #666;">No notes selected</div>';
        }
    }
    
    function processWithdrawal() {
        // Simulate withdrawal processing
        showProcessingModal();
        
        setTimeout(() => {
            // Update account balance
            withdrawalData.accountBalances[withdrawalData.account] -= withdrawalData.amount;
            
            // Show success screen
            updateStep('step-success');
            
            // Close processing modal
            closeCurrentModal();
        }, 2000);
    }
    
    
    function resetWithdrawal() {
        // Reset withdrawal data
        withdrawalData.amount = 0;
        withdrawalData.account = 'savings';
        withdrawalData.noteType = 'mixed';
        withdrawalData.selectedDenominations = [...denominations];
        withdrawalData.noteBreakdown = {100: 0, 50: 0, 10: 0, 5: 0, 2: 0};
        withdrawalData.transactionId = generateTransactionId();
        
        // Reset UI
        document.getElementById('custom-amount-input').value = '';
        document.querySelectorAll('.account-option').forEach(opt => opt.classList.remove('active'));
        document.querySelector('.account-option[data-account="savings"]').classList.add('active');
        document.querySelectorAll('.note-type-option').forEach(opt => opt.classList.remove('active'));
        document.querySelector('.note-type-option[data-type="mixed"]').classList.add('active');
        
        resetMixedSelection();
        resetNoteBreakdown();
        updateStep('step-amount');
    }
    
    function generateTransactionId() {
        const date = new Date();
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `OCBC-CW-${date.getFullYear()}${(date.getMonth()+1).toString().padStart(2,'0')}${date.getDate().toString().padStart(2,'0')}-${random}`;
    }
    
    // Modal functions
    function showErrorModal(message) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header error">
                    <h3>Error</h3>
                    <span class="close-modal" onclick="this.parentElement.parentElement.parentElement.remove()">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="error-content">
                        <div class="error-icon">❌</div>
                        <div class="error-message">${message}</div>
                    </div>
                    <div class="modal-actions">
                        <button class="btn-primary" onclick="window.location.href='cash-withdrawal.html'">OK</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    function showProcessingModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Processing Withdrawal</h3>
                </div>
                <div class="modal-body">
                    <div class="processing-content">
                        <div class="loading-spinner"></div>
                        <div class="processing-message">Please wait while we process your withdrawal...</div>
                        <div class="cash-animation">
                            <div class="cash-notes">💵</div>
                            <div class="cash-notes">💵</div>
                            <div class="cash-notes">💵</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    function closeCurrentModal() {
        const modal = document.querySelector('.modal');
        if (modal) {
            modal.remove();
        }
    }
    
    // Add modal styles to page
    addModalStyles();
});

function addModalStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .modal {
            display: block;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(5px);
        }
        
        .modal-content {
            background-color: white;
            margin: 10% auto;
            padding: 0;
            border-radius: 15px;
            width: 90%;
            max-width: 400px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            animation: modalSlideIn 0.3s ease;
        }
        
        @keyframes modalSlideIn {
            from { opacity: 0; transform: translateY(-50px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .modal-header {
            background: linear-gradient(135deg, #ED2722);
            color: white;
            padding: 20px 25px;
            border-radius: 15px 15px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .modal-header.error {
            background: linear-gradient(135deg, #e17055, #d63031);
        }
        
        .modal-header h3 {
            margin: 0;
            font-size: 20px;
        }
        
        .close-modal {
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
            transition: color 0.3s ease;
        }
        
        .close-modal:hover {
            color: #e74c3c;
        }
        
        .modal-body {
            padding: 25px;
        }
        
        .error-content, .processing-content {
            text-align: center;
            padding: 20px 0;
        }
        
        .error-icon {
            font-size: 60px;
            margin-bottom: 20px;
            color: #e74c3c;
        }
        
        .error-message {
            font-size: 16px;
            line-height: 1.6;
            color: #666;
            margin-bottom: 20px;
        }
        
        .processing-message {
            font-size: 16px;
            color: #666;
            margin: 20px 0;
        }
        
        .loading-spinner {
            width: 50px;
            height: 50px;
            border: 5px solid #f3f3f3;
            border-top: 5px solid #ED2722;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .cash-animation {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-top: 20px;
        }
        
        .cash-notes {
            font-size: 40px;
            animation: cashFloat 2s ease-in-out infinite;
        }
        
        .cash-notes:nth-child(2) {
            animation-delay: 0.2s;
        }
        
        .cash-notes:nth-child(3) {
            animation-delay: 0.4s;
        }
        
        @keyframes cashFloat {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
        }
        
        .modal-actions {
            display: flex;
            justify-content: center;
            margin-top: 20px;
        }
            
        .header-translate {
            position: absolute;
            right: 10px;
            top: 10%;
            transform: translateY(-50%);
        }

        .header-translate .goog-te-gadget-simple {
            background: rgba(255, 255, 255, 0.2) !important;
            border: 1px solid rgba(255, 255, 255, 0.3) !important;
            color: white !important;
            border-radius: 4px !important;
            padding: 6px 10px !important;
        }

        .header-translate .goog-te-menu-value span {
            color: white !important;
        }

        .header-translate .goog-te-menu-value span:first-child {
            color: #ffd700 !important;
        }

        @media (max-width: 768px) {
            .header-translate {
                position: relative;
                right: auto;
                top: auto;
                transform: none;
                margin-top: 10px;
                width: 100%;
                text-align: center;
            }
        }
    `;
    document.head.appendChild(style);
}