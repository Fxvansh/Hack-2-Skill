const form = document.querySelector("#plannerForm");
const results = document.querySelector("#results");
const missionTitle = document.querySelector("#missionTitle");
const cheaperButton = document.querySelector("#cheaperButton");

const menus = {
  flexible: {
    breakfast: [
      meal("Sunny Egg Toast", ["eggs", "bread", "spinach", "tomato"], 6, 12, ["quick", "protein"]),
      meal("Berry Oat Bowl", ["oats", "milk", "banana", "berries"], 5, 8, ["easy", "fresh"]),
      meal("Breakfast Fried Rice", ["rice", "eggs", "peas", "soy sauce"], 7, 18, ["leftover-friendly"]),
    ],
    lunch: [
      meal("Chicken Rice Bowl", ["chicken", "rice", "cucumber", "yogurt"], 10, 25, ["balanced"]),
      meal("Tuna Melt Wrap", ["tuna", "tortilla", "cheese", "lettuce"], 8, 15, ["busy-day"]),
      meal("Spicy Noodle Stir Fry", ["noodles", "eggs", "broccoli", "chili sauce"], 9, 22, ["spicy"]),
    ],
    dinner: [
      meal("Garlic Pasta Skillet", ["pasta", "garlic", "parmesan", "spinach"], 9, 25, ["comfort"]),
      meal("Sheet Pan Chicken", ["chicken", "potatoes", "carrots", "onion"], 12, 45, ["hands-off"]),
      meal("Turkey Taco Bowls", ["ground turkey", "rice", "beans", "salsa"], 11, 30, ["protein"]),
    ],
  },
  vegetarian: {
    breakfast: [
      meal("Masala Oats", ["oats", "spinach", "tomato", "yogurt"], 5, 15, ["cozy"]),
      meal("Paneer Toastie", ["bread", "paneer", "tomato", "mint"], 7, 16, ["comfort"]),
      meal("Fruit Yogurt Crunch", ["yogurt", "banana", "granola", "honey"], 6, 7, ["fresh"]),
    ],
    lunch: [
      meal("Chickpea Power Bowl", ["chickpeas", "rice", "cucumber", "feta"], 8, 20, ["protein"]),
      meal("Veggie Pulao", ["rice", "peas", "carrots", "yogurt"], 7, 30, ["budget"]),
      meal("Caprese Sandwich", ["bread", "mozzarella", "tomato", "basil"], 8, 12, ["quick"]),
    ],
    dinner: [
      meal("Paneer Tikka Wraps", ["paneer", "tortilla", "peppers", "yogurt"], 11, 35, ["bold"]),
      meal("Lentil Coconut Curry", ["lentils", "coconut milk", "rice", "spinach"], 9, 40, ["comfort"]),
      meal("Mushroom Pasta", ["pasta", "mushrooms", "cream", "garlic"], 10, 28, ["cozy"]),
    ],
  },
  vegan: {
    breakfast: [
      meal("Peanut Banana Oats", ["oats", "banana", "peanut butter", "almond milk"], 5, 8, ["quick"]),
      meal("Tofu Scramble Toast", ["tofu", "bread", "spinach", "turmeric"], 7, 18, ["protein"]),
      meal("Green Smoothie Bowl", ["banana", "spinach", "granola", "almond milk"], 7, 10, ["fresh"]),
    ],
    lunch: [
      meal("Bean Burrito Bowl", ["beans", "rice", "corn", "salsa"], 7, 18, ["budget"]),
      meal("Sesame Tofu Noodles", ["tofu", "noodles", "broccoli", "soy sauce"], 10, 25, ["bold"]),
      meal("Hummus Veggie Pita", ["pita", "hummus", "cucumber", "tomato"], 8, 12, ["busy-day"]),
    ],
    dinner: [
      meal("Red Lentil Dal", ["lentils", "rice", "tomato", "spinach"], 8, 35, ["comfort"]),
      meal("Chickpea Pasta", ["pasta", "chickpeas", "garlic", "tomato"], 9, 25, ["protein"]),
      meal("Sweet Potato Chili", ["sweet potato", "beans", "tomato", "corn"], 10, 45, ["cozy"]),
    ],
  },
};

const substitutions = {
  chicken: "tofu, chickpeas, or eggs",
  paneer: "tofu or extra chickpeas",
  parmesan: "nutritional yeast or cheddar",
  milk: "almond milk or oat milk",
  yogurt: "coconut yogurt or lemon dressing",
  rice: "quinoa, noodles, or bread",
  pasta: "rice noodles or zucchini ribbons",
  eggs: "tofu scramble or chickpea flour",
  cheese: "avocado or hummus",
  berries: "apple, banana, or frozen fruit",
};

function meal(name, ingredients, cost, minutes, tags) {
  return { name, ingredients, cost, minutes, tags };
}

function getFormData(forceCheaper = false) {
  const pantry = document
    .querySelector("#pantry")
    .value.toLowerCase()
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return {
    dayType: document.querySelector("#dayType").value,
    time: Number(document.querySelector("#timeAvailable").value),
    budget: Number(document.querySelector("#budget").value || 0),
    diet: document.querySelector("input[name='diet']:checked").value,
    mood: document.querySelector("#mood").value,
    pantry,
    forceCheaper,
  };
}

