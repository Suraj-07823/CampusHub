// Study Groups JavaScript
import { auth, db } from './firebase-config.js';
import { collection, addDoc, getDocs, query, where, orderBy } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const createGroupBtn = document.getElementById('createGroupBtn');
    const createGroupModal = document.getElementById('createGroupModal');
    const createGroupForm = document.getElementById('createGroupForm');
    const closeModalBtn = document.querySelector('.close');
    const authButton = document.getElementById('authButton');
    const studyGroupsGrid = document.getElementById('studyGroupsGrid');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const subjectFilter = document.getElementById('subjectFilter');
    const dayFilter = document.getElementById('dayFilter');

    // Check authentication state
    onAuthStateChanged(auth, (user) => {
        if (user) {
            authButton.textContent = 'Logout';
            createGroupBtn.style.display = 'block';
        } else {
            authButton.textContent = 'Login';
            createGroupBtn.style.display = 'none';
        }
    });

    // Event Listeners
    createGroupBtn.addEventListener('click', () => {
        if (!auth.currentUser) {
            showNotification('Please log in to create a study group', 'error');
            window.location.href = 'auth.html';
            return;
        }
        createGroupModal.style.display = 'block';
    });

    closeModalBtn.addEventListener('click', () => {
        createGroupModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === createGroupModal) {
            createGroupModal.style.display = 'none';
        }
    });

    // Form submission
    createGroupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        try {
            if (!auth.currentUser) {
                throw new Error('Please log in to create a study group');
            }

            const formData = new FormData(e.target);
            
            // Validate required fields
            const requiredFields = ['groupName', 'subject', 'course', 'description', 'semester'];
            for (const field of requiredFields) {
                if (!formData.get(field)) {
                    throw new Error(`Please fill in the ${field.replace('groupName', 'group name')} field`);
                }
            }

            const groupData = {
                name: formData.get('groupName').trim(),
                subject: formData.get('subject'),
                course: formData.get('course').trim(),
                description: formData.get('description').trim(),
                semester: formData.get('semester'),
                maxParticipants: parseInt(formData.get('maxParticipants')) || 50,
                resources: formData.get('resources')?.trim() || '',
                createdBy: auth.currentUser.uid,
                creatorName: auth.currentUser.displayName || 'Anonymous',
                creatorEmail: auth.currentUser.email,
                createdAt: new Date(),
                participants: [auth.currentUser.uid],
                active: true
            };

            // Validate data types
            if (isNaN(groupData.maxParticipants) || groupData.maxParticipants < 2) {
                throw new Error('Maximum participants must be at least 2');
            }

            const docRef = await addDoc(collection(db, 'studyGroups'), groupData);
            console.log('Study group created with ID:', docRef.id);
            
            showNotification('Study group created successfully!', 'success');
            createGroupModal.style.display = 'none';
            e.target.reset();
            loadStudyGroups();
        } catch (error) {
            console.error('Error creating study group:', error);
            showNotification(error.message || 'Error creating study group. Please try again.', 'error');
        }
    });

    // Load study groups on page load
    loadStudyGroups();

    // Search and Filter
    function filterStudyGroups() {
        const searchTerm = searchInput.value.toLowerCase();
        const subject = subjectFilter.value;
        const day = dayFilter.value;

        const filtered = studyGroups.filter(group => {
            const matchesSearch = group.name.toLowerCase().includes(searchTerm) ||
                                group.description.toLowerCase().includes(searchTerm);
            const matchesSubject = !subject || group.subject === subject;
            const matchesDay = !day || group.meetingDay === day;

            return matchesSearch && matchesSubject && matchesDay;
        });

        displayStudyGroups(filtered);
    }

    searchInput.addEventListener('input', filterStudyGroups);
    searchButton.addEventListener('click', filterStudyGroups);
    subjectFilter.addEventListener('change', filterStudyGroups);
    dayFilter.addEventListener('change', filterStudyGroups);
});

// Function to show notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());
    
    document.body.appendChild(notification);

    // Trigger reflow
    notification.offsetHeight;

    // Show notification
    setTimeout(() => notification.classList.add('show'), 10);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Function to load study groups
