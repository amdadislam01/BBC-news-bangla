// =======================
//  Elements Selection
// =======================
const categorieContainer = document.getElementById('category-container')   
const newsContainer = document.getElementById('news-container')           
const bookmarkCount = document.getElementById('bookmark-count')           
const spinner = document.getElementById('spinner')   


// ========= Data Storage =========
let bookmarks = []      
let allArticles = []     

// =======================
//  Spinner Functions
// =======================

const showSpinner = () => spinner.classList.remove('hidden')

const hideSpinner = () => spinner.classList.add('hidden')


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
// Load News by Category
// =======================
const loadNewsByCategories = (categoryId) => {
  showSpinner()   
  fetch(`https://news-api-fs.vercel.app/api/categories/${categoryId}`)
    .then(res => res.json())
    .then(data => {
      if (!data.articles || data.articles.length === 0) {   
        alertModal.showModal()                             
        newsContainer.innerHTML = ''                        
      } else {
        allArticles = data.articles                         
        showNewsByCategories(data.articles)                 
      }
    })
    .catch(err => console.error(err))
    .finally(() => hideSpinner())                           
}


// =======================
// Show News by Category
// =======================
const showNewsByCategories = (articles) => {
  newsContainer.innerHTML = ''   
  articles.forEach(article => {
    newsContainer.innerHTML += `
      <div class='border border-gray-300 rounded-lg p-4 flex flex-col'>
        <div>
          <img src='${article.image?.srcset[8]?.url || ""}' class="w-full h-40 sm:h-48 md:h-52 object-cover rounded-md"/>
        </div>
        <div id='${article.id}' class='p-2 flex flex-col flex-1'>
          <h1 class='font-bold mb-2 text-sm sm:text-base md:text-lg'>${article.title}</h1>
          <p class='font-semibold text-xs sm:text-sm mb-2'>${article.time}</p>
          <button class="btn btn-soft btn-sm mt-auto w-full">Bookmark</button>
        </div>
      </div>
    `
  })
}


// =======================
// Bookmark Button Click
// =======================

newsContainer.addEventListener('click', e => {
  if (e.target.innerText === 'Bookmark') {   
    handleBookmarks(e)                       
  }
})

const handleBookmarks = (e) => {
  const title = e.target.parentNode.children[0].innerText   
  const id = e.target.parentNode.id                         

  if (!bookmarks.some(b => b.id === id)) {                 
    bookmarks.push({ title, id })                           
  }
  showBookmarks()                                         
}


// =======================
// Show Bookmarks
// =======================
const showBookmarks = () => {
  const bookmarkDiv = document.getElementById('bookmark')
  bookmarkDiv.innerHTML = ''

  bookmarks.forEach(bookmark => {
    bookmarkDiv.innerHTML += `
      <div class='border py-2 mt-2 px-2 flex flex-col gap-2 rounded'>
        <h1 class="text-sm font-semibold">${bookmark.title}</h1>
        <div class="flex gap-2">
          <button onclick="handleDeleteBookmarks('${bookmark.id}')" class="btn btn-xs btn-error flex-1">
            Delete
          </button>
          <button onclick="handleViewDetails('${bookmark.id}')" class="btn btn-xs btn-info flex-1">
            View Details
          </button>
        </div>
      </div>
    `
  })

  updateBookmarkCount()   
}


// =======
// Init 
// =======
loadCategory()              
loadNewsByCategories('main')  
