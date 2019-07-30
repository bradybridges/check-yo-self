# IdeaBox


## Table of contents
* [General Info](#General-Info)
* [Motivation](#Motivation)
* [Built With](#Built-With) 
* [Screenshots](#Screenshots)
* [How to Use](#How-to-Use)
* [Setup](#Setup)
* [License](#License)
## General Info

<h4>A project for practicing HTML, CSS, and diving deeper into JavaScript in Turing Front-End Engineering course, Module 1. Completed by Brady Bridges.</h4>
​
## Motivation
CheckYo'Self is a project to test you abilities in HTML, CSS, and Javascript. In this project I was motivated to create clean DRY code with emphasis on modularity and dynamic behavior. In this project my understanding of DOM tree traversal improved significantly. I really pushed to meet all requirements of Phase 4.</h4>
​
## Built With
- HTML5
- CSS3
- JavaScript
​
## Screenshots
  <img src="https://github.com/bradybridges/check-yo-self/blob/master/images/desktop-actual.png" alt="Desktop Img Of Project">
  <img src="https://github.com/bradybridges/check-yo-self/blob/master/images/mobile-actual.png" alt="Mobile Img Of Project" style="margin: 0 auto;">
​
## Features

  - [x] See list of all existing to-dos, lists of checked off tasks, and state of urgency
  - [x] To dos appear in descending order, if no to-dos a message is displayed
  - [x] Two inputs for entering the title and adding a new task to list and clear all button to clear fields
  - [x] Filter by urgency button
  - [x] Task is added to bottom of checklist under task title
  - [x] Each task in checklist can be removed
  - [x] Should not add task to checklist if input is empty
  - [x] A new card is created when you click Make Task List button
  - [x] Text/Input list from new to do form cleared after making new toDo
  - [x] Make Task List button disabled if criteria not met
  - [x] Page does not reload
  - [x] ToDo cards persist
  - [x] ToDo is added to localStorage using saveToStorage method
  - [x] When user clicks clear all input and list of tasks cleared
  - [x] Clear all is disabled if title and checklist is empty
  - [x] There should be a visual cue so that the user knows what they have completed and what is still left to do
  There should be a visual cue so that the user knows what they have completed and what is still left to do
  - [x] Tasks that are checked off should persist upon reloading the page.
  - [x] The update of the data model should occur in the updateTask method that is defined in the ToDoList class.
  - [x] How the DOM gets updated using JavaScript should happen in the main.js file.
  - [x] Each todo card on the todo list should have a button to remove it from both the data model and the DOM.
  - [x] The “Delete” button should only be enabled if all of the tasks on the checklist have been checked off.
  - [x] Upon clicking the “Delete” button, the appropriate todo list should be removed from the DOM.
  - [x] The update of the data model should happen in the deleteFromStorage method that is defined in the ToDoList class.
  - [x] How the DOM gets updated using JavaScript should happen in the main.js file
  - [x] When the user clicks on the Urgent button, the button should stay in the active state.
  - [x] Todo cards that are marked as urgent should persist upon reloading the page.
  - [x] This update of the data model should occur in the updateToDo method that is defined in the ToDoList class.
  - [x] How the DOM gets updated using JavaScript should happen in the main.js file
  - [x] At the top of the application, include a text field labeled Search.
  - [x] As a user types in the search box, the list of to-dos on the DOM should filter in real time to only display todo cards whose title include the user’s text. The page should not reload.
  - [x] Clearing the search box should restore all todo cards on the list.
  - [x] There is no need to make persisting changes to the data model to achieve this functionality.
  - [x] The user should only see the urgent todo cards when they click on the Filter by Urgency button. (consequently, the button should be highlighted)
  - [x] Clicking on the Filter by Urgency button again, the button should no longer be highlighted, and all of the user’s to-dos should be displayed.
  - [x] When viewing urgent to-dos, the search field should only search through the urgent to-dos.
  - [x] If there are no urgent to-dos yet, then there should be an indication displayed in the empty todo section notifying the user to mark some to-dos urgent.
  - [x] These changes do not need to persist in between sessions.
  - [x] The user should have a drop down next to the search bar to select if they want to filter their list by Title, Tasks, or All.
  - [x] Searching by the Title will be the original functionality where it filters the todo cards by their title based on the user’s text.
  - [x] Searching by the Tasks will filter the todo cards by their tasks based on the user’s text.
  - [x] Searching by the All will filter the todo cards by both their title and tasks based on the user’s text.
  - [x] Add an input to the bottom of each card so that the user can add more tasks later.
  - [x] Each task added should appear at the bottom of the list unchecked.
  - [x] The user should not be able to add blank tasks if the input is empty.

## How to Use
1. Create a new toDo by filling out the form on the left side of the page and clicking Make To Do List. There must be a title present and checklist items to append. 
​
2. ToDo items can be toggled to urgent by clicking the urgent icon

​3. ToDo items can be deleted if all tasks are checked off, by clicking the delete button.

4. Filter ideas by favorite by using the Show Starred Ideas button or filter by quality by clicking the quality on the side bar. Show all by clicking the View All Ideas or Show All on the left sidebar.
​
5. Can't ToDo item? Try searching through your ToDos by typing key words into the search bar. Search can find items by title, task, or all

6. You can edit a To Do Cards title or a task item by clicking on the either.

7. You can add a task to a card by typing a new task in the input of the card and clicking the + button

## Setup
View <a href="https://bradybridges.github.io/check-yo-self/">here</a> on GitHub pages.
 
© 2019 GitHub, Inc.
Terms
Privacy
Security
Status
Help
Contact GitHub
Pricing
API
Training
Blog
About
