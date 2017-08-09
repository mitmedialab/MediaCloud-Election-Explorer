
var POV_FIELD_SELECTOR = 'input[name=pov]:checked';
var THEME_FIELD_SELECTOR = 'select[name=theme]';
var MAX_STORY_TITLE_LENGTH = 80;  // experimentally determined to be two lines
var currentPlatform = "facebook";

function getStories(){
  return {
    twitter: testStories,
    facebook: testStories,
    web: testStories
  }
}

function readableQuantity(n){
  if (n > 10000000) return Math.round(n/10000000)+" million";
  if (n > 1000000) return Number((n/1000000).toFixed(1))+" million";
  if (n > 10000) return Math.round(n/1000)+" thousand";
  if (n > 1000) return Number((n/1000).toFixed(1))+" thousand";
  return Math.round(n);
}

function trimStoryTitle(title) {
  if (title.length > MAX_STORY_TITLE_LENGTH) {
    return title.substring(0,MAX_STORY_TITLE_LENGTH) + "...";
  }
  return title;
}

function handlePovHoverIn(evt) {
  var label = $(evt.target);
  var offset = label.offset();
  var hoverElement = $('#pov-option-hover');
  hoverElement
    .css({top: offset.top+label.height,
          left: offset.left - (hoverElement.width() - label.width())/ 2,
          color: label.css('background-color')})
    .text(label.text())
    .show();
}

function handlePovHoverOut(evt) {
  $('#pov-option-hover').hide();
}

function handlePovChange(evt) {
  var povSelectedOption = $(POV_FIELD_SELECTOR);
  var povSelectedLabel = povSelectedOption.attr('id')+"-label";
  $("#pov-options > label").removeClass('selected');
  $("#"+povSelectedLabel).addClass('selected');
  $("#results").fadeIn();
  updateStories();
}

function handleThemeChange() {
  var themeSelected = $(THEME_FIELD_SELECTOR).val();
  updateStories();
}

function updateStories() {
  var pov = $(POV_FIELD_SELECTOR).val();
  var theme = $(THEME_FIELD_SELECTOR).val();
  var stories = getStories(pov, theme);
  render(stories);
}

function getFavIconUrl(siteUrl){
  return "http://www.google.com/s2/favicons?domain_url="+siteUrl;
}

function renderStory(story, shareType) {
  return $(
    '<li class="story" data-stories-id="'+story['storiesId']+'">' +
      '<h3><a href="'+story['storyUrl']+'" target=_new>'+trimStoryTitle(story['title'])+'</a></h3>' +
      '<span class="story-influence">' +
        readableQuantity(story['count'])+' '+shareType +
      '</span>' +
      '<span class="media-source" data-media-id="'+story['mediaId']+'">' +
        '<img src="'+getFavIconUrl(story['mediaUrl'])+'" alt="'+story['mediaName']+' logo"/>' +
        story['mediaName'] +
      '</span>' +
    '</li>'
  );
}

function changePlatform(nextPlatform) {
  var docWidth = $( window ).width();
  var platformWidth = $($('.platform')[0]).width();
  var platformsWidth = $($('#platforms')[0]).width();
  var docOffset = (docWidth - platformWidth) / 2;
  // fade...
  $('#'+currentPlatform+'-stories').animate({opacity: 0.2}, 500);
  var selectedPlatformId = nextPlatform+'-stories';
  $('#'+nextPlatform+'-stories').animate({opacity: 1}, 500);
  // ...and sliiiiide
  var xOffset = 0;
  if(nextPlatform == "twitter") xOffset += docOffset/2;
  if(nextPlatform == "facebook") xOffset -= platformsWidth/2 - docWidth/2;
  if(nextPlatform == "web") xOffset -= (platformsWidth - platformWidth/2) - docWidth/2;
  $('#platforms').animate({left: xOffset}, 500);
  currentPlatform = nextPlatform;
}

function render(stories){
  var twitterStoryElements = $.map(stories.twitter, function(s) { return renderStory(s, "retweets"); });
  var twitterStoryList = $('#twitter-stories ul.story-list');
  twitterStoryList.empty();
  twitterStoryList.append(twitterStoryElements);

  var facebookStoryElements = $.map(stories.facebook, function(s) { return renderStory(s, "likes"); });
  var facebookStoryList = $('#facebook-stories ul.story-list');
  facebookStoryList.empty();
  facebookStoryList.append(facebookStoryElements);
  
  var webStoryElements = $.map(stories.web, function(s) { return renderStory(s, "links"); });
  var webStoryList = $('#web-stories ul.story-list');
  webStoryList.empty();
  webStoryList.append(webStoryElements);
}

function initApp(){
  $('input[type=radio][name=pov]').change(handlePovChange);
  $('#pov-options > label').hover(handlePovHoverIn, handlePovHoverOut);
  $('select[name=theme]').change(handleThemeChange);
  changePlatform('facebook');
}

// init the app once the document is ready
$(initApp);
