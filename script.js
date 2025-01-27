document.addEventListener('DOMContentLoaded', () => {
    // Event listeners for buttons
    document.getElementById('addUserBtn').addEventListener('click', showForm);
    document.getElementById('cancelBtn').addEventListener('click', hideForm);
    document.getElementById('userForm').addEventListener('submit', handleFormSubmit);

    // Fetch and display 
    fetchUsers();
});

// Fetch users 
async function fetchUsers() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!response.ok) throw new Error('Failed to fetch users');
        const users = await response.json();
        displayUsers(users); // Function to display 
    } catch (error) {
        alert('Error fetching users: ' + error.message);
    }
}

// Display users 
function displayUsers(users) {
    const userList = document.getElementById('userList');
    userList.innerHTML = ''; // Clear existing users

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
      <td>${user.id}</td>
      <td>${user.name.split(' ')[0]}</td>
      <td>${user.name.split(' ')[1]}</td>
      <td>${user.email}</td>
      <td>${user.company.name}</td>
      <td>
        <button onclick="editUser(${user.id})">Edit</button>
        <button onclick="deleteUser(${user.id})">Delete</button>
      </td>
    `;
        userList.appendChild(row);
    });
}

// Add or Edit user 
async function handleFormSubmit(event) {
    event.preventDefault();

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const department = document.getElementById('department').value;

    // Valid user input
    const errorMessage = validateUserInput(firstName, lastName, email);
    if (errorMessage) {
        alert(errorMessage);
        return;
    }

    const userData = {
        name: `${firstName} ${lastName}`,
        email: email,
        company: {
            name: department
        },
    };

    const isEditing = document.getElementById('userForm').dataset.id; 
    const url = isEditing ?
        `https://jsonplaceholder.typicode.com/users/${document.getElementById('userForm').dataset.id}` :
        'https://jsonplaceholder.typicode.com/users';

    const method = isEditing ? 'PUT' : 'POST'; // Choose method put or post

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) throw new Error('Failed to add or edit user');

        alert(isEditing ? 'User edited successfully!' : 'User added successfully!');

        const newUser = await response.json(); 

        
        if (!isEditing) {
            addUserToTable(newUser);
        }

        fetchUsers(); // Refresh 
        hideForm(); // Close after submission
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}

// Edit a user 
function editUser(id) {
    // Fetch user data 
    fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
        .then(response => response.json())
        .then(user => {
            document.getElementById('firstName').value = user.name.split(' ')[0];
            document.getElementById('lastName').value = user.name.split(' ')[1];
            document.getElementById('email').value = user.email;
            document.getElementById('department').value = user.company.name;

            document.getElementById('formTitle').textContent = 'Edit User';
            document.getElementById('userForm').dataset.id = id; // Store the user ID in the form for editing
            showForm();
        })
        .catch(error => {
            alert('Error editing user: ' + error.message);
        });
}

// Delete  user 
async function deleteUser(id) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) throw new Error('Failed to delete user');

        alert('User deleted successfully!');
        removeUserFromTable(id); 
    } catch (error) {
        alert('Error deleting user: ' + error.message);
    }
}

// remove delete user
function removeUserFromTable(id) {
    const rows = document.querySelectorAll('#userList tr');
    rows.forEach(row => {
        if (row.cells[0].textContent == id) {
            row.remove();
        }
    });
}

// add new users in table
function addUserToTable(user) {
    const userList = document.getElementById('userList');
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${user.id}</td>
      <td>${user.name.split(' ')[0]}</td>
      <td>${user.name.split(' ')[1]}</td>
      <td>${user.email}</td>
      <td>${user.company.name}</td>
      <td>
        <button onclick="editUser(${user.id})">Edit</button>
        <button onclick="deleteUser(${user.id})">Delete</button>
      </td>
    `;
    userList.appendChild(row);
}


function validateUserInput(firstName, lastName, email) {
    // Names pattern
    const namePattern = /^[A-Za-z\s]+$/;
    if (!namePattern.test(firstName) || !namePattern.test(lastName)) {
        return 'First Name and Last Name should only contain letters and spaces.';
    }

    // if email id valid
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(email)) {
        return 'Please enter a valid email address.';
    }

    // All validation right
    return null;
}

// Show the user form 
function showForm() {
    document.getElementById('userFormContainer').style.display = 'block';
}

// Hide the user 
function hideForm() {
    document.getElementById('userFormContainer').style.display = 'none';
    document.getElementById('userForm').reset();
    document.getElementById('formTitle').textContent = 'Add User';
    delete document.getElementById('userForm').dataset.id; // Remove the ID stored for editing
}