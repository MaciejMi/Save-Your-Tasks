const prompt = document.querySelector('.prompt');
const closeButton = document.querySelector('.prompt__close-btn');
const updateBox = document.querySelector('.update-box');
const createBox = document.querySelector('.create-box');
const deleteBox = document.querySelector('.delete-box');
const paragraphCalendar = document.querySelector('.header__calendar p');
const addTasksInput = document.querySelector('.header__top-input');
const addTasksSelect = document.querySelector('.header__select--add');
const addTaskButton = document.querySelector('.header__btn--add');
const pastButton = document.querySelector('.past-button');
const futureButton = document.querySelector('.future-button');
const headerMain = document.querySelector('.header__main');
const headerButtonDelete = document.querySelector('.header__btn--delete');
const countOfTask = document.querySelector('.header__bottom-tasks');

let countsOfTasks = 0;

closeButton.addEventListener('click', () => {
	prompt.classList.remove('active');
	updateBox.classList.remove('checked');
	deleteBox.classList.remove('checked');
	createBox.classList.remove('checked');
});

const addTask = data => {
	const headerTask = document.createElement('div');
	const headerCheckbox = document.createElement('input');
	const headerTaskDescription = document.createElement('p');
	const headerTaskCategory = document.createElement('p');
	const headerButtons = document.createElement('div');
	const headerTaskUpdateButton = document.createElement('button');
	const headerTaskDeleteButton = document.createElement('button');

	headerTaskUpdateButton.classList.add('header__task-update-button');
	headerTaskDeleteButton.classList.add('header__task-delete-button');
	headerButtons.classList.add('header__buttons');
	headerButtons.appendChild(headerTaskDeleteButton);
	headerButtons.appendChild(headerTaskUpdateButton);
	headerTaskCategory.classList.add('header__task-category');
	headerTaskDescription.classList.add('header__task-description');
	headerCheckbox.type = 'checkbox';
	headerCheckbox.classList.add('header__checkbox');
	headerTaskCategory.textContent = data.category_id;
	if (data.status == 'done') {
		headerCheckbox.checked = true;
		headerTask.classList.add('checked');
	}
	headerTask.classList.add('header__task');

	headerTaskDescription.textContent = data.text;

	headerTaskDeleteButton.innerHTML = '<i class="ti ti-x"></i>';
	headerTaskUpdateButton.innerHTML = '<i class="ti ti-pencil"></i>';

	headerTaskDeleteButton.addEventListener('click', () => {
		prompt.classList.add('active');
		deleteBox.classList.add('checked');
		headerButtonDelete.addEventListener('click', () => {
			fetch(`http://localhost/saveyourtasks/backend/todos.php/${data.id}`, { method: 'delete' })
				.then(res => res.json())
				.then(data => {
					if (data) {
						headerMain.removeChild(headerTask);
						prompt.classList.remove('active');
						deleteBox.classList.remove('checked');
					}
				});
		});
	});

	headerCheckbox.addEventListener('click', () => {
		const dataStatus = headerCheckbox.checked ? 'done' : 'not yet';
		console.log(dataStatus);
		fetch(`http://localhost/saveyourtasks/backend/todos?id=${data.id}&status=${dataStatus}`, { method: 'put' })
			.then(res => res.json())
			.then(data => {
				if (data) {
					if (dataStatus === 'done') {
						headerTask.classList.add('checked');
					} else {
						headerTask.classList.remove('checked');
					}
				}
			});
	});

	headerTask.appendChild(headerCheckbox);
	headerTask.appendChild(headerTaskDescription);
	headerTask.appendChild(headerTaskCategory);
	headerTask.appendChild(headerButtons);
	headerMain.appendChild(headerTask);
};

fetch('http://localhost/saveyourtasks/backend/categories.php')
	.then(res => res.json())
	.then(json => {
		json.forEach(data => {
			const option = document.createElement('option');
			option.value = data.name;
			option.textContent = data.name;
			addTasksSelect.appendChild(option);
		});
	})
	.catch(error => console.log(error));

fetch('http://localhost/saveyourtasks/backend/todos.php')
	.then(res => res.json())
	.then(json => {
		countOfTask.textContent = `Tasks: ${json.length}`;
		countsOfTasks += json.length;
		json.forEach(data => {
			addTask(data);
		});
	})
	.catch(error => console.log(error));

addTaskButton.addEventListener('click', () => {
	const formData = new FormData();
	formData.append('text', addTasksInput.value);
	formData.append('status', 'not yet');
	formData.append('date', '2023-11-18');
	formData.append('category', addTasksSelect.value);
	fetch('http://localhost/saveyourtasks/backend/todos/', {
		method: 'post',
		body: formData,
	})
		.then(res => res.json())
		.then(json => {
			if (json) {
				addTask({
					text: addTasksInput.value,
					status: 'not yet',
					date: '2023-11-18',
					category_id: addTasksSelect.value,
				});
			}
		});
});
