document.addEventListener('DOMContentLoaded', function() {
    console.log('CPF Services page loaded');
    
    const cpfTransactions = [
        {
            id: 1,
            description: 'Monthly Employer Contribution',
            type: 'credit',
            amount: 1850.00,
            account: 'OA',
            date: '01 Dec 2024',
            status: 'completed'
        },
        {
            id: 2,
            description: 'Housing Loan Payment',
            type: 'debit',
            amount: 1250.00,
            account: 'OA',
            date: '28 Nov 2024',
            status: 'completed'
        },
        {
            id: 3,
            description: 'Voluntary Contribution',
            type: 'credit',
            amount: 500.00,
            account: 'SA',
            date: '25 Nov 2024',
            status: 'completed'
        },
        {
            id: 4,
            description: 'Medical Expense',
            type: 'debit',
            amount: 320.50,
            account: 'MA',
            date: '20 Nov 2024',
            status: 'completed'
        },
        {
            id: 5,
            description: 'CPF Investment - Unit Trust',
            type: 'debit',
            amount: 2000.00,
            account: 'OA',
            date: '15 Nov 2024',
            status: 'completed'
        }
    ];
    
    const transactionsList = document.getElementById('cpfTransactionsList');
    const serviceCards = document.querySelectorAll('.service-card');
    const contributionForm = document.getElementById('contributionForm');
    
    function populateCPFTransactions() {
        transactionsList.innerHTML = '';
        
        cpfTransactions.forEach(transaction => {
            const transactionItem = document.createElement('div');
            transactionItem.className = 'transaction-item';
            transactionItem.innerHTML = `
                <div class="transaction-details">
                    <span class="transaction-description">${transaction.description}</span>
                    <div class="transaction-meta">
                        <span class="transaction-date">${transaction.date}</span>
                        <span class="transaction-account">${transaction.account}</span>
                        <span class="transaction-status">${transaction.status}</span>
                    </div>
                </div>
                <span class="transaction-amount ${transaction.type}">
                    ${transaction.type === 'credit' ? '+' : '-'}S$ ${transaction.amount.toLocaleString('en-SG', { minimumFractionDigits: 2 })}
                </span>
            `;
            transactionsList.appendChild(transactionItem);
        });
    }
    
    serviceCards.forEach(card => {
        card.addEventListener('click', function() {
            const service = this.dataset.service;
            handleServiceSelection(service);
        });
    });
    
    if (contributionForm) {
        contributionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            processCPFContribution();
        });
    }
    
    populateCPFTransactions();
    
    setInterval(updateCPFBalances, 60000);
});

function handleServiceSelection(service) {
    switch(service) {
        case 'contribution':
            openContributionModal();
            break;
        case 'withdrawal':
            showPropertyWithdrawal();
            break;
        case 'investment':
            showCPFInvestment();
            break;
        case 'housing':
            showHousingLoan();
            break;
        case 'healthcare':
            showHealthcareServices();
            break;
        case 'statement':
            downloadCPFStatement();
            break;
        default:
            console.log('Unknown service:', service);
    }
}

function openContributionModal() {
    const modal = document.getElementById('contributionModal');
    modal.style.display = 'block';
    
    document.getElementById('contributionForm').reset();
    
    document.getElementById('contribution-amount').focus();
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
}

function processCPFContribution() {
    const amount = parseFloat(document.getElementById('contribution-amount').value);
    const account = document.getElementById('cpf-account').value;
    const paymentMethod = document.getElementById('payment-method').value;
    
    if (!amount || !account || !paymentMethod) {
        alert('Please fill in all required fields.');
        return;
    }
    
    if (amount > 37740) {
        alert('Contribution amount exceeds the annual limit of S$ 37,740.');
        return;
    }
    
    if (amount < 1) {
        alert('Please enter a valid contribution amount.');
        return;
    }
    
    const submitBtn = document.querySelector('#contributionForm .btn-primary');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Processing...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        alert(`CPF Contribution Successful!\n\nAmount: S$ ${amount.toLocaleString('en-SG', { minimumFractionDigits: 2 })}\nAccount: ${getAccountFullName(account)}\nPayment Method: ${paymentMethod}\n\nYour contribution will be reflected in your CPF account within 3 working days.`);
        
        closeModal('contributionModal');
        
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        refreshCPFData();
    }, 2000);
}

function getAccountFullName(accountCode) {
    const accounts = {
        'OA': 'Ordinary Account',
        'SA': 'Special Account',
        'MA': 'Medisave Account'
    };
    return accounts[accountCode] || accountCode;
}

