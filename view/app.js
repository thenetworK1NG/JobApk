// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, ref, onValue, remove, update } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDcxQLLka_eZ5tduUW3zEAKKdKMvebeXRI",
  authDomain: "job-card-8bb4b.firebaseapp.com",
  databaseURL: "https://job-card-8bb4b-default-rtdb.firebaseio.com",
  projectId: "job-card-8bb4b",
  storageBucket: "job-card-8bb4b.firebasestorage.app",
  messagingSenderId: "355622785459",
  appId: "1:355622785459:web:fc49655132c77fb9cbfbc6",
  measurementId: "G-T7EET4NRQR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Global variables
let allJobs = [];
let currentJobId = null;

// DOM elements
const loadingIndicator = document.getElementById('loadingIndicator');
const jobsList = document.getElementById('jobsList');
const noJobsMessage = document.getElementById('noJobsMessage');
const assigneeFilter = document.getElementById('assigneeFilter');
const searchInput = document.getElementById('searchInput');
const refreshBtn = document.getElementById('refreshBtn');
const jobModal = document.getElementById('jobModal');
const deleteModal = document.getElementById('deleteModal');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    loadJobs();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Filter and search
    assigneeFilter.addEventListener('change', filterJobs);
    searchInput.addEventListener('input', filterJobs);
    
    // Refresh button
    refreshBtn.addEventListener('click', () => {
        refreshBtn.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            refreshBtn.style.transform = 'rotate(0deg)';
        }, 600);
        loadJobs();
    });
    
    // Modal controls
    document.getElementById('closeModal').addEventListener('click', closeJobModal);
    document.getElementById('closeDeleteModal').addEventListener('click', closeDeleteModal);
    document.getElementById('deleteJobBtn').addEventListener('click', showDeleteConfirmation);
    document.getElementById('markCompleteBtn').addEventListener('click', markJobComplete);
    document.getElementById('confirmDelete').addEventListener('click', deleteJob);
    document.getElementById('cancelDelete').addEventListener('click', closeDeleteModal);
    
    // Close modals when clicking outside
    jobModal.addEventListener('click', (e) => {
        if (e.target === jobModal) closeJobModal();
    });
    
    deleteModal.addEventListener('click', (e) => {
        if (e.target === deleteModal) closeDeleteModal();
    });
}

// Load jobs from Firebase
function loadJobs() {
    showLoading(true);
    
    const jobsRef = ref(database, 'jobCards');
    onValue(jobsRef, (snapshot) => {
        allJobs = [];
        
        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                const job = {
                    id: childSnapshot.key,
                    ...childSnapshot.val()
                };
                allJobs.push(job);
            });
        }
        
        // Sort jobs by date (newest first)
        allJobs.sort((a, b) => {
            const dateA = new Date(a.date || '1970-01-01');
            const dateB = new Date(b.date || '1970-01-01');
            return dateB - dateA;
        });
        
        showLoading(false);
        filterJobs();
    }, (error) => {
        console.error('Error loading jobs:', error);
        showLoading(false);
        showNoJobs();
    });
}

// Filter and display jobs
function filterJobs() {
    const assigneeFilter = document.getElementById('assigneeFilter').value.toLowerCase();
    const searchQuery = document.getElementById('searchInput').value.toLowerCase();
    
    let filteredJobs = allJobs.filter(job => {
        const matchesAssignee = !assigneeFilter || 
            (job.assignedTo && job.assignedTo.toLowerCase() === assigneeFilter);
        const matchesSearch = !searchQuery || 
            (job.customerName && job.customerName.toLowerCase().includes(searchQuery));
        
        return matchesAssignee && matchesSearch;
    });
    
    displayJobs(filteredJobs);
}

// Display jobs in the grid
function displayJobs(jobs) {
    if (jobs.length === 0) {
        showNoJobs();
        return;
    }
    
    hideNoJobs();
    
    jobsList.innerHTML = jobs.map(job => `
        <div class="job-card ${job.completed ? 'completed' : ''}" onclick="showJobDetails('${job.id}')">
            <div class="customer-name">${escapeHtml(job.customerName || 'Unknown Customer')}</div>
            <div class="job-meta">
                <span class="job-date">${formatDate(job.date)}</span>
                <span class="assigned-to">${escapeHtml(job.assignedTo || 'Unassigned')}</span>
            </div>
            <div class="job-description">${escapeHtml(job.jobDescription || 'No description provided')}</div>
            <div class="job-total">Total: R${formatCurrency(job.jobTotal || 0)}</div>
        </div>
    `).join('');
}

