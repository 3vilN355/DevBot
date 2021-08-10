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
        "Desert",
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
        return combinations[index].map((name) => `${current} ${name}`);
    }
    var names = [];
    for (var i = 0; i < combinations[index].length; i++) {
        names = names.concat(generate_recursive(combinations, index + 1, current + " " + combinations[index][i]));
    }
    return names;
}

function post_process(generated_names) {
    var rng = mulberry32(SEED);
    return generated_names
        .filter((name) => !((name.length > 27) || (name.includes("Orange") && name.includes("Juice"))))
        .map((name) => ({ name, sort: rng() }))
        .sort((a,b) => a.sort-b.sort)
        .map((a) => a.name.trim());
}

module.exports = class BadNamer {
    constructor() {
        // for (var i = 0; i < combinations.length; i++) {
        //     console.log(combinations[i].length);
        // }
        this.names = post_process(generate_all(COMBINATIONS));
        // console.log(this.names.length);
    }

    get(index) {
        let name_index = index % this.names.length;
        let number = Math.floor(index / this.names.length);
        return `${this.names[name_index]}${number>0?`#${number}`:''}`
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