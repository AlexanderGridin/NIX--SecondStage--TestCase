import getDataFromUrl from '../utils.js';

class Pagination{
  constructor(elementSelector){
    this.classNames = {
      current: 'current',
    }
    
    this.element = document.querySelector(elementSelector);
    this.elementForPagging = null;

    this.nextPageButton = this.element.querySelector('.pagination__button-next');
    this.prevPageButton = this.element.querySelector('.pagination__button-prev');

    this.paginationList = this.element.querySelector('.pagination__list');
    this.pageButtons = this.paginationList.querySelectorAll('.pagination__button');
    this.pageButtonsTotal = this.pageButtons.length;
    this.currentPageButtonIndex = 0;

    this.init();
    this.handlePagination();
  }

  init(){
    let firstPageButton = this.pageButtons[0];

    if(firstPageButton){
      firstPageButton.classList.add(this.classNames.current);
    }

    return this;
  }

  setElementForPagging(element){
    this.elementForPagging = element;
    return this;
  }

  handlePagination(){
    if(!this.element){
      return this;
    }

    this.element.addEventListener('click', handlePaginationButtons(this), false);
    return this;
  }

  removeCurrentClassFromPageButtons(){
    for(let button of this.pageButtons){
      if(button.classList.contains(this.classNames.current)){
        button.classList.remove(this.classNames.current);
      }
    }

    return this;
  }
}

function handlePaginationButtons(pagination){
  return function(e){
    e.preventDefault();
    e.stopPropagation();

    let button = e.target.closest('button');

    if(
      !button ||
      !button.classList.contains('pagination__button') ||
      button.hasAttribute('disabled') ||
      button.classList.contains(pagination.classNames.current)
    ){
      return;
    }

    let paginationList = button.closest('.pagination__list');
    
    // Handle page button
    if(paginationList){
      handlePageButton(button, pagination);
    }

    // Handle prev page button
    if(button.classList.contains('pagination__button-prev')){
      handlePrevPageButton(button, pagination);
    }

    // Handle next page button
    if(button.classList.contains('pagination__button-next')){
      handleNextPageButton(button, pagination);
    }
  }
}

function handlePrevPageButton(button, pagination){
  let currentPageButtonIndex = pagination.currentPageButtonIndex--;
  let currentPageButton = pagination.pageButtons[pagination.currentPageButtonIndex]; 
  let url = currentPageButton.getAttribute('data-url');
  let table = pagination.elementForPagging;

  // Disable button if currentPageButton is the first
  if(!pagination.pageButtons[currentPageButtonIndex - 2]){
    button.setAttribute('disabled', 'disabled');
  }

  // Endable nextPageButton
  if(pagination.nextPageButton.hasAttribute('disabled')){
    pagination.nextPageButton.removeAttribute('disabled');
  }

  // Update currentPageButton CSS class
  pagination.removeCurrentClassFromPageButtons();
  currentPageButton.classList.add(pagination.classNames.current);
  
  // Get data and update table body
  getDataFromUrl(url).then((data) => {
    table.clearBody();
    table.updateBody(data);
  });
}

function handleNextPageButton(button, pagination){
  let currentPageButtonIndex = pagination.currentPageButtonIndex++;
  let currentPageButton = pagination.pageButtons[pagination.currentPageButtonIndex]; 
  let url = currentPageButton.getAttribute('data-url');
  let table = pagination.elementForPagging;

  // Disable button if currentPageButton is the last
  if(!pagination.pageButtons[currentPageButtonIndex + 2]){
    button.setAttribute('disabled', 'disabled');
  }

  // Enable prevPageButton
  if(pagination.prevPageButton.hasAttribute('disabled')){
    pagination.prevPageButton.removeAttribute('disabled');
  }

  // Update currentPageButton CSS class
  pagination.removeCurrentClassFromPageButtons();
  currentPageButton.classList.add(pagination.classNames.current);
  
  // Get data and update table body
  getDataFromUrl(url).then((data) => {
    table.clearBody();
    table.updateBody(data);
  });
}

function handlePageButton(button, pagination){
  let url = button.getAttribute('data-url');
  let table = pagination.elementForPagging;
  let buttonIndex = +button.getAttribute('data-id');

  pagination.removeCurrentClassFromPageButtons();
  button.classList.add(pagination.classNames.current);
  pagination.currentPageButtonIndex = buttonIndex;

  // Disable nextPageButton or prevPageButton
  if(!button.parentElement.nextElementSibling){
    pagination.nextPageButton.setAttribute('disabled', 'disabled');
  }

  if(!button.parentElement.previousElementSibling){
    pagination.prevPageButton.setAttribute('disabled', 'disabled');
  }

  // Enable nextPageButton or prevPageButton
  if(
    button.parentElement.previousElementSibling && 
    pagination.prevPageButton.hasAttribute('disabled')
  ){
    pagination.prevPageButton.removeAttribute('disabled');
  }

  if(
    button.parentElement.nextElementSibling && 
    pagination.nextPageButton.hasAttribute('disabled')
  ){
    pagination.nextPageButton.removeAttribute('disabled');
  }

  // Get data and update table body
  getDataFromUrl(url).then((data) => {
    table.clearBody();
    table.updateBody(data);
  });
}

export default Pagination;