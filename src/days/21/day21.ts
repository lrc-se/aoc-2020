import { OutputPublic } from "@/functions/output";

interface Food {
  ingredients: string[];
  allergens: string[];
}

interface FoodList {
  foods: Food[];
  ingredients: Set<string>;
  allergens: Set<string>;
}

interface AllergenMatches {
  [K: string]: Set<string>;
}

interface AllergenMap {
  [K: string]: string;
}

function getFoodList(input: string[]): FoodList {
  const re = /^(.+)\s+\(contains\s+(.+)\)$/;
  const foods = input.map(line => {
    const match = re.exec(line);
    if (match) {
      return {
        ingredients: match[1].split(/\s+/),
        allergens: match[2].split(/,\s+/)
      };
    }
    return null;
  }).filter((food): food is Food => !!food);

  const ingredients = new Set<string>();
  const allergens = new Set<string>();
  foods.forEach(food => {
    food.ingredients.forEach(ingredient => {
      ingredients.add(ingredient);
    });
    food.allergens.forEach(allergen => {
      allergens.add(allergen);
    });
  });

  return {
    foods,
    ingredients,
    allergens
  };
}

function getAllergenMatches(foodList: FoodList): AllergenMatches {
  const matches: AllergenMatches = {};
  for (const allergen of foodList.allergens) {
    matches[allergen] = new Set<string>();
    const filteredFoods = foodList.foods.filter(food => food.allergens.includes(allergen));
    foodList.ingredients.forEach(ingredient => {
      if (filteredFoods.every(food => food.ingredients.includes(ingredient))) {
        matches[allergen].add(ingredient);
      }
    });
  }
  return matches;
}

function getAllergenMap(matches: AllergenMatches): AllergenMap {
  const map: AllergenMap = {};
  let finished: boolean;
  do {
    finished = true;
    for (const allergen in matches) {
      const ingredients = matches[allergen];
      if (ingredients.size == 1) {
        const ingredient = Array.from(ingredients)[0];
        map[allergen] = ingredient;
        delete matches[allergen];
        for (const allergen2 in matches) {
          matches[allergen2].delete(ingredient);
        }
        finished = false;
        break;
      }
    }
  } while (!finished);
  return map;
}

function getSafeIngredients(foodList: FoodList): Set<string> {
  const safeIngredients = new Set(foodList.ingredients);
  const matches = getAllergenMatches(foodList);
  Object.values(matches).forEach(ingredients => {
    ingredients.forEach(ingredient => safeIngredients.delete(ingredient));
  });
  return safeIngredients;
}

function getIngredientFrequency(foodList: FoodList, ingredient: string): number {
  let count = 0;
  foodList.foods.forEach(food => {
    count += food.ingredients.filter(i => i === ingredient).length;
  });
  return count;
}

function getDangerousIngredientList(allergenMap: AllergenMap): string[] {
  const allergens = Object.keys(allergenMap);
  allergens.sort();
  return allergens.map(allergen => allergenMap[allergen]);
}

function runPuzzle1(input: string[], showIngredients: boolean, output: OutputPublic) {
  const foodList = getFoodList(input);
  const safeIngredients = getSafeIngredients(foodList);
  let count = 0;
  safeIngredients.forEach(ingredient => {
    count += getIngredientFrequency(foodList, ingredient);
  });
  if (showIngredients) {
    output.print(`Safe ingredients: ${Array.from(safeIngredients).join(", ")}`);
  }
  output.print(`Safe ingredient frequency: ${count}`);
  output.print();
}

function runPuzzle2(input: string[], showAllergens: boolean, output: OutputPublic) {
  const foodList = getFoodList(input);
  const matches = getAllergenMatches(foodList);
  const map = getAllergenMap(matches);
  if (showAllergens) {
    output.print("Allergen distribution: ", true);
    output.print(Object.keys(map).map(allergen => `${allergen} = ${map[allergen]}`).join(", "));
  }
  const list = getDangerousIngredientList(map);
  output.print(`Canonical dangerous ingredient list: ${list.join(",")}`);
  output.print();
}

export function createHandler(output: OutputPublic) {
  return {
    runTest1(input: string[]) {
      output.system("Running test 1...");
      runPuzzle1(input, true, output);
    },
    runPuzzle1(input: string[]) {
      output.system("Running puzzle 1...");
      runPuzzle1(input, false, output);
    },
    runTest2(input: string[]) {
      output.system("Running test 2...");
      runPuzzle2(input, true, output);
    },
    runPuzzle2(input: string[]) {
      output.system("Running puzzle 2...");
      runPuzzle2(input, false, output);
    }
  };
}
