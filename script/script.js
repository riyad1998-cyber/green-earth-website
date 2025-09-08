let categoryMap={};
let cart=[];
//loading categories
async function loadCategories(){
  try{
    const res = await fetch("https://openapi.programming-hero.com/api/categories");
    const data = await res.json();
    const categories = data.categories;
    const categoriesList = document.getElementById("categories-list");
    categoriesList.innerHTML= "";
    categoryMap= {};

    for(const cat of categories) {
      categoryMap[String(cat.id)]=cat.category_name;
    }
    //Trees button
    const allLi = document.createElement("li");
    allLi.innerHTML= `
      <button id="all-plants-btn" onclick="setActiveCategory(this); loadPlants();"
        class="w-full text-left px-3 py-2 rounded-lg hover:bg-green-600 hover:text-white transition-colors duration-300">
        All Trees
      </button>
    `;
    categoriesList.appendChild(allLi);
    for (const cat of categories) {
      const li = document.createElement("li");
      li.innerHTML = `
        <button onclick="setActiveCategory(this); loadPlantsByCategory('${cat.id}', '${cat.category_name}')"
          class="w-full text-left px-3 py-2 rounded-lg hover:bg-green-600 hover:text-white transition-colors duration-300">
          ${cat.category_name}
        </button>
      `;
      categoriesList.appendChild(li);
    }
    const allPlantsBtn=document.getElementById("all-plants-btn");
    if(allPlantsBtn){
      setActiveCategory(allPlantsBtn);
    }
  } catch (err){
    console.error("Error loading categories:",err);
  }
}
//highlight selected category
function setActiveCategory(selectedBtn){
  const allButtons= document.querySelectorAll("#categories-list button");
  for (const btn of allButtons) {
    btn.classList.remove("bg-green-600", "text-white","font-bold");
    btn.classList.add("hover:bg-green-600","hover:text-white");
  }
  selectedBtn.classList.add("bg-green-600","text-white","font-bold");
}
//load all plants
async function loadPlants(){
  showSpinner();
  try{
    const res= await fetch("https://openapi.programming-hero.com/api/plants");
    const data =await res.json();
    const plants =data.plants|| data.data;
    await renderPlantsWithDetails(plants);
  } catch (err) {
    console.error("Error loading plants:",err);
  }
}
//Load plants by category
async function loadPlantsByCategory(categoryId, categoryName) {
  showSpinner();
  try {
    const res = await fetch(`https://openapi.programming-hero.com/api/category/${categoryId}`);
    const data = await res.json();
    const plants = data.plants||data.data;
    await renderPlantsWithDetails(plants);
  } catch (err) {
    console.error("Error loading category plants:", err);
  }
}

