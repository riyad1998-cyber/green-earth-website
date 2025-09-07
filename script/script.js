let categoryMap ={};
let cart=[];
//Load categorie and build cetegory map
async function loadCategories(){
  try{
    const res= await fetch("https://openapi.programming-hero.com/api/categories");
    const data=await res.json();
    const categories = data.categories;
    const categoriesList = document.getElementById("categories-list");
    categoriesList.innerHTML= "";
    categoryMap= {};
    categories.forEach(cat=> {
      categoryMap[String(cat.id)]=cat.category_name;
    });
    //All Plants Btn with unique ID
    const allLi=document.createElement("li");
    allLi.innerHTML= `
      <button id="all-plants-btn" onclick="setActiveCategory(this); loadPlants();"
        class="w-full text-left px-3 py-2 rounded-lg hover:bg-green-600 hover:text-white transition-colors duration-300 font-semibold">
        All Trees
      </button>
    `;
    categoriesList.appendChild(allLi);
    //individual category btn
    categories.forEach(cat=>{
      const li =document.createElement("li");
      li.innerHTML= `
        <button onclick="setActiveCategory(this); loadPlantsByCategory('${cat.id}', '${cat.category_name}')"
          class="w-full text-left px-3 py-2 rounded-lg hover:bg-green-600 hover:text-white transition-colors duration-300">
          ${cat.category_name}
        </button>
      `;
      categoriesList.appendChild(li);
    });
    //Highlight All Plants
    setTimeout(() => {
      const allPlantsBtn = document.getElementById("all-plants-btn");
      if (allPlantsBtn) {
        setActiveCategory(allPlantsBtn);
      }
    },100);

  } catch(err){
    console.error("Error loading categories:",err);
  }
}

function setActiveCategory(selectedBtn){
  const allButtons = document.querySelectorAll("#categories-list button");
  allButtons.forEach(btn=>{
    btn.classList.remove("bg-green-600", "text-white", "font-bold");
    btn.classList.add("hover:bg-green-600","hover:text-white");
  });
  selectedBtn.classList.add("bg-green-600","text-white","font-bold");
}
//Load all plants
async function loadPlants(){
  try{
    const res=await fetch("https://openapi.programming-hero.com/api/plants");
    const data =await res.json();
    const plants = data.plants|| data.data;
    await renderPlantsWithDetails(plants);
  } catch (err) {
    console.error("Error loading plants:",err);
  }
}
//Load plants by cetegory
async function loadPlantsByCategory(categoryId,categoryName) {
  try {
    const res =await fetch(`https://openapi.programming-hero.com/api/category/${categoryId}`);
    const data=await res.json();
    const plants= data.plants|| data.data;
    await renderPlantsWithDetails(plants);
  } catch(err) {
    console.error("Error loading category plants:",err);
  }
}

async function renderPlantsWithDetails(plants){
  const treeGrid=document.getElementById("tree-grid");
  treeGrid.innerHTML = "";
  if (!plants||plants.length ===0) {
    treeGrid.innerHTML =`<p>No plants found</p>`;
    return;
  }
  for (const plant of plants) {
    try {
      const detailRes =await fetch(`https://openapi.programming-hero.com/api/plant/${plant.id || plant.plant_id}`);
      const detailData= await detailRes.json();
      const detail= detailData.data || plant;

      const categoryName =detail.category || "No category";

      const card =document.createElement("div");
      card.className = "w-full sm:w-[343px] rounded-xl bg-white p-4 flex flex-col shadow";

      card.innerHTML= `
        <div class="flex justify-center">
          <img src="${detail.image_url ||detail.image}" 
               alt="${detail.plant_name||detail.name}" 
               class="w-full sm:w-[311px] h-[186px] object-cover rounded-lg">
        </div>

        <h3 class="font-semibold text-[14px] mt-3">${detail.plant_name || detail.name}</h3>
        <p class="text-[12px] mt-2">
          ${detail.short_description ||detail.description|| "No description available"}
        </p>

        <div class="flex justify-between items-center mt-3">
          <p class="bg-[#DCFCE7] rounded-3xl px-3 py-1 text-[14px] text-green-600 flex items-center justify-center whitespace-normal break-words">
            ${categoryName}
          </p>
          <h3 class="font-semibold text-[14px]">৳${detail.price || "N/A"}</h3>
        </div>

        <div class="flex justify-center items-center mt-auto">
          <button onclick='addToCart(${JSON.stringify(detail)}, "${categoryName}")'
            class="w-full h-[43px] bg-green-600 rounded-3xl text-white text-center mt-4">
            Add to cart
          </button>
        </div>
      `;
      treeGrid.appendChild(card);
    } catch (err) {
      console.error("Error fetching plant details:", err);
    }
  }
}
//Add plant to cart
function addToCart(plant, categoryName) {
  cart.push({ ...plant, categoryName });
  renderCart();
}
function renderCart() {
  const cartItems= document.getElementById("cart-items");
  cartItems.innerHTML="";

  if (cart.length=== 0) {
    cartItems.innerHTML= `<p class="text-gray-500">Cart is empty</p>`;
    return;
  }

  cart.forEach(item =>{
    const div = document.createElement("div");
    div.className = "flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-2 rounded shadow";
    div.innerHTML= `
      <div class="text-sm leading-snug break-words">
        ${item.plant_name || item.name} - <span class="text-green-600">${item.categoryName}</span>
      </div>
      <p class="text-sm font-semibold mt-1 sm:mt-0">৳${item.price||"N/A"}</p>
    `;
    cartItems.appendChild(div);
  });
}
loadCategories();
loadPlants();
