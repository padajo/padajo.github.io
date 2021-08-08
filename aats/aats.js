Object.defineProperty(Array.prototype, 'shuffle', {
    value: function() {
        for (let i = this.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this[i], this[j]] = [this[j], this[i]];
        }
        return this;
    }
});

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function get_die_roll() {
    return getRandomInt(6) + 1;
}

// setup the deck of cards
let card_numbers = ['Ace','2','3','4','5','6','7','8','9','10','Jack','Queen','King'];
let card_suits = ['Spades','Hearts','Diamonds','Clubs'];
let deck = [];
let current_planet = {};
let saved_story = [];

for(suit in card_suits) {
    for(number in card_numbers) {
        let card = [card_numbers[number],card_suits[suit]];
        deck.push(card);
    }
}

// shuffle the cards
deck.shuffle();

// NOW WE HAVE EVERYTHING TO PLAY, CREATE THE FUNCTIONS FOR PLAY

// the story should appear backwards (but will save forwards)
function add_to_story(story_text, type) {
    // this isn't quite right, but hey ho - fix it later
    setTimeout((text, t) => {
        let p = document.createElement("p");
        if(type == 'continue') {
            let button = document.createElement("button");
            button.appendChild(document.createTextNode("Continue"));
            p.appendChild(button);
            document.getElementById('story').prepend(p);
            button.onclick = view_next_feature;
        } else if(type == 'final_continue') {
            let button = document.createElement("button");
            button.appendChild(document.createTextNode("Continue"));
            p.appendChild(button);
            document.getElementById('story').prepend(p);
            button.onclick = prepare_to_leave;
        } else if(type == 'name_planet') {
            let button = document.createElement("button");
            button.appendChild(document.createTextNode("Planet has been named"));
            p.appendChild(button);
            document.getElementById('story').prepend(p);
            button.onclick = planet_named;
        } else if(type == 'leave') {
            let button = document.createElement("button");
            button.appendChild(document.createTextNode("Leave Planet"));
            p.appendChild(button);
            document.getElementById('story').prepend(p);
            button.onclick = go_to_next_planet;
        } else if(type == 'interstellar') {
            let b = document.createElement("b");
            b.appendChild(document.createTextNode("*** INTERSTELLAR TRAVEL ***"));
            p.appendChild(b);
            document.getElementById('story').prepend(document.createElement("hr"));
            document.getElementById('story').prepend(p);
            document.getElementById('story').prepend(document.createElement("hr"));
        } else if(type == 'bold') {
            let b = document.createElement("b");
            b.appendChild(document.createTextNode(text));
            p.appendChild(b);
            document.getElementById('story').prepend(p);
        } else if(type == 'heading') {
            let h = document.createElement("h3");
            h.appendChild(document.createTextNode(text));
            p.appendChild(h);
            document.getElementById('story').prepend(p);
        } else {
            document.getElementById('story').prepend(text, p);
        }
    }, 500, story_text, type);
}

function land_on_planet() {
    // shuffle the cards
    deck.shuffle();
    
    // roll the die to see how many cards we should take
    let planet_die_roll = get_die_roll();

    let planet_type_die_roll = get_die_roll();

    // get the number of cards rolled from the deck of cards
    // (slice of deck array from zero to number on die)
    let planet_cards = deck.slice(0, planet_die_roll);

    // now save to current_planet
    current_planet = {
        planet_die_roll: planet_die_roll,
        planet_cards: planet_cards,
        planet_type: planet_type_die_roll,
        current_feature: 0
    };

    add_to_story('Your computer slowly wakes you on a new planet.', 'heading');

    add_to_story('(Planet roll: ' + current_planet.planet_type + ')');

    if(current_planet.planet_type > 5) {
        add_to_story('This planet appears to be an icy moon of a gas giant.', 'bold');
    } else if(current_planet.planet_type > 4) {
        add_to_story('This planet appears to be a small, rocky, terrestrial world with an oxygen rich atmosphere.', 'bold');
    } else if(current_planet.planet_type > 3) {
        add_to_story('This planet appears to be a relatively stable lava giant.', 'bold');
    } else if(current_planet.planet_type > 2) {
        add_to_story('This planet appears to be an ice giant at the outer reaches of a solar system.', 'bold');
    } else if(current_planet.planet_type > 1) {
        add_to_story('This planet appears to be a volcanic moon of a gas giant.', 'bold');
    } else {
        add_to_story('This planet appears to be a large, terrestrial world with almost no oxygen in the thick atmosphere.', 'bold');
    }

    if(current_planet.planet_die_roll > 1) {
        add_to_story('There are ' + current_planet.planet_die_roll + ' unique features of interest.');
    } else {
        add_to_story('There is ' + current_planet.planet_die_roll + ' unique feature of interest.');
    }
    
    // this should happen as you leave the planet, not as you arrive
    // add_to_story('The computer asks you to name the planet. What will you name it?');

    add_to_story('', 'continue');
}

