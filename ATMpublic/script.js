class WelcomeATM {
    constructor() {
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.querySelectorAll('.amount-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const amount = e.target.dataset.amount;
                this.handleQuickAmount(amount);
            });
        });
        document.getElementById('other-amount').addEventListener('click', () => {
            alert('Other amount feature would open here');
        });
        document.querySelectorAll('.service-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const service = e.target.dataset.service;
                this.handleServiceSelection(service);
            });
        });
        document.querySelector('.cancel-btn').addEventListener('click', () => {
            this.cancelTransaction();
        });
        document.querySelector('.clear-btn').addEventListener('click', () => {
            this.clearInput();
        });
        document.querySelector('.enter-btn').addEventListener('click', () => {
            this.enterAction();
        });
    }

    handleQuickAmount(amount) {
        alert(`Withdrawing $${amount}. This would proceed to transaction screen.`);
    }

    handleServiceSelection(service) {
        switch(service) {
            case 'activate-card':
                alert('Card activation service selected');
                break;
            case 'balance':
                alert('Balance enquiry selected');
                break;
        }
    }

    cancelTransaction() {
        if(confirm('Cancel current transaction?')) {
            alert('Transaction cancelled');
        }
    }

    clearInput() {
        console.log('Input cleared');
    }

    enterAction() {
        console.log('Enter action triggered');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new WelcomeATM();
});

class MoreServicesATM {
    constructor() {
        this.initializeEventListeners();
    }
    initializeEventListeners() {
        document.querySelectorAll('.service-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const serviceText = e.currentTarget.querySelector('h3').textContent;
                this.handleServiceSelection(serviceText);
            });
        });
    }

    handleServiceSelection(service) {
        console.log(`Service selected: ${service}`);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MoreServicesATM();
});

function processTransfer() {
    const confirmBtn = document.querySelector('.confirm-btn');
    const originalText = confirmBtn.textContent;
    confirmBtn.textContent = 'Processing...';
    confirmBtn.disabled = true;
    setTimeout(() => {
        alert('Transfer completed successfully!');
        confirmBtn.textContent = originalText;
        confirmBtn.disabled = false;
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }, 2000);
}

class TransferConfirmation {
    constructor() {
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                processTransfer();
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TransferConfirmation();
});