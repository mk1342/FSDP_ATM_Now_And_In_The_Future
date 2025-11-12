document.addEventListener('DOMContentLoaded', function() {
    console.log('Transfer Confirmation page loaded');
    
    const transactionData = {
        reference: 'OCBC202411150001234',
        amount: '50.00',
        fromAccount: 'Savings Account (***-1234)',
        toAccount: 'John Doe (OCBC ***-7890)',
        date: '15 November 2024, 14:30',
        status: 'Completed',
        newBalance: '10,950.75'
    };
    
    const transactionDetails = document.getElementById('transactionDetails');
    const availableBalance = document.getElementById('availableBalance');
    const printReceiptBtn = document.getElementById('printReceiptBtn');
    const anotherTransferBtn = document.getElementById('anotherTransferBtn');
    const mainMenuBtn = document.getElementById('mainMenuBtn');
    
    function populateTransactionDetails() {
        transactionDetails.innerHTML = `
            <div class="detail-item">
                <span class="detail-label">Transaction Reference</span>
                <span class="detail-value">${transactionData.reference}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Amount</span>
                <span class="detail-value amount">S$ ${transactionData.amount}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">From Account</span>
                <span class="detail-value">${transactionData.fromAccount}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">To Account</span>
                <span class="detail-value">${transactionData.toAccount}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Transaction Date</span>
                <span class="detail-value">${transactionData.date}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Status</span>
                <span class="detail-value status completed">${transactionData.status}</span>
            </div>
        `;
        
        availableBalance.textContent = `S$ ${transactionData.newBalance}`;
    }
    
    printReceiptBtn.addEventListener('click', printReceipt);
    anotherTransferBtn.addEventListener('click', makeAnotherTransfer);
    mainMenuBtn.addEventListener('click', goToMainMenu);
    
    populateTransactionDetails();
    
    saveTransactionToHistory();
});

function printReceipt() {
    const receiptSection = document.getElementById('receiptSection');
    const printableReceipt = document.getElementById('printableReceipt');
    
    printableReceipt.innerHTML = `
        <div class="receipt-header">
            <h3>OCBC BANK</h3>
            <p>Funds Transfer Receipt</p>
        </div>
        <div class="receipt-details">
            <div class="receipt-item">
                <span>Reference No:</span>
                <span>OCBC202411150001234</span>
            </div>
            <div class="receipt-item">
                <span>Date & Time:</span>
                <span>15 Nov 2024, 14:30</span>
            </div>
            <div class="receipt-item">
                <span>From Account:</span>
                <span>***-1234</span>
            </div>
            <div class="receipt-item">
                <span>To Account:</span>
                <span>John Doe (***-7890)</span>
            </div>
            <div class="receipt-item">
                <span>Amount:</span>
                <span><strong>S$ 50.00</strong></span>
            </div>
            <div class="receipt-item">
                <span>Status:</span>
                <span>Completed</span>
            </div>
            <div class="receipt-item">
                <span>Available Balance:</span>
                <span>S$ 10,950.75</span>
            </div>
        </div>
        <div class="receipt-footer">
            <p>Thank you for banking with OCBC</p>
            <p>Visit us at www.ocbc.com</p>
        </div>
    `;
    
    receiptSection.style.display = 'block';
    
    setTimeout(() => {
        const originalContent = document.body.innerHTML;
        const receiptContent = printableReceipt.innerHTML;
        
        document.body.innerHTML = `
            <div style="padding: 20px; font-family: Arial, sans-serif;">
                ${receiptContent}
            </div>
        `;
        
        window.print();
        
        document.body.innerHTML = originalContent;
        
        document.getElementById('printReceiptBtn').addEventListener('click', printReceipt);
        document.getElementById('anotherTransferBtn').addEventListener('click', makeAnotherTransfer);
        document.getElementById('mainMenuBtn').addEventListener('click', goToMainMenu);
        
        receiptSection.style.display = 'none';
    }, 500);
}

function makeAnotherTransfer() {
    const button = document.getElementById('anotherTransferBtn');
    const originalText = button.textContent;
    button.textContent = 'Redirecting...';
    button.disabled = true;
    
    setTimeout(() => {
        alert('Redirecting to Transfer page...');
        history.back();
    }, 1000);
}

function goToMainMenu() {
    const button = document.getElementById('mainMenuBtn');
    const originalText = button.textContent;
    button.textContent = 'Redirecting...';
    button.disabled = true;
    
    setTimeout(() => {
        alert('Returning to Main Menu...');
        history.back();
    }, 1000);
}

function saveTransactionToHistory() {
    const transactionHistory = JSON.parse(localStorage.getItem('transactionHistory') || '[]');
    
    const newTransaction = {
        id: Date.now(),
        type: 'transfer',
        amount: 50.00,
        fromAccount: 'Savings Account',
        toAccount: 'John Doe',
        date: new Date().toISOString(),
        status: 'completed',
        reference: 'OCBC202411150001234'
    };
    
    transactionHistory.unshift(newTransaction);
    
    if (transactionHistory.length > 50) {
        transactionHistory.pop();
    }
    
    localStorage.setItem('transactionHistory', JSON.stringify(transactionHistory));
    console.log('Transaction saved to history:', newTransaction);
}