async function renderPlantsWithDetails(plants){
  const treeGrid=document.getElementById("tree-grid");
  treeGrid.innerHTML= "";
  if (!plants||plants.length===0) {
    treeGrid.innerHTML= `<p class="text-center mt-10">No plants found</p>`;
    return;
  }
  for(const plant of plants){
    try{
      const detailRes=await fetch(`https://openapi.programming-hero.com/api/plant/${plant.id}`);
      const detailData=await detailRes.json();
      const detail =detailData.data||plant;
      const categoryName= detail.category;
      const card=document.createElement("div");
      card.className= "w-full sm:w-[343px] rounded-xl bg-white p-4 flex flex-col shadow";
      card.innerHTML= `
        <div class="flex justify-center">
          <img src="${detail.image}" 
               alt="${detail.name}" 
               class="w-full sm:w-[311px] h-[186px] object-cover rounded-lg">
        </div>
        <h3 class="font-semibold text-[14px] mt-3 cursor-pointer"onclick='openModal(${JSON.stringify(detail)},"${categoryName}")'>
          ${detail.name}
        </h3>

        <p class="text-[12px] mt-2">
          ${detail.description}
        </p>

        <div class="flex justify-between items-center mt-3">
          <p class="bg-[#DCFCE7] rounded-3xl px-3 py-1 text-[14px] text-green-600 flex items-center justify-center whitespace-normal break-words">
            ${categoryName}
          </p>
          <h3 class="font-semibold text-[14px]">৳${detail.price}</h3>
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
      console.error("Error fetching plant details:",err);
    }
  }
}
// Add to cart
function addToCart(plant, categoryName){
  const plantId= String(plant.id||plant.plant_id);
  const existingItem=cart.find(item => item.id=== plantId);
  if(existingItem){
    existingItem.quantity += 1;
  }else{
    cart.push({
      ...plant,
      id: plantId,
      categoryName,
      quantity: 1
    });
  }
    alert(`${plant.name} has been added to the cart`);
  renderCart();
}

function removeFromCart(id){
  cart = cart.filter(item => item.id !==String(id));
  renderCart();
}

function renderCart(){
  const cartItems=document.getElementById("cart-items");
  cartItems.innerHTML= "";
  if (cart.length=== 0) {
    cartItems.innerHTML= `<p class="text-gray-500">Cart is empty</p>`;
    return;
  }
  let totalAmount= 0;
  for (const item of cart) {
    const price =parseFloat(item.price)||0;
    const subtotal=price * item.quantity;
    totalAmount +=subtotal;
    const div= document.createElement("div");
    div.className= "flex items-center justify-between bg-[#F0FDF4] p-2 rounded shadow border border-gray-200 mb-2";
    div.innerHTML= `
      <div>
        <div class="text-sm font-semibold">${item.name}</div>
        <div class="text-xs text-gray-600 mt-1">৳${price} x ${item.quantity}</div>
        <div class="text-sm font-bold text-green-700 mt-1">৳${subtotal}</div>
      </div>
      <button onclick="removeFromCart('${item.id}')" 
        class="text-red-500 font-bold text-lg ml-4 hover:text-red-700">✖</button>
    `;
    cartItems.appendChild(div);
  }
  const totalDiv=document.createElement("div");
  totalDiv.className= "mt-4 p-2 border-t border-gray-300 text-right font-bold text-lg";
  totalDiv.innerText= `Total: ৳${totalAmount}`;
  cartItems.appendChild(totalDiv);
}
//loading Spinner
function showSpinner() {
  const treeGrid = document.getElementById("tree-grid");
  treeGrid.style.position = "relative";
  treeGrid.innerHTML= `
    <div style="
      position:absolute;
      top:50%;
      left:50%;
      transform:translate(-50%, -50%);
    ">
      <span class="loading loading-dots loading-xl"></span>
    </div>
  `;
}
//modal part
const modal=document.createElement("div");
modal.id="tree-modal";
modal.className="fixed inset-0 flex justify-center items-start z-50 hidden";

const overlay=document.createElement("div");
overlay.className= "absolute inset-0 bg-black opacity-20";
modal.appendChild(overlay);

const modalContent=document.createElement("div");
modalContent.className= "relative bg-white w-[420px] max-h-[550px] mt-24 p-5 rounded-xl shadow-lg flex flex-col gap-4 z-50 overflow-auto";

const modalName=document.createElement("h3");
modalName.id= "modal-name";
modalName.className= "font-bold text-lg cursor-default";

const modalImage= document.createElement("img");
modalImage.id= "modal-image";
modalImage.className= "w-full h-[220px] object-cover rounded-lg";

const modalCategory=document.createElement("p");
modalCategory.id="modal-category";
modalCategory.className="text-black";

const modalPrice=document.createElement("p");
modalPrice.id= "modal-price";
modalPrice.className= "text-black";

const modalDescription=document.createElement("p");
modalDescription.id= "modal-description";
modalDescription.className= "text-black text-sm";

const closeDiv=document.createElement("div");
closeDiv.className="flex justify-end mt-2";
const closeBtn=document.createElement("button");
closeBtn.id = "close-modal";
closeBtn.className= "bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600";
closeBtn.innerText= "Close";
closeDiv.appendChild(closeBtn);

modalContent.append(modalName, modalImage, modalCategory, modalPrice, modalDescription, closeDiv);
modal.appendChild(modalContent);
document.body.appendChild(modal);

closeBtn.addEventListener("click",() =>{
  modal.classList.add("hidden");
});

function openModal(plant, categoryName){
  modalName.innerText=plant.name;
  modalImage.src= plant.image;
  modalCategory.innerHTML= `<span class="font-bold">Category:</span>${categoryName}`;
  modalPrice.innerHTML= `<span class="font-bold">Price:</span> ৳${plant.price}`;
  modalDescription.innerHTML= `<span class="font-bold">Description:</span>${plant.description}`;
  modal.classList.remove("hidden");
}

loadCategories();
loadPlants();
