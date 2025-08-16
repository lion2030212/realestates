document.addEventListener('DOMContentLoaded', () => {
    const loginScreen = document.getElementById('login-screen');
    const mainApp = document.getElementById('main-app');
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');
    const addIncomeBtn = document.getElementById('add-income-btn');
    const addExpenseBtn = document.getElementById('add-expense-btn');
    const modal = document.getElementById('modal');
    const closeBtn = document.querySelector('#modal .close-btn');
    const modalTitle = document.getElementById('modal-title');
    const transactionForm = document.getElementById('transaction-form');
    const transactionTypeInput = document.getElementById('transaction-type');
    const transactionIdInput = document.getElementById('transaction-id');
    const transactionsContainer = document.getElementById('transactions-container');
    const totalIncomeSpan = document.getElementById('total-income');
    const totalExpensesSpan = document.getElementById('total-expenses');
    const balanceSpan = document.getElementById('balance');
    const chartCanvas = document.getElementById('myChart');
    const durationFilter = document.getElementById('duration-filter');
    
    const manageUsersBtn = document.getElementById('manage-users-btn');
    const permissionsBtn = document.getElementById('permissions-btn');
    const backupBtn = document.getElementById('backup-btn');

    const usersModal = document.getElementById('users-modal');
    const usersModalCloseBtn = document.querySelector('#users-modal .close-btn');
    const usersListContainer = document.getElementById('users-list-container');
    const addUserForm = document.getElementById('add-user-form');
    const showAddUserFormBtn = document.getElementById('show-add-user-form');
    const newUserRoleInput = document.getElementById('new-user-role');
    const newUsernameInput = document.getElementById('new-username');
    const newPasswordInput = document.getElementById('new-password');
    const newUserDescriptionInput = document.getElementById('new-user-description');
    const saveUserBtn = document.getElementById('save-user-btn');

    const logoutBtn = document.getElementById('logout-btn');
    const userGreetingSpan = document.getElementById('user-greeting');
    const sidebar = document.getElementById('sidebar');
    const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');
    const sidebarCloseBtn = document.getElementById('sidebar-close-btn');

    const notificationsBtn = document.getElementById('notifications-btn');
    const messagesModal = document.getElementById('messages-modal');
    const messagesModalCloseBtn = document.querySelector('#messages-modal .close-btn');
    const notificationBadge = document.getElementById('notification-badge');
    const pendingTransactionsContainer = document.getElementById('pending-transactions-container');
    const noPendingTransactionsMsg = document.getElementById('no-pending-transactions');

    const permissionsModal = document.getElementById('permissions-modal');
    const permissionsModalCloseBtn = document.querySelector('#permissions-modal .close-btn');
    const approvedTransactionsContainer = document.getElementById('approved-transactions-container');
    const noApprovedTransactionsMsg = document.getElementById('no-approved-transactions');

    // Backup Modal Elements
    const backupModal = document.getElementById('backup-modal');
    const backupModalCloseBtn = document.querySelector('#backup-modal .close-btn');
    const createBackupBtn = document.getElementById('create-backup-btn');
    const restoreBackupInput = document.getElementById('restore-backup-input');
    const fileNameDisplay = document.getElementById('file-name-display');

    const chartMenuBtn = document.querySelector('.chart-menu-btn');
    const chartOptions = document.querySelector('.chart-options');
    const chartFilterMonthlyBtn = document.getElementById('chart-filter-monthly');
    const chartFilterYearlyBtn = document.getElementById('chart-filter-yearly');
    let chartFilterType = 'monthly';

    // Advanced Search Elements
    const advancedSearchBtn = document.getElementById('advanced-search-btn');
    const searchActiveBadge = document.getElementById('search-active-badge');
    const advancedSearchModal = document.getElementById('advanced-search-modal');
    const advancedSearchModalCloseBtn = document.querySelector('#advanced-search-modal .close-btn');
    const advancedSearchForm = document.getElementById('advanced-search-form');
    const searchTypeInput = document.getElementById('search-type');
    const searchCategoryInput = document.getElementById('search-category');
    const searchNoteInput = document.getElementById('search-note');
    const searchFromToInput = document.getElementById('search-from-to'); // New field
    const searchUsernameInput = document.getElementById('search-username'); // New field
    const searchFromDateInput = document.getElementById('search-from-date');
    const searchToDateInput = document.getElementById('search-to-date');
    const clearSearchBtn = document.getElementById('clear-search-btn');

    let currentUser = null;
    let isSearchActive = false;

    const monthNames = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
    
    const rolesMap = {
        'manager': 'مدير النظام',
        'admin': 'مشرف محترف',
        'editor': 'مشرف',
        'employee': 'موظف محترف',
        'new_employee': 'موظف',
        'viewer': 'القارئ'
    };

    function getInitialUsers() {
        return [
            { id: 1, username: 'manager', password: 'manager', role: 'manager', description: 'مدير النظام' },
            { id: 2, username: 'admin', password: 'admin', role: 'admin', description: 'مشرف محترف' },
            { id: 3, username: 'editor', password: 'editor', role: 'editor', description: 'مشرف' },
            { id: 4, username: 'employee', password: 'employee', role: 'employee', description: 'موظف محترف' },
            { id: 5, username: 'new_employee', password: 'new_employee', role: 'new_employee', description: 'موظف' },
            { id: 6, username: 'viewer', password: 'viewer', role: 'viewer', description: 'قارئ فقط' }
        ];
    }
    
    function getUsers() {
        const users = JSON.parse(localStorage.getItem('users'));
        if (!users || users.length === 0) {
            const initialUsers = getInitialUsers();
            saveUsers(initialUsers);
            return initialUsers;
        }
        return users;
    }

    function saveUsers(users) {
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    let pendingTransactions = JSON.parse(localStorage.getItem('pendingTransactions')) || [];
    let myChart;

    function saveTransactions() {
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }

    function savePendingTransactions() {
        localStorage.setItem('pendingTransactions', JSON.stringify(pendingTransactions));
        updateNotificationBadge();
    }
    
    durationFilter.value = 'current-month';

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = usernameInput.value;
        const password = passwordInput.value;
        const users = getUsers();
        
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            currentUser = user;
            loginScreen.classList.add('hidden');
            mainApp.classList.remove('hidden');
            errorMessage.style.display = 'none';
            
            userGreetingSpan.textContent = `مرحبا، ${currentUser.username}`;
            
            const isManager = currentUser.role === 'manager';
            const canAdd = ['manager', 'admin', 'editor', 'employee', 'new_employee'].includes(currentUser.role);
            const canApprove = ['manager', 'admin', 'editor'].includes(currentUser.role);

            manageUsersBtn.classList.toggle('hidden', !isManager);
            permissionsBtn.classList.toggle('hidden', !isManager);
            backupBtn.classList.toggle('hidden', !isManager);
            document.querySelector('#advanced-search-modal .manager-only').classList.toggle('hidden', !isManager);


            addIncomeBtn.classList.toggle('hidden', !canAdd);
            addExpenseBtn.classList.toggle('hidden', !canAdd);
            notificationsBtn.classList.toggle('hidden', !canApprove);
            
            applyFilter();
            updateSummary();
            initializeChart();
            updateChart();
            updateNotificationBadge();
        } else {
            errorMessage.textContent = 'اسم المستخدم أو كلمة المرور غير صحيحة.';
            errorMessage.style.display = 'block';
            passwordInput.value = '';
        }
    });

    logoutBtn.addEventListener('click', () => {
        currentUser = null;
        loginScreen.classList.remove('hidden');
        mainApp.classList.add('hidden');
        loginForm.reset();
        sidebar.classList.remove('show');
    });

    sidebarToggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('show');
    });
    
    sidebarCloseBtn.addEventListener('click', () => {
        sidebar.classList.remove('show');
    });
    
    manageUsersBtn.addEventListener('click', () => {
        usersModal.style.display = 'block';
        renderUsersList();
    });

    usersModalCloseBtn.addEventListener('click', () => {
        usersModal.style.display = 'none';
        addUserForm.classList.add('hidden');
        addUserForm.reset();
        showAddUserFormBtn.innerHTML = '<i class="fas fa-plus"></i> إضافة مستخدم جديد';
    });
    
    showAddUserFormBtn.addEventListener('click', () => {
        addUserForm.classList.toggle('hidden');
        if (!addUserForm.classList.contains('hidden')) {
            showAddUserFormBtn.textContent = 'إلغاء';
            saveUserBtn.textContent = 'إضافة';
            addUserForm.reset();
            document.getElementById('new-user-id').value = '';
        } else {
            showAddUserFormBtn.innerHTML = '<i class="fas fa-plus"></i> إضافة مستخدم جديد';
        }
    });

    addUserForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const users = getUsers();
        const newUserId = document.getElementById('new-user-id').value;
        
        const role = newUserRoleInput.value;
        const username = newUsernameInput.value;
        const password = newPasswordInput.value;
        const description = newUserDescriptionInput.value;
        
        if (newUserId) {
            const index = users.findIndex(u => u.id == newUserId);
            if (index !== -1) {
                users[index] = { id: parseInt(newUserId), username, password, role, description };
            }
        } else {
            const isUsernameTaken = users.some(u => u.username === username);
            if (isUsernameTaken) {
                alert('اسم المستخدم موجود بالفعل. اختر اسمًا آخر.');
                return;
            }
            const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
            users.push({ id: newId, username, password, role, description });
        }
        
        saveUsers(users);
        renderUsersList();
        addUserForm.classList.add('hidden');
        addUserForm.reset();
        showAddUserFormBtn.innerHTML = '<i class="fas fa-plus"></i> إضافة مستخدم جديد';
    });
    
    function renderUsersList() {
        const users = getUsers();
        usersListContainer.innerHTML = '';
        users.forEach(user => {
            const userCard = document.createElement('div');
            userCard.className = 'user-card';
            userCard.innerHTML = `
                <div class="user-info-text">
                    <h4>${user.username}</h4>
                    <p><strong>الدور:</strong> ${rolesMap[user.role]}</p>
                    <p><strong>الوصف:</strong> ${user.description || 'لا يوجد'}</p>
                </div>
                <div class="user-actions">
                    <button class="action-btn edit-user-btn" data-id="${user.id}"><i class="fas fa-edit"></i> تعديل</button>
                    <button class="action-btn delete-user-btn" data-id="${user.id}"><i class="fas fa-trash-alt"></i> حذف</button>
                </div>
            `;
            usersListContainer.appendChild(userCard);
        });

        document.querySelectorAll('.edit-user-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const userId = e.target.closest('button').dataset.id;
                const userToEdit = getUsers().find(u => u.id == userId);
                if (userToEdit) {
                    document.getElementById('new-user-id').value = userToEdit.id;
                    newUserRoleInput.value = userToEdit.role;
                    newUsernameInput.value = userToEdit.username;
                    newPasswordInput.value = userToEdit.password;
                    newUserDescriptionInput.value = userToEdit.description;
                    addUserForm.classList.remove('hidden');
                    saveUserBtn.textContent = 'حفظ التعديل';
                    showAddUserFormBtn.textContent = 'إلغاء';
                }
            });
        });

        document.querySelectorAll('.delete-user-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const userId = e.target.closest('button').dataset.id;
                if (confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
                    let users = getUsers();
                    users = users.filter(u => u.id != userId);
                    saveUsers(users);
                    renderUsersList();
                    if (currentUser && currentUser.id == userId) {
                        alert('تم حذف حسابك. سيتم تسجيل الخروج.');
                        window.location.reload();
                    }
                }
            });
        });
    }

    notificationsBtn.addEventListener('click', () => {
        renderPendingTransactions();
        messagesModal.style.display = 'block';
    });

    messagesModalCloseBtn.addEventListener('click', () => {
        messagesModal.style.display = 'none';
    });
    
    permissionsBtn.addEventListener('click', () => {
        renderApprovedTransactions();
        permissionsModal.style.display = 'block';
    });

    permissionsModalCloseBtn.addEventListener('click', () => {
        permissionsModal.style.display = 'none';
    });
    
    function updateNotificationBadge() {
        const count = pendingTransactions.length;
        if (count > 0) {
            notificationBadge.textContent = count;
            notificationBadge.classList.remove('hidden');
        } else {
            notificationBadge.classList.add('hidden');
        }
    }
    
    function renderPendingTransactions() {
        pendingTransactionsContainer.innerHTML = '';
        if (pendingTransactions.length === 0) {
            noPendingTransactionsMsg.classList.remove('hidden');
        } else {
            noPendingTransactionsMsg.classList.add('hidden');
            pendingTransactions.forEach(t => {
                const isEdit = !!t.originalId;
                const card = document.createElement('div');
                card.className = `pending-card ${isEdit ? 'pending-edit-card' : ''}`;
                card.innerHTML = `
                    <div class="card-details">
                        <p><strong>التاريخ:</strong> ${t.date}</p>
                        <p><strong>التصنيف:</strong> ${t.category}</p>
                        <p><strong>المبلغ:</strong> <span class="${t.type}-label">${t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}</span></p>
                        <p><strong>من/إلى:</strong> ${t.fromTo || 'غير محدد'}</p>
                        <p><strong>ملاحظة:</strong> ${t.note || 'لا توجد'}</p>
                        <div class="card-footer">
                            <p><strong>بواسطة:</strong> ${t.lastActionBy.description} (${t.lastActionBy.username})</p>
                            ${isEdit ? '<p class="status-note">طلب تعديل ينتظر الموافقة</p>' : '<p class="status-note">معاملة جديدة بانتظار الموافقة</p>'}
                        </div>
                    </div>
                    <div class="pending-actions">
                        <button class="action-btn income-btn approve-btn" data-id="${t.id}"><i class="fas fa-check"></i> موافقة</button>
                        <button class="action-btn expense-btn reject-btn" data-id="${t.id}"><i class="fas fa-times"></i> رفض</button>
                    </div>
                `;
                pendingTransactionsContainer.appendChild(card);
            });
        }
    }
    
    function renderApprovedTransactions() {
        approvedTransactionsContainer.innerHTML = '';
        const approved = transactions.filter(t => t.approvedBy);
        
        if (approved.length === 0) {
            noApprovedTransactionsMsg.classList.remove('hidden');
        } else {
            noApprovedTransactionsMsg.classList.add('hidden');
            approved.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(t => {
                const card = document.createElement('div');
                card.className = 'approved-card';
                card.innerHTML = `
                    <div class="card-details">
                        <p><strong>التاريخ:</strong> ${t.date}</p>
                        <p><strong>التصنيف:</strong> ${t.category}</p>
                        <p><strong>المبلغ:</strong> <span class="${t.type}-label">${t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}</span></p>
                        <p><strong>من/إلى:</strong> ${t.fromTo || 'غير محدد'}</p>
                        <p><strong>ملاحظة:</strong> ${t.note || 'لا توجد'}</p>
                        <div class="card-footer">
                            <p><strong>أضيفت بواسطة:</strong> ${t.lastActionBy.description} (${t.lastActionBy.username})</p>
                            <p><strong>تمت الموافقة بواسطة:</strong> ${t.approvedBy.description} (${t.approvedBy.username})</p>
                        </div>
                    </div>
                `;
                approvedTransactionsContainer.appendChild(card);
            });
        }
    }

    pendingTransactionsContainer.addEventListener('click', (e) => {
        const approveBtn = e.target.closest('.approve-btn');
        const rejectBtn = e.target.closest('.reject-btn');
        if (approveBtn) {
            const id = parseInt(approveBtn.dataset.id);
            const transactionToApprove = pendingTransactions.find(t => t.id === id);
            if (transactionToApprove) {
                const isEdit = !!transactionToApprove.originalId;

                if (isEdit) {
                    const originalIndex = transactions.findIndex(t => t.id === transactionToApprove.originalId);
                    if (originalIndex !== -1) {
                        transactions[originalIndex] = {
                            ...transactions[originalIndex],
                            date: transactionToApprove.date,
                            category: transactionToApprove.category,
                            amount: transactionToApprove.amount,
                            fromTo: transactionToApprove.fromTo,
                            note: transactionToApprove.note,
                            type: transactionToApprove.type,
                            isEdited: false, // Reset pending state
                            approvedBy: { username: currentUser.username, description: rolesMap[currentUser.role] },
                            // حفظ معلومات من قام بالتعديل
                            lastEditedBy: transactionToApprove.lastActionBy 
                        };
                    }
                } else {
                    transactionToApprove.approvedBy = { username: currentUser.username, description: rolesMap[currentUser.role] };
                    transactions.push(transactionToApprove);
                }

                pendingTransactions = pendingTransactions.filter(t => t.id !== id);
                saveTransactions();
                savePendingTransactions();
                applyFilter();
                updateSummary();
                updateChart();
                renderPendingTransactions();
            }
        } else if (rejectBtn) {
            const id = parseInt(rejectBtn.dataset.id);
            const transactionToReject = pendingTransactions.find(t => t.id === id);
            
            if(transactionToReject && transactionToReject.originalId) {
                const originalTransaction = transactions.find(t => t.id === transactionToReject.originalId);
                if(originalTransaction) {
                    originalTransaction.isEdited = false;
                }
                saveTransactions();
            }

            pendingTransactions = pendingTransactions.filter(t => t.id !== id);
            savePendingTransactions();
            applyFilter();
            renderPendingTransactions();
        }
    });

    function initializeChart() {
        const ctx = chartCanvas.getContext('2d');
        if (myChart) {
            myChart.destroy();
        }
        myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'الدخل',
                        data: [],
                        backgroundColor: 'rgba(46, 204, 113, 0.5)',
                        borderColor: 'rgba(46, 204, 113, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'المصروفات',
                        data: [],
                        backgroundColor: 'rgba(231, 76, 60, 0.5)',
                        borderColor: 'rgba(231, 76, 60, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }

    function updateChart() {
        const incomeData = {};
        const expenseData = {};
        
        const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
        
        sortedTransactions.forEach(t => {
            let key;
            if (chartFilterType === 'yearly') {
                key = t.date.substring(0, 4);
            } else { // monthly
                key = t.date.substring(0, 7);
            }

            if (t.type === 'income') {
                incomeData[key] = (incomeData[key] || 0) + t.amount;
            } else {
                expenseData[key] = (expenseData[key] || 0) + t.amount;
            }
        });
        
        let allMonths = [...new Set([...Object.keys(incomeData), ...Object.keys(expenseData)])].sort();
        
        if (chartFilterType === 'monthly' && allMonths.length > 6) {
            allMonths = allMonths.slice(-6);
        }

        const incomeValues = allMonths.map(month => incomeData[month] || 0);
        const expenseValues = allMonths.map(month => expenseData[month] || 0);

        myChart.data.labels = allMonths;
        myChart.data.datasets[0].data = incomeValues;
        myChart.data.datasets[1].data = expenseValues;
        myChart.update();
    }
    
    chartMenuBtn.addEventListener('click', () => {
        chartOptions.classList.toggle('hidden');
    });

    chartFilterMonthlyBtn.addEventListener('click', () => {
        chartFilterType = 'monthly';
        chartOptions.classList.add('hidden');
        chartFilterMonthlyBtn.classList.add('active');
        chartFilterYearlyBtn.classList.remove('active');
        updateChart();
    });

    chartFilterYearlyBtn.addEventListener('click', () => {
        chartFilterType = 'yearly';
        chartOptions.classList.add('hidden');
        chartFilterYearlyBtn.classList.add('active');
        chartFilterMonthlyBtn.classList.remove('active');
        updateChart();
    });
    
    chartFilterMonthlyBtn.classList.add('active');

    function updateSummary() {
        let totalIncome = 0;
        let totalExpenses = 0;

        transactions.forEach(transaction => {
            if (transaction.type === 'income') {
                totalIncome += transaction.amount;
            } else {
                totalExpenses += transaction.amount;
            }
        });

        const balance = totalIncome - totalExpenses;

        totalIncomeSpan.textContent = totalIncome.toFixed(2);
        totalExpensesSpan.textContent = totalExpenses.toFixed(2);
        balanceSpan.textContent = balance.toFixed(2);
        balanceSpan.style.color = balance >= 0 ? 'var(--success-color)' : 'var(--danger-color)';
    }
    
    function createTransactionCard(transaction) {
        const transactionCard = document.createElement('div');
        let cardClass = `transaction-card ${transaction.type}-card`;
        
        // الشرط الجديد لتلوين البطاقة باللون الأصفر
        if (transaction.lastEditedBy && transaction.lastEditedBy.role !== 'manager') {
            cardClass += ' edited-by-user';
        }
        
        transactionCard.className = cardClass;
        
        const cardInnerHtml = `
            <p><strong>التاريخ:</strong> ${transaction.date}</p>
            <p><strong>التصنيف:</strong> ${transaction.category}</p>
            <p><strong>من/إلى:</strong> ${transaction.fromTo || 'غير محدد'}</p>
            <p><strong>ملاحظة:</strong> ${transaction.note || 'لا توجد'}</p>
            <span class="amount ${transaction.type}-label">${transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}</span>
            ${transaction.lastActionBy ? `<span class="user-info"><i class="fas fa-user-tag"></i> <strong>بواسطة:</strong> ${transaction.lastActionBy.description} (${transaction.lastActionBy.username})</span>` : ''}
            ${transaction.lastEditedBy ? `<span class="user-info" style="color:#c49500;"><i class="fas fa-user-edit"></i> <strong>آخر تعديل:</strong> ${transaction.lastEditedBy.description} (${transaction.lastEditedBy.username})</span>` : ''}
        `;

        const canEdit = ['manager', 'admin', 'editor', 'employee', 'new_employee'].includes(currentUser.role);
        const canDelete = ['manager', 'admin'].includes(currentUser.role);

        if (canEdit || canDelete) {
            transactionCard.classList.add('can-interact');
            
            let actionsHtml = `<div class="transaction-actions">`;
            if (canEdit) {
                actionsHtml += `<button class="action-btn edit-btn" data-id="${transaction.id}"><i class="fas fa-edit"></i></button>`;
            }
            if (canDelete) {
                actionsHtml += `<button class="action-btn delete-btn" data-id="${transaction.id}"><i class="fas fa-trash-alt"></i></button>`;
            }
            actionsHtml += `</div>`;
            
            transactionCard.innerHTML = cardInnerHtml + actionsHtml;

        } else {
            transactionCard.innerHTML = cardInnerHtml;
        }

        transactionCard.dataset.id = transaction.id;
        return transactionCard;
    }

    function updateTransactionsContainer(filteredTransactions, isGrouped = true) {
        transactionsContainer.innerHTML = '';
        
        // Sort transactions by date descending
        const sortedTransactions = [...filteredTransactions].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        if (sortedTransactions.length === 0) {
            transactionsContainer.innerHTML = '<p class="no-transactions" style="text-align:center; padding: 20px;">لا توجد معاملات في هذه الفترة.</p>';
            return;
        }

        if (isSearchActive) {
            appendSummary(sortedTransactions);
            sortedTransactions.forEach(transaction => {
                transactionsContainer.appendChild(createTransactionCard(transaction));
            });
            return;
        }

        const duration = durationFilter.value;
        const groupedData = {};
        sortedTransactions.forEach(t => {
            let key;
            if (duration === 'current-year' || duration === 'last-year') {
                key = t.date.substring(0, 4);
            } else {
                key = t.date.substring(0, 7);
            }
            
            if (!groupedData[key]) {
                groupedData[key] = { income: 0, expenses: 0, transactions: [] };
            }
            if (t.type === 'income') {
                groupedData[key].income += t.amount;
            } else {
                groupedData[key].expenses += t.amount;
            }
            groupedData[key].transactions.push(t);
        });
        
        const sortedKeys = Object.keys(groupedData).sort().reverse();
        
        sortedKeys.forEach(key => {
            const groupData = groupedData[key];
            
            appendSummary(groupData.transactions, key, duration);
            
            groupData.transactions.forEach(transaction => {
                transactionsContainer.appendChild(createTransactionCard(transaction));
            });
        });
    }
    
    function appendSummary(transactionsToSummarize, key = null, duration = null) {
        let title, className;
        let totalIncome = 0;
        let totalExpenses = 0;

        transactionsToSummarize.forEach(t => {
            if (t.type === 'income') {
                totalIncome += t.amount;
            } else {
                totalExpenses += t.amount;
            }
        });

        if (isSearchActive) {
            title = 'ملخص نتائج البحث';
            className = 'search-summary';
        } else {
            if (duration === 'current-year' || duration === 'last-year') {
                title = `ملخص عام ${key}`;
                className = 'yearly-summary';
            } else {
                const [year, monthIndex] = key.split('-');
                const monthName = monthNames[parseInt(monthIndex, 10) - 1];
                title = `ملخص شهر ${monthName} ${year}`;
                className = 'monthly-summary';
            }
        }

        const summaryDiv = document.createElement('div');
        const balance = totalIncome - totalExpenses;
        summaryDiv.className = className;
        summaryDiv.innerHTML = `
            <span class="summary-title">${title}</span>
            <div class="summary-details">
                <p><strong>دخل:</strong> <span class="income-label">${totalIncome.toFixed(2)}</span></p>
                <p><strong>مصروف:</strong> <span class="expense-label">${totalExpenses.toFixed(2)}</span></p>
                <p><strong>صافي:</strong> <span class="balance-label" style="color:${balance >= 0 ? 'var(--success-color)' : 'var(--danger-color)'}">${balance.toFixed(2)}</span></p>
            </div>
        `;
        transactionsContainer.appendChild(summaryDiv);
    }
    
    function filterByToday() {
        const today = new Date().toISOString().split('T')[0];
        return transactions.filter(t => t.date === today);
    }

    function filterByCurrentMonth() {
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
        return transactions.filter(t => t.date >= firstDayOfMonth && t.date <= lastDayOfMonth);
    }

    function filterByLastMonth() {
        const today = new Date();
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const firstDayOfLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1).toISOString().split('T')[0];
        const lastDayOfLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0).toISOString().split('T')[0];
        return transactions.filter(t => t.date >= firstDayOfLastMonth && t.date <= lastDayOfLastMonth);
    }
    
    function filterByCurrentYear() {
        const currentYear = new Date().getFullYear();
        return transactions.filter(t => new Date(t.date).getFullYear() == currentYear);
    }

    function filterByLastYear() {
        const lastYear = new Date().getFullYear() - 1;
        return transactions.filter(t => new Date(t.date).getFullYear() == lastYear);
    }

    function applyFilter() {
        if (isSearchActive) {
            performAdvancedSearch();
            return;
        }

        const duration = durationFilter.value;
        let filtered = [];
        
        if (duration === 'today') {
            filtered = filterByToday();
        } else if (duration === 'current-month') {
            filtered = filterByCurrentMonth();
        } else if (duration === 'last-month') {
            filtered = filterByLastMonth();
        } else if (duration === 'current-year') {
            filtered = filterByCurrentYear();
        } else if (duration === 'last-year') {
            filtered = filterByLastYear();
        }
        
        updateTransactionsContainer(filtered);
    }

    durationFilter.addEventListener('change', applyFilter);

    addIncomeBtn.addEventListener('click', () => {
        modal.style.display = 'block';
        modalTitle.textContent = 'إضافة دخل';
        transactionTypeInput.value = 'income';
        transactionIdInput.value = '';
        transactionForm.reset();
        document.querySelector('#transaction-form .submit-btn').textContent = 'إضافة';
    });

    addExpenseBtn.addEventListener('click', () => {
        modal.style.display = 'block';
        modalTitle.textContent = 'إضافة مصروف';
        transactionTypeInput.value = 'expense';
        transactionIdInput.value = '';
        transactionForm.reset();
        document.querySelector('#transaction-form .submit-btn').textContent = 'إضافة';
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        transactionForm.reset();
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal || e.target === usersModal || e.target === permissionsModal || e.target === messagesModal || e.target === backupModal || e.target === advancedSearchModal) {
            modal.style.display = 'none';
            usersModal.style.display = 'none';
            permissionsModal.style.display = 'none';
            messagesModal.style.display = 'none';
            backupModal.style.display = 'none';
            advancedSearchModal.style.display = 'none';
            transactionForm.reset();
            addUserForm.classList.add('hidden');
            showAddUserFormBtn.innerHTML = '<i class="fas fa-plus"></i> إضافة مستخدم جديد';
        }
        
        if (!sidebar.contains(e.target) && !sidebarToggleBtn.contains(e.target)) {
            sidebar.classList.remove('show');
        }

        if (!chartMenuBtn.contains(e.target) && !chartOptions.contains(e.target)) {
            chartOptions.classList.add('hidden');
        }
    });

    transactionForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const type = transactionTypeInput.value;
        const date = document.getElementById('date').value;
        const category = document.getElementById('category').value;
        const amount = parseFloat(document.getElementById('amount').value);
        const fromTo = document.getElementById('from-to').value;
        const note = document.getElementById('note').value;
        const transactionId = transactionIdInput.value;
        
        const needsApprovalForEdit = ['employee', 'new_employee'].includes(currentUser.role);
        const needsApprovalForNew = ['new_employee'].includes(currentUser.role);
        const currentUserInfo = { username: currentUser.username, description: rolesMap[currentUser.role], role: currentUser.role };

        if (transactionId) {
            // Logic for editing an existing transaction
            if (needsApprovalForEdit) {
                const editedTransaction = {
                    id: Date.now(),
                    originalId: parseInt(transactionId),
                    date, category, amount, fromTo, note, type,
                    lastActionBy: currentUserInfo
                };
                pendingTransactions.push(editedTransaction);
                savePendingTransactions();
                const originalTransaction = transactions.find(t => t.id == transactionId);
                if (originalTransaction) {
                    originalTransaction.isEdited = true;
                }
                saveTransactions();
                alert('تم إرسال طلب التعديل للموافقة.');
            } else {
                const index = transactions.findIndex(t => t.id == transactionId);
                if (index !== -1) {
                    transactions[index] = {
                        ...transactions[index],
                        date, category, amount, fromTo, note, type,
                        lastActionBy: currentUserInfo,
                        lastEditedBy: currentUserInfo
                    };
                }
                saveTransactions();
            }
        } else {
            // Logic for adding a new transaction
            const newTransaction = {
                id: Date.now(),
                date, category, amount, fromTo, note, type,
                lastActionBy: currentUserInfo
            };
            if (needsApprovalForNew) {
                pendingTransactions.push(newTransaction);
                savePendingTransactions();
                alert('تم إرسال المعاملة الجديدة للموافقة.');
            } else {
                transactions.push(newTransaction);
                saveTransactions();
            }
        }
        
        applyFilter();
        updateSummary();
        updateChart();
        modal.style.display = 'none';
    });


    transactionsContainer.addEventListener('click', (e) => {
        const editBtn = e.target.closest('.edit-btn');
        const deleteBtn = e.target.closest('.delete-btn');

        if (editBtn) {
            const transactionId = editBtn.dataset.id;
            const transaction = transactions.find(t => t.id == transactionId);
            if (transaction) {
                modalTitle.textContent = 'تعديل المعاملة';
                transactionTypeInput.value = transaction.type;
                transactionIdInput.value = transaction.id;
                document.getElementById('date').value = transaction.date;
                document.getElementById('category').value = transaction.category;
                document.getElementById('amount').value = transaction.amount;
                document.getElementById('from-to').value = transaction.fromTo;
                document.getElementById('note').value = transaction.note;
                document.querySelector('#transaction-form .submit-btn').textContent = 'تعديل';
                modal.style.display = 'block';
            }
        } else if (deleteBtn) {
            const transactionId = parseInt(deleteBtn.dataset.id);
            if (confirm('هل أنت متأكد من حذف هذه المعاملة؟')) {
                transactions = transactions.filter(t => t.id !== transactionId);
                saveTransactions();
                applyFilter();
                updateSummary();
                updateChart();
            }
        }
    });
    
    let startX = 0;
    let currentCard = null;

    transactionsContainer.addEventListener('touchstart', (e) => {
        if (e.target.closest('.transaction-card.can-interact')) {
            const card = e.target.closest('.transaction-card');
            if (currentCard && currentCard !== card) {
                currentCard.style.transform = 'translateX(0)';
                currentCard.classList.remove('swiped');
                const actions = currentCard.querySelector('.transaction-actions');
                if (actions) actions.style.right = '-120px';
            }
            startX = e.touches[0].clientX;
            currentCard = card;
        }
    }, { passive: true });

    transactionsContainer.addEventListener('touchmove', (e) => {
        if (currentCard) {
            const currentX = e.touches[0].clientX;
            const diffX = startX - currentX;
            if (diffX > 20) {
                const swipeDistance = Math.min(diffX, 120);
                currentCard.style.transform = `translateX(-${swipeDistance}px)`;
                const actions = currentCard.querySelector('.transaction-actions');
                if(actions) actions.style.right = `-${120 - swipeDistance}px`;
            } else {
                currentCard.style.transform = 'translateX(0)';
                const actions = currentCard.querySelector('.transaction-actions');
                if(actions) actions.style.right = '-120px';
            }
        }
    }, { passive: true });

    transactionsContainer.addEventListener('touchend', (e) => {
        if (currentCard) {
            const endX = e.changedTouches[0].clientX;
            const diffX = startX - endX;
            const actions = currentCard.querySelector('.transaction-actions');
            if (diffX > 60) {
                currentCard.style.transform = 'translateX(-120px)';
                if(actions) actions.style.right = '0';
                currentCard.classList.add('swiped');
            } else {
                currentCard.style.transform = 'translateX(0)';
                if(actions) actions.style.right = '-120px';
                currentCard.classList.remove('swiped');
            }
            currentCard = null;
        }
    });
    
    window.addEventListener('click', (e) => {
        const isTransactionCard = e.target.closest('.transaction-card');
        const isModal = e.target.closest('.modal-content');
        if (!isTransactionCard && !isModal) {
            transactionsContainer.querySelectorAll('.transaction-card.swiped').forEach(card => {
                card.classList.remove('swiped');
                card.style.transform = 'translateX(0)';
                const actions = card.querySelector('.transaction-actions');
                if(actions) actions.style.right = '-120px';
            });
        }
    });
    
    // --- Advanced Search Logic ---
    advancedSearchBtn.addEventListener('click', () => {
        advancedSearchModal.style.display = 'block';
    });

    advancedSearchModalCloseBtn.addEventListener('click', () => {
        advancedSearchModal.style.display = 'none';
    });

    advancedSearchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        isSearchActive = true;
        searchActiveBadge.classList.remove('hidden');
        durationFilter.disabled = true;
        advancedSearchModal.style.display = 'none';
        performAdvancedSearch();
    });

    clearSearchBtn.addEventListener('click', () => {
        advancedSearchForm.reset();
        isSearchActive = false;
        searchActiveBadge.classList.add('hidden');
        durationFilter.disabled = false;
        applyFilter();
    });

    function performAdvancedSearch() {
        const searchType = searchTypeInput.value;
        const searchCategory = searchCategoryInput.value.trim().toLowerCase();
        const searchNote = searchNoteInput.value.trim().toLowerCase();
        const searchFromTo = searchFromToInput.value.trim().toLowerCase();
        const searchUsername = searchUsernameInput.value.trim().toLowerCase();
        const searchFromDate = searchFromDateInput.value;
        const searchToDate = searchToDateInput.value;

        const filtered = transactions.filter(t => {
            const typeMatch = searchType === '' || t.type === searchType;
            const categoryMatch = searchCategory === '' || (t.category && t.category.toLowerCase().includes(searchCategory));
            const noteMatch = searchNote === '' || (t.note && t.note.toLowerCase().includes(searchNote));
            const fromToMatch = searchFromTo === '' || (t.fromTo && t.fromTo.toLowerCase().includes(searchFromTo));
            const usernameMatch = !currentUser || currentUser.role !== 'manager' || searchUsername === '' || (t.lastActionBy && t.lastActionBy.username.toLowerCase().includes(searchUsername));

            let dateMatch = true;
            const transactionDate = new Date(t.date);
            if (searchFromDate) {
                const fromDate = new Date(searchFromDate);
                if (transactionDate < fromDate) {
                    dateMatch = false;
                }
            }
            if (searchToDate) {
                const toDate = new Date(searchToDate);
                toDate.setDate(toDate.getDate() + 1); // لتضمين اليوم الأخير
                if (transactionDate > toDate) {
                    dateMatch = false;
                }
            }
            
            return typeMatch && categoryMatch && noteMatch && fromToMatch && usernameMatch && dateMatch;
        });
        
        updateTransactionsContainer(filtered, false);
    }
    
    // Clicking the badge clears the search
    searchActiveBadge.addEventListener('click', () => {
        clearSearchBtn.click();
    });

    // --- Backup and Restore Logic ---
    backupBtn.addEventListener('click', () => {
        backupModal.style.display = 'block';
    });

    backupModalCloseBtn.addEventListener('click', () => {
        backupModal.style.display = 'none';
    });

    createBackupBtn.addEventListener('click', () => {
        const backupData = {
            users: getUsers(),
            transactions: transactions,
            pendingTransactions: pendingTransactions,
            backupDate: new Date().toISOString()
        };
        const jsonString = JSON.stringify(backupData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const date = new Date().toISOString().slice(0, 10);
        link.href = url;
        link.download = `property_backup_${date}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    });

    restoreBackupInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) {
            fileNameDisplay.textContent = 'لم يتم اختيار أي ملف.';
            return;
        }

        fileNameDisplay.textContent = `الملف المختار: ${file.name}`;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const restoredData = JSON.parse(e.target.result);
                if (restoredData && restoredData.users && restoredData.transactions && restoredData.pendingTransactions) {
                    if (confirm('هل أنت متأكد من أنك تريد استعادة هذه البيانات؟ سيتم الكتابة فوق جميع البيانات الحالية.')) {
                        saveUsers(restoredData.users);
                        localStorage.setItem('transactions', JSON.stringify(restoredData.transactions));
                        localStorage.setItem('pendingTransactions', JSON.stringify(restoredData.pendingTransactions));
                        alert('تمت استعادة البيانات بنجاح! سيتم إعادة تحميل الصفحة.');
                        window.location.reload();
                    }
                } else {
                    alert('ملف النسخة الاحتياطية غير صالح أو تالف.');
                }
            } catch (error) {
                alert('خطأ في قراءة الملف. تأكد من أنه ملف JSON صالح.');
                console.error("Restore error:", error);
            } finally {
                restoreBackupInput.value = '';
                fileNameDisplay.textContent = 'لم يتم اختيار أي ملف.';
            }
        };
        reader.readAsText(file);
    });

    // --- Initial Load ---
    if (!localStorage.getItem('users')) {
        saveUsers(getInitialUsers());
    }
    if (!localStorage.getItem('transactions')) {
        saveTransactions();
    }
    if (!localStorage.getItem('pendingTransactions')) {
        savePendingTransactions();
    }
});