function prepare_to_leave(e) {
    this.disabled = true;
    this.parentElement.style.display = 'none';

    add_to_story('The computer asks you to name the planet. What will you name it?', 'bold');
    add_to_story('', 'name_planet');

}

function planet_named(e) {
    this.disabled = true;
    this.parentElement.style.display = 'none';

    add_to_story('', 'leave');
}

function go_to_next_planet(e) {
    // the button (this) used to trigger this feature can no longer be clicked
    this.disabled = true;
    this.parentElement.style.display = 'none';

    add_to_story('You get into your ship, and tell the computer to take off and find the next suitable planet.');

    add_to_story('The computer beeps acknowledgement and places you in stasis... you sleep.');

    add_to_story('', 'interstellar');

    land_on_planet();
}
function view_next_feature(e) {
    // the button (this) used to trigger this feature can no longer be clicked
    this.disabled = true;
    this.parentElement.style.display = 'none';

    // get the index of the feature
    let current_feature_index = current_planet.current_feature;

    // get the card for that feature
    let feature_card = current_planet.planet_cards[current_feature_index];

    // iterate for the next time
    current_planet.current_feature = current_planet.current_feature + 1;

    let feature_die_roll = get_die_roll();

    add_to_story('(Roll: ' + feature_die_roll + ' - Feature: ' + feature_card[0] + ' of ' + feature_card[1] + ')');

    let story_text = 'You see...';

    let it_them = 'it';

    if(feature_card[1] == 'Diamonds') {
        story_text = story_text + ' living and moving beings...';
        it_them = 'them';
    } else if(feature_card[1] == 'Clubs') {
        story_text = story_text + ' plants or at least some form of immobile life...';
        it_them = 'them';
    } else if(feature_card[1] == 'Hearts') {
        story_text = story_text + ' the ruins of previous visitors or inhabitants...';
    } else if(feature_card[1] == 'Spades') {
        story_text = story_text + ' an incredible natural phenomena...';
    }

    if(feature_card[0] == 'A') {
        story_text = story_text + ' in a field taller than you...';
    } else if(feature_card[0] == '2') {
        story_text = story_text + ' under the light of the moon(s)...';
    } else if(feature_card[0] == '3') {
        story_text = story_text + ' by a gentle river...';
    } else if(feature_card[0] == '4') {
        story_text = story_text + ' in a steep canyon...';
    } else if(feature_card[0] == '5') {
        story_text = story_text + ' in a treetop...';
    } else if(feature_card[0] == '6') {
        story_text = story_text + ' on the snowy peak of a mountain...';
    } else if(feature_card[0] == '7') {
        story_text = story_text + ' near a volcano...';
    } else if(feature_card[0] == '8') {
        story_text = story_text + ' on a glacier...';
    } else if(feature_card[0] == '9') {
        story_text = story_text + ' deep underground...';
    } else if(feature_card[0] == '10') {
        story_text = story_text + ' on a cliff face...';
    } else if(feature_card[0] == 'J') {
        story_text = story_text + ' in the desert...';
    } else if(feature_card[0] == 'Q') {
        story_text = story_text + ' in deep water...';
    } else if(feature_card[0] == 'K') {
        story_text = story_text + ' floating in the air...';
    }

    if(feature_die_roll > 4) {
        story_text = story_text + ' and you spot ' + it_them + ' as you are resting.';
    } else if(feature_die_roll > 2) {
        story_text = story_text + ' and you come upon ' + it_them + ' suddenly.';
    } else {
        story_text = story_text + ' and you find ' + it_them + ' arduous to get to.';
    }

    add_to_story(story_text, 'bold');

    if(current_planet.current_feature < current_planet.planet_cards.length){
        add_to_story('', 'continue');
    } else {
        // add_to_story('The computer asks you to name the planet. What will you name it?', 'bold');
        add_to_story('', 'final_continue');
    }


    return false;
}

// start (!!)
land_on_planet();

