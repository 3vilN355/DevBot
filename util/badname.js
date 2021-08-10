//This class works just fine when given the proper indices

var SEED = 130873;
var COMBINATIONS = [
    [
        "Delightful",
        "Amazing",
        "Dangerous",
        "Hostile",
        "Wholesome",
        "Royal",
        "Odd",
        "Unfortunate",
        "Calm",
        "Distinct",
        "Hilarious",
        "Graceful",
        "Evil",
        "Adventurous",
        "Exceptional",
        "Crazy",
        "Burnt",
        "Instinctual",
        "Overpowered",
        "Shakespearean",
        "Robotic",
        "Peaceful",
        "Controversial",
    ],
    [
        "Pineapple",
        "Tomato",
        "Grape",
        "Apple",
        "Pear",
        "Peach",
        "Blueberry",
        "Raisin",
        "Strawberry",
        "Orange",
        "Banana",
        "Raspberry",
        "Carrot",
        "Artichoke",
        "Spinach",
        "Potato",
        "Pickle",
        "Durian",
        "Mango",
        "Avocado",
        "Cherry",
        "Bread",
    ],
    [
        "Pizza",
        "Juice",
        "Soup",
        "Meal",
        "Blend",
        "Essence",
        "Potion",
        "Elixir",
        "Stew",
        "Cake",
        "Ice Cream",
        "Dessert",
        "Milkshake",
        "Mash",
        "Pie",
        "Slices",
        "Sandwich",
        "Tortilla",
        "Soda",
        "Omelette",
    ]
];

function generate_all(combinations) {
    return generate_recursive(combinations, 0, "");
}

function generate_recursive(combinations, index, current) {
    if (index === (combinations.length - 1)) {
        return combinations[index].map(function (name) {
            return current + " " + name;
        });
    }
    var names = [];
    for (var i = 0; i < combinations[index].length; i++) {
        names = names.concat(generate_recursive(combinations, index + 1, current + " " + combinations[index][i]));
    }
    return names;
}

function post_process(generated_names) {
    var rng = mulberry32(SEED);
    var filtered = generated_names.filter(function (name) {
        return !(name.includes("Orange") && name.includes("Juice"));
    });
    filtered = filtered
        .map(function (value) {
            return ({value: value, sort: rng()});
        })
        .sort(function (a, b) {
            return a.sort - b.sort;
        })
        .map(function (_a) {
            var value = _a.value;
            return value;
        });
    return filtered.map(function (name) {
        return name.trim();
    });
}

class BadNamer {
    constructor(combinations) {
        for (var i = 0; i < combinations.length; i++) {
            console.log(combinations[i].length);
        }
        this.names = post_process(generate_all(combinations));
        console.log(this.names.length);
    }

    get(index) {
        let name_index = index % this.names.length;
        let number = Math.floor(index / this.names.length);
        return this.names[name_index] + " #" + number
    };
}

function mulberry32(a) {
    return function () {
        var t = a += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}