function showPropertyWithdrawal() {
    alert('Property Withdrawal Service\n\nThis service allows you to withdraw CPF savings for:\n• Property purchase\n• Mortgage payments\n• Property tax payments\n\nPlease ensure you meet the eligibility criteria before proceeding.');
}

function showCPFInvestment() {
    alert('CPF Investment Scheme\n\nInvest your CPF savings in:\n• Unit Trusts\n• Exchange Traded Funds (ETFs)\n• Bonds\n• Fixed Deposits\n\nNote: Investments are subject to CPFIS guidelines and market risks.');
}

function showHousingLoan() {
    alert('Housing Loan Services\n\nUse your CPF for:\n• HDB loan payments\n• Bank loan payments\n• Property downpayment\n• Stamp duty and legal fees\n\nPlease check your CPF Housing Withdrawal Limit before applying.');
}

function showHealthcareServices() {
    alert('Healthcare Services\n\nUse Medisave for:\n• Hospital bills\n• Surgical procedures\n• Chronic disease management\n• Health screenings\n• Insurance premiums\n\nNote: Certain limits and conditions apply.');
}

function downloadCPFStatement() {
    alert('Generating CPF Statement...');
    
    setTimeout(() => {
        const statementData = {
            period: 'January - December 2024',
            totalBalance: 'S$ 196,300.00',
            transactions: 24,
            generated: new Date().toLocaleString('en-SG')
        };
        
        alert(`CPF Statement Generated!\n\nPeriod: ${statementData.period}\nTotal Balance: ${statementData.totalBalance}\nTransactions: ${statementData.transactions}\nGenerated: ${statementData.generated}\n\nYour statement has been downloaded.`);
        
        console.log('CPF Statement downloaded:', statementData);
    }, 1500);
}

function refreshCPFData() {
    const refreshBtn = document.querySelector('.btn-primary');
    const originalText = refreshBtn.textContent;
    refreshBtn.textContent = 'Refreshing...';
    refreshBtn.disabled = true;
    
    setTimeout(() => {
        updateCPFBalances();
        
        alert('CPF data refreshed successfully!');
        refreshBtn.textContent = originalText;
        refreshBtn.disabled = false;
    }, 2000);
}

function updateCPFBalances() {
    console.log('Updating CPF balances...');
    
    const balanceItems = document.querySelectorAll('.cpf-balance-item:not(.total)');
    balanceItems.forEach(item => {
        const currentAmount = item.querySelector('.balance-amount').textContent;
        const amount = parseFloat(currentAmount.replace(/[^\d.]/g, ''));
        
        const fluctuation = (Math.random() - 0.5) * 10;
        const newAmount = amount + fluctuation;
        
        item.querySelector('.balance-amount').textContent = 
            `S$ ${newAmount.toLocaleString('en-SG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    });
    
    updateTotalBalance();
}

function updateTotalBalance() {
    const balanceItems = document.querySelectorAll('.cpf-balance-item:not(.total)');
    let total = 0;
    
    balanceItems.forEach(item => {
        const amountText = item.querySelector('.balance-amount').textContent;
        const amount = parseFloat(amountText.replace(/[^\d.]/g, ''));
        total += amount;
    });
    
    const totalItem = document.querySelector('.cpf-balance-item.total .balance-amount');
    totalItem.textContent = `S$ ${total.toLocaleString('en-SG', { minimumFractionDigits: 2 })}`;
}

function openCPFWebsite() {
    alert('Opening CPF Board Website...\n\nYou will be redirected to the official CPF website for more information and services.');
}

function showRetirementPlanning() {
    alert('Retirement Planning\n\nPlan for your retirement with:\n• Retirement savings calculator\n• Payout estimates\n• Retirement sum schemes\n• CPF LIFE information\n\nEnsure you meet your Full Retirement Sum for comfortable retirement.');
}

function showCPFCalculator() {
    alert('CPF Calculator\n\nCalculate:\n• Retirement savings\n• Housing affordability\n• Investment returns\n• Healthcare needs\n\nUse our comprehensive calculators to plan your financial future.');
}

function showCPFContact() {
    alert('Contact CPF Board\n\nPhone: 1800-227-1188\nEmail: feedback@cpf.gov.sg\nWebsite: www.cpf.gov.sg\n\nOperating Hours: Mon-Fri, 8am-5:30pm');
}

window.addEventListener('click', function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (modal.style.display === 'block') {
                modal.style.display = 'none';
            }
        });
    }
});