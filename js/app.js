(function() {
  var $ = jQuery,
      headings,
      decisions,
      levels;

  var render = function(data) {
    decisions = data[0]['decisions'],
    headings = data[0]['headings'],
    levels = _.keys(data[0]['decisions']);
    renderCards('a', decisions['a']);
  };

  var renderCards = function(level, statements) {
    $('.render').html('');

    var span = '6';
    if (statements.length > 2)
      span = '4';

    var levelIdx = levels.indexOf(level);
    $('.render').prepend('<h3 class="level-heading">' + headings[levelIdx] + '</h3>');

    _.each(statements, function(statement, key) {
      var tmpl = _.template($('#card-tmpl').html()),
          el = tmpl({
            'statement': statement,
            'level': level,
            'span': span
          });

      $('.render').append(el);
    });
  };

  var renderNext = function(level, statement) {
    var levelNum = levels.indexOf(level),
        nextLevelNum = levelNum + 1;

    if (!!nextLevelNum) {
      var nextLevel = levels[nextLevelNum],
          statements = decisions[nextLevel];

      if (typeof statements !== 'undefined') {
        statements = statements[statement];
        renderCards(nextLevel, statements);
      } else {
        renderExplain();
      }
    }
  };

  var renderExplain = function() {
    $('.render').html('');

    var tmpl = _.template($('#explain-tmpl').html());
    var el = tmpl();

    $('.render').append(el);
  };

  var statementClick = function(e) {
    var target = $(e.currentTarget),
        level = target.data('level'),
        statement = target.data('statement');

    renderNext(level, statement);
    return false;
  };

  var formSubmit = function() {
    window.location.reload(true);
    return false;
  };

  var bindEvents = function() {
    $('body').on('click', '.card a', statementClick);
    $('body').on('submit', 'form', formSubmit);
  };

  $(document).ready(function() {
    $.getJSON('data/difficulty.json', render);
    bindEvents();
  });
})();
