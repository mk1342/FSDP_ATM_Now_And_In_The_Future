document.addEventListener('DOMContentLoaded', function() {
    console.log('Bill Payment page loaded');
    
    const savedBillers = [
        { id: 1, name: 'SP Group', account: '78901234', type: 'utilities' },
        { id: 2, name: 'Singtel', account: '56789012', type: 'telecom' },
        { id: 3, name: 'IRAS', account: 'S1234567A', type: 'tax' }
    ];
    
    const paymentForm = document.getElementById('paymentForm');
    const billerList = document.getElementById('billerList');
    
    function populateSavedBillers() {
        billerList.innerHTML = '';
        
        savedBillers.forEach(biller => {
            const billerItem = document.createElement('div');
            billerItem.className = 'biller-item';
            billerItem.innerHTML = `
                <div class="biller-info">
                    <span class="biller-name">${biller.name}</span>
                    <span class="biller-account">ACC-${biller.account}</span>
                </div>
                <button class="btn-small use" onclick="useSavedBiller(${biller.id})">Use</button>
            `;
            billerList.appendChild(billerItem);
        });
    }
    
    paymentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            billType: document.getElementById('bill-type').value,
            biller: document.getElementById('biller').value,
            accountNumber: document.getElementById('account-number').value,
            amount: document.getElementById('amount').value,
            fromAccount: document.getElementById('from-account').value,
            paymentDate: document.getElementById('payment-date').value
        };
        
        if (validateForm(formData)) {
            processBillPayment(formData);
        }
    });
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('payment-date').min = today;
    document.getElementById('payment-date').value = today;
    
    populateSavedBillers();
});

function validateForm(formData) {
    if (!formData.billType) {
        alert('Please select a bill type.');
        return false;
    }
    
    if (!formData.biller) {
        alert('Please select a biller.');
        return false;
    }
    
    if (!formData.accountNumber) {
        alert('Please enter account number.');
        return false;
    }
    
    if (!formData.amount || formData.amount <= 0) {
        alert('Please enter a valid amount.');
        return false;
    }
    
    return true;
}

function processBillPayment(formData) {
    console.log('Processing bill payment:', formData);
    
    const submitBtn = document.querySelector('.btn-primary');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Processing...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        alert(`Bill payment of S$ ${formData.amount} to ${formData.biller} processed successfully!`);

        document.getElementById('paymentForm').reset();
        
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        history.back();
    }, 2000);
}

function useSavedBiller(billerId) {
    const billers = [
        { id: 1, name: 'SP Group', account: '78901234', type: 'utilities' },
        { id: 2, name: 'Singtel', account: '56789012', type: 'telecom' },
        { id: 3, name: 'IRAS', account: 'S1234567A', type: 'tax' }
    ];
    
    const biller = billers.find(b => b.id === billerId);
    
    if (biller) {
        document.getElementById('bill-type').value = biller.type;
        document.getElementById('biller').value = biller.name.toLowerCase().replace(' ', '-');
        document.getElementById('account-number').value = biller.account;

        document.querySelector('.payment-form').scrollIntoView({ 
            behavior: 'smooth' 
        });
    }
}