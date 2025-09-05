// =======================
//  Elements Selection
// =======================
const categorieContainer = document.getElementById('category-container')   



// =======================
// Load Categories Function
// =======================
const loadCategory = () => {
  fetch('https://news-api-fs.vercel.app/api/categories')   
    .then(res => res.json())
    .then(data => showCategory(data.categories))           
    .catch(err => console.error(err))                     
}

// =======================
// Show Categories
// =======================
const showCategory = (categories) => {
  categories.forEach(cat => {
    categorieContainer.innerHTML += `
      <li id='${cat.id}' class="hover:border-b-4 border-red-600 hover:border-red-600 cursor-pointer whitespace-nowrap">
        ${cat.title}
      </li>
    `
  })


  categorieContainer.addEventListener('click', e => {
    const allLi = document.querySelectorAll('#category-container li')
    allLi.forEach(li => li.classList.remove('border-b-4')) 

    if (e.target.localName === 'li') {
      e.target.classList.add('border-b-4')               
      loadNewsByCategories(e.target.id)                     
    }
  })
}


// =======================
// Init (শুরুতেই Call)
// =======================
loadCategory()              
loadNewsByCategories('main')  
