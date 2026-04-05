// A helpful AI assistant built by Google.
// Refactored JavaScript code to use localStorage instead of a simulated backend API.

Document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element Selection ---
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
    const transactionFormSubmitBtn = document.querySelector('#transaction-form .submit-btn');
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
    const newUserIdInput = document.getElementById('new-user-id');

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

    // --- Application State ---
    let currentUser = null;
    let isSearchActive = false;
    let transactions = [];
    let pendingTransactions = [];
    let users = [];
    let myChart;
    
    // --- Constants ---
    const monthNames = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
    const rolesMap = {
        'manager': 'مدير النظام',
        'admin': 'مشرف محترف',
        'editor': 'مشرف',
        'employee': 'موظف محترف',
        'new_employee': 'موظف',
        'viewer': 'القارئ'
    };
    
    // --- Local Storage Keys ---
    const LS_TRANSACTIONS = 'finance_transactions';
    const LS_PENDING = 'finance_pending_transactions';
    const LS_USERS = 'finance_users';

    // --- Utility Functions ---

    function formatNumber(num) {
        return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function generateUniqueId() {
        return Date.now() + Math.random().toString(36).substring(2, 9);
    }
    
    function saveToLocalStorage(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }
    
    function loadFromLocalStorage(key, defaultValue = []) {
        const stored = localStorage.getItem(key);
        try {
            return stored ? JSON.parse(stored) : defaultValue;
        } catch (e) {
            console.error(`Error parsing localStorage key: ${key}`, e);
            return defaultValue;
        }
    }

    // --- Local Storage Initialization and Data Sync ---

    function initializeLocalStorage() {
        // Ensure initial users are set if the user list is empty or doesn't exist.
        if (!localStorage.getItem(LS_USERS) || loadFromLocalStorage(LS_USERS).length === 0) {
            // Initial Users setup (Manager and a few others)
            const initialUsers = [
                { id: generateUniqueId(), username: 'manager', password: 'password123', role: 'manager', description: 'مدير النظام الرئيسي' },
                { id: generateUniqueId(), username: 'admin', password: 'password123', role: 'admin', description: 'مشرف محترف للمالية' },
                { id: generateUniqueId(), username: 'employee1', password: 'password123', role: 'employee', description: 'موظف مدخل بيانات' }
            ];
            saveToLocalStorage(LS_USERS, initialUsers);
        }
        users = loadFromLocalStorage(LS_USERS);
        transactions = loadFromLocalStorage(LS_TRANSACTIONS);
        pendingTransactions = loadFromLocalStorage(LS_PENDING);
    }

    // --- Local Storage API Mocking Functions (Replacing fetchAPI) ---

    async function loginUser(username, password) {
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            return { success: true, user: { id: user.id, username: user.username, role: user.role, description: user.description || rolesMap[user.role] } };
        }
        return { success: false, message: 'اسم المستخدم أو كلمة المرور غير صحيحة.' };
    }

    async function getUsers() {
        await new Promise(resolve => setTimeout(resolve, 100));
        return { success: true, users: users.map(u => ({...u, description: u.description || rolesMap[u.role]})) };
    }

    async function addUser(data) {
        await new Promise(resolve => setTimeout(resolve, 100));
        if (users.some(u => u.username === data.username)) {
            return { success: false, message: 'اسم المستخدم موجود بالفعل.' };
        }
        const newUser = {
            id: generateUniqueId(),
            username: data.username,
            password: data.password, // In a real app, this should be hashed
            role: data.role,
            description: data.description || rolesMap[data.role]
        };
        users.push(newUser);
        saveToLocalStorage(LS_USERS, users);
        return { success: true, message: 'تمت إضافة المستخدم بنجاح.' };
    }
    
    async function editUser(data) {
        await new Promise(resolve => setTimeout(resolve, 100));
        const index = users.findIndex(u => u.id == data.id);
        if (index !== -1) {
            const user = users[index];
            user.username = data.username;
            user.role = data.role;
            user.description = data.description;
            if (data.password && data.password !== user.password) {
                 user.password = data.password; // Update password only if provided
            }
            users[index] = user;
            saveToLocalStorage(LS_USERS, users);
            // If the current user's role was edited, update session (FIX APPLIED HERE)
            if (currentUser && currentUser.id == data.id) {
                currentUser.role = data.role;
                currentUser.username = data.username;
                currentUser.description = data.description;
                sessionStorage.setItem('loggedInUser', JSON.stringify(currentUser));
                initApp(currentUser, false); // Re-initialize permissions without full data fetch
            }
            return { success: true, message: 'تم تحديث بيانات المستخدم بنجاح.' };
        }
        return { success: false, message: 'المستخدم غير موجود.' };
    }

    async function deleteUser(id) {
        await new Promise(resolve => setTimeout(resolve, 100));
        const initialLength = users.length;
        users = users.filter(u => u.id != id);
        if (users.length < initialLength) {
            saveToLocalStorage(LS_USERS, users);
            // Also remove all transactions and pending by this user for data integrity in this local mock
            transactions = transactions.filter(t => t.added_by_id != id);
            pendingTransactions = pendingTransactions.filter(t => t.added_by_id != id);
            saveToLocalStorage(LS_TRANSACTIONS, transactions);
            saveToLocalStorage(LS_PENDING, pendingTransactions);
            return { success: true, message: 'تم حذف المستخدم بنجاح.' };
        }
        return { success: false, message: 'المستخدم غير موجود.' };
    }

    function getFullUserData(userId) {
        const user = users.find(u => u.id === userId);
        return user ? { username: user.username, description: user.description || rolesMap[user.role] } : { username: 'مستخدم غير معروف', description: 'غير معروف' };
    }
    
    function enhanceTransaction(t) {
        const addedBy = getFullUserData(t.added_by_id);
        const approvedBy = t.approved_by_id ? getFullUserData(t.approved_by_id) : {};
        const lastEditedBy = t.last_edited_by_id ? getFullUserData(t.last_edited_by_id) : {};
        
        return {
            ...t,
            added_by_username: addedBy.username,
            added_by_description: addedBy.description,
            approved_by_username: approvedBy.username,
            approved_by_description: approvedBy.description,
            last_edited_by_username: lastEditedBy.username,
            edited_by_description: lastEditedBy.description // Naming convention from original code
        };
    }

    async function getTransactions() {
        await new Promise(resolve => setTimeout(resolve, 100));
        return { success: true, transactions: transactions.map(enhanceTransaction) };
    }

    async function getPendingTransactions() {
        await new Promise(resolve => setTimeout(resolve, 100));
        return { success: true, pending: pendingTransactions.map(enhanceTransaction) };
    }

    async function addTransaction(data) {
        await new Promise(resolve => setTimeout(resolve, 100));
        const isManager = currentUser.role === 'manager';
        const isApproved = isManager;
        
        const newTransaction = {
            id: generateUniqueId(),
            type: data.type,
            date: data.date,
            category: data.category,
            amount: data.amount,
            fromTo: data.fromTo,
            note: data.note,
            added_by_id: currentUser.id,
            approved_by_id: isApproved ? currentUser.id : null,
            last_edited_by_id: null,
            original_transaction_id: null, // For edit requests
            created_at: new Date().toISOString()
        };
        
        if (isApproved) {
            transactions.push(newTransaction);
            saveToLocalStorage(LS_TRANSACTIONS, transactions);
            return { success: true, message: 'تمت إضافة المعاملة والموافقة عليها بنجاح.' };
        } else {
            pendingTransactions.push(newTransaction);
            saveToLocalStorage(LS_PENDING, pendingTransactions);
            return { success: true, message: 'تم إرسال المعاملة للموافقة.' };
        }
    }

    async function editTransaction(data) {
        await new Promise(resolve => setTimeout(resolve, 100));
        const isManagerOrAdmin = ['manager', 'admin'].includes(currentUser.role);
        
        const existingTransactionIndex = transactions.findIndex(t => t.id == data.id);
        const transactionToEdit = transactions[existingTransactionIndex];

        if (!transactionToEdit) {
            return { success: false, message: 'المعاملة غير موجودة.' };
        }
        
        // Users (employee, editor) must submit an edit request (pending transaction)
        if (!isManagerOrAdmin) {
            const editRequest = {
                ...transactionToEdit,
                id: generateUniqueId(), // New ID for the pending request
                type: data.type,
                date: data.date,
                category: data.category,
                amount: data.amount,
                fromTo: data.fromTo,
                note: data.note,
                approved_by_id: null, // Reset approval
                original_transaction_id: data.id, // Link to the original
                last_edited_by_id: currentUser.id,
                created_at: new Date().toISOString() // Ensure created_at for sorting pending
            };
            
            pendingTransactions.push(editRequest);
            saveToLocalStorage(LS_PENDING, pendingTransactions);
            return { success: true, message: 'تم إرسال طلب تعديل المعاملة للموافقة.' };
        } else {
            // Manager/Admin can directly edit
            transactionToEdit.type = data.type;
            transactionToEdit.date = data.date;
            transactionToEdit.category = data.category;
            transactionToEdit.amount = data.amount;
            transactionToEdit.fromTo = data.fromTo;
            transactionToEdit.note = data.note;
            transactionToEdit.last_edited_by_id = currentUser.id;
            transactions[existingTransactionIndex] = transactionToEdit;
            saveToLocalStorage(LS_TRANSACTIONS, transactions);
            return { success: true, message: 'تم تعديل المعاملة بنجاح.' };
        }
    }

    async function deleteTransaction(id) {
        await new Promise(resolve => setTimeout(resolve, 100));
        const initialLength = transactions.length;
        transactions = transactions.filter(t => t.id != id);
        if (transactions.length < initialLength) {
            saveToLocalStorage(LS_TRANSACTIONS, transactions);
            return { success: true, message: 'تم حذف المعاملة بنجاح.' };
        }
        return { success: false, message: 'المعاملة غير موجودة.' };
    }

    async function approveTransaction(id) {
        await new Promise(resolve => setTimeout(resolve, 100));
        const index = pendingTransactions.findIndex(t => t.id == id);
        if (index === -1) return { success: false, message: 'طلب المعاملة غير موجود.' };
        
        const pendingT = pendingTransactions[index];
        pendingT.approved_by_id = currentUser.id;
        
        if (pendingT.original_transaction_id) {
            // This is an edit request
            const originalIndex = transactions.findIndex(t => t.id == pendingT.original_transaction_id);
            if (originalIndex !== -1) {
                // Apply the changes to the original transaction
                const originalT = transactions[originalIndex];
                originalT.type = pendingT.type;
                originalT.date = pendingT.date;
                originalT.category = pendingT.category;
                originalT.amount = pendingT.amount;
                originalT.fromTo = pendingT.fromTo;
                originalT.note = pendingT.note;
                originalT.last_edited_by_id = pendingT.last_edited_by_id; // Keep the ID of the user who requested the edit
                transactions[originalIndex] = originalT;
            }
        } else {
            // New transaction - Add to transactions list
            // We should strip the temporary pending ID and use the full object including added_by_id
            const approvedTransaction = { ...pendingT, approved_by_id: currentUser.id };
            transactions.push(approvedTransaction);
        }
        
        // Remove from pending
        pendingTransactions.splice(index, 1);
        saveToLocalStorage(LS_TRANSACTIONS, transactions);
        saveToLocalStorage(LS_PENDING, pendingTransactions);
        
        return { success: true, message: 'تمت الموافقة على المعاملة بنجاح.' };
    }

    async function rejectTransaction(id) {
        await new Promise(resolve => setTimeout(resolve, 100));
        const initialLength = pendingTransactions.length;
        pendingTransactions = pendingTransactions.filter(t => t.id != id);
        if (pendingTransactions.length < initialLength) {
            saveToLocalStorage(LS_PENDING, pendingTransactions);
            return { success: true, message: 'تم رفض طلب المعاملة بنجاح.' };
        }
        return { success: false, message: 'طلب المعاملة غير موجود.' };
    }


    // --- Core Application Logic (Refactored to use local functions) ---

    async function initApp(user, fetchData = true) {
        currentUser = user;
        sessionStorage.setItem('loggedInUser', JSON.stringify(currentUser));
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
        const managerOnlySearchElement = document.querySelector('#advanced-search-modal .manager-only');
        if (managerOnlySearchElement) {
            managerOnlySearchElement.classList.toggle('hidden', !isManager);
        }

        addIncomeBtn.classList.toggle('hidden', !canAdd);
        addExpenseBtn.classList.toggle('hidden', !canAdd);
        notificationsBtn.classList.toggle('hidden', !canSeeNotifications);
        
        durationFilter.value = 'current-month';
        
        if (fetchData) {
            await fetchAllData();
        }
        applyFilter();
        updateSummary();
        initializeChart();
        updateChart();
        updateNotificationBadge();
    }

    async function fetchAllData() {
        const transactionsResponse = await getTransactions();
        if (transactionsResponse.success) {
            transactions = transactionsResponse.transactions;
        }

        const pendingResponse = await getPendingTransactions();
        if (pendingResponse.success) {
            pendingTransactions = pendingResponse.pending;
        }
    }

    function checkLoginStatus() {
        initializeLocalStorage();
        const storedUser = sessionStorage.getItem('loggedInUser');
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                initApp(user);
            } catch (e) {
                console.error("Failed to parse stored user data:", e);
                sessionStorage.removeItem('loggedInUser');
            }
        }
    }
    
    let loginAttempts = 0;
    const maxAttempts = 5;
    const lockoutDuration = 30000;

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const loginBtn = loginForm.querySelector('.modern-btn');

        if (loginBtn.disabled) {
            return;
        }
        
        const username = usernameInput.value;
        const password = passwordInput.value;
        
        // Replaced fetchAPI('login.php', 'POST', { username, password })
        const response = await loginUser(username, password);
        
        if (response.success) {
            loginAttempts = 0;
            initApp(response.user);
        } else {
            loginAttempts++;
            errorMessage.textContent = response.message;
            errorMessage.style.display = 'block';
            passwordInput.value = '';

            if (loginAttempts >= maxAttempts) {
                loginBtn.disabled = true;
                loginBtn.textContent = 'تم تجميد الدخول (30 ثانية)';
                setTimeout(() => {
                    loginBtn.disabled = false;
                    loginBtn.textContent = 'دخول';
                    loginAttempts = 0;
                    errorMessage.style.display = 'none';
                }, lockoutDuration);
            }
        }
    });

    logoutBtn.addEventListener('click', () => {
        currentUser = null;
        sessionStorage.removeItem('loggedInUser');
        loginScreen.classList.remove('hidden');
        mainApp.classList.add('hidden');
        loginForm.reset();
        sidebar.classList.remove('show');
    });

    // --- Sidebar Toggles ---
    sidebarToggleBtn.addEventListener('click', () => sidebar.classList.toggle('show'));
    sidebarCloseBtn.addEventListener('click', () => sidebar.classList.remove('show'));
    document.addEventListener('click', (e) => {
        if (sidebar.classList.contains('show') && !sidebar.contains(e.target) && !sidebarToggleBtn.contains(e.target)) {
            sidebar.classList.remove('show');
        }
    });
    
    // --- Stats Modal Logic ---
    statsBtn.addEventListener('click', async () => {
        statsModal.style.display = 'block';
        if (!statsChart) initializeStatsChart();
        statsDurationFilter.value = 'current-month';
        await updateStatsChart();
        renderTopTransactions();
    });

    statsModalCloseBtn.addEventListener('click', () => statsModal.style.display = 'none');
    statsDurationFilter.addEventListener('change', () => { updateStatsChart(); renderTopTransactions(); });
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
        if (statsChart) statsChart.destroy();
        statsChart = new Chart(ctx, { type: 'bar', data: { labels: ['الدخل', 'المصروفات'], datasets: [{ label: 'إجمالي المبلغ', data: [0, 0], backgroundColor: ['rgba(46, 204, 113, 0.7)', 'rgba(231, 76, 60, 0.7)'], borderColor: ['rgba(46, 204, 113, 1)', 'rgba(231, 76, 60, 1)'], borderWidth: 1 }] }, options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } } });
    }

    function updateStatsChart(chartType = statsChart.config.type) {
        const duration = statsDurationFilter.value;
        const filteredTransactions = getFilteredTransactions(duration);
        const totalIncome = filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + parseFloat(t.amount), 0);
        const totalExpenses = filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + parseFloat(t.amount), 0);
        
        statsChart.config.type = chartType;
        if (chartType === 'pie') {
            statsChart.data.labels = ['الدخل', 'المصروفات'];
            statsChart.data.datasets[0].label = 'توزيع المبالغ';
            statsChart.data.datasets[0].data = [totalIncome, totalExpenses];
            if(statsChart.options.scales.y) statsChart.options.scales.y.display = false;
        } else {
            statsChart.data.labels = ['الدخل', 'المصروفات'];
            statsChart.data.datasets[0].label = 'إجمالي المبلغ';
            statsChart.data.datasets[0].data = [totalIncome, totalExpenses];
            if(statsChart.options.scales.y) statsChart.options.scales.y.display = true;
        }
        statsChart.update();
    }
    
    function renderTopTransactions() {
        const duration = statsDurationFilter.value;
        const filteredTransactions = getFilteredTransactions(duration);

        const incomeTransactions = filteredTransactions.filter(t => t.type === 'income').sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));
        const expenseTransactions = filteredTransactions.filter(t => t.type === 'expense').sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));
        
        topIncomeList.innerHTML = ''; topExpenseList.innerHTML = '';
        noTopIncomeMsg.classList.add('hidden'); noTopExpenseMsg.classList.add('hidden');

        if (incomeTransactions.length === 0) {
            noTopIncomeMsg.classList.remove('hidden');
        } else {
            incomeTransactions.slice(0, 5).forEach(t => {
                const item = document.createElement('div');
                item.className = 'top-transaction-item';
                item.innerHTML = `<div class="details"><strong>${t.category}</strong><span>${t.date}</span></div><span class="amount income-label">+${formatNumber(parseFloat(t.amount))}</span>`;
                topIncomeList.appendChild(item);
            });
        }
        
        if (expenseTransactions.length === 0) {
            noTopExpenseMsg.classList.remove('hidden');
        } else {
            expenseTransactions.slice(0, 5).forEach(t => {
                const item = document.createElement('div');
                item.className = 'top-transaction-item';
                item.innerHTML = `<div class="details"><strong>${t.category}</strong><span>${t.date}</span></div><span class="amount expense-label">-${formatNumber(parseFloat(t.amount))}</span>`;
                topExpenseList.appendChild(item);
            });
        }
    }
    
    // --- User Management Logic ---
    manageUsersBtn.addEventListener('click', async () => {
        usersModal.style.display = 'block';
        userRoleFilter.value = 'all';
        await renderUsersList();
    });
    usersModalCloseBtn.addEventListener('click', () => { usersModal.style.display = 'none'; addUserForm.classList.add('hidden'); showAddUserFormBtn.innerHTML = '<i class="fas fa-plus"></i> إضافة مستخدم جديد'; addUserForm.reset(); newUserIdInput.value = ''; });
    
    showAddUserFormBtn.addEventListener('click', () => {
        addUserForm.classList.toggle('hidden');
        if (!addUserForm.classList.contains('hidden')) {
            showAddUserFormBtn.textContent = 'إلغاء';
            saveUserBtn.textContent = 'إضافة';
            addUserForm.reset();
            newUserIdInput.value = '';
        } else {
            showAddUserFormBtn.innerHTML = '<i class="fas fa-plus"></i> إضافة مستخدم جديد';
        }
    });

    userRoleFilter.addEventListener('change', renderUsersList);

    addUserForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newUserId = newUserIdInput.value;
        const role = newUserRoleInput.value;
        const username = newUsernameInput.value;
        const password = newPasswordInput.value;
        const description = newUserDescriptionInput.value;
        
        let response;
        if (newUserId) {
            // Replaced fetchAPI('users.php?action=edit', 'POST', { id: newUserId, ... })
            response = await editUser({ id: newUserId, username, password, role, description });
        } else {
            // Replaced fetchAPI('users.php?action=add', 'POST', { ... })
            if (!password) {
                alert('الرجاء إدخال كلمة مرور للمستخدم الجديد.');
                return;
            }
            response = await addUser({ username, password, role, description });
        }
        
        alert(response.message);
        if (response.success) {
            await renderUsersList();
            addUserForm.classList.add('hidden');
            addUserForm.reset();
            showAddUserFormBtn.innerHTML = '<i class="fas fa-plus"></i> إضافة مستخدم جديد';
        }
    });
    
    async function renderUsersList() {
        // Replaced fetchAPI('users.php?action=get')
        const response = await getUsers();
        if (!response.success) {
            usersListContainer.innerHTML = `<p style="text-align:center; padding: 20px;">${response.message}</p>`;
            return;
        }
        
        const usersData = response.users;
        const selectedRole = userRoleFilter.value;
        const filteredUsers = selectedRole === 'all' ? usersData : usersData.filter(u => u.role === selectedRole);
        
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
                    <h4>${user.username} ${user.id == currentUser.id ? '(أنت)' : ''}</h4>
                    <p><strong>الدور:</strong> ${rolesMap[user.role]}</p>
                    <p><strong>الوصف:</strong> ${user.description || 'لا يوجد'}</p>
                </div>
                <div class="user-actions">
                    <button class="action-btn edit-user-btn" data-id="${user.id}" ${user.id == currentUser.id ? 'disabled title="لا يمكنك تعديل دورك/حسابك من هنا"' : ''}><i class="fas fa-edit"></i> تعديل</button>
                    <button class="action-btn delete-user-btn" data-id="${user.id}" ${user.id == currentUser.id ? 'disabled title="لا يمكنك حذف حسابك أثناء تسجيل الدخول"' : ''}><i class="fas fa-trash-alt"></i> حذف</button>
                </div>
            `;
            usersListContainer.appendChild(userCard);
        });

        document.querySelectorAll('.edit-user-btn:not([disabled])').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const userId = e.target.closest('button').dataset.id;
                const userToEdit = users.find(u => u.id == userId);
                if (userToEdit) {
                    newUserIdInput.value = userToEdit.id;
                    newUserRoleInput.value = userToEdit.role;
                    newUsernameInput.value = userToEdit.username;
                    newPasswordInput.value = ''; // Don't pre-fill password for security
                    newUserDescriptionInput.value = userToEdit.description;
                    addUserForm.classList.remove('hidden');
                    saveUserBtn.textContent = 'حفظ التعديل';
                    showAddUserFormBtn.textContent = 'إلغاء';
                }
            });
        });

        document.querySelectorAll('.delete-user-btn:not([disabled])').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const userId = e.target.closest('button').dataset.id;
                if (confirm('هل أنت متأكد من حذف هذا المستخدم؟ سيتم أيضًا حذف جميع معاملاته المعلقة والمعتمدة.')) {
                    // Replaced fetchAPI('users.php?action=delete', 'POST', { id: userId })
                    const response = await deleteUser(userId);
                    alert(response.message);
                    if (response.success) {
                        await renderUsersList();
                        // Re-fetch transactions after user deletion (which also deletes their transactions)
                        await fetchAllData(); 
                        applyFilter();
                        updateSummary();
                        updateChart();
                    }
                }
            });
        });
    }

    // --- Notifications/Pending Transactions Logic ---
    notificationsBtn.addEventListener('click', () => {
        renderPendingTransactions();
        messagesModal.style.display = 'block';
    });
    messagesModalCloseBtn.addEventListener('click', () => messagesModal.style.display = 'none');

    async function renderPendingTransactions() {
        // Replaced fetchAPI('transactions.php?action=pending')
        const response = await getPendingTransactions();
        if (!response.success) {
            pendingTransactionsContainer.innerHTML = `<p style="text-align:center; padding: 20px;">${response.message}</p>`;
            return;
        }
        pendingTransactions = response.pending;
        pendingTransactionsContainer.innerHTML = '';
        const canApprove = ['manager', 'admin', 'editor'].includes(currentUser.role);
        
        if (pendingTransactions.length === 0) {
            noPendingTransactionsMsg.classList.remove('hidden');
        } else {
            noPendingTransactionsMsg.classList.add('hidden');
            pendingTransactions.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).forEach(t => {
                const isEdit = !!t.original_transaction_id;
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
                        <p><strong>المبلغ:</strong> <span class="${t.type}-label">${t.type === 'income' ? '+' : '-'}${formatNumber(parseFloat(t.amount))}</span></p>
                        <p><strong>من/إلى:</strong> ${t.fromTo || 'غير محدد'}</p>
                        <p><strong>ملاحظة:</strong> ${t.note || 'لا توجد'}</p>
                        <div class="card-footer">
                            <p><strong>بواسطة:</strong> ${t.added_by_description} (${t.added_by_username})</p>
                            ${isEdit ? `<p class="status-note">طلب تعديل بواسطة: ${t.edited_by_description} (${t.last_edited_by_username})</p>` : '<p class="status-note">معاملة جديدة بانتظار الموافقة</p>'}
                        </div>
                    </div>
                    ${actionsHTML}
                `;
                pendingTransactionsContainer.appendChild(card);
            });
        }
        updateNotificationBadge();
    }
    
    pendingTransactionsContainer.addEventListener('click', async (e) => {
        const approveBtn = e.target.closest('.approve-btn');
        const rejectBtn = e.target.closest('.reject-btn');
        
        if (approveBtn) {
            const id = approveBtn.dataset.id;
            // Replaced fetchAPI('transactions.php?action=approve', 'POST', { id })
            const response = await approveTransaction(id);
            alert(response.message);
            if(response.success) {
                await fetchAllData();
                applyFilter();
                updateSummary();
                updateChart();
                renderPendingTransactions();
            }
        } else if (rejectBtn) {
            const id = rejectBtn.dataset.id;
            // Replaced fetchAPI('transactions.php?action=reject', 'POST', { id })
            const response = await rejectTransaction(id);
            alert(response.message);
            if(response.success) {
                await fetchAllData();
                applyFilter();
                renderPendingTransactions();
            }
        }
    });

    function updateNotificationBadge() {
        if (!currentUser) return;
        
        // Only show badge if the user has permission to approve
        const canApprove = ['manager', 'admin', 'editor'].includes(currentUser.role);
        const count = canApprove ? pendingTransactions.length : 0;
        
        if (count > 0) {
            notificationBadge.textContent = count;
            notificationBadge.classList.remove('hidden');
        } else {
            notificationBadge.classList.add('hidden');
        }
    }
    
    // --- Permissions (Approved Transactions) Logic ---
    permissionsBtn.addEventListener('click', async () => {
        permissionsModal.style.display = 'block';
        approvedDurationFilter.value = 'current-month';
        customDateFilter.classList.add('hidden');
        await renderApprovedTransactions();
    });
    permissionsModalCloseBtn.addEventListener('click', () => permissionsModal.style.display = 'none');
    approvedDurationFilter.addEventListener('change', async () => {
        if (approvedDurationFilter.value === 'custom') {
            customDateFilter.classList.remove('hidden');
        } else {
            customDateFilter.classList.add('hidden');
            await renderApprovedTransactions();
        }
    });
    approvedFromDate.addEventListener('change', renderApprovedTransactions);
    approvedToDate.addEventListener('change', renderApprovedTransactions);
    
    async function renderApprovedTransactions() {
        // Replaced fetchAPI('transactions.php?action=get')
        const response = await getTransactions();
        if (!response.success) {
            approvedTransactionsContainer.innerHTML = `<p style="text-align:center; padding: 20px;">${response.message}</p>`;
            return;
        }

        const allApproved = response.transactions.filter(t => t.approved_by_id); // Filter by existing approved_by_id
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
                to.setDate(to.getDate() + 1); // To include the 'toDate' fully
                filteredApproved = allApproved.filter(t => {
                    const transactionDate = new Date(t.date);
                    return transactionDate >= from && transactionDate < to;
                });
            }
        }
        
        approvedTransactionsContainer.innerHTML = '';
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
                        <p><strong>المبلغ:</strong> <span class="${t.type}-label">${t.type === 'income' ? '+' : '-'}${formatNumber(parseFloat(t.amount))}</span></p>
                        <p><strong>من/إلى:</strong> ${t.fromTo || 'غير محدد'}</p>
                        <p><strong>ملاحظة:</strong> ${t.note || 'لا توجد'}</p>
                        <div class="card-footer">
                            <p><strong>أضيفت بواسطة:</strong> ${t.added_by_description} (${t.added_by_username})</p>
                            <p><strong>تمت الموافقة بواسطة:</strong> ${t.approved_by_description} (${t.approved_by_username})</p>
                        </div>
                    </div>
                `;
                approvedTransactionsContainer.appendChild(card);
            });
        }
    }
    
    // --- Chart Logic ---
    function initializeChart() {
        const ctx = chartCanvas.getContext('2d');
        if (myChart) myChart.destroy();
        myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [ { label: 'الدخل', data: [], backgroundColor: 'rgba(46, 204, 113, 0.5)', borderColor: 'rgba(46, 204, 113, 1)', borderWidth: 1 }, { label: 'المصروفات', data: [], backgroundColor: 'rgba(231, 76, 60, 0.5)', borderColor: 'rgba(231, 76, 60, 1)', borderWidth: 1 } ]
            },
            options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }
        });
    }

    function updateChart() {
        const incomeData = {};
        const expenseData = {};
        // Only use approved transactions
        const approvedTransactions = transactions.filter(t => t.approved_by_id);
        const sortedTransactions = [...approvedTransactions].sort((a, b) => new Date(a.date) - new Date(b.date));
        
        sortedTransactions.forEach(t => {
            let key;
            if (chartFilterType === 'yearly') {
                key = t.date.substring(0, 4);
            } else {
                key = t.date.substring(0, 7);
            }

            if (t.type === 'income') {
                incomeData[key] = (incomeData[key] || 0) + parseFloat(t.amount);
            } else {
                expenseData[key] = (expenseData[key] || 0) + parseFloat(t.amount);
            }
        });
        
        let allMonths = [...new Set([...Object.keys(incomeData), ...Object.keys(expenseData)])].sort();
        if (chartFilterType === 'monthly' && allMonths.length > 6) {
            allMonths = allMonths.slice(-6);
        }

        const labels = allMonths.map(key => {
            if (key.includes('-')) {
                const parts = key.split('-');
                return monthNames[parseInt(parts[1], 10) - 1] + ' ' + parts[0];
            }
            return key;
        });

        const incomeValues = allMonths.map(month => incomeData[month] || 0);
        const expenseValues = allMonths.map(month => expenseData[month] || 0);

        myChart.data.labels = labels;
        myChart.data.datasets[0].data = incomeValues;
        myChart.data.datasets[1].data = expenseValues;
        myChart.update();
    }
    
    chartMenuBtn.addEventListener('click', () => chartOptions.classList.toggle('hidden'));
    chartFilterMonthlyBtn.addEventListener('click', () => { chartFilterType = 'monthly'; chartOptions.classList.add('hidden'); chartFilterMonthlyBtn.classList.add('active'); chartFilterYearlyBtn.classList.remove('active'); updateChart(); });
    chartFilterYearlyBtn.addEventListener('click', () => { chartFilterType = 'yearly'; chartOptions.classList.add('hidden'); chartFilterYearlyBtn.classList.add('active'); chartFilterMonthlyBtn.classList.remove('active'); updateChart(); });
    chartFilterMonthlyBtn.classList.add('active');

    // --- Summary Logic ---
    function updateSummary() {
        // Only count approved transactions for the main summary
        const approvedTransactions = transactions.filter(t => t.approved_by_id);
        let totalIncome = approvedTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + parseFloat(t.amount), 0);
        let totalExpenses = approvedTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + parseFloat(t.amount), 0);
        const balance = totalIncome - totalExpenses;

        totalIncomeSpan.textContent = formatNumber(totalIncome);
        totalExpensesSpan.textContent = formatNumber(totalExpenses);
        balanceSpan.textContent = formatNumber(balance);
        balanceSpan.style.color = balance >= 0 ? 'var(--success-color)' : 'var(--danger-color)';
    }

    // --- Transaction Card Rendering ---
    function createTransactionCard(transaction) {
        const transactionCard = document.createElement('div');
        let cardClass = `transaction-card ${transaction.type}-card`;
        
        // Note: The original code used rolesMap[transaction.last_edited_by_username] which is incorrect as rolesMap keys are roles. 
        // We will check against the user's role found via their ID.
        const lastEditedUser = transaction.last_edited_by_id ? users.find(u => u.id === transaction.last_edited_by_id) : null;
        const lastEditedUserRole = lastEditedUser ? lastEditedUser.role : '';

        if (lastEditedUserRole && !['manager', 'admin'].includes(lastEditedUserRole)) {
            cardClass += ' edited-by-user';
        }
        
        transactionCard.className = cardClass;
        
        const cardInnerHtml = `
            <p><strong>التاريخ:</strong> ${transaction.date}</p>
            <p><strong>التصنيف:</strong> ${transaction.category}</p>
            <p><strong>من/إلى:</strong> ${transaction.fromTo || 'غير محدد'}</p>
            <p><strong>ملاحظة:</strong> ${transaction.note || 'لا توجد'}</p>
            <span class="amount ${transaction.type}-label">${transaction.type === 'income' ? '+' : '-'}${formatNumber(parseFloat(transaction.amount))}</span>
            <span class="user-info"><i class="fas fa-user-tag"></i> <strong>بواسطة:</strong> ${transaction.added_by_description} (${transaction.added_by_username})</span>
            ${transaction.last_edited_by_username ? `<span class="user-info" style="color:#c49500;"><i class="fas fa-user-edit"></i> <strong>آخر تعديل:</strong> ${transaction.edited_by_description} (${transaction.last_edited_by_username})</span>` : ''}
            ${transaction.approved_by_username ? `<span class="user-info approved-info"><i class="fas fa-check-circle"></i> <strong>الموافقة:</strong> ${transaction.approved_by_description} (${transaction.approved_by_username})</span>` : ''}
        `;

        const canEdit = ['manager', 'admin', 'editor', 'employee', 'new_employee'].includes(currentUser.role);
        const canDelete = ['manager', 'admin'].includes(currentUser.role);

        if (canEdit || canDelete) {
            transactionCard.classList.add('can-interact');
            let actionsHtml = `<div class="transaction-actions">`;
            // Only non-managers/admins need to submit edit requests, but everyone can initiate the form
            if (canEdit) actionsHtml += `<button class="action-btn edit-btn" data-id="${transaction.id}"><i class="fas fa-edit"></i></button>`;
            if (canDelete) actionsHtml += `<button class="action-btn delete-btn" data-id="${transaction.id}"><i class="fas fa-trash-alt"></i></button>`;
            actionsHtml += `</div>`;
            transactionCard.innerHTML = cardInnerHtml + actionsHtml;
        } else {
            transactionCard.innerHTML = cardInnerHtml;
        }
        transactionCard.dataset.id = transaction.id;
        return transactionCard;
    }
    
    // --- Transaction Display Logic ---
    function updateTransactionsContainer(filteredTransactions) {
        transactionsContainer.innerHTML = '';
        const sortedTransactions = [...filteredTransactions].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        if (sortedTransactions.length === 0) {
            transactionsContainer.innerHTML = '<p class="no-transactions" style="text-align:center; padding: 20px;">لا توجد معاملات في هذه الفترة.</p>';
            return;
        }

        const duration = durationFilter.value;
        const groupedData = {};
        sortedTransactions.forEach(t => {
            let key;
            // Group by year for yearly filters, or month for others
            if (duration === 'current-year' || duration === 'last-year' || duration.includes('year') || isSearchActive && searchFromDateInput.value && searchToDateInput.value && (new Date(searchToDateInput.value).getFullYear() - new Date(searchFromDateInput.value).getFullYear() > 0)) {
                key = t.date.substring(0, 4);
            } else {
                key = t.date.substring(0, 7);
            }
            
            if (!groupedData[key]) {
                groupedData[key] = { income: 0, expenses: 0, transactions: [] };
            }
            if (t.type === 'income') {
                groupedData[key].income += parseFloat(t.amount);
            } else {
                groupedData[key].expenses += parseFloat(t.amount);
            }
            groupedData[key].transactions.push(t);
        });
        
        const sortedKeys = Object.keys(groupedData).sort().reverse();
        
        sortedKeys.forEach(key => {
            const groupData = groupedData[key];
            const summaryDiv = document.createElement('div');
            const balance = groupData.income - groupData.expenses;
            
            let titleText;
            let groupTypeClass;
            if (key.includes('-') && key.length === 7) { // YYYY-MM
                const parts = key.split('-');
                titleText = `ملخص شهر ${monthNames[parseInt(parts[1], 10) - 1]} ${parts[0]}`;
                groupTypeClass = 'monthly-summary';
            } else if (key.length === 4) { // YYYY
                titleText = `ملخص عام ${key}`;
                groupTypeClass = 'yearly-summary';
            } else {
                 titleText = `ملخص الفترة: ${key}`; // Should not happen with current logic, but fallback
                 groupTypeClass = 'search-summary';
            }

            if (isSearchActive) groupTypeClass = 'search-summary';
            
            summaryDiv.className = groupTypeClass;
            summaryDiv.innerHTML = `<span class="summary-title">${titleText}</span><div class="summary-details"><p><strong>دخل:</strong> <span class="income-label">${formatNumber(groupData.income)}</span></p><p><strong>مصروف:</strong> <span class="expense-label">${formatNumber(groupData.expenses)}</span></p><p><strong>صافي:</strong> <span class="balance-label" style="color:${balance >= 0 ? 'var(--success-color)' : 'var(--danger-color)'}">${formatNumber(balance)}</span></p></div>`;
            transactionsContainer.appendChild(summaryDiv);
            
            groupData.transactions.forEach(transaction => transactionsContainer.appendChild(createTransactionCard(transaction)));
        });
    }

    function getFilteredTransactions(duration) {
        const today = new Date();
        const approvedTransactions = transactions.filter(t => t.approved_by_id); // Only approved transactions
        let filtered = [];
        
        if (duration === 'all') {
             filtered = approvedTransactions;
        } else if (duration === 'today') {
            const todayStr = today.toISOString().split('T')[0];
            filtered = approvedTransactions.filter(t => t.date === todayStr);
        } else if (duration === 'current-month') {
            const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
            const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
            filtered = approvedTransactions.filter(t => t.date >= firstDayOfMonth && t.date <= lastDayOfMonth);
        } else if (duration === 'last-month') {
            const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            const firstDayOfLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1).toISOString().split('T')[0];
            const lastDayOfLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0).toISOString().split('T')[0];
            filtered = approvedTransactions.filter(t => t.date >= firstDayOfLastMonth && t.date <= lastDayOfLastMonth);
        } else if (duration === 'current-year') {
            const currentYear = today.getFullYear();
            filtered = approvedTransactions.filter(t => new Date(t.date).getFullYear() == currentYear);
        } else if (duration === 'last-year') {
            const lastYear = today.getFullYear() - 1;
            filtered = approvedTransactions.filter(t => new Date(t.date).getFullYear() == lastYear);
        }
        return filtered;
    }

    function applyFilter() {
        if (isSearchActive) {
            performAdvancedSearch();
            return;
        }
        const filtered = getFilteredTransactions(durationFilter.value);
        updateTransactionsContainer(filtered);
    }
    durationFilter.addEventListener('change', applyFilter);
    
    // --- Transaction Modal & Form Logic ---
    addIncomeBtn.addEventListener('click', () => { modal.style.display = 'block'; modalTitle.textContent = 'إضافة دخل'; transactionTypeInput.value = 'income'; transactionIdInput.value = ''; transactionForm.reset(); transactionFormSubmitBtn.textContent = 'إضافة'; transactionFormSubmitBtn.disabled = false; });
    addExpenseBtn.addEventListener('click', () => { modal.style.display = 'block'; modalTitle.textContent = 'إضافة مصروف'; transactionTypeInput.value = 'expense'; transactionIdInput.value = ''; transactionForm.reset(); transactionFormSubmitBtn.textContent = 'إضافة'; transactionFormSubmitBtn.disabled = false; });
    closeBtn.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => { if (e.target.classList.contains('modal')) e.target.style.display = 'none'; });
    
    transactionForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        transactionFormSubmitBtn.disabled = true;
        const originalText = transactionFormSubmitBtn.textContent;
        transactionFormSubmitBtn.textContent = 'جاري الإرسال...';
        
        const type = transactionTypeInput.value;
        const date = document.getElementById('date').value;
        const category = document.getElementById('category').value;
        const amount = parseFloat(document.getElementById('amount').value);
        const fromTo = document.getElementById('from-to').value;
        const note = document.getElementById('note').value;
        const transactionId = transactionIdInput.value;
        
        const data = { type, date, category, amount, fromTo, note };
        let response;
        
        if (transactionId) {
            data.id = transactionId;
            // Replaced fetchAPI('transactions.php?action=edit', 'POST', data)
            response = await editTransaction(data);
        } else {
            // Replaced fetchAPI('transactions.php?action=add', 'POST', data)
            response = await addTransaction(data);
        }
        
        alert(response.message);
        if (response.success) {
            await fetchAllData();
            applyFilter();
            updateSummary();
            updateChart();
        }
        
        setTimeout(() => {
            transactionFormSubmitBtn.disabled = false;
            transactionFormSubmitBtn.textContent = originalText;
            modal.style.display = 'none';
        }, 300); // Reduced delay for local operations
    });
    
    // --- Transaction Actions (Edit/Delete) Logic ---
    transactionsContainer.addEventListener('click', async (e) => {
        const editBtn = e.target.closest('.edit-btn');
        const deleteBtn = e.target.closest('.delete-btn');
        const swipedCard = e.target.closest('.transaction-card.swiped');

        if (editBtn) {
            const transactionId = editBtn.dataset.id;
            const transaction = transactions.find(t => t.id == transactionId);
            if (transaction) {
                modalTitle.textContent = 'تعديل المعاملة';
                transactionTypeInput.value = transaction.type;
                transactionIdInput.value = transaction.id;
                document.getElementById('date').value = transaction.date;
                document.getElementById('category').value = transaction.category;
                document.getElementById('amount').value = parseFloat(transaction.amount);
                document.getElementById('from-to').value = transaction.fromTo;
                document.getElementById('note').value = transaction.note;
                
                const isManagerOrAdmin = ['manager', 'admin'].includes(currentUser.role);
                transactionFormSubmitBtn.textContent = isManagerOrAdmin ? 'تعديل مباشر' : 'طلب تعديل';
                transactionFormSubmitBtn.disabled = false;
                modal.style.display = 'block';
            }
        } else if (deleteBtn) {
            const transactionId = deleteBtn.dataset.id;
            if (confirm('هل أنت متأكد من حذف هذه المعاملة؟')) {
                // Replaced fetchAPI('transactions.php?action=delete', 'POST', { id: transactionId })
                const response = await deleteTransaction(transactionId);
                alert(response.message);
                if(response.success) {
                    await fetchAllData();
                    applyFilter();
                    updateSummary();
                    updateChart();
                }
            }
        }
        if (swipedCard) {
            swipedCard.classList.remove('swiped');
            swipedCard.style.transform = 'translateX(0)';
            const actions = swipedCard.querySelector('.transaction-actions');
            if(actions) actions.style.left = '-120px';
        }
    });

    // --- Touch Swipe Logic ---
    let startX = 0;
    let currentCard = null;

    transactionsContainer.addEventListener('touchstart', (e) => {
        const card = e.target.closest('.transaction-card.can-interact');
        if (card) {
            if (currentCard && currentCard !== card) {
                currentCard.style.transform = 'translateX(0)';
                currentCard.classList.remove('swiped');
                const actions = currentCard.querySelector('.transaction-actions');
                if (actions) actions.style.left = '-120px';
            }
            startX = e.touches[0].clientX;
            currentCard = card;
        }
    }, { passive: true });

    transactionsContainer.addEventListener('touchmove', (e) => {
        if (currentCard) {
            const currentX = e.touches[0].clientX;
            const diffX = currentX - startX;
            if (diffX > 20) {
                const swipeDistance = Math.min(diffX, 120);
                currentCard.style.transform = `translateX(${swipeDistance}px)`;
                const actions = currentCard.querySelector('.transaction-actions');
                if(actions) actions.style.left = `-${120 - swipeDistance}px`;
            } else {
                currentCard.style.transform = 'translateX(0)';
                const actions = currentCard.querySelector('.transaction-actions');
                if(actions) actions.style.left = '-120px';
            }
        }
    }, { passive: true });

    transactionsContainer.addEventListener('touchend', (e) => {
        if (currentCard) {
            const endX = e.changedTouches[0].clientX;
            const diffX = endX - startX;
            const actions = currentCard.querySelector('.transaction-actions');
            if (diffX > 60) {
                currentCard.style.transform = 'translateX(120px)';
                if(actions) actions.style.left = '0';
                currentCard.classList.add('swiped');
            } else {
                currentCard.style.transform = 'translateX(0)';
                if(actions) actions.style.left = '-120px';
                currentCard.classList.remove('swiped');
            }
            currentCard = null;
        }
    });

    document.addEventListener('click', (e) => {
        document.querySelectorAll('.transaction-card.swiped').forEach(card => {
            if (!card.contains(e.target)) {
                card.style.transform = 'translateX(0)';
                card.classList.remove('swiped');
                const actions = card.querySelector('.transaction-actions');
                if (actions) {
                    actions.style.left = '-120px';
                }
            }
        });
    });

    
    // --- Advanced Search Logic ---
    advancedSearchBtn.addEventListener('click', () => advancedSearchModal.style.display = 'block');
    advancedSearchModalCloseBtn.addEventListener('click', () => advancedSearchModal.style.display = 'none');
    
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
        
        // Only search approved transactions
        const approvedTransactions = transactions.filter(t => t.approved_by_id);

        const filtered = approvedTransactions.filter(t => {
            const typeMatch = searchType === '' || t.type === searchType;
            const categoryMatch = searchCategory === '' || (t.category && t.category.toLowerCase().includes(searchCategory));
            const noteMatch = searchNote === '' || (t.note && t.note.toLowerCase().includes(searchNote));
            const fromToMatch = searchFromTo === '' || (t.fromTo && t.fromTo.toLowerCase().includes(searchFromTo));
            
            // Manager only search criteria for username
            let usernameMatch = true;
            if (currentUser && currentUser.role === 'manager' && searchUsername !== '') {
                usernameMatch = (t.added_by_username && t.added_by_username.toLowerCase().includes(searchUsername));
            } else if (currentUser && currentUser.role !== 'manager' && searchUsername !== '') {
                 // Non-managers should not see this field's effect unless they are searching their own name, but for consistency we use the original logic if the field is visible.
                 usernameMatch = (t.added_by_username && t.added_by_username.toLowerCase().includes(searchUsername));
            }
            
            let dateMatch = true;
            const transactionDate = new Date(t.date);
            if (searchFromDate) {
                const fromDate = new Date(searchFromDate);
                if (transactionDate < fromDate) dateMatch = false;
            }
            if (searchToDate) {
                const toDate = new Date(searchToDate);
                toDate.setDate(toDate.getDate() + 1);
                if (transactionDate >= toDate) dateMatch = false;
            }
            return typeMatch && categoryMatch && noteMatch && fromToMatch && usernameMatch && dateMatch;
        });
        updateTransactionsContainer(filtered);
    }
    
    searchActiveBadge.addEventListener('click', () => clearSearchBtn.click());

    // --- Backup/Restore Logic ---
    backupBtn.addEventListener('click', () => backupModal.style.display = 'block');
    backupModalCloseBtn.addEventListener('click', () => backupModal.style.display = 'none');
    
    createBackupBtn.addEventListener('click', async () => {
        // Data is already in memory, just structure it
        const backupData = {
            users: users,
            transactions: loadFromLocalStorage(LS_TRANSACTIONS),
            pendingTransactions: loadFromLocalStorage(LS_PENDING),
            backupDate: new Date().toISOString(),
            version: 1.0 // Optional versioning
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
        reader.onload = async (e) => {
            try {
                const restoredData = JSON.parse(e.target.result);
                if (restoredData && restoredData.users && restoredData.transactions) {
                    if (confirm('هل أنت متأكد من أنك تريد استعادة هذه البيانات؟ سيتم الكتابة فوق جميع البيانات الحالية في المتصفح.')) {
                        // Restore to localStorage
                        saveToLocalStorage(LS_USERS, restoredData.users);
                        saveToLocalStorage(LS_TRANSACTIONS, restoredData.transactions);
                        // Pending transactions is optional in backup
                        if (restoredData.pendingTransactions) {
                            saveToLocalStorage(LS_PENDING, restoredData.pendingTransactions);
                        } else {
                            localStorage.removeItem(LS_PENDING); // Clear if not in backup
                        }
                        
                        alert('تم استعادة البيانات بنجاح من الملف! سيتم إعادة تحميل التطبيق.');
                        window.location.reload(); // Force reload to ensure all data is loaded from LS
                    }
                } else {
                    alert('ملف النسخة الاحتياطية غير صالح أو تالف. يجب أن يحتوي على "users" و "transactions".');
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
    
    // --- Start Application ---
    checkLoginStatus();
});
