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
    const statsBtn = document.getElementById('stats-btn');

    const usersModal = document.getElementById('users-modal');
    const usersModalCloseBtn = document.querySelector('#users-modal .close-btn');
    const usersListContainer = document.getElementById('users-list-container');
    const userRoleFilter = document.getElementById('user-role-filter');
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
    const approvedDurationFilter = document.getElementById('approved-duration-filter');
    const customDateFilter = document.getElementById('custom-date-filter');
    const approvedFromDate = document.getElementById('approved-from-date');
    const approvedToDate = document.getElementById('approved-to-date');

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

    const advancedSearchBtn = document.getElementById('advanced-search-btn');
    const searchActiveBadge = document.getElementById('search-active-badge');
    const advancedSearchModal = document.getElementById('advanced-search-modal');
    const advancedSearchModalCloseBtn = document.querySelector('#advanced-search-modal .close-btn');
    const advancedSearchForm = document.getElementById('advanced-search-form');
    const searchTypeInput = document.getElementById('search-type');
    const searchCategoryInput = document.getElementById('search-category');
    const searchNoteInput = document.getElementById('search-note');
    const searchFromToInput = document.getElementById('search-from-to');
    const searchUsernameInput = document.getElementById('search-username');
    const searchFromDateInput = document.getElementById('search-from-date');
    const searchToDateInput = document.getElementById('search-to-date');
    const clearSearchBtn = document.getElementById('clear-search-btn');
    
    // Stats Modal Elements
    const statsModal = document.getElementById('stats-modal');
    const statsModalCloseBtn = document.querySelector('#stats-modal .close-btn');
    const statsDurationFilter = document.getElementById('stats-duration-filter');
    const statsChartCanvas = document.getElementById('statsChart');
    const barChartBtn = document.getElementById('bar-chart-btn');
    const pieChartBtn = document.getElementById('pie-chart-btn');
    const topIncomeList = document.getElementById('top-income-list');
    const topExpenseList = document.getElementById('top-expense-list');
    const noTopIncomeMsg = document.getElementById('no-top-income');
    const noTopExpenseMsg = document.getElementById('no-top-expense');
    let statsChart;

    let currentUser = null;
    let isSearchActive = false;
    let loginAttempts = parseInt(localStorage.getItem('loginAttempts')) || 0;
    const MAX_LOGIN_ATTEMPTS = 5;
    
    const monthNames = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
    
    const rolesMap = {
        'manager': 'مدير النظام',
        'admin': 'مشرف محترف',
        'editor': 'مشرف',
        'employee': 'موظف محترف',
        'new_employee': 'موظف',
        'viewer': 'القارئ'
    };

    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    let pendingTransactions = JSON.parse(localStorage.getItem('pendingTransactions')) || [];
    let myChart;

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

    function saveTransactions() {
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }

    function savePendingTransactions() {
        localStorage.setItem('pendingTransactions', JSON.stringify(pendingTransactions));
    }
    
    function getNotifications() {
        return JSON.parse(localStorage.getItem('notifications')) || [];
    }

    function saveNotifications(notifications) {
        localStorage.setItem('notifications', JSON.stringify(notifications));
    }

    function updateNotificationBadge() {
        if (!currentUser) return;
        
        const allNotifications = getNotifications();
        const userNotifications = allNotifications.filter(n => n.userId === currentUser.id);
        const count = userNotifications.length;

        if (count > 0) {
            notificationBadge.textContent = count;
            notificationBadge.classList.remove('hidden');
        } else {
            notificationBadge.classList.add('hidden');
        }
    }

    function createNotificationsForPendingTransaction(pendingTransaction) {
        let notifications = getNotifications();
        const allUsers = getUsers();
        const approverRoles = ['manager', 'admin', 'editor'];

        const creatorNotification = {
            id: Date.now() + Math.random(),
            userId: currentUser.id,
            transactionId: pendingTransaction.id,
            message: `Your transaction request #${pendingTransaction.id} is pending approval.`
        };
        notifications.push(creatorNotification);
        
        const approvers = allUsers.filter(user => approverRoles.includes(user.role));
        approvers.forEach(approver => {
            if (approver.id === currentUser.id) return;

            const approverNotification = {
                id: Date.now() + Math.random(),
                userId: approver.id,
                transactionId: pendingTransaction.id,
                message: `A new transaction #${pendingTransaction.id} requires your approval.`
            };
            notifications.push(approverNotification);
        });

        saveNotifications(notifications);
    }
    
    function clearNotificationsForTransaction(transactionId) {
        let notifications = getNotifications();
        const updatedNotifications = notifications.filter(n => n.transactionId !== transactionId);
        saveNotifications(updatedNotifications);
    }

    durationFilter.value = 'current-month';

    function initApp(user) {
        currentUser = user;
        localStorage.setItem('loggedInUser', JSON.stringify(currentUser));
        localStorage.setItem('loginAttempts', 0);
        loginScreen.classList.add('hidden');
        mainApp.classList.remove('hidden');
        errorMessage.style.display = 'none';
        
        userGreetingSpan.textContent = `مرحبا، ${currentUser.username}`;
        
        const isManager = currentUser.role === 'manager';
        const canSeeNotifications = ['manager', 'admin', 'editor', 'employee', 'new_employee'].includes(currentUser.role);
        const canAdd = ['manager', 'admin', 'editor', 'employee', 'new_employee'].includes(currentUser.role);
        
        manageUsersBtn.classList.toggle('hidden', !isManager);
        permissionsBtn.classList.toggle('hidden', !isManager);
        backupBtn.classList.toggle('hidden', !isManager);
        document.querySelector('#advanced-search-modal .manager-only').classList.toggle('hidden', !isManager);

        addIncomeBtn.classList.toggle('hidden', !canAdd);
        addExpenseBtn.classList.toggle('hidden', !canAdd);
        notificationsBtn.classList.toggle('hidden', !canSeeNotifications);
        
        applyFilter();
        updateSummary();
        initializeChart();
        updateChart();
        updateNotificationBadge();
    }

    function checkLoginStatus() {
        const storedUser = localStorage.getItem('loggedInUser');
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                initApp(user);
            } catch (e) {
                console.error("Failed to parse stored user data:", e);
                localStorage.removeItem('loggedInUser');
            }
        }
    }

    function handleFailedLogin() {
        loginAttempts++;
        localStorage.setItem('loginAttempts', loginAttempts);
        errorMessage.textContent = 'اسم المستخدم أو كلمة المرور غير صحيحة.';
        errorMessage.style.display = 'block';
        passwordInput.value = '';
        
        if (loginAttempts >= MAX_LOGIN_ATTEMPTS) {
            const loginButton = loginForm.querySelector('.modern-btn');
            loginButton.disabled = true;
            errorMessage.textContent = `تم تجاوز الحد الأقصى للمحاولات (${MAX_LOGIN_ATTEMPTS}). الرجاء المحاولة بعد 30 ثانية.`;
            setTimeout(() => {
                loginButton.disabled = false;
                loginAttempts = 0;
                localStorage.setItem('loginAttempts', 0);
                errorMessage.textContent = '';
                errorMessage.style.display = 'none';
            }, 30000); // 30 seconds
        }
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = usernameInput.value;
        const password = passwordInput.value;
        const users = getUsers();
        
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            initApp(user);
        } else {
            handleFailedLogin();
        }
    });

    logoutBtn.addEventListener('click', () => {
        currentUser = null;
        localStorage.removeItem('loggedInUser');
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

    statsBtn.addEventListener('click', () => {
        statsModal.style.display = 'block';
        if (!statsChart) {
            initializeStatsChart();
        }
        statsDurationFilter.value = 'current-month';
        updateStatsChart();
        renderTopTransactions();
    });

    statsModalCloseBtn.addEventListener('click', () => {
        statsModal.style.display = 'none';
    });

    statsDurationFilter.addEventListener('change', () => {
        updateStatsChart();
        renderTopTransactions();
    });

    barChartBtn.addEventListener('click', () => {
        barChartBtn.classList.add('active-chart-btn');
        pieChartBtn.classList.remove('active-chart-btn');
        updateStatsChart('bar');
    });

    pieChartBtn.addEventListener('click', () => {
        pieChartBtn.classList.add('active-chart-btn');
        barChartBtn.classList.remove('active-chart-btn');
        updateStatsChart('pie');
    });
    
    function initializeStatsChart() {
        const ctx = statsChartCanvas.getContext('2d');
        statsChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['الدخل', 'المصروفات'],
                datasets: [{
                    label: 'إجمالي المبلغ',
                    data: [0, 0],
                    backgroundColor: ['rgba(46, 204, 113, 0.7)', 'rgba(231, 76, 60, 0.7)'],
                    borderColor: ['rgba(46, 204, 113, 1)', 'rgba(231, 76, 60, 1)'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    function updateStatsChart(chartType = statsChart.config.type) {
        const duration = statsDurationFilter.value;
        const filteredTransactions = getFilteredTransactions(duration);

        const totalIncome = filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const totalExpenses = filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        
        statsChart.config.type = chartType;
        if (chartType === 'pie') {
            statsChart.data.labels = ['الدخل', 'المصروفات'];
            statsChart.data.datasets[0].label = 'توزيع المبالغ';
            statsChart.data.datasets[0].data = [totalIncome, totalExpenses];
            statsChart.options.scales.y.display = false;
        } else { // bar
            statsChart.data.labels = ['الدخل', 'المصروفات'];
            statsChart.data.datasets[0].label = 'إجمالي المبلغ';
            statsChart.data.datasets[0].data = [totalIncome, totalExpenses];
            statsChart.options.scales.y.display = true;
        }
        
        statsChart.update();
    }
    
    function renderTopTransactions() {
        const duration = statsDurationFilter.value;
        const filteredTransactions = getFilteredTransactions(duration);

        const incomeTransactions = filteredTransactions.filter(t => t.type === 'income').sort((a, b) => b.amount - a.amount);
        const expenseTransactions = filteredTransactions.filter(t => t.type === 'expense').sort((a, b) => b.amount - a.amount);
        
        topIncomeList.innerHTML = '';
        topExpenseList.innerHTML = '';
        
        noTopIncomeMsg.classList.add('hidden');
        noTopExpenseMsg.classList.add('hidden');

        if (incomeTransactions.length === 0) {
            noTopIncomeMsg.classList.remove('hidden');
        } else {
            incomeTransactions.slice(0, 5).forEach(t => {
                const item = document.createElement('div');
                item.className = 'top-transaction-item';
                item.innerHTML = `
                    <div class="details">
                        <strong>${t.category}</strong>
                        <span>${t.date}</span>
                    </div>
                    <span class="amount income-label">+${t.amount.toFixed(2)}</span>
                `;
                topIncomeList.appendChild(item);
            });
        }
        
        if (expenseTransactions.length === 0) {
            noTopExpenseMsg.classList.remove('hidden');
        } else {
            expenseTransactions.slice(0, 5).forEach(t => {
                const item = document.createElement('div');
                item.className = 'top-transaction-item';
                item.innerHTML = `
                    <div class="details">
                        <strong>${t.category}</strong>
                        <span>${t.date}</span>
                    </div>
                    <span class="amount expense-label">-${t.amount.toFixed(2)}</span>
                `;
                topExpenseList.appendChild(item);
            });
        }
    }
    
    manageUsersBtn.addEventListener('click', () => {
        usersModal.style.display = 'block';
        userRoleFilter.value = 'all';
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

    userRoleFilter.addEventListener('change', renderUsersList);

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
        const selectedRole = userRoleFilter.value;
        
        const filteredUsers = selectedRole === 'all' ? users : users.filter(u => u.role === selectedRole);
        
        usersListContainer.innerHTML = '';
        if (filteredUsers.length === 0) {
            usersListContainer.innerHTML = '<p class="no-users" style="text-align:center; padding: 20px;">لا يوجد مستخدمون بهذا الدور.</p>';
            return;
        }

        filteredUsers.forEach(user => {
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
        permissionsModal.style.display = 'block';
        approvedDurationFilter.value = 'current-month';
        customDateFilter.classList.add('hidden');
        renderApprovedTransactions();
    });

    permissionsModalCloseBtn.addEventListener('click', () => {
        permissionsModal.style.display = 'none';
    });
    
    approvedDurationFilter.addEventListener('change', () => {
        if (approvedDurationFilter.value === 'custom') {
            customDateFilter.classList.remove('hidden');
        } else {
            customDateFilter.classList.add('hidden');
            renderApprovedTransactions();
        }
    });

    approvedFromDate.addEventListener('change', renderApprovedTransactions);
    approvedToDate.addEventListener('change', renderApprovedTransactions);
    
    function renderPendingTransactions() {
        pendingTransactionsContainer.innerHTML = '';
        const canApprove = ['manager', 'admin', 'editor'].includes(currentUser.role);

        if (pendingTransactions.length === 0) {
            noPendingTransactionsMsg.classList.remove('hidden');
        } else {
            noPendingTransactionsMsg.classList.add('hidden');
            pendingTransactions.forEach(t => {
                const isEdit = !!t.originalId;
                const card = document.createElement('div');
                card.className = `pending-card ${isEdit ? 'pending-edit-card' : ''}`;
                
                const actionsHTML = canApprove ? `
                    <div class="pending-actions">
                        <button class="action-btn income-btn approve-btn" data-id="${t.id}"><i class="fas fa-check"></i> موافقة</button>
                        <button class="action-btn expense-btn reject-btn" data-id="${t.id}"><i class="fas fa-times"></i> رفض</button>
                    </div>` : '';

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
                    ${actionsHTML}
                `;
                pendingTransactionsContainer.appendChild(card);
            });
        }
    }
    
    function renderApprovedTransactions() {
        approvedTransactionsContainer.innerHTML = '';
        const allApproved = transactions.filter(t => t.approvedBy);
        
        let filteredApproved = [];
        const duration = approvedDurationFilter.value;
        const today = new Date();

        if (duration === 'all') {
            filteredApproved = allApproved;
        } else if (duration === 'current-month') {
            const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
            const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
            filteredApproved = allApproved.filter(t => t.date >= firstDayOfMonth && t.date <= lastDayOfMonth);
        } else if (duration === 'last-month') {
            const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            const firstDayOfLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1).toISOString().split('T')[0];
            const lastDayOfLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0).toISOString().split('T')[0];
            filteredApproved = allApproved.filter(t => t.date >= firstDayOfLastMonth && t.date <= lastDayOfLastMonth);
        } else if (duration === 'current-year') {
            const currentYear = today.getFullYear();
            filteredApproved = allApproved.filter(t => new Date(t.date).getFullYear() == currentYear);
        } else if (duration === 'last-year') {
            const lastYear = today.getFullYear() - 1;
            filteredApproved = allApproved.filter(t => new Date(t.date).getFullYear() == lastYear);
        } else if (duration === 'custom') {
            const fromDate = approvedFromDate.value;
            const toDate = approvedToDate.value;
            if (fromDate && toDate) {
                const from = new Date(fromDate);
                const to = new Date(toDate);
                to.setDate(to.getDate() + 1);
                filteredApproved = allApproved.filter(t => {
                    const transactionDate = new Date(t.date);
                    return transactionDate >= from && transactionDate <= to;
                });
            }
        }
        
        if (filteredApproved.length === 0) {
            noApprovedTransactionsMsg.classList.remove('hidden');
        } else {
            noApprovedTransactionsMsg.classList.add('hidden');
            filteredApproved.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(t => {
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
        const canApprove = ['manager', 'admin', 'editor'].includes(currentUser.role);
        
        if (!canApprove) return;

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
                            date: transactionToApprove.date, category: transactionToApprove.category,
                            amount: transactionToApprove.amount, fromTo: transactionToApprove.fromTo,
                            note: transactionToApprove.note, type: transactionToApprove.type,
                            isEdited: false,
                            approvedBy: { username: currentUser.username, description: rolesMap[currentUser.role] },
                            lastEditedBy: transactionToApprove.lastActionBy 
                        };
                    }
                } else {
                    transactionToApprove.approvedBy = { username: currentUser.username, description: rolesMap[currentUser.role] };
                    transactions.push(transactionToApprove);
                }

                pendingTransactions = pendingTransactions.filter(t => t.id !== id);
                clearNotificationsForTransaction(id);
                saveTransactions();
                savePendingTransactions();
                applyFilter();
                updateSummary();
                updateChart();
                renderPendingTransactions();
                updateNotificationBadge();
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
            clearNotificationsForTransaction(id);
            savePendingTransactions();
            applyFilter();
            renderPendingTransactions();
            updateNotificationBadge();
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
    
    function getFilteredTransactions(duration) {
        const today = new Date();
        if (duration === 'current-month') {
            const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
            const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
            return transactions.filter(t => t.date >= firstDayOfMonth && t.date <= lastDayOfMonth);
        } else if (duration === 'last-month') {
            const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            const firstDayOfLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1).toISOString().split('T')[0];
            const lastDayOfLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0).toISOString().split('T')[0];
            return transactions.filter(t => t.date >= firstDayOfLastMonth && t.date <= lastDayOfLastMonth);
        } else if (duration === 'current-year') {
            const currentYear = today.getFullYear();
            return transactions.filter(t => new Date(t.date).getFullYear() == currentYear);
        } else if (duration === 'last-year') {
            const lastYear = today.getFullYear() - 1;
            return transactions.filter(t => new Date(t.date).getFullYear() == lastYear);
        }
    }

    function applyFilter() {
        if (isSearchActive) {
            performAdvancedSearch();
            return;
        }

        const duration = durationFilter.value;
        let filtered = [];
        
        if (duration === 'today') {
            const today = new Date().toISOString().split('T')[0];
            filtered = transactions.filter(t => t.date === today);
        } else {
            filtered = getFilteredTransactions(duration);
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
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
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
            if (needsApprovalForEdit) {
                const editedTransaction = {
                    id: Date.now(), originalId: parseInt(transactionId),
                    date, category, amount, fromTo, note, type,
                    lastActionBy: currentUserInfo
                };
                pendingTransactions.push(editedTransaction);
                createNotificationsForPendingTransaction(editedTransaction);
                savePendingTransactions();
                
                const originalTransaction = transactions.find(t => t.id == transactionId);
                if (originalTransaction) originalTransaction.isEdited = true;
                saveTransactions();
                alert('تم إرسال طلب التعديل للموافقة.');
            } else {
                const index = transactions.findIndex(t => t.id == transactionId);
                if (index !== -1) {
                    transactions[index] = {
                        ...transactions[index], date, category, amount, fromTo, note, type,
                        lastActionBy: currentUserInfo, lastEditedBy: currentUserInfo
                    };
                }
                saveTransactions();
            }
        } else {
            const newTransaction = {
                id: Date.now(), date, category, amount, fromTo, note, type,
                lastActionBy: currentUserInfo
            };
            if (needsApprovalForNew) {
                pendingTransactions.push(newTransaction);
                createNotificationsForPendingTransaction(newTransaction);
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
        updateNotificationBadge();
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
                toDate.setDate(toDate.getDate() + 1);
                if (transactionDate > toDate) {
                    dateMatch = false;
                }
            }
            
            return typeMatch && categoryMatch && noteMatch && fromToMatch && usernameMatch && dateMatch;
        });
        
        updateTransactionsContainer(filtered, false);
    }
    
    searchActiveBadge.addEventListener('click', () => {
        clearSearchBtn.click();
    });

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
            notifications: getNotifications(),
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
                if (restoredData && restoredData.users && restoredData.transactions) {
                    if (confirm('هل أنت متأكد من أنك تريد استعادة هذه البيانات؟ سيتم الكتابة فوق جميع البيانات الحالية.')) {
                        saveUsers(restoredData.users);
                        localStorage.setItem('transactions', JSON.stringify(restoredData.transactions));
                        localStorage.setItem('pendingTransactions', JSON.stringify(restoredData.pendingTransactions || []));
                        localStorage.setItem('notifications', JSON.stringify(restoredData.notifications || []));
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
    
    if (!localStorage.getItem('users')) {
        saveUsers(getInitialUsers());
    }
    
    // Check login status on page load
    checkLoginStatus();
});
