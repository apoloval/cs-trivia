COLORS = ["blue", "brown", "green", "orange", "pink", "yellow"]

function toggle_card() {
  $(this).toggleClass("questions answers")
}

function parse_questions(data) {
    return data.trim().split("\n").map(function(line) {
      var pair = line.split("|");
      return {question: pair[0], answer: pair[1]};
    })
}

function load_questions(sets, handler) {
  var questions = {}
  var promises = sets.map(function(set) {
    return $.ajax("../data/" + set.file).done(function (data) {
      questions[set.color] = parse_questions(data);
    })
  })
  $.when.apply(this, promises).done(function() {
    handler(questions);
  })
}

function random_card(questions) {
  function random_question(theme) {
    var randomIndex = Math.floor(Math.random() * theme.length);
    return theme[randomIndex];
  }
  var card = {};
  $(COLORS).each(function (idx, color) {
    card[color] = random_question(questions[color]);
  })
  return card;
}

function update_card_dom(node, card) {
  $(node).removeClass("answers");
  $(node).addClass("questions");
  $.each(card, function(color, pair) {
    $("." + color + " .question", node).text(pair.question);
    $("." + color + " .answer", node).text(pair.answer);
  })
}

$(document).ready(function attach_handlers() {
  $(".card").each(function attach_handler(idx, card) {
    $(card).click(toggle_card)
  })
  console.log("Downloading questions...");
  var question_sets = [
    {color: "blue",   file: "blue-programming_languages.csv"},
    {color: "brown",  file: "brown-algorithmics_and_math.csv"},
    {color: "green",  file: "green-computer_architecture.csv"},
    {color: "orange", file: "orange-networks_and_internet.csv"},
    {color: "pink",   file: "pink-software_architecture_and_methodologies.csv"},
    {color: "yellow", file: "yellow-history.csv"}
  ];
  load_questions(question_sets, function(questions) {
    console.log("All questions loaded!");
    var cardNode = $("#card")[0];
    function pick_card() {
      update_card_dom(cardNode, random_card(questions));
    }
    $("#next").click(pick_card);
    pick_card();
  })
})
