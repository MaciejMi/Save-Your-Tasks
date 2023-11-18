const prompt = document.querySelector('.prompt');
const closeButton = document.querySelector('.prompt__close-btn');
const updateBox = document.querySelector('.update-box');
const createBox = document.querySelector('.create-box');
const deleteBox = document.querySelector('.delete-box');
const paragraphCalendar = document.querySelector('.header__calendar p');
const addTasksInput = document.querySelector('.header__top-input');
const findTasksSelect = document.querySelector('.header__select--find');
const addTasksSelect = document.querySelector('.header__select--add');
const addTaskButton = document.querySelector('.header__btn--add');
const pastButton = document.querySelector('.past-button');
const futureButton = document.querySelector('.future-button');
const headerMain = document.querySelector('.header__main');
const headerButtonDelete = document.querySelector('.header__btn--delete');
const countOfTask = document.querySelector('.header__bottom-tasks');
const countOfCompleted = document.querySelector('.header__bottom-completed');
const countOfUncompleted = document.querySelector('.header__bottom-uncompleted');
const headerBtnClear = document.querySelector('.header__btn--clear');

let countsOfTasks = 0;
let countsOfCompleted = 0;

closeButton.addEventListener('click', () => {
	prompt.classList.remove('active');
	updateBox.classList.remove('checked');
	deleteBox.classList.remove('checked');
	createBox.classList.remove('checked');
});

const reloadTask = (category = null) => {
	countsOfTasks = 0;
	countsOfCompleted = 0;
	headerMain.innerHTML = '';

	const sentenceToAddToFetch = category ? `?category=${category}` : '';

	fetch('http://localhost/saveyourtasks/backend/todos.php' + sentenceToAddToFetch)
		.then(res => res.json())
		.then(json => {
			json.forEach(data => {
				addTask(data);
			});
		})
		.catch(error => console.log(error));
};

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
	headerTaskCategory.classList.add('header__task-category');
	headerTaskDescription.classList.add('header__task-description');
	headerCheckbox.classList.add('header__checkbox');
	headerCheckbox.type = 'checkbox';
	headerTaskCategory.textContent = data.category_id;
	if (data.status == 'done') {
		headerCheckbox.checked = true;
		headerTask.classList.add('checked');
		countsOfCompleted++;
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
						countsOfTasks--;
						countOfTask.textContent = 'Tasks: ' + countsOfTasks;
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
						countsOfCompleted++;
					} else {
						countsOfCompleted--;
						headerTask.classList.remove('checked');
					}
					countOfCompleted.textContent = 'Completed: ' + countsOfCompleted;
					countOfUncompleted.textContent = 'Uncompleted: ' + (countsOfTasks - countsOfCompleted);
				}
			});
	});

	headerButtons.appendChild(headerTaskDeleteButton);
	headerButtons.appendChild(headerTaskUpdateButton);
	headerTask.appendChild(headerCheckbox);
	headerTask.appendChild(headerTaskDescription);
	headerTask.appendChild(headerTaskCategory);
	headerTask.appendChild(headerButtons);
	headerMain.appendChild(headerTask);
	countOfTask.textContent = `Tasks: ${++countsOfTasks}`;
	countOfCompleted.textContent = `Completed ${countsOfCompleted}`;
	countOfUncompleted.textContent = 'Uncompleted: ' + (countsOfTasks - countsOfCompleted);
};

reloadTask();

fetch('http://localhost/saveyourtasks/backend/categories.php')
	.then(res => res.json())
	.then(json => {
		json.forEach(data => {
			const option = document.createElement('option');
			option.value = data.name;
			option.textContent = data.name;
			addTasksSelect.appendChild(option);
			const option2 = document.createElement('option');
			option2.value = data.name;
			option2.textContent = data.name;
			findTasksSelect.appendChild(option2);
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
		})
		.catch(error => {
			console.log(error);
		});
});

headerBtnClear.addEventListener('click', () => {
	fetch('http://localhost/saveyourtasks/backend/todos?status=done', { method: 'delete' })
		.then(res => res.json())
		.then(data => {
			if (data) {
				reloadTask();
			}
		})
		.catch(error => {
			console.log(error);
		});
});

findTasksSelect.addEventListener('click', () => {
	reloadTask(findTasksSelect.value);
});
