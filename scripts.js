
var POV_FIELD_SELECTOR = 'input[name=pov]:checked';
var THEME_FIELD_SELECTOR = 'select[name=theme]';
var MAX_STORY_TITLE_LENGTH = 80;  // experimentally determined to be two lines
var currentPlatform = "facebook";

var isMobile = false;
if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) isMobile = true;

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
  if (n > 10000) return Math.round(n/1000)+"k";
  if (n > 1000) return Number((n/1000).toFixed(1))+"k";
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
  $('select[name=theme]').change(handleThemeChange);
  // on mobile show label names; on desktop hide them and do a hove
  if (isMobile) {
    $('#pov-names').show();
  } else {
    $('#pov-names').hide();
    $('#pov-options > label').hover(handlePovHoverIn, handlePovHoverOut);
  }
  // start off on FB
  changePlatform('facebook');
}

// init the app once the document is ready
$(initApp);