function scoreMeal(option, data) {
  let score = 0;
  score += option.ingredients.filter((item) => data.pantry.includes(item)).length * 3;
  score += option.minutes <= data.time ? 4 : -4;
  score += data.forceCheaper ? -option.cost * 1.5 : -option.cost * 0.3;

  if (data.dayType === "busy" && option.minutes <= 18) score += 4;
  if (data.dayType === "lazy" && option.tags.includes("comfort")) score += 3;
  if (data.dayType === "active" && option.tags.includes("protein")) score += 4;
  if (data.mood === "fresh" && option.tags.includes("fresh")) score += 5;
  if (data.mood === "comfort" && option.tags.includes("comfort")) score += 5;
  if (data.mood === "protein" && option.tags.includes("protein")) score += 5;
  if (data.mood === "spicy" && (option.tags.includes("spicy") || option.tags.includes("bold"))) score += 5;

  return score;
}

function pickMeal(mealType, data) {
  return menus[data.diet][mealType]
    .slice()
    .sort((a, b) => scoreMeal(b, data) - scoreMeal(a, data))[0];
}

function buildPlan(data) {
  const plan = {
    breakfast: pickMeal("breakfast", data),
    lunch: pickMeal("lunch", data),
    dinner: pickMeal("dinner", data),
  };
  const ingredients = Object.values(plan).flatMap((item) => item.ingredients);
  const grocery = [...new Set(ingredients)].map((name) => ({
    name,
    owned: data.pantry.includes(name),
  }));
  const needed = grocery.filter((item) => !item.owned);
  const cost = Math.round(Object.values(plan).reduce((sum, item) => sum + item.cost, 0) * 100) / 100;
  const adjustedCost = Math.max(4, Math.round((cost - grocery.filter((item) => item.owned).length * 1.25) * 100) / 100);
  return { plan, grocery: needed.concat(grocery.filter((item) => item.owned)), cost: adjustedCost };
}

function budgetDetails(cost, budget) {
  const ratio = budget ? cost / budget : 2;
  if (ratio <= 1) {
    return {
      className: "",
      label: "✅ Within budget",
      note: `Estimated groceries are $${cost}, which fits your $${budget} budget.`,
      fill: Math.max(12, ratio * 100),
    };
  }
  if (ratio <= 1.2) {
    return {
      className: "warning",
      label: "⚠️ Slightly over budget",
      note: `Estimated groceries are $${cost}. Try using pantry items or tap Cheaper.`,
      fill: 100,
    };
  }
  return {
    className: "danger",
    label: "❌ Too expensive",
    note: `Estimated groceries are $${cost}. The planner recommends simpler swaps.`,
    fill: 100,
  };
}

function planSubstitutions(grocery) {
  return grocery
    .filter((item) => substitutions[item.name])
    .slice(0, 5)
    .map((item) => `${title(item.name)} → ${substitutions[item.name]}`);
}

function title(value) {
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function render(data) {
  const { plan, grocery, cost } = buildPlan(data);
  const budget = budgetDetails(cost, data.budget);
  const swaps = planSubstitutions(grocery);
  missionTitle.textContent = data.forceCheaper
    ? "Budget rescue board 💸"
    : "Cooking quest unlocked 🔥";

  results.className = "plan-stack";
  results.innerHTML = `
    <div class="meal-grid">
      ${mealCard("🌅", "Breakfast", plan.breakfast)}
      ${mealCard("☀️", "Lunch", plan.lunch)}
      ${mealCard("🌙", "Dinner", plan.dinner)}
    </div>

    <div class="list-layout">
      <article class="card list-card">
        <h3>🛒 Grocery To-Do</h3>
        <ul class="check-list">
          ${grocery
            .map(
              (item) => `
                <li>
                  <label>
                    <input type="checkbox" ${item.owned ? "checked" : ""} />
                    <span>${title(item.name)}</span>
                    ${item.owned ? '<span class="owned">home</span>' : ""}
                  </label>
                </li>
              `
            )
            .join("")}
        </ul>
      </article>

      <article class="card list-card">
        <h3>🔁 Smart Substitutions</h3>
        <ul class="sub-list">
          ${(swaps.length ? swaps : ["Use rice, pasta, or bread as the base for any meal.", "Swap fresh produce for frozen to reduce cost."])
            .map((swap) => `<li>${swap}</li>`)
            .join("")}
        </ul>
      </article>
    </div>

    <article class="card todo-card">
      <h3>✅ Cooking To-Do Quest</h3>
      <ul class="check-list">
        ${[
          "🌅 Prep breakfast ingredients before coffee gets cold",
          "🧺 Check pantry items marked home before shopping",
          "🛒 Buy only unchecked grocery items",
          "🔁 Use one substitution if budget feels tight",
          "🌙 Start dinner prep before hunger takes over",
        ]
          .map(
            (task) => `
              <li>
                <label>
                  <input type="checkbox" />
                  <span>${task}</span>
                  <span></span>
                </label>
              </li>
            `
          )
          .join("")}
      </ul>
    </article>

    <article class="card budget-card">
      <h3>💸 Budget Feasibility</h3>
      <div class="budget-meter">
        <div class="budget-fill ${budget.className}" style="--fill: ${budget.fill}%"></div>
      </div>
      <div class="budget-status">${budget.label}</div>
      <p>${budget.note}</p>
    </article>
  `;
}

function mealCard(icon, label, item) {
  return `
    <article class="card meal-card">
      <div class="meal-icon">${icon}</div>
      <h3>${label}</h3>
      <div class="meal-name">${item.name}</div>
      <p>${item.ingredients.map(title).join(", ")}</p>
      <div class="tag-line">
        <span class="tag">⏱ ${item.minutes} min</span>
        <span class="tag">~$${item.cost}</span>
        ${item.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
      </div>
    </article>
  `;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  render(getFormData(false));
});

cheaperButton.addEventListener("click", () => {
  render(getFormData(true));
});