// Show job details in modal
function showJobDetails(jobId) {
    const job = allJobs.find(j => j.id === jobId);
    if (!job) return;
    
    currentJobId = jobId;
    
    document.getElementById('modalCustomerName').textContent = job.customerName || 'Unknown Customer';
    
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <div class="detail-section">
            <h4>Customer Information</h4>
            <p><strong>Name:</strong> ${escapeHtml(job.customerName || 'N/A')}</p>
            <p><strong>Phone:</strong> ${escapeHtml(job.customerCell || 'N/A')}</p>
            <p><strong>Email:</strong> ${escapeHtml(job.email || 'N/A')}</p>
            <p><strong>Date:</strong> ${formatDate(job.date)}</p>
        </div>
        
        <div class="detail-section">
            <h4>Job Assignment</h4>
            <p><strong>Assigned To:</strong> ${escapeHtml(job.assignedTo || 'Unassigned')}</p>
            <p><strong>Status:</strong> ${job.completed ? 'Completed' : 'In Progress'}</p>
        </div>
        
        <div class="detail-section">
            <h4>Financial Details</h4>
            <p><strong>Job Total:</strong> R${formatCurrency(job.jobTotal || 0)}</p>
            <p><strong>Deposit:</strong> R${formatCurrency(job.deposit || 0)}</p>
            <p><strong>Balance Due:</strong> R${formatCurrency(job.balanceDue || 0)}</p>
        </div>
        
        <div class="detail-section">
            <h4>Job Description</h4>
            <p>${escapeHtml(job.jobDescription || 'No description provided')}</p>
        </div>
        
        <div class="detail-section">
            <h4>Selected Options</h4>
            <div class="options-grid">
                ${generateOptionsHTML(job)}
            </div>
        </div>
    `;
    
    // Update modal buttons based on job status
    const completeBtn = document.getElementById('markCompleteBtn');
    if (job.completed) {
        completeBtn.textContent = 'Mark Incomplete';
        completeBtn.className = 'secondary-btn';
    } else {
        completeBtn.textContent = 'Mark Complete';
        completeBtn.className = 'complete-btn';
    }
    
    jobModal.style.display = 'flex';
}

// Generate options HTML
function generateOptionsHTML(job) {
    const optionCategories = [
        { name: 'Stickers', key: 'stickers' },
        { name: 'Other', key: 'other' },
        { name: 'Banner/Canvas', key: 'banner_canvas' },
        { name: 'Boards', key: 'boards' }
    ];
    
    return optionCategories.map(category => {
        const options = job[category.key] || [];
        if (options.length === 0) return '';
        
        return `
            <div class="option-category">
                <h5>${category.name}</h5>
                <ul class="option-list">
                    ${options.map(option => `<li>${escapeHtml(option)}</li>`).join('')}
                </ul>
            </div>
        `;
    }).filter(html => html).join('');
}

// Mark job as complete/incomplete
function markJobComplete() {
    if (!currentJobId) return;
    
    const job = allJobs.find(j => j.id === currentJobId);
    if (!job) return;
    
    const newStatus = !job.completed;
    const jobRef = ref(database, `jobCards/${currentJobId}`);
    
    update(jobRef, { completed: newStatus })
        .then(() => {
            console.log(`Job ${newStatus ? 'completed' : 'reopened'} successfully`);
            closeJobModal();
            loadJobs(); // Reload to update the view
        })
        .catch((error) => {
            console.error('Error updating job status:', error);
            alert('Failed to update job status. Please try again.');
        });
}

// Show delete confirmation
function showDeleteConfirmation() {
    closeJobModal();
    deleteModal.style.display = 'flex';
}

// Delete job
function deleteJob() {
    if (!currentJobId) return;
    
    const jobRef = ref(database, `jobCards/${currentJobId}`);
    
    remove(jobRef)
        .then(() => {
            console.log('Job deleted successfully');
            closeDeleteModal();
            loadJobs(); // Reload to update the view
        })
        .catch((error) => {
            console.error('Error deleting job:', error);
            alert('Failed to delete job. Please try again.');
        });
}

// Modal control functions
function closeJobModal() {
    jobModal.style.display = 'none';
    currentJobId = null;
}

function closeDeleteModal() {
    deleteModal.style.display = 'none';
}

// Utility functions
function showLoading(show) {
    loadingIndicator.style.display = show ? 'block' : 'none';
}

function showNoJobs() {
    jobsList.style.display = 'none';
    noJobsMessage.style.display = 'block';
}

function hideNoJobs() {
    jobsList.style.display = 'grid';
    noJobsMessage.style.display = 'none';
}

function formatDate(dateString) {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-ZA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatCurrency(amount) {
    const num = parseFloat(amount) || 0;
    return num.toFixed(2);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
