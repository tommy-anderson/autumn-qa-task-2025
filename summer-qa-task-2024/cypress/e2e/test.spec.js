describe('Regression Testing for Task Manager', { tags: 'regression' }, () => {
	it('Verify if task creation fails with missing Title', () => {
		cy.visit('http://127.0.0.1:5174')
		
		// Create a task without a Title
		cy.get('.app .flex select:eq(0)').select('Low') // Select Importance
		cy.get('.app .flex select:eq(1)').select('Work') // Select Label
		cy.get('.app button[type="submit"]').click() // Attempt to add task

		// Check that no task was created
		cy.get('.task-list .task-item').should('not.be.visible')
	})

	it('Verify if the task remains deleted after page refresh', () => {
		cy.visit('http://127.0.0.1:5174')
		
		// Create two tasks
		cy.get('.app input').type('First Task')
		cy.get('.app .flex select:eq(0)').select('Low')
		cy.get('.app .flex select:eq(1)').select('Work')
		cy.get('.app button[type="submit"]').click()
		cy.get('.app input').type('Second Task')
		cy.get('.app .flex select:eq(0)').select('Medium')
		cy.get('.app .flex select:eq(1)').select('Social')
		cy.get('.app button[type="submit"]').click()

		// Delete one of the tasks
		cy.get('.task-list .task-item:eq(0) button:contains("Delete")').click() // Adjust selector as needed
		cy.reload() // Refresh the page

		// Check if only one task remains
		cy.get('.task-list .task-item').should('have.length', 1)
  })

	it('Verify if task description remains visible after editing only the title', () => {
		cy.visit('http://127.0.0.1:5174')
	
		// Create a task with a Title and Description
		cy.get('.app input').type('Initial Task Title')
		cy.get('.app textarea').type('Initial Task Description')
		cy.get('.app button[type="submit"]').click()
	
		// Verify that the task is created correctly
		cy.get('.task-list .task-item:eq(0) div h3:contains("Initial Task Title")')
		cy.get('.task-list .task-item:eq(0) div p:contains("Initial Task Description")')
		
		// Edit the task
		cy.get('.task-list .task-item:eq(0) button:contains("Edit")').click() // Click edit button 
		cy.get('.app input:eq(1)').clear().type('Updated Task Title') // Update Title Field
		cy.get('.app button:contains("Save")').click() // Save the changes
	
		// Verify that the task is updated correctly
		cy.get('.task-list .task-item:eq(0) div h3:contains("Updated Task Title")')
		cy.get('.task-list .task-item:eq(0) div p:contains("Initial Task Description")')
	})

	it('Verify task creation for every combination of importance and label', () => {
		const importance = ['Low', 'Medium', 'High']
		const label = ['Work', 'Social', 'Home', 'Hobby']
	
		cy.visit('http://127.0.0.1:5174')

		importance.forEach((importance) => {
			label.forEach((label) => {
				cy.get('.app input').type(`Task with ${importance} importance for ${label} label`)
				cy.get('.app .flex select:eq(0)').select(importance)
				cy.get('.app .flex select:eq(1)').select(label)
				cy.get('.app button[type="submit"]').click()
				cy.screenshot(`task-${importance}-${label}`)
			})
		})
	})
})