document.addEventListener('DOMContentLoaded', function() {
    console.log('Manage Investments page loaded');
    
    const investmentActions = [
        {
            id: 1,
            icon: '📈',
            title: 'Buy Stocks',
            description: 'Purchase shares in Singapore and international markets',
            action: 'buyStocks'
        },
        {
            id: 2,
            icon: '📉',
            title: 'Sell Stocks',
            description: 'Sell your existing stock holdings',
            action: 'sellStocks'
        },
        {
            id: 3,
            icon: '🏦',
            title: 'Unit Trusts',
            description: 'Invest in managed fund portfolios',
            action: 'unitTrusts'
        },
        {
            id: 4,
            icon: '📊',
            title: 'Portfolio Analysis',
            description: 'View detailed performance reports',
            action: 'portfolioAnalysis'
        }
    ];
    
    const recentInvestments = [
        {
            id: 1,
            stockName: 'DBS Group Holdings',
            transactionType: 'buy',
            quantity: '100 shares',
            date: '10 Nov 2024',
            amount: 'S$ 3,450.00'
        },
        {
            id: 2,
            stockName: 'OCBC Blue Chip Fund',
            transactionType: 'buy',
            quantity: '500 units',
            date: '05 Nov 2024',
            amount: 'S$ 2,500.00'
        },
        {
            id: 3,
            stockName: 'Singapore Airlines',
            transactionType: 'sell',
            quantity: '50 shares',
            date: '01 Nov 2024',
            amount: 'S$ 1,850.00'
        }
    ];
    
    const actionGrid = document.getElementById('actionGrid');
    const investmentsList = document.getElementById('investmentsList');
    
    function populateInvestmentActions() {
        actionGrid.innerHTML = '';
        
        investmentActions.forEach(action => {
            const actionCard = document.createElement('div');
            actionCard.className = 'action-card';
            actionCard.innerHTML = `
                <div class="action-icon">${action.icon}</div>
                <h4>${action.title}</h4>
                <p>${action.description}</p>
            `;
            actionCard.addEventListener('click', () => handleInvestmentAction(action.action));
            actionGrid.appendChild(actionCard);
        });
    }
    
    function populateRecentInvestments() {
        investmentsList.innerHTML = '';
        
        recentInvestments.forEach(investment => {
            const investmentItem = document.createElement('div');
            investmentItem.className = 'investment-item';
            investmentItem.innerHTML = `
                <div class="investment-details">
                    <span class="stock-name">${investment.stockName}</span>
                    <span class="transaction-type ${investment.transactionType}">${investment.transactionType.toUpperCase()}</span>
                </div>
                <div class="investment-meta">
                    <span class="quantity">${investment.quantity}</span>
                    <span class="date">${investment.date}</span>
                </div>
                <span class="investment-amount">${investment.amount}</span>
            `;
            investmentItem.addEventListener('click', () => showInvestmentDetails(investment));
            investmentsList.appendChild(investmentItem);
        });
    }
    
    populateInvestmentActions();
    populateRecentInvestments();
    setInterval(updatePortfolioValue, 30000);
});

function handleInvestmentAction(action) {
    switch(action) {
        case 'buyStocks':
            showBuyStocks();
            break;
        case 'sellStocks':
            showSellStocks();
            break;
        case 'unitTrusts':
            showUnitTrusts();
            break;
        case 'portfolioAnalysis':
            showPortfolioAnalysis();
            break;
        default:
            console.log('Unknown action:', action);
    }
}

function showBuyStocks() {
    alert('Redirecting to Stock Purchase page...\n\nAvailable features:\n• Search stocks\n• View real-time prices\n• Place buy orders\n• Portfolio allocation');
}

function showSellStocks() {
    alert('Redirecting to Stock Sales page...\n\nAvailable features:\n• View current holdings\n• Check profit/loss\n• Place sell orders\n• Transaction history');
}

function showUnitTrusts() {
    alert('Redirecting to Unit Trusts page...\n\nAvailable features:\n• Browse funds\n• Risk assessment\n• Performance charts\n• Investment calculator');
}

function showPortfolioAnalysis() {
    alert('Generating portfolio analysis report...\n\nReport includes:\n• Performance overview\n• Asset allocation\n• Risk analysis\n• Recommendations');
}

function showInvestmentDetails(investment) {
    alert(`Investment Details:\n\nStock: ${investment.stockName}\nTransaction: ${investment.transactionType.toUpperCase()}\nQuantity: ${investment.quantity}\nDate: ${investment.date}\nAmount: ${investment.amount}`);
}

function updatePortfolioValue() {
    console.log('Updating portfolio value...');

}