async function loadStudyGroups() {
    const studyGroupsGrid = document.getElementById('studyGroupsGrid');
    studyGroupsGrid.innerHTML = '<div class="loading-spinner"></div>';

    try {
        const q = query(collection(db, 'studyGroups'), where('active', '==', true), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            studyGroupsGrid.innerHTML = '<p class="error-message">No study groups found. Be the first to create one!</p>';
            return;
        }

        studyGroupsGrid.innerHTML = '';
        querySnapshot.forEach((doc) => {
            const group = { id: doc.id, ...doc.data() };
            const card = createStudyGroupCard(group);
            studyGroupsGrid.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading study groups:', error);
        studyGroupsGrid.innerHTML = '<p class="error-message">Error loading study groups. Please try again later.</p>';
        showNotification('Error loading study groups. Please refresh the page.', 'error');
    }
}

// Function to create a study group card
function createStudyGroupCard(group) {
    const template = document.getElementById('studyGroupTemplate');
    const card = template.content.cloneNode(true);

    // Update card content with group data
    card.querySelector('.group-name').textContent = group.name;
    card.querySelector('.group-subject').textContent = formatSubject(group.subject);
    card.querySelector('.group-course').textContent = group.course;
    card.querySelector('.group-description').textContent = group.description;
    card.querySelector('.group-semester').textContent = `Semester ${group.semester}`;
    card.querySelector('.group-participants').textContent = `${group.participants.length}/${group.maxParticipants} participants`;

    // Add resources if available
    if (group.resources) {
        const resourcesSection = document.createElement('div');
        resourcesSection.className = 'resources-section';
        resourcesSection.innerHTML = `
            <h4><i class="fas fa-book"></i> Study Materials</h4>
            <div class="resources-content">${group.resources}</div>
        `;
        card.querySelector('.group-details').appendChild(resourcesSection);
    }

    // Creator info
    const creatorInfo = document.createElement('div');
    creatorInfo.className = 'creator-info';
    creatorInfo.innerHTML = `
        <small>Created by: ${group.creatorName}</small>
    `;
    card.querySelector('.group-details').appendChild(creatorInfo);

    const joinButton = card.querySelector('.join-group-btn');
    if (auth.currentUser) {
        if (group.participants.includes(auth.currentUser.uid)) {
            joinButton.textContent = 'Joined';
            joinButton.disabled = true;
        } else if (group.participants.length >= group.maxParticipants) {
            joinButton.textContent = 'Full';
            joinButton.disabled = true;
        }
    } else {
        joinButton.addEventListener('click', () => {
            showNotification('Please log in to join study groups', 'error');
        });
    }

    return card;
}

// Function to display study groups
function displayStudyGroups(groups) {
    studyGroupsGrid.innerHTML = '';
    const template = document.getElementById('studyGroupTemplate');

    groups.forEach(group => {
        const clone = template.content.cloneNode(true);
        
        // Branch and semester tags
        const headerDiv = clone.querySelector('.group-header');
        const branchTag = document.createElement('div');
        branchTag.className = 'branch-tag';
        branchTag.textContent = formatSubject(group.subject);
        
        const semesterTag = document.createElement('span');
        semesterTag.className = 'semester-tag';
        semesterTag.textContent = `${group.semester}${getSemesterSuffix(group.semester)} Sem`;
        
        headerDiv.appendChild(branchTag);
        headerDiv.appendChild(semesterTag);
        
        clone.querySelector('.group-name').textContent = group.name;
        clone.querySelector('.group-description').textContent = group.description;
        
        // Course name
        const courseDiv = document.createElement('div');
        courseDiv.className = 'course-name';
        courseDiv.textContent = `Course: ${group.course}`;
        clone.querySelector('.group-description').after(courseDiv);
        
        // Participants
        clone.querySelector('.participants').textContent = 
            `${group.participants.length}/${group.maxParticipants} members`;

        // Creator info
        const creatorInfo = document.createElement('div');
        creatorInfo.className = 'creator-info';
        creatorInfo.innerHTML = `
            <small>Created by: ${group.creatorName}</small>
        `;
        clone.querySelector('.group-details').appendChild(creatorInfo);

        // Resources section if available
        if (group.resources) {
            const resourcesDiv = document.createElement('div');
            resourcesDiv.className = 'resources-section';
            resourcesDiv.innerHTML = `
                <h4><i class="fas fa-book"></i> Study Materials</h4>
                <div class="resources-content">${group.resources}</div>
            `;
            clone.querySelector('.group-details').after(resourcesDiv);
        }

        const joinButton = clone.querySelector('.join-group');
        const viewButton = clone.querySelector('.view-details');

        // Handle join button state
        if (auth.currentUser && group.participants.includes(auth.currentUser.uid)) {
            joinButton.textContent = 'Leave Group';
            joinButton.classList.add('btn-outline');
            joinButton.classList.remove('btn-primary');
        }

        joinButton.addEventListener('click', () => handleJoinGroup(group, joinButton));
        viewButton.addEventListener('click', () => handleViewDetails(group));

        studyGroupsGrid.appendChild(clone);
    });
}

// Helper function to format subject
function formatSubject(subject) {
    return subject.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

// Helper function to get semester suffix
function getSemesterSuffix(semester) {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const v = semester % 100;
    return suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0];
}

// Function to handle join group
async function handleJoinGroup(group, button) {
    if (!auth.currentUser) {
        showNotification('Please log in to join study groups', 'error');
        return;
    }

    try {
        const groupRef = db.collection('studyGroups').doc(group.id);
        
        if (group.participants.includes(auth.currentUser.uid)) {
            // Leave group
            await groupRef.update({
                participants: firebase.firestore.FieldValue.arrayRemove(auth.currentUser.uid)
            });
            button.textContent = 'Join Group';
            button.classList.remove('btn-outline');
            button.classList.add('btn-primary');
        } else {
            // Join group
            if (group.participants.length >= group.maxParticipants) {
                alert('This group is full');
                return;
            }
            await groupRef.update({
                participants: firebase.firestore.FieldValue.arrayUnion(auth.currentUser.uid)
            });
            button.textContent = 'Leave Group';
            button.classList.add('btn-outline');
            button.classList.remove('btn-primary');
        }
        
        loadStudyGroups(); // Refresh the display
    } catch (error) {
        console.error('Error updating group membership:', error);
        alert('Failed to update group membership. Please try again.');
    }
}

// Function to handle view details
function handleViewDetails(group) {
    // Implement view details functionality
    alert('View details functionality coming soon!');
}
