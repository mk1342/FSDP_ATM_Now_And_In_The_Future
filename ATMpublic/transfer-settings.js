document.addEventListener('DOMContentLoaded', function() {
    console.log('Transfer Settings page loaded');
    
    const beneficiaries = [
        { id: 1, name: 'John Lim', bank: 'OCBC', account: '7890' },
        { id: 2, name: 'Sarah Tan', bank: 'DBS', account: '4567' },
        { id: 3, name: 'Michael Chen', bank: 'UOB', account: '2345' }
    ];
    
    const securityOptions = [
        { id: 1, label: 'Require OTP for all transfers', checked: true },
        { id: 2, label: 'Email notification for transfers above S$ 1,000', checked: true },
        { id: 3, label: 'SMS notification for all transfers', checked: false },
        { id: 4, label: 'Approve large transfers via mobile app', checked: true }
    ];
    
    const beneficiariesList = document.getElementById('beneficiariesList');
    const securityOptionsContainer = document.getElementById('securityOptions');
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');
    const addBeneficiaryBtn = document.getElementById('addBeneficiaryBtn');
    
    function populateBeneficiaries() {
        beneficiariesList.innerHTML = '';
        
        beneficiaries.forEach(beneficiary => {
            const beneficiaryItem = document.createElement('div');
            beneficiaryItem.className = 'beneficiary-item';
            beneficiaryItem.innerHTML = `
                <div class="beneficiary-info">
                    <span class="beneficiary-name">${beneficiary.name}</span>
                    <span class="bank-account">${beneficiary.bank} ***-${beneficiary.account}</span>
                </div>
                <div class="beneficiary-actions">
                    <button class="btn-small edit" onclick="editBeneficiary(${beneficiary.id})">Edit</button>
                    <button class="btn-small delete" onclick="deleteBeneficiary(${beneficiary.id})">Delete</button>
                </div>
            `;
            beneficiariesList.appendChild(beneficiaryItem);
        });
    }
    
    function populateSecurityOptions() {
        securityOptionsContainer.innerHTML = '';
        
        securityOptions.forEach(option => {
            const securityItem = document.createElement('div');
            securityItem.className = 'security-item';
            securityItem.innerHTML = `
                <label class="checkbox-label">
                    <input type="checkbox" ${option.checked ? 'checked' : ''} id="security-${option.id}">
                    ${option.label}
                </label>
            `;
            securityOptionsContainer.appendChild(securityItem);
        });
    }
    
    saveSettingsBtn.addEventListener('click', function() {
        saveSettings();
    });
    
    addBeneficiaryBtn.addEventListener('click', function() {
        addBeneficiary();
    });
    
    populateBeneficiaries();
    populateSecurityOptions();
    
    loadSavedSettings();
});

function saveSettings() {
    const dailyLimit = document.getElementById('daily-limit').value;
    const perTransactionLimit = document.getElementById('per-transaction-limit').value;
    
    const securitySettings = {};
    for (let i = 1; i <= 4; i++) {
        const checkbox = document.getElementById(`security-${i}`);
        if (checkbox) {
            securitySettings[`security${i}`] = checkbox.checked;
        }
    }
    
    if (dailyLimit < 1000 || dailyLimit > 50000) {
        alert('Daily limit must be between S$ 1,000 and S$ 50,000');
        return;
    }
    
    if (perTransactionLimit < 500 || perTransactionLimit > 10000) {
        alert('Per transaction limit must be between S$ 500 and S$ 10,000');
        return;
    }
    
    if (parseInt(perTransactionLimit) > parseInt(dailyLimit)) {
        alert('Per transaction limit cannot exceed daily limit');
        return;
    }
    
    const settings = {
        dailyLimit: dailyLimit,
        perTransactionLimit: perTransactionLimit,
        securitySettings: securitySettings,
        lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem('transferSettings', JSON.stringify(settings));
    
    const saveBtn = document.getElementById('saveSettingsBtn');
    const originalText = saveBtn.textContent;
    saveBtn.textContent = 'Saving...';
    saveBtn.disabled = true;
    
    setTimeout(() => {
        alert(`Settings saved successfully!\n\nDaily Limit: S$ ${dailyLimit}\nPer Transaction Limit: S$ ${perTransactionLimit}`);
        
        saveBtn.textContent = originalText;
        saveBtn.disabled = false;
        
        history.back();
    }, 1500);
}

function loadSavedSettings() {
    const savedSettings = localStorage.getItem('transferSettings');
    
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        
        document.getElementById('daily-limit').value = settings.dailyLimit;
        document.getElementById('per-transaction-limit').value = settings.perTransactionLimit;
        
        if (settings.securitySettings) {
            Object.keys(settings.securitySettings).forEach((key, index) => {
                const checkbox = document.getElementById(`security-${index + 1}`);
                if (checkbox) {
                    checkbox.checked = settings.securitySettings[key];
                }
            });
        }
    }
}

function addBeneficiary() {
    const name = prompt('Enter beneficiary name:');
    if (!name) return;
    
    const bank = prompt('Enter bank name (OCBC, DBS, UOB, etc.):');
    if (!bank) return;
    
    const account = prompt('Enter account number (last 4 digits):');
    if (!account || account.length !== 4) {
        alert('Please enter a valid 4-digit account number');
        return;
    }
    
    alert(`Beneficiary "${name}" added successfully!\n\nBank: ${bank}\nAccount: ***-${account}`);
    

    location.reload();
}

function editBeneficiary(id) {
    alert(`Editing beneficiary ID: ${id}`);
}

function deleteBeneficiary(id) {
    if (confirm('Are you sure you want to delete this beneficiary?')) {

        alert(`Beneficiary ID: ${id} deleted successfully`);
        location.reload();
    }
}