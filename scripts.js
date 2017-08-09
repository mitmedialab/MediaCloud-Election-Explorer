
var POV_FIELD_SELECTOR = 'input[name=pov]:checked';
var THEME_FIELD_SELECTOR = 'select[name=theme]';
var MAX_STORY_TITLE_LENGTH = 60;  // experimentally determined to be two lines
var currentPlatform = "facebook";

function getStories(){
  return {
    twitter: testStories,
    facebook: testStories,
    web: testStories
  }
}

function trimStoryTitle(title) {
  
  if (title.length > MAX_STORY_TITLE_LENGTH) {
    return title.substring(0,MAX_STORY_TITLE_LENGTH) + "...";
  }
  return title;
}

function handlePovChange() {
  var povSelectedOption = $(POV_FIELD_SELECTOR);
  var povSelectedLabel = povSelectedOption.attr('id')+"-label";
  $("#pov-options > label").removeClass('selected');
  $("#"+povSelectedLabel).addClass('selected');
  handleStoryUpdate();
}

function handleThemeChange() {
  var themeSelected = $(THEME_FIELD_SELECTOR).val();
  handleStoryUpdate();
}

function handleStoryUpdate() {
  var pov = $(POV_FIELD_SELECTOR).val();
  var theme = $(THEME_FIELD_SELECTOR).val();
  var stories = getStories(pov, theme);
  render(stories);
}

function getFavIconUrl(siteUrl){
  return "http://www.google.com/s2/favicons?domain_url="+siteUrl;
}

function renderStory(story) {
  return $(
    '<li class="story" data-stories-id="'+story['storiesId']+'">' +
      '<span class="story-influence">' +
        '<em>'+story['count']+'</em>' +
        '<br />' +
        ' shares' +
      '</span>' +
      '<h3>'+trimStoryTitle(story['title'])+'</h3>' +
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
  var docOffset = (docWidth - platformWidth) / 2;
  // fade...
  $('#'+currentPlatform+'-stories').animate({opacity: 0.2}, 500);
  var selectedPlatformId = nextPlatform+'-stories';
  $('#'+nextPlatform+'-stories').animate({opacity: 1}, 500);
  // ...and sliiiiide
  var xOffset = docOffset;
  if(nextPlatform == "twitter") xOffset += 0;
  if(nextPlatform == "facebook") xOffset += -420;
  if(nextPlatform == "web") xOffset += -855;
  $('#platforms').animate({left: xOffset}, 500);
  currentPlatform = nextPlatform;
}

function render(stories){
  var twitterStoryElements = $.map(stories.twitter, renderStory);
  var twitterStoryList = $('#twitter-stories ul.story-list');
  twitterStoryList.empty();
  twitterStoryList.append($.map(stories.twitter, renderStory));

  var facebookStoryElements = $.map(stories.twitter, renderStory);
  var facebookStoryList = $('#facebook-stories ul.story-list');
  facebookStoryList.empty();
  facebookStoryList.append($.map(stories.facebook, renderStory));
  
  var webStoryElements = $.map(stories.web, renderStory);
  var webStoryList = $('#web-stories ul.story-list');
  webStoryList.empty();
  webStoryList.append($.map(stories.web, renderStory));
}

function initApp(){
  $('input[type=radio][name=pov]').change(handlePovChange);
  $('select[name=theme]').change(handleThemeChange);
}

// init the app once the document is ready
$(initApp);
