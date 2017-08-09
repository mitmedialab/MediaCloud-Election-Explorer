
function handlePovChange() {
  var povSelected = $('input[name=pov]:checked');
  var povSelectedLabel = povSelected.attr('id')+"-label";
  $("#pov-options > label").removeClass('selected');
  $("#"+povSelectedLabel).addClass('selected');
  console.log("new pov: "+povSelected.val());
  // TODO: right new POV
}

function handleThemeChange() {
  var themeSelected = $('select[name=theme]').val();
  console.log("new theme: "+themeSelected);
}

function initApp(){
  $('input[type=radio][name=pov]').change(handlePovChange);
  $('select[name=theme]').change(handleThemeChange);
}

// init the app once the document is ready
$(initApp);
